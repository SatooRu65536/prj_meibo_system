import { ResError } from '@/types/response';

type ErrorStruct = {
  err: ResError;
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
    approach: '登録したのちに、管理者に承認してもらう必要があります',
  },
  status: 401,
});

const registered = (): ErrorStruct => ({
  err: {
    success: false,
    key: 'A5',
    message: 'すでにユーザー登録されています',
  },
  status: 401,
});

const AuthError = {
  notFoundToken,
  failedAuth,
  notAdmin,
  notRegistered,
  notSelfOrAdmin,
  registered,
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

const RequestError = {
  invalidRequest,
  validationError,
  notFound,
};

export const ErrorService = {
  auth: AuthError,
  request: RequestError,
};
