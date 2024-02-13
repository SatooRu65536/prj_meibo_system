import { TypedResponse } from 'hono';

type SuccessResponse<T> = {
  success: true;
} & T;

export type ErrorResponse = {
  success: false;
  key: string;
  message: string;
  approach?: string;
};

export type CustomResponse<T> = Promise<
  Response & TypedResponse<ErrorResponse | SuccessResponse<T>>
>;
