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
type Address = {
  postalCode: string;
  address: string;
};

// 非公開の情報
type PrivateInfo = {
  privateInfo: {
    birthdate: string;
    gender: string;
    phoneNumber: string;
    email: string;
    currentAddress: Address;
    homeAddress: Address;
  };
};

// 現役部員
type ActiveMember = {
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

type MemberType = ActiveMember | OBOGMember | ExternalMember;

export type MemberBase<T extends boolean = false, U extends boolean = false> = {
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
} & (T extends true ? PrivateInfo : {}) &
  (U extends true ? MemberType : {});
