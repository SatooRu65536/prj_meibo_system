import { CustomContext } from '@/types/context';
import { AuthService } from '../service/auth.service';
import { CustomResponse, UserDetailRes, UserRes } from '@/types/response';
import {
  auth,
  adminOrSelf,
  approved,
  admin,
  notRegistered,
} from '@/src/decorator';
import { UserRepository } from '../repository/user.repository';
import { UserService } from '../service/user.service';
import { ErrorService } from '../service/error.service';

export class UserController {
  /**
   * ユーザー登録
   */
  @auth
  @notRegistered
  static async createUser(
    c: CustomContext<'/api/users'>,
  ): Promise<CustomResponse<UserDetailRes>> {
    const user = AuthService.getUser(c);
    if (!user) {
      const err = ErrorService.auth.failedAuth();
      return c.json(err.err, err.status);
    }

    const member = await UserRepository.createUser(c, user.uid);

    return c.json({
      success: true,
      member: UserService.toFormatDetail(member),
    });
  }

  /**
   * ユーザー削除
   */
  @admin
  static async deleteUser(c: CustomContext<'/api/users/:id'>) {
    const { id } = c.req.param();
    const idNum = Number(id);
    if (isNaN(idNum)) {
      const err = ErrorService.request.invalidRequest('id', '数値');
      return c.json(err.err, err.status);
    }

    const member = await UserRepository.getUserById(c, idNum);
    if (member === undefined) {
      const err = ErrorService.request.notFound('ユーザー');
      return c.json(err.err, err.status);
    }

    const deleteUser = await UserRepository.deleteUser(c, member.uid);

    return c.json({
      success: true,
      deleteUser: UserService.toFormatDetail(deleteUser),
    });
  }

  /**
   * ユーザー情報更新
   */
  @adminOrSelf
  static async updateUser(c: CustomContext<'/api/users/:id'>) {
    const { id } = c.req.param();
    const idNum = Number(id);
    if (isNaN(idNum)) {
      const err = ErrorService.request.invalidRequest('id', '数値');
      return c.json(err.err, err.status);
    }

    const editMember = await UserRepository.getUserById(c, idNum);
    const editedUser = await UserRepository.updateUser(
      c,
      idNum,
      editMember.uid,
    );

    return c.json({
      success: true,
      member: UserService.toFormatDetail(editedUser),
    });
  }

  /**
   * ユーザー情報取得
   */
  @approved
  static async getUser(
    c: CustomContext<'/api/users/:id'>,
  ): Promise<CustomResponse<UserRes>> {
    const { id } = c.req.param();
    const idNum = Number(id);
    if (isNaN(idNum)) {
      const err = ErrorService.request.invalidRequest('id', '数値');
      return c.json(err.err, err.status);
    }

    // id が一致するユーザー情報を取得
    const member = await UserRepository.getApprovedUserById(c, idNum);

    if (member === undefined) {
      const err = ErrorService.request.notFound('ユーザー');
      return c.json(err.err, err.status);
    }

    return c.json({
      success: true,
      member: UserService.toFormat(member),
    });
  }

  /**
   * ユーザー一覧取得
   */
  @approved
  static async getUsers(c: CustomContext<'/api/users'>) {
    const members = await UserRepository.getApprovedUsers(c);

    return c.json({
      success: true,
      members: members.map((member) => UserService.toFormat(member)),
    });
  }

  /**
   * ユーザー情報詳細取得
   */
  @adminOrSelf
  @approved
  static async getUserDetail(
    c: CustomContext<'/api/users/:id/detail'>,
  ): Promise<CustomResponse<UserDetailRes>> {
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
      const err = ErrorService.request.notFound('ユーザー');
      return c.json(err.err, err.status);
    }

    return c.json({
      success: true,
      member: UserService.toFormatDetail(member),
    });
  }

  /**
   * ユーザーを承認
   */
  @admin
  static async approve(c: CustomContext<'/api/users/:id/approve'>) {
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

    const isApproved = await UserRepository.isApprovedById(c, idNum);
    if (isApproved) {
      const err = ErrorService.request.alreadyApproved();
      return c.json(err.err, err.status);
    }

    const approvedId = await UserService.getIdForApprove(c, user);

    if (approvedId === undefined) {
      const err = ErrorService.auth.notAdmin();
      return c.json(err.err, err.status);
    }

    const member = await UserRepository.approveUser(c, approvedId, idNum);
    if (member === undefined) {
      const err = ErrorService.request.notFound('ユーザー');
      return c.json(err.err, err.status);
    }

    return c.json({
      success: true,
      member: UserService.toFormatDetail(member),
    });
  }

  /**
   * 役職を承認
   * @param c
   */
  @admin
  static async approveOfficer(c: CustomContext<'/api/users/:id/officer'>) {
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

    const approvedId = await UserService.getIdForApprove(c, user);

    const newUserUid = await UserRepository.getUserUidById(c, idNum);

    if (newUserUid === undefined) {
      const err = ErrorService.request.notFound('ユーザー');
      return c.json(err.err, err.status);
    }

    const isApproved = await UserRepository.isAdmin(c, newUserUid);

    if (isApproved) {
      const err = ErrorService.request.alreadyApprovedOfficer();
      return c.json(err.err, err.status);
    }

    if (approvedId === undefined) {
      const err = ErrorService.auth.notAdmin();
      return c.json(err.err, err.status);
    }

    const officer = await UserRepository.approveOfficer(
      c,
      approvedId,
      newUserUid,
    );
    if (officer === undefined) {
      const err = ErrorService.request.approveFailed();
      return c.json(err.err, err.status);
    }

    return c.json({ success: true, officer });
  }

  /**
   * 管理者解除
   */
  @admin
  static async deleteOfficer(c: CustomContext<'/api/users/:id/officer'>) {
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

    const deleteOfficerUid = await UserRepository.getUserUidById(c, idNum);

    if (deleteOfficerUid === undefined) {
      const err = ErrorService.request.notFound('ユーザー');
      return c.json(err.err, err.status);
    }

    const isApproved = await UserRepository.isAdmin(c, deleteOfficerUid);

    if (!isApproved) {
      const err = ErrorService.request.notApprovedOfficer();
      return c.json(err.err, err.status);
    }

    const officer = await UserRepository.deleteOfficer(c, deleteOfficerUid);
    if (officer === undefined) {
      const err = ErrorService.request.deleteOfficerFailed();
      return c.json(err.err, err.status);
    }

    return c.json({ success: true, officer });
  }
}
