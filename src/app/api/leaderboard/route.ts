import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// Helper: extract FID string from zrange results (handles both formats)
function parseZrangeResults(raw: any[]): { fid: string; score: number }[] {
  const entries: { fid: string; score: number }[] = [];
  if (!raw || raw.length === 0) return entries;

  for (let i = 0; i < raw.length; i++) {
    const item = raw[i];
    // withScores returns flat: [member, score, member, score, ...]
    // BUT @vercel/kv may auto-parse members as JSON
    // So member could be: string, number, or object
    if (typeof item === 'object' && item !== null && 'member' in item) {
      // Object format from some KV versions: {member, score}
      entries.push({
        fid: primitiveToString(item.member),
        score: Number(item.score),
      });
    } else if (i + 1 < raw.length) {
      // Flat format: [member, score, member, score, ...]
      entries.push({
        fid: primitiveToString(raw[i]),
        score: Number(raw[i + 1]),
      });
      i++; // skip score
    }
  }
  return entries;
}

// Force anything to a plain string (handles objects, numbers, etc.)
function primitiveToString(val: any): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'bigint') return val.toString();
  // If it's an object, try to extract meaningful value
  if (typeof val === 'object') {
    if ('fid' in val) return primitiveToString(val.fid);
    if ('value' in val) return primitiveToString(val.value);
    // Last resort: JSON
    try { return JSON.stringify(val); } catch { return ''; }
  }
  return String(val);
}

// GET /api/leaderboard?mode=classic&limit=100
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'classic';
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 100);

    const key = `lb:${mode}`;

    // Get top scores (highest first)
    const rawResults = await kv.zrange(key, 0, limit - 1, { rev: true, withScores: true });
    const entries = parseZrangeResults(rawResults);

    if (entries.length === 0) {
      return NextResponse.json({ scores: [] });
    }

    // Fetch user profiles (stored as simple JSON strings via kv.set)
    const scores = [];
    for (const entry of entries) {
      let username = `fid:${entry.fid}`;
      let pfpUrl = '';
      let timestamp = 0;

      try {
        const profileRaw = await kv.get(`profile:${entry.fid}`);
        if (profileRaw) {
          // profileRaw might be auto-parsed by KV, or might be a string
          const profile = typeof profileRaw === 'string' ? JSON.parse(profileRaw) : profileRaw;
          username = profile.u || username;
          pfpUrl = profile.p || '';
          timestamp = profile.t || 0;
        }
      } catch {
        // ignore, use defaults
      }

      scores.push({
        fid: entry.fid,
        username,
        pfpUrl,
        score: entry.score,
        timestamp,
      });
    }

    return NextResponse.json({ scores });
  } catch (error: any) {
    console.error('Leaderboard GET error:', error);
    return NextResponse.json({ scores: [], error: error.message }, { status: 200 });
  }
}

// POST /api/leaderboard
// Body: { fid, username, pfpUrl, score, mode }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { fid, username, pfpUrl, score, mode } = body;

    // Aggressively convert to primitives
    fid = primitiveToString(fid);
    username = primitiveToString(username) || `fid:${fid}`;
    pfpUrl = primitiveToString(pfpUrl);
    score = Number(score);
    mode = primitiveToString(mode);

    if (!fid || isNaN(score) || !mode) {
      return NextResponse.json({ error: 'Missing: fid, score, mode' }, { status: 400 });
    }
    if (!['classic', 'arcade'].includes(mode)) {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    }
    if (score < 0 || score > 999999) {
      return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
    }

    const key = `lb:${mode}`;

    // Check current best
    const currentBest = await kv.zscore(key, fid);

    if (currentBest === null || score > Number(currentBest)) {
      // Update sorted set — member MUST be a plain string
      await kv.zadd(key, { score, member: fid });

      // Store profile as simple JSON via kv.set (avoids hash serialization issues)
      // Short keys: u=username, p=pfpUrl, t=timestamp
      const profile = JSON.stringify({ u: username, p: pfpUrl, t: Date.now() });
      await kv.set(`profile:${fid}`, profile);

      // Get new rank
      const rank = await kv.zrevrank(key, fid);

      return NextResponse.json({
        success: true,
        newBest: true,
        score,
        rank: rank !== null ? rank + 1 : null,
      });
    }

    return NextResponse.json({
      success: true,
      newBest: false,
      currentBest: Number(currentBest),
    });
  } catch (error: any) {
    console.error('Leaderboard POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
  }
}
