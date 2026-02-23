import React, { useMemo } from "react";

/**
 * 元件屬性介面
 * @property {React.ReactNode} children - 要進行關鍵字強調的內容，可以是字串、React 元素或陣列
 * @property {string | null | undefined} keyword - 需要強調的關鍵字
 * @property {string} [className] - 強調關鍵字的樣式類別名稱，例如 Tailwind class
 * @property {React.CSSProperties} [style] - 強調關鍵字的內聯樣式
 * @property {boolean} [caseSensitive=false] - 是否區分大小寫，預設為 false (不區分)
 */
type KeywordEmphasizeProps = {
  children: React.ReactNode;
  keyword: string | null | undefined;
  className?: string;
  style?: React.CSSProperties;
  caseSensitive?: boolean;
};

/**
 * 轉義正則表達式特殊字符
 * @param {string} string - 原始字串
 * @returns {string} 轉義後的字串
 */
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * 關鍵字強調元件
 *
 * 這個元件會遞迴遍歷 children，找出所有文本節點，
 * 並將其中匹配 keyword 的部分用 span 包裹並套用樣式。
 *
 * @component
 * @example
 * ```tsx
 * <KeywordEmphasize keyword="test" className="text-red-500 font-bold">
 *   This is a test message.
 * </KeywordEmphasize>
 * ```
 */
export const KeywordEmphasize = ({
  children,
  keyword,
  className,
  style,
  caseSensitive = false,
}: KeywordEmphasizeProps) => {
  // 為了避免 style 物件每次 render 都視為不同而破壞 useMemo，建議外部傳入 memoized style 或固定 style
  // 但在此我們主要依賴 keyword 和 children 的變化來觸發重算

  const processedChildren = useMemo(() => {
    // 1. 如果沒有關鍵字或關鍵字為空字串，直接返回原始内容
    if (!keyword || keyword.trim() === "") return children;

    const trimmedKeyword = keyword.trim();

    // 2. 建立正則表達式
    // 使用括號 () 包裹模式以在 split 時保留分隔符 (即匹配到的關鍵字)
    // 這樣我們可以保留原始文本的大小寫 (如果是 case-insensitive 匹配)
    const flags = caseSensitive ? "g" : "gi";
    const regex = new RegExp(`(${escapeRegExp(trimmedKeyword)})`, flags);

    /**
     * 文字處理函數
     * 將字串根據關鍵字分割，並將關鍵字部分替換為帶樣式的 span
     */
    const highlightText = (text: string): React.ReactNode[] => {
      // split 的結果會包含：[非關鍵字, 關鍵字(若匹配), 非關鍵字, ...]
      // 例如 keyword="a", text="b a c" -> ["b ", "a", " c"]
      const parts = text.split(regex);

      // 如果只有一個部分，表示沒有匹配到關鍵字，直接返回原字串 (為了效能)
      if (parts.length === 1) return [text];

      return parts.map((part, index) => {
        // 因使用捕獲群組 split，偶數索引為普通文本，奇數索引為匹配到的關鍵字
        // 但為了保險起見 (不同瀏覽器 split 行為可能極端情況不同)，我們再次驗證內容
        // 簡單判斷：若 parts[index] 符合 regex 測試則為關鍵字 (需注意 global flag regex 的 lastIndex 問題，這裡簡單用字串比較或忽略)
        // 更穩健的做法：依賴 split capturing group 的順序特性: split 產生的 odd index 是 separator
        const isMatch = index % 2 === 1;

        console.log(isMatch, part)

        if (isMatch) {
          return (
            <span key={index} className={className} style={style} data-highlighted>
              {part}
            </span>
          );
        }
        return part;
      });
    };

    /**
     * 遞迴處理 React 節點
     */
    const processNode = (node: React.ReactNode): React.ReactNode => {
        console.log(node)
      // 情況 A: 純字串節點 - 執行取代
      if (typeof node === "string") {
        const highlighted = highlightText(node);
        // 如果 highlightText 返回陣列長度為 1 且是原字串，直接回傳 node 避免不必要的 Fragment
        if (highlighted.length === 1 && highlighted[0] === node) {
          return node;
        }
        return <>{highlighted}</>;
      }

      // 情況 B: React 元素 (HTML tags 或 Components) - 遞迴處理 children
      if (React.isValidElement<React.HTMLAttributes<HTMLElement>>(node)) {
        const { children: elementChildren, ...restProps } = node.props;

        // 如果沒有 children，直接返回原元素
        if (elementChildren === undefined || elementChildren === null) {
          return node;
        }

        return React.cloneElement(node, {
          ...restProps,
          children: processNode(elementChildren),
        });
      }

      // 情況 C: 陣列 (Fragments 或列表) - 遍歷處理
      if (Array.isArray(node)) {
        return React.Children.map(node, (child) => processNode(child));
      }

      // 情況 D: 其他類型 (null, number, boolean) - 直接返回
      return node;
    };

    return processNode(children);
  }, [children, keyword, className, style, caseSensitive]);

  return <>{processedChildren}</>;
};
