export const memberKeys = [
  'id',
  'firstName',
  'lastName',
  'firstNameKana',
  'lastNameKana',
  'skills',
  'graduationYear',
  'slackName',
  'updatedAt',
  'createdAt',
  'privateInfo',
] as const;
export const privateInfoKeys = [
  'birthdate',
  'gender',
  'phoneNumber',
  'email',
  'currentAddress',
  'homeAddress',
] as const;
export const addressKeys = [
  'postalCode',
  'address',
] as const;

// キーの型
export type MemberKeys = typeof memberKeys[number];
export type PrivateInfoKeys = typeof privateInfoKeys[number];
export type AddressKeys = typeof addressKeys[number];

// 住所と郵便番号
export type Address = {
  postalCode: string;
  address: string;
}

// 非公開の情報
export type PrivateInfo = {
  birthdate: string;
  gender: string;
  phoneNumber: string;
  email: string;
  currentAddress: Address;
  homeAddress: Address;
}

// 現役部員
export type ActiveMember = {
  type: 'active';
  studentNumber: string;
  position: string;
  grade: string;
}

// OB・OG
export type OBOGMember = {
  type: 'obog';
  oldPosition: string;
  studentNumber: string;
  employment?: string;
}

// 外部
export type ExternalMember = {
  type: 'external';
  school: string;
  organization: string;
}

export type Member = {
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
  createdAt: string;
} & (ActiveMember | OBOGMember | ExternalMember);

export type MemberWithPrivateInfo = Member & {
  privateInfo: PrivateInfo;
};

export type MemberKeysWithPrivateInfo = MemberKeys | PrivateInfoKeys | AddressKeys;
