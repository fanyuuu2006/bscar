import React, { useMemo } from "react";

/**
 * 元件屬性介面
 * @typedef {Object} KeywordEmphasizeProps
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
  const processedChildren = useMemo(() => {
    // 1. 如果沒有關鍵字或關鍵字為空字串，直接返回原始内容
    if (!keyword || keyword.trim() === "") return children;

    const trimmedKeyword = keyword.trim();

    // 2. 建立正則表達式
    const flags = caseSensitive ? "g" : "gi";
    const regex = new RegExp(`(${escapeRegExp(trimmedKeyword)})`, flags);

    /**
     * 文字處理函數
     * 將字串根據關鍵字分割，並將關鍵字部分替換為帶樣式的 span
     */
    const highlightText = (text: string): React.ReactNode[] => {
      const parts = text.split(regex);
      if (parts.length === 1) return [text];

      return parts.map((part, index) => {
        const isMatch = index % 2 === 1;
        if (isMatch) {
          return (
            <span key={index} className={className} style={style}>
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
      // 情況 A: 純字串節點 - 執行取代
      if (typeof node === "string") {
        const highlighted = highlightText(node);
        if (highlighted.length === 1 && highlighted[0] === node) {
          return node;
        }
        return <>{highlighted}</>;
      }

      // 情況 B: React 元素
      if (React.isValidElement<React.HTMLAttributes<HTMLElement>>(node)) {
        // 如果該元素有標記為 data-no-emphasize，則跳過其內部的處理
        if ("data-no-emphasize" in node.props) {
          return node;
        }

        // 重要：如果是一個我們無法"鑽進去"的自定義組件（例如 <BookingTableRow>），
        // 我們無法修改它的內部渲染結果。我們只能原樣返回。
        //
        // 唯一的例外是如果這個元件有 children prop，我們可以遞迴處理 children。
        // 但如果它的內容是從內部 state 或其他 props (ex: item prop) 渲染出來的，
        // 外部是完全無能為力的。
        const { children: elementChildren, ...props } = node.props;

        // 如果這個元素有 children，我們嘗試處理 children
        if (elementChildren !== undefined && elementChildren !== null) {
          return React.cloneElement(
            node,
            { ...props, key: node.key },
            processNode(elementChildren),
          );
        }

        // 如果沒有 children (或是自定義組件內部渲染)，直接返回
        return node;
      }

      // 情況 C: 陣列
      if (Array.isArray(node)) {
        return React.Children.map(node, (child) => processNode(child));
      }

      return node;
    };

    return processNode(children);
  }, [children, keyword, className, style, caseSensitive]);

  return <>{processedChildren}</>;
};
