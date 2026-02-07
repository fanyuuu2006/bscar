import { DateFormatToken } from "@/utils/date";
import { OverrideProps } from "fanyucomponents";
import React from "react";

  const _pad = (n: number) => String(n).padStart(2, "0");


type FormatDateNodeProps = OverrideProps< React.TimeHTMLAttributes<HTMLTimeElement>,
  {
    date: ConstructorParameters<typeof Date>;
  }>

export const FormatDateNode: React.FC<FormatDateNodeProps> = ({
  date,
  children,
  ...rest
}) => {
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

  const replacer = (str: string) =>
    str.replace(
      /YYYY|MM|DD|HH|hh|mm|ss|A/g,
      (token) => map[token as DateFormatToken],
    );

  const processNode = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === "string") {
      return replacer(node);
    }

    if (React.isValidElement<React.HTMLAttributes<HTMLElement>>(node)) {
      const { children, ...props } = node.props;

      return React.cloneElement(
        node,
        { ...props },
        children !== undefined ? processNode(children) : children
      );
    }

    if (Array.isArray(node)) {
      return React.Children.map(node, processNode);
    }

    return node;
  };

  return <time {...rest}>{processNode(children)}</time>;
};
