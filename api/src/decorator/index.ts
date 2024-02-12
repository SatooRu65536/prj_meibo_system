import { CustomContext } from '@/types/context';
import { AuthService } from '../service/auth.service';
import { UserRepository } from '../repository/user.repository';

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

    const isAdmin = await UserRepository.isAdmin(c, user.uid);
    console.log({ isAdmin });

    if (!isAdmin) {
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

  descriptor.value = async function (c: CustomContext<':id'>, ...args: any[]) {
    const { id } = c.req.param();
    const idNum = Number(id);

    if (isNaN(idNum)) {
      return c.json({ success: false, message: 'IDが不正です' }, 400);
    }

    const user = AuthService.getUser(c);

    if (!user) {
      return c.json({ success: false, message: '認証に失敗しました' }, 401);
    }

    // 本人か
    const isAdminOrSelf = await UserRepository.isAdminOrSelf(c, user.uid, idNum);

    if (!isAdminOrSelf) {
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

    const isRegistered = await UserRepository.isRegistered(c, user.uid);

    if (!isRegistered) {
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

    const isRegistered = await UserRepository.isRegistered(c, user.uid);

    if (isRegistered) {
      return c.json({ success: false, message: '既に登録されています' }, 401);
    }

    return originalMethod.apply(this, [c, ...args]);
  };

  return descriptor;
}
