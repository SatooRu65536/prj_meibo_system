import { CustomContext } from '@/types/context';
import { AuthService } from '../service/auth.service';
import { UserRepository } from '../repository/user.repository';
import { ErrorService } from '../service/error.service';

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
      const err = ErrorService.auth.failedAuth();
      return c.json(err.err, err.status);
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
      const err = ErrorService.auth.failedAuth();
      return c.json(err.err, err.status);
    }

    const isAdmin = await UserRepository.isAdmin(c, user.uid);
    console.log({ isAdmin });

    if (!isAdmin) {
      const err = ErrorService.auth.notAdmin();
      return c.json(err.err, err.status);
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
      const err = ErrorService.request.invalidRequest('id', '数値');
      return c.json(err.err, err.status);
    }

    const user = AuthService.getUser(c);

    if (!user) {
      const err = ErrorService.auth.failedAuth();
      return c.json(err.err, err.status);
    }

    // 本人か
    const isAdminOrSelf = await UserRepository.isAdminOrSelf(
      c,
      user.uid,
      idNum,
    );

    if (!isAdminOrSelf) {
      const err = ErrorService.auth.notSelfOrAdmin();
      return c.json(err.err, err.status);
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
      const err = ErrorService.auth.failedAuth();
      return c.json(err.err, err.status);
    }

    const isRegistered = await UserRepository.isRegistered(c, user.uid);

    if (!isRegistered) {
      const err = ErrorService.auth.notRegistered();
      return c.json(err.err, err.status);
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
      const err = ErrorService.auth.failedAuth();
      return c.json(err.err, err.status);
    }

    const isRegistered = await UserRepository.isRegistered(c, user.uid);

    if (isRegistered) {
      const err = ErrorService.auth.registered();
      return c.json(err.err, err.status);
    }

    return originalMethod.apply(this, [c, ...args]);
  };

  return descriptor;
}
