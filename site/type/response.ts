import { Member, MemberProps, MemberWithPrivateInfo } from './member';

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

export type MembersRes<T extends Member | MemberWithPrivateInfo | MemberProps> =
  BaseResponse<{
    users: T[];
  }>;

export type MemberRes<T extends Member | MemberWithPrivateInfo | MemberProps> = BaseResponse<{
  user: T;
}>;

export type MemberInfo = {
  user: Member;
  isDetail: false;
  isApproved: boolean;
}
export type MemberDetailInfo = {
  user: MemberWithPrivateInfo;
  isDetail: true;
  isApproved: boolean;
}
export type UserInfoRes = BaseResponse<MemberInfo | MemberDetailInfo>;
