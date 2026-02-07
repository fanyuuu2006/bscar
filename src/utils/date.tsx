type DateFormatToken = "YYYY" | "MM" | "DD" | "HH" | "hh" | "mm" | "ss" | "A";

/**
 * 格式化日期字串
 * @param format 格式字串 (YYYY:年, MM:月, DD:日, HH:24時, hh:12時, mm:分, ss:秒, A:AM/PM)
 * @param args Date 建構參數
 * @returns 格式化後的字串
 */
export const formatDate = (
  format: string,
  ...args: ConstructorParameters<typeof Date>
): string => {
  const date = new Date(...args);

  const _pad = (n: number) => String(n).padStart(2, "0");
  const hours = date.getHours();

  const map: Record<DateFormatToken, string> = {
    YYYY: String(date.getFullYear()),
    MM: _pad(date.getMonth() + 1),
    DD: _pad(date.getDate()),
    HH: _pad(hours),
    hh: _pad(hours % 12 || 12),
    mm: _pad(date.getMinutes()),
    ss: _pad(date.getSeconds()),
    A: hours >= 12 ? "PM" : "AM",
  };

  return format.replace(
    /YYYY|MM|DD|HH|hh|mm|ss|A/g,
    (token) => map[token as DateFormatToken],
  );
};

export const formatDateNode = (
  format: React.ReactNode,
  ...args: ConstructorParameters<typeof Date>
): React.ReactNode => {
  const date = new Date(...args);

  const _pad = (n: number) => String(n).padStart(2, "0");
  const hours = date.getHours();
  const map: Record<DateFormatToken, string> = {
    YYYY: String(date.getFullYear()),
    MM: _pad(date.getMonth() + 1),
    DD: _pad(date.getDate()),
    HH: _pad(hours),
    hh: _pad(hours % 12 || 12),
    mm: _pad(date.getMinutes()),
    ss: _pad(date.getSeconds()),
    A: hours >= 12 ? "PM" : "AM",
  };
  if (typeof format === "string") {
    return format.replace(
      /YYYY|MM|DD|HH|hh|mm|ss|A/g,
      (token) => map[token as DateFormatToken],
    );
  }
  const formatStr = format as React.ReactNode[];
  return formatStr.map((part) => {
    if (typeof part === "string") {
      return part.replace(
        /YYYY|MM|DD|HH|hh|mm|ss|A/g,
        (token) => map[token as DateFormatToken],
      );
    }
    return part;
  });
};

/**
 * 取得該月份有幾天
 * @param year 年份
 * @param month 月份 (0-11)
 * @returns 天數
 */
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * 取得該月份第一天是星期幾
 * @param year 年份
 * @param month 月份 (0-11)
 * @returns 0 (日) - 6 (六)
 */
export const getFirstWeekdayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

/**
 * 取得日曆顯示用的陣列 (包含前面的空白填補)
 * @param year 年份
 * @param month 月份 (0-11)
 * @returns 日期陣列 (null 為空白)
 */
export const getDaysArray = (year: number, month: number): (Date | null)[] => {
  const daysInMonth = getDaysInMonth(year, month);
  // 取得該月第一天是星期幾（0 = 星期日, 1 = 星期一, ..., 6 = 星期六）
  const firstWeekday = getFirstWeekdayOfMonth(year, month);
  const daysArray: (Date | null)[] = [];

  // 填充空白日期
  for (let i = 0; i < firstWeekday; i++) {
    daysArray.push(null);
  }
  // 填充實際日期
  for (let day = 1; day <= daysInMonth; day++) {
    daysArray.push(new Date(year, month, day));
  }
  return daysArray;
};

/**
 * 比較兩個日期是否為同一天
 * @param date1 日期1
 * @param date2 日期2
 * @returns boolean
 */
export const isSameDate = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
