import { CustomContext } from '@/types/context';
import { AuthService } from '../service/auth.service';
import { UserRepository } from '../repository/user.repository';
import { ErrorService } from '../service/error.service';
import { StateRepository } from '../repository/userstate.repojitory';

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

    const isAdmin = await StateRepository.isAdmin(c, user.uid);

    const initAdmins = c.env?.INIT_ADMINS.split(',') || '';
    const includeAdmin = user?.email && initAdmins.includes(user?.email);

    if (!isAdmin && !includeAdmin) {
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
    const isAdminOrSelf = await StateRepository.isAdminOrSelf(
      c,
      user.uid,
      idNum,
    );

    const initAdmins = c.env?.INIT_ADMINS.split(',') || '';
    const includeAdmin = user?.email && initAdmins.includes(user?.email);

    if (!isAdminOrSelf && !includeAdmin) {
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

    const isApproved = await StateRepository.isRegisteredByUid(c, user.uid);

    if (!isApproved) {
      const err = ErrorService.user.notRegistered();
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

    const isApproved = await StateRepository.isRegisteredByUid(c, user.uid);

    if (isApproved) {
      const err = ErrorService.user.registered();
      return c.json(err.err, err.status);
    }

    return originalMethod.apply(this, [c, ...args]);
  };

  return descriptor;
}

/**
 * 承認済みか(user を包括)
 */
export function approved(
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

    const isApproved = await StateRepository.isApprovedByUid(c, user.uid);
    const initAdmins = c.env?.INIT_ADMINS.split(',') || '';
    const includeAdmin = user?.email && initAdmins.includes(user?.email);

    if (!isApproved && !includeAdmin) {
      const err = ErrorService.user.notApproved();
      return c.json(err.err, err.status);
    }

    return originalMethod.apply(this, [c, ...args]);
  };

  return descriptor;
}

/**
 * 未承認か(user を包括)
 */
export function notApproved(
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

    const isApproved = await StateRepository.isApprovedByUid(c, user.uid);

    if (isApproved) {
      const err = ErrorService.user.approved();
      return c.json(err.err, err.status);
    }

    return originalMethod.apply(this, [c, ...args]);
  };

  return descriptor;
}

/**
 * 支払い済みか(user を包括)
 */
export function userPaidAndNotConfirned(
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

    const user = await UserRepository.getUserById(c, idNum);
    if (user === undefined) {
      const err = ErrorService.request.userNotFound();
      return c.json(err.err, err.status);
    }

    const isPaidAndNotConrifmed =
      await StateRepository.isPaidAndNotConfirmedByUid(c, user.uid);
    if (!isPaidAndNotConrifmed) {
      const err = ErrorService.payment.notAvailable();
      return c.json(err.err, err.status);
    }

    return originalMethod.apply(this, [c, ...args]);
  };

  return descriptor;
}

/**
 * 支払い前か(user を包括)
 */
export function userNotPaid(
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

    const user = await UserRepository.getUserById(c, idNum);
    if (user === undefined) {
      const err = ErrorService.request.userNotFound();
      return c.json(err.err, err.status);
    }

    const isPaid = await StateRepository.isPaidByUid(c, user.uid);
    if (isPaid) {
      const err = ErrorService.payment.alreadyPaid();
      return c.json(err.err, err.status);
    }

    return originalMethod.apply(this, [c, ...args]);
  };

  return descriptor;
}

/**
 * 無効化されているか
 * @param _target
 * @param _propertyKey
 * @param descriptor
 * @returns
 */
export function deactivated(
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

    const isDeactivated = await StateRepository.isDeactivatedById(c, idNum);

    if (!isDeactivated) {
      const err = ErrorService.user.notDeactivated();
      return c.json(err.err, err.status);
    }

    return originalMethod.apply(this, [c, ...args]);
  };

  return descriptor;
}

/**
 * 無効化されていないか
 * @param _target
 * @param _propertyKey
 * @param descriptor
 * @returns
 */
export function notDeactivated(
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

    const isDeactivated = await StateRepository.isDeactivatedById(c, idNum);

    if (isDeactivated) {
      const err = ErrorService.user.deactivated();
      return c.json(err.err, err.status);
    }

    return originalMethod.apply(this, [c, ...args]);
  };

  return descriptor;
}
