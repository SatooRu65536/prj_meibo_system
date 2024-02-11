import { CreateUserSchema } from '@/src/validation';

export type UserDetailRes = {
  member: CreateUserSchema['member'] & {
    id: number;
  };
};

export type UserRes = {
  member: Omit<CreateUserSchema['member'], 'privateInfo'> & {
    id: number;
  };
};
