import { CustomContext } from '@/types/context';
import { admin } from '../decorator';
import { GroupRepository } from '../repository/group.repository';
import { ErrorService } from '../service/error.service';
import { GroupNameTable } from '@/types/table';
import { CustomResponse } from '@/types/response';

export class GroupController {
  /**
   * グループを作成する
   */
  @admin
  static async create(
    c: CustomContext<string>,
  ): CustomResponse<{ groupName: GroupNameTable }> {
    const res = await GroupRepository.create(c).catch((err) => null);

    if (res === null) {
      const error = ErrorService.request.groupAlreadyExist();
      return c.json(error.err, error.status);
    }

    return c.json({ success: true, groupName: res });
  }
}
