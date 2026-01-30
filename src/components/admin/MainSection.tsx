"use client";

import { useAdmin } from "@/contexts/AdminContext";
import { cn } from "@/utils/className";
import { useState } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

export const MainSection = () => {
  const { logIn, loading } = useAdmin();
  const [formData, setFormData] = useState<Parameters<typeof logIn>[0]>({
    id: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logIn(formData);
  };

  const formFields = [
    {
      id: "id",
      label: "帳號",
      type: "text",
    },
    {
      id: "password",
      label: "密碼",
      type: "password",
    },
  ] as const;

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
            <div key={field.id} className="flex flex-col gap-2">
              <label
                htmlFor={field.id}
                className={cn(
                  "text-sm font-medium text-(--foreground)",
                  "after:content-['*'] after:ml-0.5 after:text-(--accent)"
                )}
              >
                {field.label}
              </label>
              <div className="relative">
                <input
                  required
                  id={field.id}
                  name={field.id}
                  type={
                    field.id === "password" && showPassword
                      ? "text"
                      : field.type
                  }
                  disabled={loading}
                  value={formData[field.id as keyof typeof formData]}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={`請輸入${field.label}`}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border border-(--border) bg-(--background) text-(--foreground) focus:outline-hidden focus:border-(--primary) transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                    field.id === "password" && "pr-10"
                  )}
                />
                {field.id === "password" && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-(--muted) cursor-pointer"
                  >
                    {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </button>
                )}
              </div>
            </div>
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