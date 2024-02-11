export type Id = {
  id: number;
};

export type CreateAt = {
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
  grade: string;
};

type ObogMemberPropertyTable = {
  type: 'obog';
  oldPosition: string;
  oldStudentNumber: string;
  employment: string;
};

type ExternalMemberPropertyTable = {
  type: 'external';
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
