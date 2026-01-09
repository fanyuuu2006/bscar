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
