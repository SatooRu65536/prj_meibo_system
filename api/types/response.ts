import { TypedResponse } from 'hono';
import { MemberBase, MemberType, PrivateInfo } from './member';

export type UserDetailRes = {
  member: MemberBase<PrivateInfo, MemberType>;
};

export type UserRes = {
  member: MemberBase<{}, MemberType>;
};

export type ResSuccess<T> = {
  success: true;
} & T;

export type ResError = {
  key: string;
  message: string;
  approach?: string;
  success: false;
};

export type CustomResponse<T> = Response &
  TypedResponse<ResSuccess<T> | ResError>;
