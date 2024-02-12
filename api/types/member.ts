// 学年
export type Grade =
  | 'B1'
  | 'B2'
  | 'B3'
  | 'B4'
  | 'M1'
  | 'M2'
  | 'D1'
  | 'D2'
  | 'その他';

// 住所と郵便番号
export type Address = {
  postalCode: string;
  address: string;
};

// 非公開の情報
export type PrivateInfo = {
  birthdate: string;
  gender: string;
  phoneNumber: string;
  email: string;
  currentAddress: Address;
  homeAddress: Address;
};

// 現役部員
export type ActiveMember = {
  type: 'active';
  studentNumber: string;
  position: string;
  grade: Grade;
};

// OB・OG
type OBOGMember = {
  type: 'obog';
  oldPosition: string;
  oldStudentNumber: string;
  employment: string;
};

// 外部
type ExternalMember = {
  type: 'external';
  school: string;
  organization: string;
};

export type MemberType = ActiveMember | OBOGMember | ExternalMember;

export type MemberBase<
  T extends PrivateInfo | {} = {},
  U extends MemberType | {} = {},
> = {
  id: number;
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  skills: string[];
  graduationYear: number;
  slackName: string;
  iconUrl: string;
  updatedAt: string;
} & (T extends PrivateInfo ? { privateInfo: T } : {}) &
  (U extends MemberType ? U : {});
