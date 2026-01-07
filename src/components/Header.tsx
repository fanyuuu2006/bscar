import { DistributiveOmit } from "fanyucomponents";

type HeaderProps = DistributiveOmit<
  React.HtmlHTMLAttributes<HTMLElement>,
  "children"
>;

export const Header = (props: HeaderProps) => {
  return (
    <header {...props}>
      <div className="container w-full">
        <h1>博斯汽車美容</h1>
      </div>
    </header>
  );
};
