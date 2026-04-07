import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// Ping KV daily to prevent Upstash from archiving due to inactivity
export async function GET() {
  try {
    await kv.set('ping', Date.now());
    return NextResponse.json({ ok: true, ts: Date.now() });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
