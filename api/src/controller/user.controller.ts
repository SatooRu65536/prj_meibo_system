import { CustomContext } from '@/types/context';
import { AuthService } from '../service/auth.service';
import {
  auth,
  adminOrSelf,
  approved,
  admin,
  notDeactivated,
} from '@/src/decorator';
import {
  UserRepoAllFlatT,
  UserRepository,
} from '../repository/user.repository';
import { UserService, UserServiceT } from '../service/user.service';
import { ErrorService } from '../service/error.service';
import { StateRepository } from '../repository/userstate.repojitory';
import { CustomResponse } from '@/types/response';
import { ReturnType } from '@/types';

export class UserController {
  /**
   * 新規, 継続登録
   */
  @auth
  @notDeactivated
  static async createUser(
    c: CustomContext<'/api/user'>,
  ): CustomResponse<{ user: ReturnType<UserServiceT['toFormatDetail']> }> {
    const user = AuthService.getUser(c);
    if (!user) {
      const err = ErrorService.auth.failedAuth();
      return c.json(err.err, err.status);
    }

    const isRegistered = await StateRepository.isRegisteredByUid(c, user.uid);

    // 既に登録済みの場合はエラー
    if (isRegistered) {
      const err = ErrorService.user.registered();
      return c.json(err.err, err.status);
    }

    const isDeactivated = await StateRepository.isDeactivatedByUid(c, user.uid);
    // 無効化されている場合は継続登録
    if (isDeactivated) {
      const member = await UserRepository.continueRegister(c, user.uid);
      return c.json({
        ok: true,
        user: UserService.toFormatDetail(member),
      });
    }

    const member = await UserRepository.createUser(c, user.uid);
    return c.json({
      ok: true,
      user: UserService.toFormatDetail(member),
    });
  }

  /**
   * ユーザー削除
   */
  @admin
  static async deleteUser(
    c: CustomContext<'/api/user/:id'>,
  ): CustomResponse<{ user: ReturnType<UserServiceT['toFormatDetail']> }> {
    const { id } = c.req.param();
    const idNum = Number(id);
    if (isNaN(idNum)) {
      const err = ErrorService.request.invalidRequest('id', '数値');
      return c.json(err.err, err.status);
    }

    const member = await UserRepository.getUserById(c, idNum);
    if (member === undefined) {
      const err = ErrorService.request.userNotFound();
      return c.json(err.err, err.status);
    }

    const deleteUser = await UserRepository.deleteUser(c, member.uid);

    return c.json({
      ok: true,
      user: UserService.toFormatDetail(deleteUser),
    });
  }

  /**
   * ユーザー情報更新
   */
  @adminOrSelf
  static async updateUser(
    c: CustomContext<'/api/user/:id'>,
  ): CustomResponse<{ user: ReturnType<UserServiceT['toFormatDetail']> }> {
    const { id } = c.req.param();
    const idNum = Number(id);
    if (isNaN(idNum)) {
      const err = ErrorService.request.invalidRequest('id', '数値');
      return c.json(err.err, err.status);
    }

    const editMember = await UserRepository.getUserById(c, idNum);

    if (editMember === undefined) {
      const err = ErrorService.request.userNotFound();
      return c.json(err.err, err.status);
    }

    const editedUser = await UserRepository.updateUser(
      c,
      idNum,
      editMember.uid,
    );

    return c.json({
      ok: true,
      user: UserService.toFormatDetail(editedUser),
    });
  }

  /**
   * ユーザー情報取得
   */
  @approved
  static async getUser(c: CustomContext<'/api/user/:id'>): CustomResponse<{
    user: ReturnType<UserServiceT['toFormat'] | UserServiceT['toFormatDetail']>;
    isDetail: boolean;
  }> {
    const { id } = c.req.param();
    const idNum = Number(id);
    if (isNaN(idNum)) {
      const err = ErrorService.request.invalidRequest('id', '数値');
      return c.json(err.err, err.status);
    }

    const user = AuthService.getUser(c);

    if (!user) {
      const err = ErrorService.auth.failedAuth();
      return c.json(err.err, err.status);
    }

    const isAdmin = await StateRepository.isAdmin(c, user.uid);

    // id が一致するユーザー情報を取得
    const member = await UserRepository.getApprovedUserById(c, idNum);

    if (member === undefined) {
      const err = ErrorService.request.userNotFound();
      return c.json(err.err, err.status);
    }

    if (isAdmin) {
      return c.json({
        ok: true,
        user: UserService.toFormatDetail(member),
        isDetail: true,
      });
    }
    return c.json({
      ok: true,
      user: UserService.toFormat(member),
      isDetail: false,
    });
  }

  /**
   * 自分のユーザー情報取得
   */
  @approved
  static async getMe(
    c: CustomContext<'/api/user'>,
  ): CustomResponse<{ user: ReturnType<UserServiceT['toFormatDetail']> }> {
    const user = AuthService.getUser(c);

    if (!user) {
      const err = ErrorService.auth.failedAuth();
      return c.json(err.err, err.status);
    }

    // id が一致するユーザー情報を取得
    const member = await UserRepository.getUserByUidWithPrivateInfo(
      c,
      user.uid,
    );

    if (member === undefined) {
      const err = ErrorService.request.userNotFound();
      return c.json(err.err, err.status);
    }

    return c.json({
      ok: true,
      user: UserService.toFormatDetail(member),
    });
  }

  /**
   * ユーザー一覧取得
   */
  @approved
  static async getUsers(
    c: CustomContext<'/api/users'>,
  ): CustomResponse<{ users: ReturnType<UserServiceT['toFormat']>[] }> {
    const members = await UserRepository.getApprovedUsers(c);

    return c.json({
      ok: true,
      users: members.map((member) => UserService.toFormat(member)),
    });
  }

  /**
   * ユーザー情報詳細取得
   */
  @approved
  @adminOrSelf
  static async getUserDetail(
    c: CustomContext<'/api/user/:id/detail'>,
  ): CustomResponse<{ user: ReturnType<UserServiceT['toFormatDetail']> }> {
    const { id } = c.req.param();
    const idNum = Number(id);
    if (isNaN(idNum)) {
      const err = ErrorService.request.invalidRequest('id', '数値');
      return c.json(err.err, err.status);
    }

    // id が一致するユーザー情報を取得
    const member = await UserRepository.getApprovedUserByIdWithPrivateInfo(
      c,
      idNum,
    );

    if (member === undefined) {
      const err = ErrorService.request.userNotFound();
      return c.json(err.err, err.status);
    }

    return c.json({
      ok: true,
      user: UserService.toFormatDetail(member),
    });
  }

  /**
   * ユーザー詳細情報一覧取得
   */
  @admin
  static async getUsersDetail(
    c: CustomContext<'/api/users/detail'>,
  ): CustomResponse<{
    users: UserRepoAllFlatT;
  }> {
    const members = await UserRepository.getAllUsers(c);

    return c.json({
      ok: true,
      users: members,
    });
  }

  /**
   * ユーザーを承認
   */
  @admin
  static async approve(
    c: CustomContext<'/api/user/:id/approve'>,
  ): CustomResponse<{ user: ReturnType<UserServiceT['toFormatDetail']> }> {
    const { id } = c.req.param();
    const idNum = Number(id);
    if (isNaN(idNum)) {
      const err = ErrorService.request.invalidRequest('id', '数値');
      return c.json(err.err, err.status);
    }

    const user = AuthService.getUser(c);
    if (!user) {
      const err = ErrorService.auth.failedAuth();
      return c.json(err.err, err.status);
    }

    const isApproved = await StateRepository.isApprovedById(c, idNum);
    if (isApproved) {
      const err = ErrorService.request.alreadyApproved();
      return c.json(err.err, err.status);
    }

    const approvedId = await UserService.getIdForApprove(c, user);

    if (approvedId === undefined) {
      const err = ErrorService.auth.notAdmin();
      return c.json(err.err, err.status);
    }

    const member = await UserRepository.approve(c, approvedId, idNum);
    if (member === undefined) {
      const err = ErrorService.request.userNotFound();
      return c.json(err.err, err.status);
    }

    return c.json({
      ok: true,
      user: UserService.toFormatDetail(member),
    });
  }

  /**
   * ユーザーの状態取得
   * @param c
   * @returns
   */
  @adminOrSelf
  static async state(c: CustomContext<':id'>): CustomResponse<{
    state: 'unregistered' | 'deactivated' | 'unapproved' | 'registered';
  }> {
    const { id } = c.req.param();
    const idNum = Number(id);
    if (isNaN(idNum)) {
      const err = ErrorService.request.invalidRequest('id', '数値');
      return c.json(err.err, err.status);
    }

    const member = await UserRepository.getUserById(c, idNum);
    if (member === undefined) {
      const err = ErrorService.request.userNotFound();
      return c.json(err.err, err.status);
    }

    const state = await StateRepository.getStateByUid(c, member.uid);

    return c.json({ ok: true, state });
  }

  /**
   * 管理者かどうか
   */
  static async isAdmin(
    c: CustomContext<'/api/user/admin'>,
  ): CustomResponse<{ isAdmin: boolean }> {
    const user = AuthService.getUser(c);
    if (!user) return c.json({ ok: true, isAdmin: false });

    const isAdmin = await StateRepository.isAdmin(c, user.uid);
    const initAdmins = c.env?.DEFAULT_ADMIN_EMAILS.split(',') || '';
    const includeAdmin = user?.email && initAdmins.includes(user?.email);

    if (isAdmin || includeAdmin) return c.json({ ok: true, isAdmin: true });
    return c.json({ ok: true, isAdmin: false });
  }

  /**
   * 支払い先一覧取得
   */
  static async getPayee(c: CustomContext<'/api/users/payee'>): CustomResponse<{
    payee: { id: number; name: string }[];
  }> {
    const payee = await UserRepository.getPayee(c);
    return c.json({ ok: true, payee });
  }
}
