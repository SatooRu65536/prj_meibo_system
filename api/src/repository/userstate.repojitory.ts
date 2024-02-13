import { memberTable, officerTable, paymentTable } from '../models/schema';
import { and, eq, gte, isNull, or } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { CustomContext } from '@/types/context';
import { getFYFirstdate } from '@/util';

export class StateRepository {
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
   * 支払い済みか
   * @param c
   * @param uid
   * @returns
   */
  static async isPaidByUid(c: CustomContext<string>, uid: string) {
    const db = drizzle(c.env.DB);

    const [payment] = await db
      .select()
      .from(paymentTable)
      .where(eq(paymentTable.uid, uid));

    if (payment === undefined) return false;

    return payment !== undefined;
  }

  /**
   * 支払い済みかつ受け取り前か
   * @param c
   * @param uid
   * @returns
   */
  static async isPaidAndNotConfirmedByUid(
    c: CustomContext<string>,
    uid: string,
  ) {
    const db = drizzle(c.env.DB);

    const [payment] = await db
      .select()
      .from(paymentTable)
      .where(and(eq(paymentTable.uid, uid), eq(paymentTable.isConfirmed, 0)));

    return payment !== undefined;
  }
}
