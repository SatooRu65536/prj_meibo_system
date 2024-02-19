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
  user: {
    name: 'ユーザーページ',
    path: '/user',
  },
};
