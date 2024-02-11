import { MemberAll, MemberError, Nullable } from '@/type/member';

/**
 * メンバー情報のバリデーション
 * @param member メンバー情報
 * @param isLivingWithParents 実家暮らしか
 * @returns {[boolean, string[]]} [バリデーション結果, エラーメッセージ]
 */
export function validateMember(
  member: Nullable<MemberAll>,
  isLivingWithParents: boolean
): [boolean, MemberError] {
  const errors: MemberError = {};

  const KANA_REGEXP = /[ァ-ンー　]+$/;
  const STUDENT_NUMBER_REGEXP = /^[a-z]\d{5}$/;
  const EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const PHONE_NUMBER_REGEXP = /^\d{2,4}-\d{2,4}-\d{2,4}$/;
  const POSTAL_CODE_REGEXP = /^\d{3}-\d{4}$/;

  if (!member.firstName || !member.lastName)
    errors.name = '姓名が正しくありません';
  if (!member.firstNameKana || !member.lastNameKana)
    errors.kana = '姓名(フリガナ)が正しくありません';
  if (!member.firstNameKana?.match(KANA_REGEXP))
    errors.kana = '姓名(フリガナ)はカタカナで入力してください';
  else if (!member.lastNameKana?.match(KANA_REGEXP))
    errors.kana = '姓名(フリガナ)はカタカナで入力してください';
  if (!member.graduationYear)
    errors.graduationYear = '卒業(予定)年度を入力してください';
  else if (member.graduationYear < 1900 || member.graduationYear > 3000)
    errors.graduationYear = '卒業(予定)年度が正しくありません';
  if (!member.slackName) errors.slackName = 'Slack表示名を入力してください';
  if (!member.type) errors.type = 'タイプを選択してください';

  if (member.type === 'active') {
    if (!member.studentNumber)
      errors.studentNumber = '学籍番号を入力してください';
    else if (!member.studentNumber?.match(STUDENT_NUMBER_REGEXP))
      errors.studentNumber = '学籍番号の形式が正しくありません';
    if (!member.grade) errors.grade = '学年を選択してください';
  }

  if (member.type === 'obog') {
    if (!member.oldStudentNumber)
      errors.oldStudentNumber = '学籍番号を入力してください';
  }

  if (member.type === 'external') {
    if (!member.school) errors.school = '学校を入力してください';
    if (!member.organization)
      errors.organization = '所属団体を入力してください';
  }

  if (!member.privateInfo.gender) errors.gender = '性別を選択してください';
  if (!member.privateInfo.email)
    errors.email = 'メールアドレスを入力してください';
  else if (!member.privateInfo.email?.match(EMAIL_REGEXP))
    errors.email = 'メールアドレスの形式が正しくありません';
  if (!member.privateInfo.phoneNumber)
    errors.phoneNumber = '電話番号を入力してください';
  else if (!member.privateInfo.phoneNumber?.match(PHONE_NUMBER_REGEXP))
    errors.phoneNumber = '電話番号の形式が正しくありません';
  if (!member.privateInfo.birthdate)
    errors.birthdate = '生年月日を入力してください';
  if (!member.privateInfo.currentAddress.postalCode)
    errors.currentPostalCode = '現在の郵便番号を入力してください';
  if (!member.privateInfo.currentAddress.postalCode?.match(POSTAL_CODE_REGEXP))
    errors.currentPostalCode = '現在の郵便番号の形式が正しくありません';
  if (!member.privateInfo.currentAddress.address)
    errors.currentAddress = '現在の住所を入力してください';

  if (!isLivingWithParents) {
    if (!member.privateInfo.homeAddress.postalCode)
      errors.homePostalCode = '実家の郵便番号を入力してください';
    if (!member.privateInfo.homeAddress.postalCode?.match(POSTAL_CODE_REGEXP))
      errors.homePostalCode = '実家の郵便番号の形式が正しくありません';
    if (!member.privateInfo.homeAddress.address)
      errors.homeAddress = '実家の住所を入力してください';
  }

  const ok = Object.keys(errors).length === 0;
  return [ok, errors];
}
