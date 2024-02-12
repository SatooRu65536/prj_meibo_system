import { CustomContext } from '@/types/context';
import { AuthService } from '../service/auth.service';
import { drizzle } from 'drizzle-orm/d1';
import {
  memberPropertyTable,
  memberTable,
  officerTable,
  stackTable,
} from '../models/schema';
import { CustomResponse } from '@/types/response';
import { CreateUserSchema } from '../validation';
import { eq } from 'drizzle-orm';
import { CreatedAt, Id, MemberPropertyTable } from '@/types/table';
import { UserDetailRes, UserRes } from '@/types/response/user';
import { auth, adminOrSelf, registered, notRegistered } from '@/src/decorator';
import { UserRepository } from '../repository/user.repository';
import { UserService } from '../service/user.service';

/**
 * @private
 */
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
    if (!user) return this.error(c, '認証に失敗しました');
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
  @adminOrSelf
  @registered
  static async getUserDetail(
    c: CustomContext<'/api/users/:id/detail'>,
  ): Promise<CustomResponse<UserDetailRes>> {
    const { id } = c.req.param();
    const idNum = Number(id);
    if (isNaN(idNum)) return this.error(c, 'IDが不正です');

    // id が一致するユーザー情報を取得
    const member = await UserRepository.getUserByIdWithPrivateInfo(c, idNum);

    if (member === undefined) return this.error(c, 'ユーザーが見つかりません');

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
    if (isNaN(idNum)) return this.error(c, 'IDが不正です');

    // id が一致するユーザー情報を取得
    const member = await UserRepository.getUserById(c, idNum);

    if (member === undefined) return this.error(c, 'ユーザーが見つかりません');

    return c.json({
      success: true,
      member: UserService.toFormat(member),
    });
  }

  /**
   * ユーザーが見つからないエラー
   */
  private static error(
    c: CustomContext<string>,
    message: string,
  ): CustomResponse<never> {
    return c.json({ success: false, message }, 401);
  }
}
