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

export const ErrorService = {
  auth: AuthError,
  request: RequestError,
};
