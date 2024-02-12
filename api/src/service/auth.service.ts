import { CustomContext } from '@/types/context';
import { getFirebaseToken } from '../auth';
import { FirebaseIdToken } from 'firebase-auth-cloudflare-workers';

export class AuthService {
  /**
   * ユーザー情報取得
   * @param c　Context
   * @returns ユーザー情報 or null
   */
  static getUser(c: CustomContext<string>): FirebaseIdToken | null {
    return getFirebaseToken(c);
  }
}
