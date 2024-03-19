import {
  memberPropertyTable,
  memberTable,
  officerTable,
  paymentTable,
  stackTable,
} from '../models/schema';
import {
  SQL,
  and,
  desc,
  eq,
  gte,
  inArray,
  isNotNull,
  isNull,
  max,
  sql,
} from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { CustomContext } from '@/types/context';
import { UnwrapPromise, ReturnType } from '@/types';
import { UserSchema } from '../validation';
import { UserService } from '../service/user.service';
import { getFYFirstdate } from '@/util';
import { CreateUserSchema } from '../validation/user';

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
    const fyFirst = getFYFirstdate();

    const [user] = await db
      .select({ uid: memberTable.uid })
      .from(memberTable)
      .where(
        and(
          eq(memberTable.id, id),
          isNull(memberTable.deletedAt),
          gte(memberTable.updatedAt, fyFirst),
        ),
      );

    return user?.uid;
  }

  static async getUserUidsByIds(c: CustomContext<string>, ids: number[]) {
    const db = drizzle(c.env.DB);
    const fyFirst = getFYFirstdate();

    const res = await db
      .select({ uid: memberTable.uid })
      .from(memberTable)
      .where(
        and(
          inArray(memberTable.id, ids),
          isNull(memberTable.deletedAt),
          gte(memberTable.updatedAt, fyFirst),
        ),
      );

    return res.map((r) => r.uid);
  }

  /**
   * idが一致するユーザー情報を取得(承認済)
   * @param c
   * @param id
   * @returns idが一致するユーザー情報を取得(承認済)
   */
  static async getUserById(c: CustomContext<string>, id: number) {
    const filter = and(eq(memberTable.id, id), isNull(memberTable.deletedAt));

    const [user] = await this.commonGetUerWithPrivateInfo(c, filter);

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
      isNull(memberTable.deletedAt),
    );

    const [user] = await this.commonGetUerWithPrivateInfo(c, filter);

    return user;
  }

  /**
   * ユーザー情報を取得(承認済)
   * @param c
   * @returns
   */
  static async getApprovedUsers(c: CustomContext<string>, approved = true) {
    const isApproved = approved ? 1 : 0;
    const filter = and(
      eq(memberTable.isApproved, isApproved),
      isNull(memberTable.deletedAt),
    );

    return await this.commonGetUerWithPrivateInfo(c, filter);
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
      isNull(memberTable.deletedAt),
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
    const filter = and(eq(memberTable.id, id), isNull(memberTable.deletedAt));

    const [user] = await this.commonGetUerWithPrivateInfo(c, filter);
    return user;
  }

  /**
   * uidが一致するユーザー詳細情報を取得(承認済)
   * @param c
   * @param id
   * @returns idが一致するユーザー詳細情報を取得(承認済)
   */
  static async getUserByUidWithPrivateInfo(
    c: CustomContext<string>,
    uid: string,
  ) {
    const filter = and(eq(memberTable.uid, uid), isNull(memberTable.deletedAt));

    const [user] = await this.commonGetUerWithPrivateInfo(c, filter);
    return user;
  }

  static async getDeletedUserByUidWithPrivateInfo(
    c: CustomContext<string>,
    id: number,
  ) {
    const filter = and(
      eq(memberTable.id, id),
      isNotNull(memberTable.deletedAt),
    );

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
      isNull(memberTable.deletedAt),
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
    const { user, payeeId } = await c.req.json<CreateUserSchema>();

    const db = drizzle(c.env.DB);
    const now = Date.now();
    const [ids] = await db.batch([
      db
        .insert(memberTable)
        .values({ uid: uid, createdAt: now, updatedAt: now, isApproved: 0 })
        .returning({ id: memberTable.id }),
      db.insert(stackTable).values(
        user.skills.map((s) => ({
          uid: uid,
          name: s,
          createdAt: now,
        })),
      ),
      db
        .insert(memberPropertyTable)
        .values(UserService.toFlatUser(user, uid, now)),
      db.insert(paymentTable).values({
        uid: uid,
        payee: payeeId,
        createdAt: now,
        updatedAt: now,
      }),
    ]);

    return await this.getUserByIdWithPrivateInfo(c, ids[0].id);
  }

  /**
   * 継続登録
   * @param c
   * @param uid
   */
  static async continueRegister(c: CustomContext<string>, uid: string) {
    const { user } = await c.req.json<UserSchema>();

    const db = drizzle(c.env.DB);
    const now = Date.now();
    db.update(memberTable)
      .set({ deletedAt: now })
      .where(eq(memberTable.uid, uid));

    const [ids] = await db.batch([
      db
        .insert(memberTable)
        .values({ uid: uid, createdAt: now, updatedAt: now, isApproved: 0 })
        .returning({ id: memberTable.id }),
      db.insert(stackTable).values(
        user.skills.map((s) => ({
          uid: uid,
          name: s,
          createdAt: now,
        })),
      ),
      db
        .insert(memberPropertyTable)
        .values(UserService.toFlatUser(user, uid, now)),
    ]);

    return await this.getUserByIdWithPrivateInfo(c, ids[0].id);
  }

  static async deleteUser(c: CustomContext<string>, uid: string) {
    const db = drizzle(c.env.DB);
    const now = Date.now();
    const [[deleteUser]] = await db.batch([
      db
        .update(memberTable)
        .set({ deletedAt: now })
        .where(eq(memberTable.uid, uid))
        .returning({ id: memberTable.id }),
      db
        .update(stackTable)
        .set({ deletedAt: now })
        .where(eq(stackTable.uid, uid)),
      db
        .update(officerTable)
        .set({ deletedAt: now })
        .where(eq(officerTable.uid, uid)),
    ]);

    const { id } = deleteUser;
    return await this.getDeletedUserByUidWithPrivateInfo(c, id);
  }

  /**
   * ユーザー情報を更新する
   * @param c
   * @param uid
   */
  static async updateUser(c: CustomContext<string>, id: number, uid: string) {
    const { user } = await c.req.json<UserSchema>();

    const db = drizzle(c.env.DB);
    const now = Date.now();
    await db.batch([
      db
        .update(stackTable)
        .set({ deletedAt: now })
        .where(eq(stackTable.uid, uid)),
      db.insert(stackTable).values(
        user.skills.map((s) => ({
          uid: uid,
          name: s,
          createdAt: now,
        })),
      ),
      db
        .insert(memberPropertyTable)
        .values(UserService.toFlatUser(user, uid, now)),
    ]);

    return await this.getUserByIdWithPrivateInfo(c, id);
  }

  /**
   * ユーザー登録を承認する
   * @param c
   * @param adminId 承認した管理者のid
   * @param newUserId 承認するユーザーのid
   */
  static async approve(
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
   * ユーザー情報を取得(privateInfoなし)
   * @param c
   * @param filter
   * @returns ユーザー情報(privateInfoなし)
   */
  private static async commonGetUer(c: CustomContext<string>, filter?: SQL) {
    const db = drizzle(c.env.DB);
    const fyFirst = getFYFirstdate();

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
      .where(and(filter, gte(memberTable.updatedAt, fyFirst)))
      .orderBy(desc(memberTable.id));
    const skills = await db
      .select({ skill: stackTable.name, uid: stackTable.uid })
      .from(stackTable)
      .where(
        and(isNull(stackTable.deletedAt), gte(stackTable.createdAt, fyFirst)),
      );

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
    const fyFirst = getFYFirstdate();

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
      .groupBy(memberPropertyTable.uid)
      .leftJoin(
        memberPropertyTable,
        eq(memberTable.uid, memberPropertyTable.uid),
      )
      .where(and(filter, gte(memberTable.updatedAt, fyFirst)))
      .orderBy(desc(memberTable.id));
    const skills = await db
      .select({ skill: stackTable.name, uid: stackTable.uid })
      .from(stackTable)
      .where(
        and(isNull(stackTable.deletedAt), gte(stackTable.createdAt, fyFirst)),
      );

    return propaties.map((p) => {
      const { address, privateInfo, ...m } = p;
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

  /**
   * 全てのユーザを取得する
   */
  static async getAllUsers(c: CustomContext<string>) {
    const db = drizzle(c.env.DB);
    const fyFirst = getFYFirstdate();

    const propaties = await db
      .select({
        id: memberTable.id,
        uid: memberTable.uid,
        isApproved: memberTable.isApproved,
        approveBy: memberTable.approveBy,
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

        birthdate: memberPropertyTable.birthdate,
        gender: memberPropertyTable.gender,
        phoneNumber: memberPropertyTable.phoneNumber,
        email: memberPropertyTable.email,

        homePostalCode: memberPropertyTable.homePostalCode,
        homeAddress: memberPropertyTable.homeAddress,
        cuurentPostalCode: memberPropertyTable.cuurentPostalCode,
        currentAddress: memberPropertyTable.currentAddress,

        payee: paymentTable.payee,
        isConfirmed: paymentTable.isConfirmed,
        paymentAt: paymentTable.createdAt,
      })
      .from(memberTable)
      .groupBy(memberPropertyTable.uid)
      .leftJoin(
        memberPropertyTable,
        eq(memberTable.uid, memberPropertyTable.uid),
      )
      .leftJoin(paymentTable, eq(paymentTable.uid, memberTable.uid))
      .where(
        and(isNull(memberTable.deletedAt), gte(memberTable.updatedAt, fyFirst)),
      )
      .orderBy(desc(memberTable.id));
    const skills = await db
      .select({ skill: stackTable.name, uid: stackTable.uid })
      .from(stackTable)
      .where(
        and(isNull(stackTable.deletedAt), gte(stackTable.createdAt, fyFirst)),
      );
    const officers = await db
      .select({ uid: officerTable.uid })
      .from(memberTable)
      .innerJoin(officerTable, eq(officerTable.uid, memberTable.uid))
      .where(
        and(
          isNull(officerTable.deletedAt),
          isNull(memberTable.deletedAt),
          gte(memberTable.updatedAt, fyFirst),
        ),
      );

    return propaties.map((p) => {
      const { uid, isApproved, isConfirmed, ...m } = p;
      return {
        ...m,
        skills: skills.filter((s) => s.uid === uid).map((s) => s.skill),
        isAdmin: officers.some((o) => o.uid === uid),
        isApproved: isApproved === 1,
        isConfirmed: isConfirmed === 1,
      };
    });
  }

  /**
   * 支払い先一覧を取得する
   */
  static async getPayee(c: CustomContext<string>) {
    const db = drizzle(c.env.DB);
    const fyFirst = getFYFirstdate();

    return await db
      .select({
        id: memberTable.id,
        name: sql`CONCAT(${memberPropertyTable.lastName}, ' ', ${memberPropertyTable.firstName})`,
      })
      .from(memberTable)
      .groupBy(memberPropertyTable.uid)
      .leftJoin(
        memberPropertyTable,
        eq(memberTable.uid, memberPropertyTable.uid),
      )
      .innerJoin(officerTable, eq(officerTable.uid, memberTable.uid))
      .where(
        and(
          isNull(memberTable.deletedAt),
          isNull(officerTable.deletedAt),
          gte(memberTable.updatedAt, fyFirst),
        ),
      )
      .orderBy(desc(memberTable.id));
  }
}

export type UserRepoT = UnwrapPromise<
  ReturnType<typeof UserRepository.getApprovedUserById>
>;
export type UserRepoWithPrivateInfoT = UnwrapPromise<
  ReturnType<typeof UserRepository.getApprovedUserByIdWithPrivateInfo>
>;
export type UserRepoAllFlatT = UnwrapPromise<
  ReturnType<typeof UserRepository.getAllUsers>
>;
