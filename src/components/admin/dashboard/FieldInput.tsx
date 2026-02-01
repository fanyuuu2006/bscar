import { cn } from "@/utils/className";
import { OverrideProps } from "fanyucomponents";

export type FieldInputProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    field: {
      id: string;
      label: string;
      hint?: string;
      type: string;
    };

    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
>;

export const FieldInput = ({
  field,
  value,
  onChange,
  className,
  ...rest
}: FieldInputProps) => {
  return (
    <div className={cn("flex flex-col", className)} {...rest}>
      <label className="font-bold mb-1" htmlFor={field.id}>
        {field.label}
        {field.hint && (
          <span className="text-[0.75em] text-(--muted) ml-2">
            ({field.hint})
          </span>
        )}
      </label>
      <input
        id={field.id}
        type={field.type}
        value={value}
        onChange={onChange}
        className={cn("w-full p-2 border-(--border) rounded-lg bg-black/5")}
      />
    </div>
  );
};
