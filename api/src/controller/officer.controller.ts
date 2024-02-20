import { CustomContext } from '@/types/context';
import { admin } from '../decorator';
import { ErrorService } from '../service/error.service';
import { AuthService } from '../service/auth.service';
import { UserService } from '../service/user.service';
import { UserRepository } from '../repository/user.repository';
import { OfficerRepository } from '../repository/officer.repository';
import { StateRepository } from '../repository/userstate.repojitory';
import { CustomResponse } from '@/types/response';
import { OfficerTable } from '@/types/table';

export class OfficerController {
  /**
   * 役職を承認
   * @param c
   */
  @admin
  static async approve(
    c: CustomContext<'/api/user/:id/officer'>,
  ): CustomResponse<{ officer: OfficerTable }> {
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

    const approvedId = await UserService.getIdForApprove(c, user);

    const newUserUid = await UserRepository.getUserUidById(c, idNum);

    if (newUserUid === undefined) {
      const err = ErrorService.request.userNotFound();
      return c.json(err.err, err.status);
    }

    const isApproved = await StateRepository.isAdmin(c, newUserUid);

    if (isApproved) {
      const err = ErrorService.request.alreadyApprovedOfficer();
      return c.json(err.err, err.status);
    }

    if (approvedId === undefined) {
      const err = ErrorService.auth.notAdmin();
      return c.json(err.err, err.status);
    }

    const officer = await OfficerRepository.approve(c, approvedId, newUserUid);
    if (officer === undefined) {
      const err = ErrorService.request.approveFailed();
      return c.json(err.err, err.status);
    }

    return c.json({ ok: true, officer });
  }

  /**
   * 管理者解除
   */
  @admin
  static async delete(
    c: CustomContext<'/api/user/:id/officer'>,
  ): CustomResponse<{ officer: OfficerTable }> {
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

    const deleteOfficerUid = await UserRepository.getUserUidById(c, idNum);

    if (deleteOfficerUid === undefined) {
      const err = ErrorService.request.userNotFound();
      return c.json(err.err, err.status);
    }

    const isApproved = await StateRepository.isAdmin(c, deleteOfficerUid);

    if (!isApproved) {
      const err = ErrorService.request.notApprovedOfficer();
      return c.json(err.err, err.status);
    }

    const officer = await OfficerRepository.delete(c, deleteOfficerUid);
    if (officer === undefined) {
      const err = ErrorService.request.deleteOfficerFailed();
      return c.json(err.err, err.status);
    }

    return c.json({ ok: true, officer });
  }
}
