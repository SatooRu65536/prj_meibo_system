import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { UserController } from './controller/user.controller';
import { CustomContext, Env } from '@/types/context';
import { VerifyFirebaseAuthConfig, verifyFirebaseAuth } from './auth';
import { zodHook } from './validation';
import { zValidator } from '@hono/zod-validator';
import { UserSchema, userSchema } from './validation/createUser';

const config: VerifyFirebaseAuthConfig = {
  projectId: 'meibo-system',
};

const app = new Hono<Env>();

app.use('*', cors({ origin: '*' }));
app.use('*', verifyFirebaseAuth(config));

// デバッグ用
app.get('/', (c) => c.text('Hello Hono!'));

// [POST] /api/user ユーザー登録
app.post(
  '/api/user',
  zValidator(
    'json',
    userSchema,
    zodHook<UserSchema, CustomContext<'/api/user'>>,
  ),
  async (c) => await UserController.createUser(c),
);

// [PUT] /api/user/:id 編集
app.put(
  '/api/user/:id',
  zValidator(
    'json',
    userSchema,
    zodHook<UserSchema, CustomContext<'/api/user/:id'>>,
  ),
  async (c) => await UserController.updateUser(c),
);

// [DELETE] /api/user/:id ユーザー削除
app.delete('/api/user/:id', async (c) => await UserController.deleteUser(c));

// [GET] /api/user/:id ユーザー情報詳細取得
app.get('/api/user/:id', async (c) => await UserController.getUser(c));

// [GET] /api/users ユーザー一覧取得
app.get('/api/users', async (c) => await UserController.getUsers(c));

// [GET] /api/user/detail ユーザー情報詳細取得
app.get(
  '/api/user/:id/detail',
  async (c) => await UserController.getUserDetail(c),
);

// [GET] /api/user/:id/detail ユーザーの出席情報取得
app.get(
  '/api/users/detail',
  async (c) => await UserController.getUsersDetail(c),
);

// [PUT] /api/user/:id/approve 承認
app.put('/api/user/:id/approve', async (c) => await UserController.approve(c));

// [PUT] /api/user/:id/officer 管理者承認
app.put(
  '/api/user/:id/officer',
  async (c) => await UserController.approveOfficer(c),
);

// [DELETE] /api/user/:id/officer 管理者解除
app.delete(
  '/api/user/:id/officer',
  async (c) => await UserController.deleteOfficer(c),
);

app.all('*', (c) => c.text('Not Found', 404));

export default app;
