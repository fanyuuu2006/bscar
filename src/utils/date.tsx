type DateFormatToken = "YYYY" | "MM" | "DD" | "HH" | "mm" | "ss";

export const formatDate = (
  format: string,
  ...args: ConstructorParameters<typeof Date>
): string => {
  const date = new Date(...args);

  const pad = (n: number) => String(n).padStart(2, "0");

  const map: Record<DateFormatToken, string> = {
    YYYY: String(date.getFullYear()),
    MM: pad(date.getMonth() + 1),
    DD: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
  };

  return format.replace(
    /YYYY|MM|DD|HH|mm|ss/g,
    (token) => map[token as DateFormatToken]
  );
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstWeekdayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

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

export const isSameDate = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
