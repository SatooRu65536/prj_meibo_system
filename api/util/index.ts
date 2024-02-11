/**
 * 文字列を日付型に変換する
 * @param date 日付文字列
 * @returns 日付型
 */
export function toDateISO(date: string | number | Date) {
  return new Date(date).toISOString();
}
