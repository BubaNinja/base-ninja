import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// GET /api/leaderboard?mode=classic&limit=100
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'classic';
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 100);

    const key = `leaderboard:${mode}`;

    // Get top scores with scores included
    const rawResults = await kv.zrange(key, 0, limit - 1, { rev: true, withScores: true });

    // rawResults is flat array: [member1, score1, member2, score2, ...]
    // or could be array of objects depending on KV version
    const entries: { fid: string; score: number }[] = [];

    if (rawResults.length === 0) {
      return NextResponse.json({ scores: [] });
    }

    // Detect format: if first element has a 'member' or 'score' property, it's object format
    if (typeof rawResults[0] === 'object' && rawResults[0] !== null && 'member' in rawResults[0]) {
      // Object format: [{member, score}, ...]
      for (const item of rawResults as any[]) {
        entries.push({ fid: String(item.member), score: Number(item.score) });
      }
    } else {
      // Flat array format: [member1, score1, member2, score2, ...]
      for (let i = 0; i < rawResults.length; i += 2) {
        entries.push({
          fid: String(rawResults[i]),
          score: Number(rawResults[i + 1]),
        });
      }
    }

    // Fetch user data for each FID
    const scores = [];
    for (const entry of entries) {
      try {
        const userData = await kv.hgetall(`user:${entry.fid}`);
        scores.push({
          fid: entry.fid,
          username: userData ? String(userData.username || `fid:${entry.fid}`) : `fid:${entry.fid}`,
          pfpUrl: userData ? String(userData.pfpUrl || '') : '',
          score: entry.score,
          timestamp: userData ? Number(userData[`best_${mode}_ts`] || 0) : 0,
        });
      } catch {
        scores.push({
          fid: entry.fid,
          username: `fid:${entry.fid}`,
          pfpUrl: '',
          score: entry.score,
          timestamp: 0,
        });
      }
    }

    return NextResponse.json({ scores });
  } catch (error: any) {
    console.error('Leaderboard GET error:', error);
    if (error.message?.includes('REDIS') || error.message?.includes('KV') || error.message?.includes('connect')) {
      return NextResponse.json({ scores: [], error: 'KV not configured' }, { status: 200 });
    }
    return NextResponse.json({ error: 'Failed to load leaderboard' }, { status: 500 });
  }
}

// POST /api/leaderboard
// Body: { fid, username, pfpUrl, score, mode }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, username, pfpUrl, score, mode } = body;

    if (!fid || score === undefined || !mode) {
      return NextResponse.json({ error: 'Missing required fields: fid, score, mode' }, { status: 400 });
    }

    if (!['classic', 'arcade'].includes(mode)) {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    }

    if (typeof score !== 'number' || score < 0 || score > 999999) {
      return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
    }

    // Ensure all values are plain strings
    const fidStr = String(fid);
    const usernameStr = String(username || `fid:${fidStr}`);
    const pfpUrlStr = String(pfpUrl || '');
    const key = `leaderboard:${mode}`;
    const userKey = `user:${fidStr}`;

    // Check current best score
    const currentBest = await kv.zscore(key, fidStr);

    // Only update if new score is higher
    if (currentBest === null || score > Number(currentBest)) {
      // Update sorted set
      await kv.zadd(key, { score: score, member: fidStr });

      // Update user data as plain strings to avoid serialization issues
      await kv.hset(userKey, {
        username: usernameStr,
        pfpUrl: pfpUrlStr,
        [`best_${mode}`]: String(score),
        [`best_${mode}_ts`]: String(Date.now()),
      });

      const rank = await kv.zrevrank(key, fidStr);

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
    if (error.message?.includes('REDIS') || error.message?.includes('KV') || error.message?.includes('connect')) {
      return NextResponse.json({ error: 'KV not configured. Add Vercel KV storage to your project.' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 });
  }
}
