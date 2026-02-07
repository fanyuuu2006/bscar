import { DateFormatToken } from "@/utils/date";
import { OverrideProps } from "fanyucomponents";
import React, { useMemo } from "react";

/**
 * 確保數字至少有兩位數，不足時在前方補零。
 */
const _pad = (n: number) => String(n).padStart(2, "0");

/**
 * FormatDateNode 組件的 Props 定義。
 */
type FormatDateNodeProps = OverrideProps<
  React.TimeHTMLAttributes<HTMLTimeElement>,
  {
    /**
     * Date 建構函式的參數。
     * 可以是時間戳 (timestamp)、日期字串、Date 物件或日期參數陣列。
     * 範例: `[Date.now()]` 或 `["2023-01-01"]`
     */
    date: ConstructorParameters<typeof Date>;
  }
>;

/**
 * 一個渲染 `<time>` 元素並格式化其子層日期佔位符的組件。
 *
 * 它會深度遍歷子節點樹，並根據提供的 `date` 將支援的日期 Token 替換為格式化後的數值。
 *
 * 支援的 Token:
 * - `YYYY`: 完整的年份 (例如: 2023)
 * - `MM`: 月份 (01-12)
 * - `DD`: 日期 (01-31)
 * - `HH`: 小時 (00-23)
 * - `hh`: 小時 (01-12)
 * - `mm`: 分鐘 (00-59)
 * - `ss`: 秒數 (00-59)
 * - `A`: 上午/下午 (AM/PM)
 *
 * @example
 * ```tsx
 * <FormatDateNode date={[new Date()]}>
 *   <span>今天是 YYYY-MM-DD</span>
 * </FormatDateNode>
 * ```
 */
export const FormatDateNode: React.FC<FormatDateNodeProps> = ({
  dateTime,
  date,
  children,
  ...rest
}) => {
  // 緩存日期數值以防止重新計算。
  // 使用 JSON.stringify(date) 確保穩定性，即使 'date' 陣列 prop 在每次渲染時都是新的參考 (例如: inline literal)。
  const { map, isoString } = useMemo(() => {
    const d = new Date(...date);
    const hours = d.getHours();

    const map: Record<DateFormatToken, string> = {
      YYYY: String(d.getFullYear()),
      MM: _pad(d.getMonth() + 1),
      DD: _pad(d.getDate()),
      HH: _pad(hours),
      hh: _pad(hours % 12 || 12),
      mm: _pad(d.getMinutes()),
      ss: _pad(d.getSeconds()),
      A: hours >= 12 ? "PM" : "AM",
    };

    return { map, isoString: d.toISOString() };
  }, [date]);

  // 緩存遞迴處理後的子節點，以避免不必要的樹狀結構遍歷。
  const processedChildren = useMemo(() => {
    const replacer = (str: string) =>
      str.replace(
        /YYYY|MM|DD|HH|hh|mm|ss|A/g,
        (token) => map[token as DateFormatToken],
      );

    const processNode = (node: React.ReactNode): React.ReactNode => {
      // 處理文字節點
      if (typeof node === "string") {
        return replacer(node);
      }

      // 處理 React 元素 (遞迴處理其子節點)
      if (React.isValidElement<React.HTMLAttributes<HTMLElement>>(node)) {
        const { children, ...props } = node.props;

        return React.cloneElement(
          node,
          { ...props },
          children !== undefined ? processNode(children) : children,
        );
      }

      // 處理節點陣列 (Fragments 或列表)
      if (Array.isArray(node)) {
        return React.Children.map(node, processNode);
      }

      // 其他類型 (null, boolean, number 等) 原樣返回
      return node;
    };

    return processNode(children);
  }, [children, map]);

  return (
    <time dateTime={dateTime ?? isoString} {...rest}>
      {processedChildren}
    </time>
  );
};
