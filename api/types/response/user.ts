import { CreateUserSchema } from '@/src/validation';

// [POST] /api/user
export type UserRes = {
  member: CreateUserSchema['member'] & {
    id: number;
  };
};
