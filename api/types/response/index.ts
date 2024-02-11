import { TypedResponse } from "hono";

export type ResSuccess<T> = {
  success: true;
} & T;

export type ResError = {
  success: false;
  message: string;
};

export type CustomResponse<T> = Response & TypedResponse<ResSuccess<T> | ResError>;
