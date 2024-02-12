import { memberPropertyTable, memberTable, stackTable } from '../models/schema';
import { SQL, and, eq, isNull, max, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { CustomContext } from '@/types/context';
import { UnwrapPromise, ReturnType } from '@/types';
import { CreateUserSchema } from '../validation';
import { UserService } from '../service/user.service';

export class UserRepository {
  /**
   * idが一致するユーザー情報を取得(承認済)
   * @param c
   * @param id
   * @returns idが一致するユーザー情報を取得(承認済)
   */
  static async getUserById(c: CustomContext<string>, id: number) {
    const filter = and(
      eq(memberTable.id, id),
      eq(memberTable.isApproved, 0),
      isNull(stackTable.deletedAt),
    );

    const [user] = await this.commonGetUer(c, filter);
    console.log(user);
    return user;
  }

  /**
   * idが一致するユーザー詳細情報を取得(承認済)
   * @param c
   * @param id
   * @returns idが一致するユーザー詳細情報を取得(承認済)
   */
  static async getUserByIdWithPrivateInfo(
    c: CustomContext<string>,
    id: number,
  ) {
    const filter = and(
      eq(memberTable.id, id),
      eq(memberTable.isApproved, 0),
      isNull(stackTable.deletedAt),
    );

    const [user] = await this.commonGetUerWithPrivateInfo(c, filter);
    return user;
  }

  /**
   * ユーザー情報を登録する
   * @param c
   * @param uid
   * @return
   */
  static async createUser(c: CustomContext<string>, uid: string) {
    const { member } = await c.req.json<CreateUserSchema>();

    const db = drizzle(c.env.DB);
    const now = Date.now();
    const [ids] = await db.batch([
      db
        .insert(memberTable)
        .values({ uid: uid, createdAt: now })
        .returning({ id: memberTable.id }),

      db.insert(stackTable).values(
        member.skills.map((s) => ({
          uid: uid,
          name: s,
          createdAt: now,
        })),
      ),
      db
        .insert(memberPropertyTable)
        .values(UserService.toFlatUser(member, uid, now)),
    ]);

    return this.getUserByIdWithPrivateInfo(c, ids[0].id);
  }

  /**
   * ユーザー情報を取得(privateInfoなし)
   * @param c
   * @param filter
   * @returns ユーザー情報(privateInfoなし)
   */
  private static async commonGetUer(c: CustomContext<string>, filter?: SQL) {
    const db = drizzle(c.env.DB);
    return await db
      .select({
        id: memberTable.id,
        createdAt: memberTable.createdAt,
        updatedAt: max(memberPropertyTable.createdAt),
        skills: sql`GROUP_CONCAT(${stackTable.name})`,
        firstName: memberPropertyTable.firstName,
        lastName: memberPropertyTable.lastName,
        firstNameKana: memberPropertyTable.firstNameKana,
        lastNameKana: memberPropertyTable.lastNameKana,
        graduationYear: memberPropertyTable.graduationYear,
        slackName: memberPropertyTable.slackName,
        iconUrl: memberPropertyTable.iconUrl,
        type: memberPropertyTable.type,

        studentNumber: memberPropertyTable.studentNumber,
        position: memberPropertyTable.position,
        grade: memberPropertyTable.grade,

        oldPosition: memberPropertyTable.oldPosition,
        oldStudentNumber: memberPropertyTable.oldStudentNumber,
        employment: memberPropertyTable.employment,

        school: memberPropertyTable.school,
        organization: memberPropertyTable.organization,
      })
      .from(memberTable)
      .leftJoin(stackTable, eq(memberTable.uid, stackTable.uid))
      .leftJoin(
        memberPropertyTable,
        eq(memberTable.uid, memberPropertyTable.uid),
      )
      .groupBy(stackTable.uid, memberPropertyTable.uid)
      .where(filter);
  }

  /**
   * ユーザー情報を取得(privateInfo)
   * @param c
   * @param filter
   * @returns ユーザー情報(privateInfo)
   */
  private static async commonGetUerWithPrivateInfo(
    c: CustomContext<string>,
    filter?: SQL,
  ) {
    const db = drizzle(c.env.DB);
    const res = await db
      .select({
        id: memberTable.id,
        createdAt: memberTable.createdAt,
        updatedAt: max(memberPropertyTable.createdAt),
        skills: sql`GROUP_CONCAT(${stackTable.name})`,
        firstName: memberPropertyTable.firstName,
        lastName: memberPropertyTable.lastName,
        firstNameKana: memberPropertyTable.firstNameKana,
        lastNameKana: memberPropertyTable.lastNameKana,
        graduationYear: memberPropertyTable.graduationYear,
        slackName: memberPropertyTable.slackName,
        iconUrl: memberPropertyTable.iconUrl,
        type: memberPropertyTable.type,

        studentNumber: memberPropertyTable.studentNumber,
        position: memberPropertyTable.position,
        grade: memberPropertyTable.grade,

        oldPosition: memberPropertyTable.oldPosition,
        oldStudentNumber: memberPropertyTable.oldStudentNumber,
        employment: memberPropertyTable.employment,

        school: memberPropertyTable.school,
        organization: memberPropertyTable.organization,

        privateInfo: {
          birthdate: memberPropertyTable.birthdate,
          gender: memberPropertyTable.gender,
          phoneNumber: memberPropertyTable.phoneNumber,
          email: memberPropertyTable.email,
        },
        address: {
          homePostalCode: memberPropertyTable.homePostalCode,
          homeAddress: memberPropertyTable.homeAddress,
          cuurentPostalCode: memberPropertyTable.cuurentPostalCode,
          currentAddress: memberPropertyTable.currentAddress,
        },
      })
      .from(memberTable)
      .leftJoin(stackTable, eq(memberTable.uid, stackTable.uid))
      .leftJoin(
        memberPropertyTable,
        eq(memberTable.uid, memberPropertyTable.uid),
      )
      .groupBy(stackTable.uid)
      .where(filter);

    return res.map((r) => {
      const { address, privateInfo, ...m } = r;
      return {
        ...m,
        privateInfo: {
          ...privateInfo,
          currentAddress: {
            postalCode: address?.cuurentPostalCode,
            address: address?.currentAddress,
          },
          homeAddress: {
            postalCode: address?.homePostalCode,
            address: address?.homeAddress,
          },
        },
      };
    });
  }
}

export type UserRepoT = UnwrapPromise<
  ReturnType<typeof UserRepository.getUserById>
>;
export type UserRepoWithPrivateInfoT = UnwrapPromise<
  ReturnType<typeof UserRepository.getUserByIdWithPrivateInfo>
>;
