type Routes = {
  [key: string]: {
    name: string;
    path: string;
  };
};

export const ROUTES: Routes = {
  top: {
    name: 'トップ',
    path: '/',
  },
  signup: {
    name: '新規登録',
    path: '/signup',
  },
  registration: {
    name: '新規登録',
    path: '/registration',
  },
  payment: {
    name: '支払い',
    path: '/registration/payment',
  },
  user: {
    name: 'ユーザーページ',
    path: '/user',
  },
};
