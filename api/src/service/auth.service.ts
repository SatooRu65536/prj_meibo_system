import { CustomContext, Env } from '@/types/context';
import type {
  KeyStorer,
  FirebaseIdToken,
} from 'firebase-auth-cloudflare-workers';
import { Auth, WorkersKVStoreSingle } from 'firebase-auth-cloudflare-workers';
import type { Context, MiddlewareHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';

interface VerifyFirebaseAuthConfig {
  projectId: string;
  authorizationHeaderKey?: string;
  keyStore?: KeyStorer;
  keyStoreInitializer?: (c: Context) => KeyStorer;
  disableErrorLog?: boolean;
  firebaseEmulatorHost?: string;
}

const defaultKVStoreJWKCacheKey = 'verify-firebase-auth-cached-public-key';
const defaultKeyStoreInitializer = (c: Context<Env>): KeyStorer => {
  if (c.env.PUBLIC_JWK_CACHE_KV === undefined) {
    const res = new Response('Not Implemented', {
      status: 501,
    });
    throw new HTTPException(501, { res });
  }
  return WorkersKVStoreSingle.getOrInitialize(
    c.env.PUBLIC_JWK_CACHE_KEY ?? defaultKVStoreJWKCacheKey,
    c.env.PUBLIC_JWK_CACHE_KV,
  );
};

export const verifyFirebaseAuth = (
  userConfig: VerifyFirebaseAuthConfig,
): MiddlewareHandler => {
  const config = {
    projectId: userConfig.projectId,
    AuthorizationHeaderKey:
      userConfig.authorizationHeaderKey ?? 'Authorization',
    KeyStore: userConfig.keyStore,
    keyStoreInitializer:
      userConfig.keyStoreInitializer ?? defaultKeyStoreInitializer,
    disableErrorLog: userConfig.disableErrorLog,
    firebaseEmulatorHost: userConfig.firebaseEmulatorHost,
  };

  return async (c, next) => {
    const authorization = c.req.header(config.AuthorizationHeaderKey);
    if (authorization === undefined) {
      console.info('Authorization がありません');
    } else {
      const jwt = authorization.replace(/Bearer\s+/i, '');
      const auth = Auth.getOrInitialize(
        config.projectId,
        config.KeyStore ?? config.keyStoreInitializer(c),
      );

      try {
        const idToken = await auth.verifyIdToken(jwt, {
          FIREBASE_AUTH_EMULATOR_HOST:
            config.firebaseEmulatorHost ?? c.env.FIREBASE_AUTH_EMULATOR_HOST,
        });
        setFirebaseToken(c, idToken);
      } catch {
        console.info('認証できませんでした');
      }
    }
    await next();
  };
};

const idTokenContextKey = 'firebase-auth-cloudflare-id-token-key';

const setFirebaseToken = (c: Context, idToken: FirebaseIdToken) =>
  c.set(idTokenContextKey, idToken);

export const getFirebaseToken = (c: Context): FirebaseIdToken | null => {
  const idToken = c.get(idTokenContextKey);
  if (!idToken) {
    return null;
  }
  return idToken;
};

export class AuthService {
  /**
   * ユーザー情報取得
   * @param c　Context
   * @returns ユーザー情報 or null
   */
  static getUser(c: CustomContext<string>): FirebaseIdToken | null {
    return getFirebaseToken(c);
  }
}
