import React from "react";

type KeywordEmphasizeProps = {
  children: React.ReactNode;
  keyword: string | null | undefined;
  className?: string;
  style?: React.CSSProperties;
};

export const KeywordEmphasize = ({
  children,
  keyword,
  className,
  style,
}: KeywordEmphasizeProps) => {
  const processedChildren = React.useMemo(() => {
    if (!keyword) return children;

    const replacer = (str: string) =>
      str.split(keyword).reduce((acc, part, index, arr) => {
        acc.push(part);
        if (index < arr.length - 1) {
          acc.push(
            <span key={index} className={className} style={style}>
              {keyword}
            </span>,
          );
        }
        return acc;
      }, [] as React.ReactNode[]);

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
  }, [children, className, keyword, style]);

  return <>{processedChildren}</>;
};
