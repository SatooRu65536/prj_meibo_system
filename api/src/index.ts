import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { UserController } from './controller/user.controller';
import { CustomContext, Env } from '@/types/context';
import { VerifyFirebaseAuthConfig, verifyFirebaseAuth } from './auth';
import { CreateUserSchema, createUserSchema, zodHook } from './validation';
import { zValidator } from '@hono/zod-validator';

const config: VerifyFirebaseAuthConfig = {
  projectId: 'meibo-system',
};

const app = new Hono<Env>();

app.use('*', cors({ origin: '*' }));
app.use('*', verifyFirebaseAuth(config));

// デバッグ用
app.get('/', (c) => c.text('Hello Hono!'));

// [POST] /api/users ユーザー登録
app.post(
  '/api/users',
  zValidator(
    'json',
    createUserSchema,
    zodHook<CreateUserSchema, CustomContext<'/api/users'>>,
  ),
  async (c) => await UserController.createUser(c),
);

// [GET] /api/users/:id ユーザー情報詳細取得
app.get('/api/users/:id', async (c) => await UserController.getUser(c));

// [GET] /api/users/:id/detail ユーザー情報詳細取得
app.get(
  '/api/users/:id/detail',
  async (c) => await UserController.getUserDetail(c),
);

app.all('*', (c) => c.text('Not Found', 404));

export default app;
