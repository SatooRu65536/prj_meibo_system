import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { UserController } from './controller/user.controller';
import { CustomContext, Env } from '@/types/context';
import { verifyFirebaseAuth } from './service/auth.service';
import { zodHook } from './validation';
import { zValidator } from '@hono/zod-validator';
import { CreateUserSchema, UserSchema, createUserSchema, userSchema } from './validation/user';
import { OfficerController } from './controller/officer.controller';
import { PaymentController } from './controller/payment.controller';
import { GroupController } from './controller/goup.controller';
import {
  GroupSchema,
  addToGroupSchema,
  goupSchema,
  AddToGroupSchema,
} from './validation/gourp';

const app = new Hono<Env>();

app.use('*', cors({ origin: '*' }));
app.use('*', verifyFirebaseAuth({ projectId: 'meibo-system' }));

// デバッグ用
app.get('/', (c) => c.text('Hello Hono!'));

// [POST] /api/user ユーザー登録
app.post(
  '/api/user',
  zValidator(
    'json',
    createUserSchema,
    zodHook<CreateUserSchema, CustomContext<'/api/user'>>,
  ),
  async (c) => await UserController.createUser(c),
);

// [GET] /api/user 自分のユーザー情報取得
app.get(
  '/api/user',
  async (c) => await UserController.getMe(c),
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
app.delete(
  '/api/user/:id',
  async (c) => await UserController.deleteUser(c),
);

// [GET] /api/user/:id ユーザー情報詳細取得
app.get(
  '/api/user/:id',
  async (c) => await UserController.getUser(c),
);

// [GET] /api/users ユーザー一覧取得
app.get(
  '/api/users',
  async (c) => await UserController.getUsers(c),
);

// [GET] /api/user/detail ユーザー情報詳細取得
app.get(
  '/api/user/:id/detail',
  async (c) => await UserController.getUserDetail(c),
);

// [GET] /api/user/:id/state ユーザーの状態取得
app.get(
  '/api/user/:id/state',
  async (c) => await UserController.state(c),
);

// [GET] /api/user/:id/detail ユーザーの詳細情報取得
app.get(
  '/api/users/detail',
  async (c) => await UserController.getUsersDetail(c),
);

// [PUT] /api/user/:id/approve 承認
app.put(
  '/api/user/:id/approve',
  async (c) => await UserController.approve(c),
);

// [PUT] /api/user/:id/admin 管理者承認
app.put(
  '/api/user/:id/admin',
  async (c) => await OfficerController.approve(c),
);

// [DELETE] /api/user/:id/admin 管理者解除
app.delete(
  '/api/user/:id/admin',
  async (c) => await OfficerController.delete(c),
);

// [POST] /api/user/:id/payment 支払い情報登録
app.post(
  '/api/user/:id/payment',
  async (c) => await PaymentController.paid(c),
);

// [PUT] /api/user/:id/payment 受け取り確認
app.put(
  '/api/user/:id/payment',
  async (c) => await PaymentController.confirme(c),
);

// [POST] /api/group グループを作成
app.post(
  '/api/group',
  zValidator(
    'json',
    goupSchema,
    zodHook<GroupSchema, CustomContext<'/api/group'>>,
  ),
  async (c) => await GroupController.create(c),
);

// [GET] /api/groups グループ一覧を取得する
app.get(
  '/api/groups',
  async (c) => await GroupController.getAllGroups(c),
);

// [GET] /api/group/:id グループ情報を取得する
app.get(
  '/api/group/:id',
  async (c) => await GroupController.getGroup(c),
);

// [DELETE] /api/group/:id グループを削除する
app.delete(
  '/api/group/:id',
  async (c) => await GroupController.delete(c),
);

// [POST] /api/group/user/:id グループにユーザー追加する
app.post(
  '/api/group/user/:id',
  zValidator(
    'json',
    addToGroupSchema,
    zodHook<AddToGroupSchema, CustomContext<'/api/group/user/:id'>>,
  ),
  async (c) => await GroupController.add(c),
);

// [DELETE] /api/group/:id グループに追加する
app.delete(
  '/api/group/user/:id',
  zValidator(
    'json',
    addToGroupSchema,
    zodHook<AddToGroupSchema, CustomContext<'/api/group/:id'>>,
  ),
  async (c) => await GroupController.remove(c),
);

app.all('*', (c) => c.text('Not Found', 404));

export default app;
