/**
 * 文字列を日付型に変換する
 * @param date 日付文字列
 * @returns 日付型
 */
export function toDateISO(date: string | number | Date) {
  return new Date(date).toISOString();
}

/**
 * 今年度の4月1日00:00:00 のUNIX時間を取得
 * @returns 今年度の4月1日00:00:00 のUNIX時間
 */
export function getFYFirstdate() {
  const date = new Date();
  date.setMonth(date.getMonth() - 3);

  // 今年の4月1日00:00:00 のUNIX時間を取得
  const year = date.getFullYear();
  const thisFY = new Date(year, 3, 1);

  return thisFY.getTime();
}
