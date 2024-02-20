import { TypedResponse } from 'hono';

type SuccessResponse<T> = {
  ok: true;
} & T;

export type ErrorResponse = {
  ok: false;
  key: string;
  message: string;
  approach?: string;
};

export type CustomResponse<T> = Promise<
  Response & TypedResponse<ErrorResponse | SuccessResponse<T>>
>;
