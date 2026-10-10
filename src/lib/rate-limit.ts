import 'server-only';
import { createHmac } from 'node:crypto';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { isIP } from 'node:net';

/** Shared atomic limiter. Fail closed when the limiter service cannot be reached. */
export async function consumeRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { allowed: false, remaining: 0, resetAt: now + windowMs, unavailable: true };

  try {
    const { data, error } = await supabase.rpc('consume_api_rate_limit', {
      p_bucket_key: key,
      p_limit: limit,
      p_window_seconds: Math.ceil(windowMs / 1000),
      p_cleanup: Math.random() < 1 / 256,
    });
    if (error || !data?.[0]) return { allowed: false, remaining: 0, resetAt: now + windowMs, unavailable: true };
    const result = data[0] as { allowed: boolean; remaining: number; reset_at: string };
    return { allowed: result.allowed, remaining: result.remaining, resetAt: new Date(result.reset_at).getTime(), unavailable: false };
  } catch {
    return { allowed: false, remaining: 0, resetAt: now + windowMs, unavailable: true };
  }
}

export function requestKey(request: Request, scope: string) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim();
  const candidate = request.headers.get('x-real-ip')?.trim() || forwarded || '';
  const ip = isIP(candidate) ? candidate : 'anonymous';
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) return 'rate-limit-unavailable';
  return createHmac('sha256', secret).update(`${scope}:${ip}`).digest('hex');
}
