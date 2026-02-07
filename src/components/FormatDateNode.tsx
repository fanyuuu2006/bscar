import { OverrideProps } from "fanyucomponents";

type FormatDateProps = OverrideProps<
  React.TimeHTMLAttributes<HTMLTimeElement>,
  {
    date: Date;
  }
>;
export const FormatDateNode = ({ date, ...rest }: FormatDateProps) => {

  return (
    <time dateTime={date.toISOString()} {...rest}>

    </time>
  );
};
