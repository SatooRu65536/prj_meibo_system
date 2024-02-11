import { CreateUserSchema } from '@/src/validation';

// [POST] /api/user
export type CreateUserRes = {
  member: CreateUserSchema['member'] & {
    id: number;
  };
};
