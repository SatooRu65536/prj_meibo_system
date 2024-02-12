import { CreateUserSchema } from '@/src/validation';
import { MemberBase, MemberType, PrivateInfo } from '../member';

export type UserDetailRes = {
  member: MemberBase<PrivateInfo, MemberType>;
};

export type UserRes = {
  member: MemberBase<{}, MemberType>;
};
