"use client";
import { useModal } from "@/hooks/useModal";
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { OverrideProps } from "fanyucomponents";
import { SupabaseBooking, SupabaseService } from "@/types";
import { TimeSlotSelector } from "@/components/TimeSlotSelector";
import { useAdminToken } from "@/hooks/useAdminToken";
import { statusMap } from "@/libs/booking";
import { getServices, updateBookingByAdmin } from "@/utils/backend";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { useRouter } from "next/navigation";
import { FieldInput, FieldInputProps } from "@/components/FieldInput";
import { FormatDateNode } from "@/components/FormatDateNode";

type BookingModalContextType = OverrideProps<
  ReturnType<typeof useModal>,
  {
    open: (
      booking: SupabaseBooking,
      options?: { onSuccess?: () => void }
    ) => void;
  }
>;

const bookingModalContext = createContext<BookingModalContextType | null>(null);

export type OperationItem<T extends React.ElementType = React.ElementType> = {
  label: string;
  component: T;
  props: React.ComponentProps<T>;
};


export const BookingModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [booking, setBooking] = useState<SupabaseBooking | null>(null);
  const [newBooking, setNewBooking] = useState<SupabaseBooking | null>(null);
  const [saving, setSaving] = useState(false);
  const [services, setServices] = useState<SupabaseService[]>([]);
  const { token } = useAdminToken();
  const router = useRouter();
  const modal = useModal({});
  const [onSuccess, setOnSuccess] = useState<(() => void) | undefined>();

  // 常用表單欄位定義
  const customerFields: FieldInputProps["field"][] = useMemo(
    () => [
      { required: true, id: "customer_name", label: "姓名", type: "text" },
      { required: true, id: "customer_phone", label: "電話", type: "tel" },
      { required: true, id: "customer_line", label: "Line ID", type: "text" },
    ],
    []
  );

  /** 一次性取得服務列表 */
  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await getServices();
      if (!mounted) return;
      if (res.success && res.data) setServices(res.data);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = useCallback(
    <T extends keyof SupabaseBooking>(key: T, value: SupabaseBooking[T]) => {
      setNewBooking((prev) => (prev ? { ...prev, [key]: value } : prev));
    },
    []
  );

  const handleSave = useCallback(async () => {
    if (!token || !newBooking) return;
    if (booking && JSON.stringify(booking) === JSON.stringify(newBooking)) {
      alert("資料未變更");
      return;
    }

    setSaving(true);
    try {
      const res = await updateBookingByAdmin(token, newBooking);
      if (res.success) {
        if (onSuccess) onSuccess();
        router.refresh();
        modal.close();
      } else {
        alert(`保存失敗${res.message ? `：${res.message}` : ""}`);
      }
    } finally {
      setSaving(false);
    }
  }, [newBooking, router, token, booking, modal, onSuccess]);

  const onServiceChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      handleChange("service_id", e.target.value);
    },
    [handleChange]
  );

  const onStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      handleChange("status", e.target.value as SupabaseBooking["status"]);
    },
    [handleChange]
  );

  const onInputChange = useCallback(
    (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(
        key as keyof SupabaseBooking,
        e.target.value as unknown as SupabaseBooking[keyof SupabaseBooking]
      );
    },
    [handleChange]
  );

  const onDateChange = useCallback(
    (date: Date) => {
      handleChange("booking_time", formatDate("YYYY-MM-DD HH:mm:ss", date));
    },
    [handleChange]
  );

  const buttons: OperationItem[] = useMemo(() => {
    return [
      {
        label: "取消",
        component: "button",
        props: {
          className: "btn secondary",
          onClick: modal.close,
        },
      },
      {
        label: "保存",
        component: "button",
        props: {
          type: "button",
          onClick: handleSave,
          disabled: saving,
          className: "btn primary",
        },
      },
    ];
  }, [modal.close, handleSave, saving]);

  const value = useMemo(
    () => ({
      ...modal,
      open: (
        booking: SupabaseBooking,
        options?: { onSuccess?: () => void }
      ) => {
        setBooking(booking);
        setNewBooking(booking);
        setOnSuccess(() => options?.onSuccess);
        modal.open();
      },
    }),
    [modal]
  );

  return (
    <bookingModalContext.Provider value={value}>
      {children}
      <modal.Container className="animate-appear flex items-center justify-center p-4 z-50">
        {newBooking ? (
          <div className="card p-4 md:p-6 w-full max-w-xl max-h-full rounded-xl flex flex-col">
            <div className="flex justify-between items-center border-b border-(--border) pb-2">
              <h3 className="text-2xl font-black">編輯預約</h3>
            </div>

            <div className="flex flex-col py-4 max-h-full overflow-y-auto gap-4">
              {/* ===== 預約資訊 ===== */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xl font-extrabold">預約資訊</h4>

                <div className="flex flex-col gap-4 pl-1">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-sm">預約編號</span>
                    <span className="font-light text-sm">{newBooking.id}</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-sm">服務</label>
                    <select
                      value={newBooking.service_id}
                      onChange={onServiceChange}
                      className="p-2.5 border-(--border) border rounded-lg bg-gray-50/50 outline-none focus:border-(--primary) transition-colors"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-sm">預約時間</span>
                    <FormatDateNode
                      date={[newBooking.booking_time]}
                      className="font-light text-sm"
                    >
                      YYYY/MM/DD hh:mm A
                    </FormatDateNode>
                    <TimeSlotSelector
                      className="mt-2 text-sm"
                      locationId={newBooking.location_id}
                      serviceId={newBooking.service_id}
                      value={new Date(newBooking.booking_time)}
                      onChange={onDateChange}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-sm">狀態</label>
                    <select
                      value={newBooking.status}
                      onChange={onStatusChange}
                      className="p-2.5 border-(--border) border rounded-lg bg-gray-50/50 outline-none focus:border-(--primary) transition-colors"
                    >
                      {Object.entries(statusMap).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* ===== 顧客資訊 ===== */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xl font-extrabold">顧客資訊</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {customerFields.map((field) => (
                    <FieldInput
                      key={field.id}
                      field={field}
                      value={
                        (newBooking[
                          field.id as keyof SupabaseBooking
                        ] as string) || ""
                      }
                      onChange={(e) => onInputChange(field.id, e)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-auto pt-2">
              {buttons.map((item) => {
                const { className: itemClassName, ...itemProps } = item.props;
                return (
                  <item.component
                    key={item.label}
                    className={cn(
                      "px-6 py-2 rounded-xl font-medium min-w-25 transition-colors",
                      itemClassName
                    )}
                    {...itemProps}
                  >
                    {item.label}
                  </item.component>
                );
              })}
            </div>
          </div>
        ) : null}
      </modal.Container>
    </bookingModalContext.Provider>
  );
};

export const useBookingModal = () => {
  const context = useContext(bookingModalContext);
  if (!context) {
    throw new Error("useBookingModal 必須在 BookingModalProvider 內使用");
  }
  return context;
};
