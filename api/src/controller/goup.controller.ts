import { CustomContext } from '@/types/context';
import { admin } from '../decorator';
import { GroupRepository } from '../repository/group.repository';
import { ErrorService } from '../service/error.service';
import { GroupMemberTable, GroupNameTable } from '@/types/table';
import { CustomResponse } from '@/types/response';
import { AddToGroupSchema } from '../validation/gourp';
import { UserRepository } from '../repository/user.repository';

export class GroupController {
  /**
   * グループを作成する
   */
  @admin
  static async create(
    c: CustomContext<string>,
  ): CustomResponse<{ group: GroupNameTable }> {
    const res = await GroupRepository.create(c).catch((err) => null);

    if (res === null) {
      const error = ErrorService.request.groupAlreadyExist();
      return c.json(error.err, error.status);
    }

    return c.json({ success: true, group: res });
  }

  /**
   * グループ一覧を取得する
   */
  @admin
  static async getAllGroups(
    c: CustomContext<'/api/groups'>,
  ): CustomResponse<{ groups: GroupNameTable[] }> {
    const groups = await GroupRepository.getAllGroups(c);
    return c.json({ success: true, groups });
  }

  /**
   * グループを削除する
   */
  @admin
  static async delete(
    c: CustomContext<'/api/group/:id'>,
  ): CustomResponse<{ group: GroupNameTable }> {
    const { id } = c.req.param();
    const idNum = Number(id);

    if (isNaN(idNum)) {
      const err = ErrorService.request.invalidRequest('id', '数値');
      return c.json(err.err, err.status);
    }

    const group = await GroupRepository.delete(c, idNum);

    if (group === undefined) {
      const err = ErrorService.group.groupNotFound();
      return c.json(err.err, err.status);
    }

    return c.json({ success: true, group });
  }

  /**
   * メンバーをグループに追加する
   */
  @admin
  static async add(
    c: CustomContext<'/api/group/:id'>,
  ): CustomResponse<{ groups: GroupMemberTable[] }> {
    const { ids } = await c.req.json<AddToGroupSchema>();
    const { id } = c.req.param();
    const idNum = Number(id);

    if (isNaN(idNum)) {
      const err = ErrorService.request.invalidRequest('id', '数値');
      return c.json(err.err, err.status);
    }

    const uids = await UserRepository.getUserUidsByIds(c, ids);

    const res = await GroupRepository.add(c, idNum, uids);
    return c.json({ success: true, groups: res });
  }

  /**
   * メンバーをグループから削除する
   */
  @admin
  static async remove(c: CustomContext<'/api/group/:id'>) {
    const { ids } = await c.req.json<AddToGroupSchema>();
    const { id } = c.req.param();
    const idNum = Number(id);

    if (isNaN(idNum)) {
      const err = ErrorService.request.invalidRequest('id', '数値');
      return c.json(err.err, err.status);
    }

    const uids = await UserRepository.getUserUidsByIds(c, ids);

    const res = await GroupRepository.remove(c, idNum, uids);
    return c.json({ success: true, groups: res });
  }
}
