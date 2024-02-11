import { Grade } from "./member";

export type Id = {
  id: number;
};

export type CreatedAt = {
  createdAt: number;
};

export type MemberTable<T = {}> = {
  uid: string;
  deletedAt: number | null;
} & T;

export type StackTable<T = {}> = {
  uid: string;
  name: string;
  createdAt: number;
  deletedAt: number | null;
} & T;

type ActiveMemberPropertyTable = {
  type: 'active';

  studentNumber: string;
  position: string;
  grade: Grade;

  oldPosition?: string | null;
  oldStudentNumber?: string | null;
  employment?: string | null;

  school?: string | null;
  organization?: string | null;
};

type ObogMemberPropertyTable = {
  type: 'obog';

  studentNumber?: string | null;
  position?: string | null;
  grade?: Grade | null;

  oldPosition: string;
  oldStudentNumber: string;
  employment: string;

  school?: string | null;
  organization?: string | null;
};

type ExternalMemberPropertyTable = {
  type: 'external';

  studentNumber?: string | null;
  position?: string | null;
  grade?: Grade | null;

  oldPosition?: string | null;
  oldStudentNumber?: string | null;
  employment?: string | null;

  school: string;
  organization: string;
};

export type MemberPropertyTable<T = {}> = {
  uid: string;
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  graduationYear: number;
  slackName: string;
  iconUrl: string;
  birthdate: string;
  gender: string;
  phoneNumber: string;
  email: string;
  cuurentPostalCode: string;
  currentAddress: string;
  homePostalCode: string;
  homeAddress: string;
} & (
  | ActiveMemberPropertyTable
  | ObogMemberPropertyTable
  | ExternalMemberPropertyTable
) &
  T;
