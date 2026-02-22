"use client";
import { CopyButton } from "@/components/CopyBuuton";
import { FormatDateNode } from "@/components/FormatDateNode";
import { useBookingModal } from "@/contexts/BookingModalContext";
import { actionMap, statusMap } from "@/libs/booking";
import { SupabaseBooking, SupabaseService } from "@/types";
import { cn } from "@/utils/className";
import {
  EditOutlined,
  CheckOutlined,
  StarOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { OverrideProps } from "fanyucomponents";
import { memo, useMemo } from "react";

type BookingTableRowProps = OverrideProps<
  React.HTMLAttributes<HTMLTableRowElement>,
  {
    item: SupabaseBooking;
    service: SupabaseService | undefined;
    onUpdate: (
      booking: SupabaseBooking,
      status: SupabaseBooking["status"],
    ) => void;
    onDelete: (booking: SupabaseBooking) => void;
    selected: boolean;
    onSelect: (id: string, checked: boolean) => void;
  }
>;

type OperationItem<T extends React.ElementType = React.ElementType> = {
  label: string;
  component: T;
  props: React.ComponentProps<T>;
  Icon: React.ElementType;
};

export const BookingTableRow = memo(
  ({
    item,
    service,
    onUpdate,
    onDelete,
    selected,
    onSelect,
    className,
    ...rest
  }: BookingTableRowProps) => {
    const modal = useBookingModal();
    const status = statusMap[item.status] ?? {
      label: item.status,
      className: "",
    };

    const operations = useMemo<OperationItem[]>(
      () => [
        {
          label: "編輯",
          component: "button",
          props: {
            className: actionMap.edit.className,
            onClick: () => modal.open(item),
          },
          Icon: EditOutlined,
        },
        {
          label: "確認",
          component: "button",
          props: {
            type: "button",
            onClick: () => onUpdate(item, "confirmed"),
            disabled: item.status === "confirmed",
            className: statusMap.confirmed.className,
          },
          Icon: CheckOutlined,
        },
        {
          label: "完成",
          component: "button",
          props: {
            type: "button",
            className: statusMap.completed.className,
            onClick: () => onUpdate(item, "completed"),
            disabled: item.status === "completed",
          },
          Icon: StarOutlined,
        },
        {
          label: "取消",
          component: "button",
          props: {
            type: "button",
            onClick: () => onUpdate(item, "cancelled"),
            disabled: item.status === "cancelled",
            className: statusMap.cancelled.className,
          },
          Icon: CloseOutlined,
        },
        {
          label: "刪除",
          component: "button",
          props: {
            onClick: () => onDelete(item),
            className: actionMap.delete.className,
          },
          Icon: DeleteOutlined,
        },
      ],
      [item, modal, onDelete, onUpdate],
    );

    return (
      <tr id={item.id} className={cn("group", className)} {...rest}>
        <td className="pl-5 py-3">
          <input
            id={`select-row-${item.id}`}
            name={`select_row_${item.id}`}
            type="checkbox"
            className="cursor-pointer align-middle"
            checked={selected}
            onChange={(e) => onSelect(item.id, e.target.checked)}
          />
        </td>
        <td
          className="px-5 py-3 text-xs font-mono text-(--muted)"
          title={item.id}
        >
          <CopyButton content={item.id}>{item.id.slice(0, 8)}...</CopyButton>
        </td>
        <td className="px-5 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">{item.customer_name}</span>
            <span className="text-xs text-(--muted)">
              {item.customer_phone}
            </span>
            <span className="text-xs text-(--muted)">{item.customer_line}</span>
          </div>
        </td>
        <td className="px-5 py-3 text-sm">
          <div className="flex items-center justify-center">
            <span className="flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium border shrink-0 w-max border-(--border) bg-gray-50/50">
              {service?.name || "-"}
            </span>
          </div>
        </td>
        <td className="px-5 py-3">
          <FormatDateNode
            date={[item.booking_time]}
            className="flex flex-col text-sm"
          >
            <span className="text-(--foreground)">YYYY/MM/DD</span>
            <span className="text-xs text-(--muted)">hh:mm A</span>
          </FormatDateNode>
        </td>
        <td className="px-5 py-3 text-center">
          <span
            className={cn(
              "flex items-center px-2 py-1 rounded-full text-xs font-medium border shrink-0 w-max",
              status.className,
            )}
          >
            {status.label}
          </span>
        </td>
        <td className="px-5 py-3 text-sm text-center whitespace-nowrap">
          {/* 操作按鈕群組 */}
          <div className="flex items-center justify-center gap-1.5">
            {operations.map((oper) => {
              const { className: operClassName, ...operRest } = oper.props;
              const Component = oper.component;
              return (
                <Component
                  key={oper.label}
                  className={cn(
                    "flex items-center p-2 rounded-md text-sm font-medium border tooltip",
                    operClassName,
                  )}
                  data-tooltip={oper.label}
                  {...operRest}
                >
                  <oper.Icon />
                </Component>
              );
            })}
          </div>
        </td>
      </tr>
    );
  },
);

BookingTableRow.displayName = "BookingTableRow";
