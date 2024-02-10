import { Member } from '@/type/member';
import { MemberKeysWithPrivateInfo } from '@/type/member';

/**
 * カラム名を取得する
 * @param key レスポンスのキー
 * @returns カラム名
 */
export const toColumnName = (key: MemberKeysWithPrivateInfo): string => {
  switch (key) {
    case 'id':
      return 'ID';
    case 'firstName':
      return '名';
    case 'lastName':
      return '姓';
    case 'firstNameKana':
      return '名(かな)';
    case 'lastNameKana':
      return '姓(かな)';
    case 'skills':
      return 'スキル';
    case 'graduationYear':
      return '卒業年';
    case 'slackName':
      return 'Slack表示名';
    case 'updatedAt':
      return '更新日';
    case 'createdAt':
      return '作成日';
    case 'privateInfo':
      return '非公開情報';
    case 'birthdate':
      return '生年月日';
    case 'gender':
      return '性別';
    case 'phoneNumber':
      return '電話番号';
    case 'email':
      return 'メールアドレス';
    case 'currentAddress':
      return '現住所';
    case 'homeAddress':
      return '実家住所';
    case 'postalCode':
      return '郵便番号';
    case 'address':
      return '住所';
    default:
      return key;
  }
};

/**
 * 簡単なメンバー情報を取得する
 * @param member メンバー情報
 * @returns ユーザー情報
 */
export function getMemberInfo(member: Member) {
  switch (member.type) {
    case 'active':
      return `[${member.grade}] ${member.studentNumber}`;
    case 'obog':
      return member.employment ? `${member.employment}(OB・OG)` : 'OB・OG';
    case 'external':
      return `${member.organization}(外部)`;
  }
}
