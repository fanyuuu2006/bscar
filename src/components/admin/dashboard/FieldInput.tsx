import { cn } from "@/utils/className";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { OverrideProps } from "fanyucomponents";
import { useState } from "react";

export type FieldInputProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    field: {
      id: string;
      label: string;
      hint?: string;
      type: string;
      required?: boolean;
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
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="relative">
        <input
          id={field.id}
          required={field.required}
          type={field.type === "password" && showPassword ? "text" : field.type}
          value={value}
          onChange={onChange}
          className={cn("w-full p-2 border-(--border) border rounded-lg bg-gray-50/50")}
        />
        {field.type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-(--muted)"
          >
            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </button>
        )}
      </div>
    </div>
  );
};
