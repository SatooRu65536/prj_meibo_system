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

// [POST] /api/users ユーザー登録
app.post(
  '/api/users',
  zValidator(
    'json',
    userSchema,
    zodHook<UserSchema, CustomContext<'/api/users'>>,
  ),
  async (c) => await UserController.createUser(c),
);

// [DELETE] /api/users/:id ユーザー削除
app.delete('/api/users/:id', async (c) => await UserController.deleteUser(c));

// [PUT] /api/users/:id 編集
app.put(
  '/api/users/:id',
  zValidator(
    'json',
    userSchema,
    zodHook<UserSchema, CustomContext<'/api/users/:id'>>,
  ),
  async (c) => await UserController.updateUser(c),
);

// [GET] /api/users/:id ユーザー情報詳細取得
app.get('/api/users/:id', async (c) => await UserController.getUser(c));

app.get('/api/users', async (c) => await UserController.getUsers(c));

// [GET] /api/users/:id/detail ユーザー情報詳細取得
app.get(
  '/api/users/:id/detail',
  async (c) => await UserController.getUserDetail(c),
);

// [PUT] /api/users/:id/approve 承認
app.put('/api/users/:id/approve', async (c) => await UserController.approve(c));

// [PUT] /api/users/:id/officer 管理者承認
app.put(
  '/api/users/:id/officer',
  async (c) => await UserController.approveOfficer(c),
);

// [DELETE] /api/users/:id/officer 管理者解除
app.delete(
  '/api/users/:id/officer',
  async (c) => await UserController.deleteOfficer(c),
);

app.all('*', (c) => c.text('Not Found', 404));

export default app;
