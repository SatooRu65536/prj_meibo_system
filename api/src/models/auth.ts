import { CustomContext } from '@/types/context';
import { Auth, WorkersKVStoreSingle } from 'firebase-auth-cloudflare-workers';

export async function verifyJWTTM<T extends CustomContext<string>>(
  c: T,
): Promise<FirebaseIdToken | null> {
  const authorization = c.req.header('Authorization');
  if (authorization === undefined) return null;

  const jwt = authorization.replace(/Bearer\s+/i, '');

  const auth = Auth.getOrInitialize(
    c.env.PROJECT_ID,
    WorkersKVStoreSingle.getOrInitialize(
      c.env.PUBLIC_JWK_CACHE_KEY,
      c.env.PUBLIC_JWK_CACHE_KV,
    ),
  );

  return await auth.verifyIdToken(jwt, c.env);
}
