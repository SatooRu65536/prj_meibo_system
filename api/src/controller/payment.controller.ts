import { CustomContext } from '@/types/context';
import { ErrorService } from '../service/error.service';
import { AuthService } from '../service/auth.service';
import { admin, userNotPaid, userPaidAndNotConfirned } from '../decorator';
import { UserService } from '../service/user.service';
import { PaymentRepository } from '../repository/payment.repository';
import { UserRepository } from '../repository/user.repository';
import { CustomResponse } from '@/types/response';
import { PaymentTable } from '@/types/table';

export class PaymentController {
  @admin
  @userNotPaid
  static async paid(
    c: CustomContext<'/api/user/:id/payment'>,
  ): CustomResponse<{ payment: PaymentTable }> {
    const { id } = c.req.param();
    const idNum = Number(id);
    if (isNaN(idNum)) {
      const err = ErrorService.request.invalidRequest('id', '数値');
      return c.json(err.err, err.status);
    }

    const payedUser = await UserRepository.getUserById(c, idNum);
    if (payedUser === undefined) {
      const err = ErrorService.request.userNotFound();
      return c.json(err.err, err.status);
    }

    const user = AuthService.getUser(c);
    if (!user) {
      const err = ErrorService.auth.failedAuth();
      return c.json(err.err, err.status);
    }

    const payeeId = await UserService.getIdForApprove(c, user);
    if (payeeId === undefined) {
      const err = ErrorService.auth.notAdmin();
      return c.json(err.err, err.status);
    }

    const payment = await PaymentRepository.paid(c, payeeId, payedUser.uid);
    if (payment === undefined) {
      const err = ErrorService.payment.failedPayment();
      return c.json(err.err, err.status);
    }

    return c.json({ success: true, payment });
  }

  @admin
  @userPaidAndNotConfirned
  static async confirme(c: CustomContext<'/api/user/:id/payment'>) {
    const { id } = c.req.param();
    const idNum = Number(id);
    if (isNaN(idNum)) {
      const err = ErrorService.request.invalidRequest('id', '数値');
      return c.json(err.err, err.status);
    }

    const payedUser = await UserRepository.getUserById(c, idNum);
    if (payedUser === undefined) {
      const err = ErrorService.request.userNotFound();
      return c.json(err.err, err.status);
    }

    const user = AuthService.getUser(c);
    if (!user) {
      const err = ErrorService.auth.failedAuth();
      return c.json(err.err, err.status);
    }

    const confirmerId = await UserService.getIdForApprove(c, user);
    if (confirmerId === undefined) {
      const err = ErrorService.auth.notAdmin();
      return c.json(err.err, err.status);
    }

    const payment = await PaymentRepository.confirme(c, payedUser.uid);
    if (payment === undefined) {
      const err = ErrorService.payment.failedConfirme();
      return c.json(err.err, err.status);
    }

    return c.json({ success: true, payment });
  }
}
