import { CustomContext } from '@/types/context';
import { drizzle } from 'drizzle-orm/d1';
import { officerTable } from '../models/schema';
import { eq } from 'drizzle-orm';

export class OfficerRepository {
  /**
   * ユーザーを管理者に承認する
   * @param c
   * @param adminId 承認した管理者のid
   * @param newUserId 承認するユーザーのid
   */
  static async approve(
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
   * 管理者を削除する
   * @param c
   * @param uid
   */
  static async delete(c: CustomContext<string>, uid: string) {
    const db = drizzle(c.env.DB);
    const now = Date.now();

    const [officer] = await db
      .update(officerTable)
      .set({ deletedAt: now })
      .where(eq(officerTable.uid, uid))
      .returning();

    return officer;
  }
}
