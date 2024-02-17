import { CustomContext } from '@/types/context';
import { drizzle } from 'drizzle-orm/d1';
import { groupNameTable } from '../models/schema';
import { GroupSchema } from '../validation/gourp';
import { eq } from 'drizzle-orm';

export class GroupRepository {
  /**
   * グループを作成する
   */
  static async create(c: CustomContext<string>) {
    const { name } = await c.req.json<GroupSchema>();
    const now = Date.now();

    const db = drizzle(c.env.DB);
    const [res] = await db
      .insert(groupNameTable)
      .values({ createdAt: now, name })
      .returning();

    return res;
  }

  /**
   * グループ一覧を取得する
   */
  static async getAllGroups(c: CustomContext<string>) {
    const db = drizzle(c.env.DB);
    return await db.select().from(groupNameTable);
  }

  /**
   * グループを削除する
   */
  static async delete(c: CustomContext<string>, id: number) {
    const db = drizzle(c.env.DB);
    const [res] = await db
      .delete(groupNameTable)
      .where(eq(groupNameTable.id, id))
      .returning();
    return res;
  }
}
