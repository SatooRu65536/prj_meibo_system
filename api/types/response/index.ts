import { TypedResponse } from 'hono';

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
