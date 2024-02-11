import { CustomContext } from '@/types/context';
import { createUserSchema, CreateUserSchema } from './createUser';
import { TypedResponse } from 'hono';
import { ResError } from '@/types/response';
import { ZodError } from 'zod';

export { createUserSchema, CreateUserSchema };

type ZodSuccess<T> = {
  success: true;
  data: T;
};

type ZodErr<T> = {
  success: false;
  error: ZodError<any>;
  data: T;
};

type ZodHookRes<T> = ZodSuccess<T> | ZodErr<T>;

/**
 * zodのバリデーション結果を返す
 * @param res
 * @param c Context
 * @returns
 */
export function zodHook<T, U extends CustomContext<string>>(
  res: ZodHookRes<T>,
  c: U,
): (Response & TypedResponse<ResError>) | void {
  if (res.success) return;

  const { issues } = res.error;
  const message = issues
    .map((i) => `${i.message} at ${i.path.join(', ')}`)
    .join('.\n');
  return c.json({ success: false, message }, 400);
}
