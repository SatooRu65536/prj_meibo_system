import {
  memberPropertyTable,
  memberTable,
  officerTable,
  stackTable,
} from '../models/schema';
import { SQL, and, desc, eq, isNull, max, or, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { CustomContext } from '@/types/context';
import { UnwrapPromise, ReturnType } from '@/types';
import { UserSchema } from '../validation';
import { UserService } from '../service/user.service';

export class UserRepository {
  /**
   * idが一致するユーザーuidを取得
   * @param c
   * @param id
   * @returns
   */
  static async getUserUidById(
    c: CustomContext<string>,
    id: number,
  ): Promise<string | undefined> {
    const db = drizzle(c.env.DB);

    const [user] = await db
      .select({ uid: memberTable.uid })
      .from(memberTable)
      .where(eq(memberTable.id, id));

    return user?.uid;
  }

  /**
   * idが一致するユーザー情報を取得(承認済)
   * @param c
   * @param id
   * @returns idが一致するユーザー情報を取得(承認済)
   */
  static async getdUserById(c: CustomContext<string>, id: number) {
    const filter = and(eq(memberTable.id, id));

    const [user] = await this.commonGetUer(c, filter);

    return user;
  }

  /**
   * idが一致するユーザー情報を取得(承認済)
   * @param c
   * @param id
   * @returns idが一致するユーザー情報を取得(承認済)
   */
  static async getApprovedUserById(
    c: CustomContext<string>,
    id: number,
    approved = true,
  ) {
    const isApproved = approved ? 1 : 0;
    const filter = and(
      eq(memberTable.id, id),
      eq(memberTable.isApproved, isApproved),
    );

    const [user] = await this.commonGetUer(c, filter);

    return user;
  }

  /**
   * idが一致するユーザー情報を取得(承認済)
   * @param c
   * @param id
   * @returns idが一致するユーザー情報を取得(承認済)
   */
  static async getApprovedUserByUid(
    c: CustomContext<string>,
    uid: string,
    approved = true,
  ) {
    const isApproved = approved ? 1 : 0;
    const filter = and(
      eq(memberTable.uid, uid),
      eq(memberTable.isApproved, isApproved),
    );

    const [user] = await this.commonGetUer(c, filter);

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
    const filter = eq(memberTable.id, id);

    const [user] = await this.commonGetUerWithPrivateInfo(c, filter);
    return user;
  }

  /**
   * idが一致するユーザー詳細情報を取得(承認済)
   * @param c
   * @param id
   * @returns idが一致するユーザー詳細情報を取得(承認済)
   */
  static async getApprovedUserByIdWithPrivateInfo(
    c: CustomContext<string>,
    id: number,
    approved = true,
  ) {
    const isApproved = approved ? 1 : 0;
    const filter = and(
      eq(memberTable.id, id),
      eq(memberTable.isApproved, isApproved),
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
    const { member } = await c.req.json<UserSchema>();

    const db = drizzle(c.env.DB);
    const now = Date.now();
    const [ids] = await db.batch([
      db
        .insert(memberTable)
        .values({ uid: uid, createdAt: now, updatedAt: now, isApproved: 0 })
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

    return await this.getUserByIdWithPrivateInfo(c, ids[0].id);
  }

  /**
   * ユーザー情報を更新する
   * @param c
   * @param uid
   */
  static async updateUser(c: CustomContext<string>, id: number, uid: string) {
    const { member } = await c.req.json<UserSchema>();

    const db = drizzle(c.env.DB);
    const now = Date.now();
    await db.batch([
      db
        .update(stackTable)
        .set({ deletedAt: now })
        .where(eq(stackTable.uid, uid)),
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

    return await this.getUserByIdWithPrivateInfo(c, id);
  }

  /**
   * ユーザー登録を承認する
   * @param c
   * @param adminId 承認した管理者のid
   * @param newUserId 承認するユーザーのid
   */
  static async approveUser(
    c: CustomContext<string>,
    adminId: number,
    newUserId: number,
  ) {
    const db = drizzle(c.env.DB);
    const now = Date.now();
    const [member] = await db
      .update(memberTable)
      .set({ isApproved: 1, updatedAt: now, approveBy: adminId })
      .where(eq(memberTable.id, newUserId))
      .returning({ id: memberTable.id });

    return this.getApprovedUserByIdWithPrivateInfo(c, member.id);
  }

  /**
   * ユーザーを管理者に承認する
   * @param c
   * @param adminId 承認した管理者のid
   * @param newUserId 承認するユーザーのid
   */
  static async approveOfficer(
    c: CustomContext<string>,
    approvedId: number,
    newUserUid: string,
  ) {
    const db = drizzle(c.env.DB);
    const now = Date.now();

    const [officer] = await db
      .insert(officerTable)
      .values({
        uid: newUserUid,
        createdAt: now,
        approvedBy: approvedId,
      })
      .returning();

    return officer;
  }

  /**
   * 管理者権限があるか
   */
  static async isAdmin(c: CustomContext<string>, uid: string) {
    const db = drizzle(c.env.DB);

    const [first] = await db
      .select()
      .from(memberTable)
      .leftJoin(officerTable, eq(officerTable.uid, memberTable.uid))
      .where(
        and(
          eq(officerTable.uid, uid),
          isNull(officerTable.deletedAt),
          isNull(memberTable.deletedAt),
        ),
      );

    return first !== undefined;
  }

  /**
   * 管理者権限があるか、または本人か
   * @param c
   * @param uid
   * @param id
   * @returns
   */
  static async isAdminOrSelf(
    c: CustomContext<string>,
    uid: string,
    id: number,
  ) {
    const db = drizzle(c.env.DB);

    const [first] = await db
      .select()
      .from(memberTable)
      .leftJoin(officerTable, eq(officerTable.uid, memberTable.uid))
      .where(
        or(
          and(
            eq(memberTable.id, id),
            eq(memberTable.uid, uid),
            isNull(memberTable.deletedAt),
          ),
          and(
            eq(officerTable.uid, uid),
            isNull(officerTable.deletedAt),
            isNull(memberTable.deletedAt),
          ),
        ),
      );

    return first !== undefined;
  }

  /**
   * 承認済みか
   * @param c
   * @param uid
   * @returns
   */
  static async isApprovedById(c: CustomContext<string>, id: number) {
    const db = drizzle(c.env.DB);

    const [approvedMembers] = await db
      .select()
      .from(memberTable)
      .where(
        and(
          eq(memberTable.id, id),
          isNull(memberTable.deletedAt),
          eq(memberTable.isApproved, 1),
        ),
      );

    return approvedMembers !== undefined;
  }

  /**
   * 承認済みか
   * @param c
   * @param uid
   * @returns
   */
  static async isApprovedByUid(c: CustomContext<string>, uid: string) {
    const db = drizzle(c.env.DB);

    const [approvedMembers] = await db
      .select()
      .from(memberTable)
      .where(
        and(
          eq(memberTable.uid, uid),
          isNull(memberTable.deletedAt),
          eq(memberTable.isApproved, 1),
        ),
      );

    return approvedMembers !== undefined;
  }

  /**
   * 登録済みか(user を包括)
   * @param c
   * @param uid
   */
  static async isRegisteredByUid(c: CustomContext<string>, uid: string) {
    const db = drizzle(c.env.DB);

    const [registeredMembers] = await db
      .select()
      .from(memberTable)
      .where(and(eq(memberTable.uid, uid), isNull(memberTable.deletedAt)));

    return registeredMembers !== undefined;
  }

  /**
   * ユーザー情報を取得(privateInfoなし)
   * @param c
   * @param filter
   * @returns ユーザー情報(privateInfoなし)
   */
  private static async commonGetUer(c: CustomContext<string>, filter?: SQL) {
    const db = drizzle(c.env.DB);
    const propaties = await db
      .select({
        id: memberTable.id,
        uid: memberTable.uid,
        createdAt: memberTable.createdAt,
        updatedAt: max(memberPropertyTable.createdAt),
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
      .leftJoin(
        memberPropertyTable,
        eq(memberTable.uid, memberPropertyTable.uid),
      )
      .groupBy(memberPropertyTable.uid)
      .where(filter)
      .orderBy(desc(memberTable.id));
    const skills = await db
      .select({ skill: stackTable.name, uid: stackTable.uid })
      .from(stackTable)
      .where(isNull(stackTable.deletedAt));

    return propaties.map((p) => {
      return {
        ...p,
        skills: skills.filter((s) => s.uid === p.uid).map((s) => s.skill),
      };
    });
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
        uid: memberTable.uid,
        createdAt: memberTable.createdAt,
        updatedAt: max(memberPropertyTable.createdAt),
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
      .leftJoin(
        memberPropertyTable,
        eq(memberTable.uid, memberPropertyTable.uid),
      )
      .where(filter)
      .orderBy(desc(memberTable.id));
    const skills = await db
      .select({ skill: stackTable.name, uid: stackTable.uid })
      .from(stackTable)
      .where(isNull(stackTable.deletedAt));

    return res.map((r) => {
      const { address, privateInfo, ...m } = r;
      return {
        ...m,
        skills: skills.filter((s) => s.uid === m.uid).map((s) => s.skill),
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
  ReturnType<typeof UserRepository.getApprovedUserById>
>;
export type UserRepoWithPrivateInfoT = UnwrapPromise<
  ReturnType<typeof UserRepository.getApprovedUserByIdWithPrivateInfo>
>;
