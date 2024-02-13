import { ErrorResponse } from '@/types/response';

type ErrorStruct = {
  err: ErrorResponse;
  status: number;
};

const notFoundToken = (): ErrorStruct => ({
  err: {
    success: false,
    key: 'A0',
    message: 'トークンを取得できませんでした',
    approach: 'ログインし直してください',
  },
  status: 401,
});

const failedAuth = (): ErrorStruct => ({
  err: {
    success: false,
    key: 'A1',
    message: '認証に失敗しました',
    approach: 'ログインし直してください',
  },
  status: 401,
});

const notAdmin = (): ErrorStruct => ({
  err: {
    success: false,
    key: 'A2',
    message: '管理者権限が必要です',
    approach: '管理者に問い合わせてください',
  },
  status: 401,
});

const notSelfOrAdmin = (): ErrorStruct => ({
  err: {
    success: false,
    key: 'A3',
    message: '本人もしくは管理者権限が必要です',
    approach: '管理者に問い合わせてください',
  },
  status: 401,
});

const notRegistered = (): ErrorStruct => ({
  err: {
    success: false,
    key: 'A4',
    message: 'ユーザー登録されていません',
    approach: 'ユーザー登録を行ってください',
  },
  status: 401,
});

const registered = (): ErrorStruct => ({
  err: {
    success: false,
    key: 'A5',
    message: '登録済みです',
  },
  status: 401,
});

const notApproved = (): ErrorStruct => ({
  err: {
    success: false,
    key: 'A4',
    message: '承認されていません',
    approach: '管理者が承認するまでお待ちください',
  },
  status: 401,
});

const approved = (): ErrorStruct => ({
  err: {
    success: false,
    key: 'A5',
    message: '承認済みです',
  },
  status: 401,
});

const AuthError = {
  notFoundToken,
  failedAuth,
  notRegistered,
  registered,
  notAdmin,
  notApproved,
  notSelfOrAdmin,
  approved,
};

type Type = '文字列' | '数値' | '真偽値' | 'オブジェクト' | '配列';
const invalidRequest = (key: string | number, type: Type): ErrorStruct => ({
  err: {
    success: false,
    key: 'C0',
    message: `${key} が不正な値です. ${key} は ${type} である必要があります`,
  },
  status: 400,
});

const validationError = (message: string): ErrorStruct => ({
  err: {
    success: false,
    key: 'C1',
    message,
  },
  status: 400,
});

// 情報が見つからない
const notFound = (key: string): ErrorStruct => ({
  err: {
    success: false,
    key: 'C2',
    message: `${key} が見つかりません`,
    approach: '正しい情報を入力してください',
  },
  status: 404,
});

// ユーザーが見つからない
const userNotFound = (): ErrorStruct => ({
  err: {
    success: false,
    key: 'C3',
    message: 'ユーザーが見つかりません',
    approach: 'ユーザーIDを確認してください',
  },
  status: 404,
});

// すでに承認済み
const alreadyApproved = (): ErrorStruct => ({
  err: {
    success: false,
    key: 'C4',
    message: 'すでに承認済みです',
  },
  status: 400,
});

// 承認に失敗
const approveFailed = (): ErrorStruct => ({
  err: {
    success: false,
    key: 'C5',
    message: '承認に失敗しました',
    approach: 'メンバーIDを確認してください',
  },
  status: 400,
});

// すでに管理者承認済み
const alreadyApprovedOfficer = (): ErrorStruct => ({
  err: {
    success: false,
    key: 'C6',
    message: 'すでに管理者承認済みです',
  },
  status: 400,
});

// 管理者承認されていない
const notApprovedOfficer = (): ErrorStruct => ({
  err: {
    success: false,
    key: 'C7',
    message: '管理者承認されていません',
    approach: 'メンバーIDを確認してください',
  },
  status: 400,
});

// 管理者解除に失敗
const deleteOfficerFailed = (): ErrorStruct => ({
  err: {
    success: false,
    key: 'C8',
    message: '管理者解除に失敗しました',
    approach: 'メンバーIDを確認してください',
  },
  status: 400,
});

const RequestError = {
  invalidRequest,
  validationError,
  userNotFound,
  notFound,
  alreadyApproved,
  approveFailed,
  alreadyApprovedOfficer,
  notApprovedOfficer,
  deleteOfficerFailed,
};

// 支払い情報の追加に失敗
const failedPayment = (): ErrorStruct => ({
  err: {
    success: false,
    key: 'D0',
    message: '支払い情報の追加に失敗しました',
  },
  status: 500,
});

// 受け取り情報の追加に失敗
const failedConfirme = (): ErrorStruct => ({
  err: {
    success: false,
    key: 'D1',
    message: '受け取り情報の追加に失敗しました',
    approach: 'お金の受け取りが完了しているか確認してください',
  },
  status: 500,
});

// 支払い前
const notPaid = (): ErrorStruct => ({
  err: {
    success: false,
    key: 'D2',
    message: '支払いが完了していません',
    approach: 'お金の支払いが完了しているか確認してください',
  },
  status: 400,
});

// 支払い済み
const alreadyPaid = (): ErrorStruct => ({
  err: {
    success: false,
    key: 'D3',
    message: '支払いが完了しています',
  },
  status: 400,
});

// 受け取り前
const notConfirmed = (): ErrorStruct => ({
  err: {
    success: false,
    key: 'D4',
    message: '受け取りが完了していません',
    approach: 'お金の受け取りが完了しているか確認してください',
  },
  status: 400,
});

// 受け取り済み
const alreadyConfirmed = (): ErrorStruct => ({
  err: {
    success: false,
    key: 'D5',
    message: '受け取りが完了しています',
  },
  status: 400,
});

// 受け取り可能な状態ではありません
const notAvailable = (): ErrorStruct => ({
  err: {
    success: false,
    key: 'D6',
    message: '受け取り可能な状態ではありません',
    approach: 'お金の受け取りが完了しているか確認してください',
  },
  status: 400,
});

const PaymentError = {
  failedPayment,
  failedConfirme,
  notPaid,
  alreadyPaid,
  notConfirmed,
  alreadyConfirmed,
  notAvailable,
};

export const ErrorService = {
  auth: AuthError,
  request: RequestError,
  payment: PaymentError,
};
