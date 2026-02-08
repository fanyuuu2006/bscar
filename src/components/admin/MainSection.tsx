"use client";
import { useAdmin } from "@/contexts/AdminContext";
import { useMemo, useState } from "react";
import { FieldInput, FieldInputProps } from "../FieldInput";

export const MainSection = () => {
  const {  logIn, loading } = useAdmin();
  const [formData, setFormData] = useState<Parameters<typeof logIn>[0]>({
    account: "",
    password: "",
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logIn(formData);
  };
  const formFields: FieldInputProps['field'][] = useMemo(()=> [
    {
      id: "account",
      label: "帳號",
      placeholder: "請輸入帳號",
      type: "text",
      required: true,
    },
    {
      id: "password",
      label: "密碼",
      placeholder: "請輸入密碼",
      type: "password",
      required: true,
    },
  ] , []);

  return (
    <section className="flex h-full w-full items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="card flex w-full max-w-md flex-col gap-6 rounded-2xl p-8"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-(--foreground)">後台登入</h2>
          <p className="mt-2 text-sm text-(--muted)">
            請輸入管理員帳號密碼以繼續
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {formFields.map((field) => (
            <FieldInput
              key={field.id}
              field={field}
              value={formData[field.id as keyof typeof formData]}
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn primary flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-medium"
        >
          {loading ? "登入中..." : "登入"}
        </button>
      </form>
    </section>
  );
};
