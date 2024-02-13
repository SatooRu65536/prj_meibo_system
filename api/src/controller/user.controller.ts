import { CustomContext } from '@/types/context';
import { AuthService } from '../service/auth.service';
import {
  auth,
  adminOrSelf,
  approved,
  admin,
  notRegistered,
  notDeactivated,
  deactivated,
} from '@/src/decorator';
import { UserRepository } from '../repository/user.repository';
import { UserService, UserServiceT } from '../service/user.service';
import { ErrorService } from '../service/error.service';
import { StateRepository } from '../repository/userstate.repojitory';
import { CustomResponse } from '@/types/response';
import { ReturnType } from '@/types';

export class UserController {
  /**
   * ユーザー登録
   */
  @auth
  @notRegistered
  @notDeactivated
  static async createUser(
    c: CustomContext<'/api/user'>,
  ): CustomResponse<{ user: ReturnType<UserServiceT['toFormatDetail']> }> {
    const user = AuthService.getUser(c);
    if (!user) {
      const err = ErrorService.auth.failedAuth();
      return c.json(err.err, err.status);
    }

    const member = await UserRepository.createUser(c, user.uid);

    return c.json({
      success: true,
      user: UserService.toFormatDetail(member),
    });
  }

  /**
   * 継続登録
   */
  @deactivated
  static async continueRegister(
    c: CustomContext<'/api/user/continue'>,
  ): CustomResponse<{ user: ReturnType<UserServiceT['toFormatDetail']> }> {
    const user = AuthService.getUser(c);
    if (!user) {
      const err = ErrorService.auth.failedAuth();
      return c.json(err.err, err.status);
    }

    const member = await UserRepository.continueRegister(c, user.uid);

    return c.json({
      success: true,
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
      success: true,
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
      success: true,
      user: UserService.toFormatDetail(editedUser),
    });
  }

  /**
   * ユーザー情報取得
   */
  @approved
  static async getUser(
    c: CustomContext<'/api/user/:id'>,
  ): CustomResponse<{ user: ReturnType<UserServiceT['toFormat']> }> {
    const { id } = c.req.param();
    const idNum = Number(id);
    if (isNaN(idNum)) {
      const err = ErrorService.request.invalidRequest('id', '数値');
      return c.json(err.err, err.status);
    }

    // id が一致するユーザー情報を取得
    const member = await UserRepository.getApprovedUserById(c, idNum);

    if (member === undefined) {
      const err = ErrorService.request.userNotFound();
      return c.json(err.err, err.status);
    }

    return c.json({
      success: true,
      user: UserService.toFormat(member),
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
      success: true,
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
      success: true,
      user: UserService.toFormatDetail(member),
    });
  }

  /**
   * ユーザー詳細情報一覧取得
   */
  @admin
  static async getUsersDetail(
    c: CustomContext<'/api/users/detail'>,
  ): CustomResponse<{ users: ReturnType<UserServiceT['toFormat']>[] }> {
    const members = await UserRepository.getApprovedUsers(c);

    return c.json({
      success: true,
      users: members.map((member) => UserService.toFormatDetail(member)),
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
      success: true,
      user: UserService.toFormatDetail(member),
    });
  }
}
