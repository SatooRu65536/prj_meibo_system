import { CustomContext } from '@/types/context';
import { AuthService } from '../service/auth.service';
import { drizzle } from 'drizzle-orm/d1';
import { memberPropertyTable, memberTable, stackTable } from '../models/schema';
import { CustomResponse } from '@/types/response';
import { CreateUserSchema } from '../validation';
import { eq } from 'drizzle-orm';
import { CreateAt, MemberPropertyTable } from '@/types/member';
import { CreateUserRes } from '@/types/response/user';

/**
 * @private
 */
export class UserController {
  /**
   * ユーザーが見つからないエラー
   * @param c
   * @returns
   */
  private static error(
    c: CustomContext<string>,
    message: string,
  ): CustomResponse<never> {
    return c.json({ success: false, message }, 401);
  }

  /**
   * ユーザー情報をフラットにする
   * @param member
   * @returns フラットなユーザー情報
   */
  private static toFlatUser(
    member: CreateUserSchema['member'],
    uid: string,
    now: number,
  ): MemberPropertyTable<CreateAt> {
    const { type } = member;

    const base = {
      uid: uid,
      createdAt: now,
      firstName: member.firstName,
      lastName: member.lastName,
      firstNameKana: member.firstNameKana,
      lastNameKana: member.lastNameKana,
      graduationYear: member.graduationYear,
      slackName: member.slackName,
      iconUrl: member.iconUrl,
      birthdate: member.privateInfo.birthdate,
      gender: member.privateInfo.gender,
      phoneNumber: member.privateInfo.phoneNumber,
      email: member.privateInfo.email,
      cuurentPostalCode: member.privateInfo.currentAddress.postalCode,
      currentAddress: member.privateInfo.currentAddress.address,
      homePostalCode: member.privateInfo.homeAddress.postalCode,
      homeAddress: member.privateInfo.homeAddress.address,
    };

    if (type === 'active') {
      return {
        type: 'active',
        ...base,
        studentNumber: member.studentNumber,
        position: member.position,
        grade: member.grade,

        createdAt: now,
      };
    } else if (type === 'obog') {
      return {
        type: 'obog',
        ...base,
        oldPosition: member.oldPosition,
        oldStudentNumber: member.oldStudentNumber,
        employment: member.employment,
      };
    } else {
      return {
        type: 'external',
        ...base,
        school: member.school,
        organization: member.organization,
      };
    }
  }

  /**
   * ユーザー登録
   * @param c
   */
  static async createUser(
    c: CustomContext<'/api/users'>,
  ): Promise<CustomResponse<CreateUserRes>> {
    const { member } = await c.req.json<CreateUserSchema>();

    // ユーザー情報を取得
    const user = AuthService.getUser(c);

    if (!user) return this.error(c, '認証に失敗しました');

    const db = drizzle(c.env.DB);

    // uid が存在するか確認
    const registeredMembers = await drizzle(c.env.DB)
      .select()
      .from(memberTable)
      .where(eq(memberTable.uid, user.uid));

    if (registeredMembers.length > 0)
      return this.error(c, '既に登録されています');

    const now = Date.now();
    // ユーザー情報を登録
    const [ids] = await db.batch([
      db
        .insert(memberTable)
        .values({ uid: user.uid })
        .returning({ id: memberTable.id }),
      db.insert(stackTable).values(
        member.skills.map((s) => ({
          uid: user.uid,
          name: s,
          createdAt: now,
        })),
      ),
      db
        .insert(memberPropertyTable)
        .values(this.toFlatUser(member, user.uid, now)),
    ]);

    const res = { ...ids[0], ...member };
    return c.json({ success: true, member: res });
  }
}
