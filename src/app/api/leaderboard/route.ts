import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// GET /api/leaderboard?mode=classic&limit=100
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'classic';
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 100);

    const key = `leaderboard:${mode}`;

    // Get top scores (highest first) from sorted set
    const topFids: string[] = await kv.zrange(key, 0, limit - 1, { rev: true });

    if (!topFids || topFids.length === 0) {
      return NextResponse.json({ scores: [] });
    }

    // Fetch user data for each FID
    const pipeline = kv.pipeline();
    for (const fid of topFids) {
      pipeline.hgetall(`user:${fid}`);
      pipeline.zscore(key, fid);
    }
    const results = await pipeline.exec();

    const scores = [];
    for (let i = 0; i < topFids.length; i++) {
      const userData = results[i * 2] as Record<string, string> | null;
      const score = results[i * 2 + 1] as number | null;
      if (userData && score !== null) {
        scores.push({
          fid: topFids[i],
          username: userData.username || `fid:${topFids[i]}`,
          pfpUrl: userData.pfpUrl || '',
          score: Number(score),
          timestamp: Number(userData[`best_${mode}_ts`] || 0),
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

    if (!fid || !score || !mode) {
      return NextResponse.json({ error: 'Missing required fields: fid, score, mode' }, { status: 400 });
    }

    if (!['classic', 'arcade'].includes(mode)) {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    }

    if (typeof score !== 'number' || score < 0 || score > 999999) {
      return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
    }

    const fidStr = String(fid);
    const key = `leaderboard:${mode}`;
    const userKey = `user:${fidStr}`;

    // Check current best score
    const currentBest = await kv.zscore(key, fidStr);

    // Only update if new score is higher
    if (currentBest === null || score > Number(currentBest)) {
      const pipeline = kv.pipeline();
      pipeline.zadd(key, { score: score, member: fidStr });
      pipeline.hset(userKey, {
        username: username || `fid:${fidStr}`,
        pfpUrl: pfpUrl || '',
        [`best_${mode}`]: score,
        [`best_${mode}_ts`]: Date.now(),
      });
      await pipeline.exec();

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
