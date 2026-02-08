"use client";

import { cn } from "@/utils/className";
import { CaretDownOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { OverrideProps } from "fanyucomponents";

type MultiSelectProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    label?: string;
    options: {
      value: string;
      label: string;
    }[];
    values: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
  }
>;

export const MultiSelect = ({
  label = "選項",
  options,
  values,
  onChange,
  placeholder,
  className,
  ...rest
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggleOption = useCallback(
    (value: string) => {
      if (values.includes(value)) {
        onChange(values.filter((v) => v !== value));
      } else {
        onChange([...values, value]);
      }
    },
    [values, onChange],
  );

  const displayText =
    values.length > 0
      ? `${label} (${values.length})`
      : placeholder || `所有${label}`;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex items-center gap-1 cursor-pointer select-none",
        className,
      )}
      onClick={() => setIsOpen(!isOpen)}
      title={
        values.length > 0
          ? options
              .filter((o) => values.includes(o.value))
              .map((o) => o.label)
              .join(", ")
          : ""
      }
      {...rest}
    >
      <span className="truncate">{displayText}</span>
      <CaretDownOutlined
        className={cn("ms-auto")}
      />
      {/* 下拉選單內容 */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-1 card w-full rounded-lg max-h-60 overflow-y-auto p-2">
          <div className="w-full flex flex-col">
            {[
              {
                value: "__all__",
                label: `全部${label}`,
              },
              ...options,
            ].map((opt) => {
              const isSelected =
                opt.value === "__all__"
                  ? values.length === 0
                  : values.includes(opt.value);

              return (
                <Option
                  key={opt.value}
                  value={opt.value}
                  isSelected={isSelected}
                  className="p-0.5"
                  onClick={(e) => {
                    e.stopPropagation();

                    if (opt.value === "__all__") {
                      onChange([]);
                    } else {
                      handleToggleOption(opt.value);
                    }
                  }}
                >
                  <span>{opt.label}</span>
                </Option>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

type OptionProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    isSelected: boolean;
    value: string;
  }
>;

const Option = ({
  value,
  className,
  children,
  isSelected,
  ...rest
}: OptionProps) => {
  return (
    <div
      role="button"
      key={value}
      className={cn("text-left flex items-center gap-1", className)}
      {...rest}
    >
      <div
        className={cn(
          "text-(--background) w-[1.2em] h-[1.2em] rounded-sm border border-(--border)",
          {
            "bg-blue-500": isSelected,
          },
        )}
      />
      {children}
    </div>
  );
};
