import { Context, Input } from 'hono';

type VerifyFirebaseAuthEnv = {
  PUBLIC_JWK_CACHE_KEY?: string | undefined;
  PUBLIC_JWK_CACHE_KV?: KVNamespace | undefined;
  FIREBASE_AUTH_EMULATOR_HOST: string | undefined;
};

type Bindings = {
  DB: D1Database;
  PROJECT_ID: string;
  PUBLIC_JWK_CACHE_KEY: string;
  PUBLIC_JWK_CACHE_KV: KVNamespace;
  INIT_ADMINS: string;
};

export type Env = { Bindings: Bindings & VerifyFirebaseAuthEnv };

export type CustomContext<T extends string, U extends Input = {}> = Context<
  Env,
  T,
  U
>;
