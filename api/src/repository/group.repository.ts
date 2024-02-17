import { CustomContext } from '@/types/context';
import { drizzle } from 'drizzle-orm/d1';
import { groupNameTable } from '../models/schema';
import { GroupSchema } from '../validation/gourp';

export class GroupRepository {
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

  static async getAllGroups(c: CustomContext<string>) {
    const db = drizzle(c.env.DB);
    return await db.select().from(groupNameTable);
  }
}
