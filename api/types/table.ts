import { Grade } from './member';

export type GroupMemberTable = {
  id: number;
  groupId: number;
  uid: string;
};

export type GroupNameTable = {
  id: number;
  name: string;
  createdAt: number;
};

export type OfficerTable = {
  id: number;
  uid: string;
  approvedBy: number | null;
  createdAt: number;
  deletedAt: number | null;
};

export type PaymentTable = {
  id: number;
  uid: string;
  payee: number;
  isConfirmed: number;
  createdAt: number;
  updatedAt: number;
};

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

export type MemberPropertyTable = {
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
  createdAt: number;
} & (
  | ActiveMemberPropertyTable
  | ObogMemberPropertyTable
  | ExternalMemberPropertyTable
);
