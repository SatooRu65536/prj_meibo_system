import { CustomContext } from '@/types/context';
import { AuthService } from '../service/auth.service';
import { drizzle } from 'drizzle-orm/d1';
import { memberTable, officerTable } from '../models/schema';
import { and, desc, eq, isNull } from 'drizzle-orm/sql';

/**
 * user が存在するか
 */
export function auth(
  _target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (c: CustomContext<string>, ...args: any[]) {
    const user = AuthService.getUser(c);

    if (!user) {
      return c.json({ success: false, message: '認証に失敗しました' }, 401);
    }

    return originalMethod.apply(this, [c, ...args]);
  };

  return descriptor;
}

/**
 * 管理者権限を持っているか(user を包括)
 */
export function admin(
  _target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (c: CustomContext<string>, ...args: any[]) {
    const user = AuthService.getUser(c);

    if (!user) {
      return c.json({ success: false, message: '認証に失敗しました' }, 401);
    }

    const db = drizzle(c.env.DB);
    // 役員か
    const isOfficer = await db
      .select()
      .from(officerTable)
      .where(
        and(eq(officerTable.uid, user.uid), isNull(officerTable.deletedAt)),
      );

    if (isOfficer.length === 0) {
      return c.json({ success: false, message: '管理者権限が必要です' }, 401);
    }

    return originalMethod.apply(this, [c, ...args]);
  };

  return descriptor;
}

/**
 * 本人か管理者権限を持っているか(user を包括)
 */
export function adminOrSelf(
  _target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (c: CustomContext<string>, ...args: any[]) {
    const user = AuthService.getUser(c);

    if (!user) {
      return c.json({ success: false, message: '認証に失敗しました' }, 401);
    }

    const db = drizzle(c.env.DB);

    // 本人か
    const isSelf = await db
      .select()
      .from(memberTable)
      .where(and(eq(memberTable.uid, user.uid), isNull(memberTable.deletedAt)));

    // 役員か
    const isOfficer = await db
      .select()
      .from(officerTable)
      .where(
        and(eq(officerTable.uid, user.uid), isNull(officerTable.deletedAt)),
      );

    if (isOfficer.length === 0 && isSelf.length === 0) {
      return c.json(
        { success: false, message: '本人もしくは管理者権限が必要です' },
        401,
      );
    }

    return originalMethod.apply(this, [c, ...args]);
  };

  return descriptor;
}

/**
 * 登録済みか(user を包括)
 */
export function registered(
  _target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (c: CustomContext<string>, ...args: any[]) {
    const user = AuthService.getUser(c);

    if (!user) {
      return c.json({ success: false, message: '認証に失敗しました' }, 401);
    }

    const db = drizzle(c.env.DB);

    const [registeredMembers] = await db
      .select()
      .from(memberTable)
      .where(and(eq(memberTable.uid, user.uid), isNull(memberTable.deletedAt)))
      .orderBy(desc(memberTable.createdAt));

    if (!registeredMembers) {
      return c.json({ success: false, message: '登録されていません' }, 401);
    }

    return originalMethod.apply(this, [c, ...args]);
  };

  return descriptor;
}

/**
 * 未登録か(user を包括)
 */
export function notRegistered(
  _target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (c: CustomContext<string>, ...args: any[]) {
    const user = AuthService.getUser(c);

    if (!user) {
      return c.json({ success: false, message: '認証に失敗しました' }, 401);
    }

    const db = drizzle(c.env.DB);

    const registeredMembers = await db
      .select()
      .from(memberTable)
      .where(and(eq(memberTable.uid, user.uid), isNull(memberTable.deletedAt)));

    if (registeredMembers.length > 0) {
      return c.json({ success: false, message: '既に登録されています' }, 401);
    }

    return originalMethod.apply(this, [c, ...args]);
  };

  return descriptor;
}
