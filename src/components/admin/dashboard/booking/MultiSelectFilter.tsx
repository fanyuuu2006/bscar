"use client";

import { cn } from "@/utils/className";
import { CaretDownOutlined, FilterOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useRef, useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectFilterProps {
  label?: string;
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  className?: string;
  placeholder?: string;
}

export const MultiSelectFilter = ({
  label = "篩選",
  options,
  selectedValues,
  onChange,
  placeholder,
  className,
}: MultiSelectFilterProps) => {
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
      if (selectedValues.includes(value)) {
        onChange(selectedValues.filter((v) => v !== value));
      } else {
        onChange([...selectedValues, value]);
      }
    },
    [selectedValues, onChange],
  );

  const displayText =
    selectedValues.length > 0
      ? `${label} (${selectedValues.length})`
      : placeholder || `所有${label}`;

  return (
    <div
      className={cn(
        "relative flex items-center bg-gray-50/50 border border-(--border) rounded-lg py-2 pl-9 pr-8 cursor-pointer text-xs select-none hover:bg-gray-100 transition-colors",
        className,
      )}
      onClick={() => setIsOpen(!isOpen)}
      title={
        selectedValues.length > 0
          ? options
              .filter((o) => selectedValues.includes(o.value))
              .map((o) => o.label)
              .join(", ")
          : ""
      }
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-(--muted)">
        <FilterOutlined />
      </div>
      <span className="truncate">{displayText}</span>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-(--muted) text-xs">
        <CaretDownOutlined rotate={isOpen ? 180 : 0} />
      </div>
      {/* 下拉選單內容 */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-1 w-full bg-white border border-(--border) rounded-lg shadow-lg max-h-60 overflow-y-auto p-1">
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-xs rounded hover:bg-gray-50 cursor-pointer",
              selectedValues.length === 0 &&
                "font-medium text-blue-600 bg-blue-50",
            )}
            onClick={() => {
              onChange([]);
              setIsOpen(false);
            }}
          >
            <span>所有{label}</span>
          </div>
          {options.map((opt) => {
            const isSelected = selectedValues.includes(opt.value);
            return (
              <div
                key={opt.value}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-xs rounded hover:bg-gray-50 cursor-pointer",
                  isSelected && "bg-blue-50 text-blue-600",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleOption(opt.value);
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  className="pointer-events-none"
                />
                <span>{opt.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
