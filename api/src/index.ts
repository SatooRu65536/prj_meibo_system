import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { UserController } from './controller/user.controller';
import { CustomContext, Env } from '@/types/context';
import { verifyFirebaseAuth } from './service/auth.service';
import { zodHook } from './validation';
import { zValidator } from '@hono/zod-validator';
import { UserSchema, userSchema } from './validation/user';
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

// [POST] /api/user 新規ユーザー登録
const postUser = app.post(
  '/api/user',
  zValidator(
    'json',
    userSchema,
    zodHook<UserSchema, CustomContext<'/api/user'>>,
  ),
  async (c) => await UserController.createUser(c),
);

// [POST] /api/user/continue 継続登録
const postUserContinue = app.post(
  '/api/user/continue',
  zValidator(
    'json',
    userSchema,
    zodHook<UserSchema, CustomContext<'/api/user'>>,
  ),
  async (c) => await UserController.continueRegister(c),
);

// [PUT] /api/user/:id 編集
const putUserId = app.put(
  '/api/user/:id',
  zValidator(
    'json',
    userSchema,
    zodHook<UserSchema, CustomContext<'/api/user/:id'>>,
  ),
  async (c) => await UserController.updateUser(c),
);

// [DELETE] /api/user/:id ユーザー削除
const deleteUserId = app.delete(
  '/api/user/:id',
  async (c) => await UserController.deleteUser(c),
);

// [GET] /api/user/:id ユーザー情報詳細取得
const GetUserId = app.get(
  '/api/user/:id',
  async (c) => await UserController.getUser(c),
);

// [GET] /api/users ユーザー一覧取得
const getUsers = app.get(
  '/api/users',
  async (c) => await UserController.getUsers(c),
);

// [GET] /api/user/detail ユーザー情報詳細取得
const getUserdetail = app.get(
  '/api/user/:id/detail',
  async (c) => await UserController.getUserDetail(c),
);

// [GET] /api/user/:id/state ユーザーの状態取得
const getUserIdState = app.get(
  '/api/user/:id/state',
  async (c) => await UserController.state(c),
);

// [GET] /api/user/:id/detail ユーザーの詳細情報取得
const getUseridDetail = app.get(
  '/api/users/detail',
  async (c) => await UserController.getUsersDetail(c),
);

// [PUT] /api/user/:id/approve 承認
const putUserIdApprove = app.put(
  '/api/user/:id/approve',
  async (c) => await UserController.approve(c),
);

// [PUT] /api/user/:id/admin 管理者承認
const putUserIdOfficer = app.put(
  '/api/user/:id/admin',
  async (c) => await OfficerController.approve(c),
);

// [DELETE] /api/user/:id/admin 管理者解除
const deleteUserIdAdmin = app.delete(
  '/api/user/:id/admin',
  async (c) => await OfficerController.delete(c),
);

// [POST] /api/user/:id/payment 支払い情報登録
const postUserIdPayment = app.post(
  '/api/user/:id/payment',
  async (c) => await PaymentController.paid(c),
);

// [PUT] /api/user/:id/payment 受け取り確認
const putUseridPayment = app.put(
  '/api/user/:id/payment',
  async (c) => await PaymentController.confirme(c),
);

// [POST] /api/group グループを作成
const postGroup = app.post(
  '/api/group',
  zValidator(
    'json',
    goupSchema,
    zodHook<GroupSchema, CustomContext<'/api/group'>>,
  ),
  async (c) => await GroupController.create(c),
);

// [GET] /api/groups グループ一覧を取得する
const getGroup = app.get(
  '/api/groups',
  async (c) => await GroupController.getAllGroups(c),
);

// [GET] /api/group/:id グループ情報を取得する
const getGroupId = app.get(
  '/api/group/:id',
  async (c) => await GroupController.getGroup(c),
);

// [DELETE] /api/group/:id グループを削除する
const deleteGroupId = app.delete(
  '/api/group/:id',
  async (c) => await GroupController.delete(c),
);

// [POST] /api/group/user/:id グループにユーザー追加する
const postGroupUserId = app.post(
  '/api/group/user/:id',
  zValidator(
    'json',
    addToGroupSchema,
    zodHook<AddToGroupSchema, CustomContext<'/api/group/user/:id'>>,
  ),
  async (c) => await GroupController.add(c),
);

// [DELETE] /api/group/:id グループに追加する
const deleteGroupUserId = app.delete(
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
export type ApiType = {
  postUser: typeof postUser;
  postUserContinue: typeof postUserContinue;
  putUserId: typeof putUserId;
  deleteUserId: typeof deleteUserId;
  GetUserId: typeof GetUserId;
  getUsers: typeof getUsers;
  getUserdetail: typeof getUserdetail;
  getUserIdState: typeof getUserIdState;
  getUseridDetail: typeof getUseridDetail;
  putUserIdApprove: typeof putUserIdApprove;
  putUserIdOfficer: typeof putUserIdOfficer;
  deleteUserIdAdmin: typeof deleteUserIdAdmin;
  postUserIdPayment: typeof postUserIdPayment;
  putUseridPayment: typeof putUseridPayment;
  postGroup: typeof postGroup;
  getGroup: typeof getGroup;
  getGroupId: typeof getGroupId;
  deleteGroupId: typeof deleteGroupId;
  postGroupUserId: typeof postGroupUserId;
  deleteGroupUserId: typeof deleteGroupUserId;
};
