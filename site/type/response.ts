import { Member, MemberWithPrivateInfo } from './member';

type SuccessResponse<T> = {
  ok: true;
} & T;

export type ErrorResponse = {
  ok: false;
  key: string;
  message: string;
  approach?: string;
};

export type BaseResponse<T> = SuccessResponse<T> | ErrorResponse;

export type MembersRes<T extends Member | MemberWithPrivateInfo> =
  BaseResponse<{
    users: T[];
  }>;

export type MemberRes<T extends Member | MemberWithPrivateInfo> = BaseResponse<{
  user: T;
}>;
