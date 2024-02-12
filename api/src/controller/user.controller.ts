import { CustomContext } from '@/types/context';
import { AuthService } from '../service/auth.service';
import { CustomResponse, UserDetailRes, UserRes } from '@/types/response';
import { auth, adminOrSelf, registered, notRegistered } from '@/src/decorator';
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
    // ユーザー情報を登録

    const member = await UserRepository.createUser(c, user.uid);

    return c.json({
      success: true,
      member: UserService.toFormatDetail(member),
    });
  }

  /**
   * ユーザー情報詳細取得
   */
  @registered
  @adminOrSelf
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
    const member = await UserRepository.getUserByIdWithPrivateInfo(c, idNum);

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
   * ユーザー情報取得
   */
  @registered
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
    const member = await UserRepository.getUserById(c, idNum);

    if (member === undefined) {
      const err = ErrorService.request.notFound('ユーザー');
      return c.json(err.err, err.status);
    }

    return c.json({
      success: true,
      member: UserService.toFormat(member),
    });
  }
}
