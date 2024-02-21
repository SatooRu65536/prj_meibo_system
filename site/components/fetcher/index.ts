export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * @description GETリクエストを送信する
 * @param path リクエストパス
 * @returns {Promise<T | undefined>} レスポンスデータ
 */
export const baseGetFetcher = async <T>(
  path: string,
  token?: string,
): Promise<T | undefined> => {
  const url = new URL(path, BASE_URL).href;
  const headers = new Headers();
  if (token) headers.append('Authorization', `Bearer ${token}`);

  return fetch(url, { headers })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return undefined;
    });
};

/**
 * @description POSTリクエストを送信する
 * @param path リクエストパス
 * @param body リクエストボディ
 * @returns {Promise<T | undefined>} レスポンスデータ
 */
export const basePostFetcher = async <T>(
  path: string,
  token: string | undefined,
  body: any,
): Promise<T | undefined> => {
  if (!token) return undefined;

  const url = new URL(path, BASE_URL).href;
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Content-Type', 'application/json');

  return fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return undefined;
    });
};

/**
 * @description PUTリクエストを送信する
 * @param path リクエストパス
 * @param body リクエストボディ
 * @returns {Promise<T | undefined>} レスポンスデータ
 */
export const basePutFetcher = async <T>(
  path: string,
  token: string | undefined,
  body: any,
): Promise<T | undefined> => {
  if (!token) return undefined;

  const url = new URL(path, BASE_URL).href;
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Content-Type', 'application/json');

  return fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return undefined;
    });
};

/**
 * @description DELETEリクエストを送信する
 * @param path リクエストパス
 * @param body リクエストボディ
 * @returns {Promise<T | undefined>} レスポンスデータ
 */
export const baseDeleteFetcher = async <T>(
  path: string,
  token: string | undefined,
  body: any,
): Promise<T | undefined> => {
  if (!token) return undefined;

  const url = new URL(path, BASE_URL).href;
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Content-Type', 'application/json');

  return fetch(url, {
    method: 'DELETE',
    headers,
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return undefined;
    });
};
