"use client";
export const useAdminToken = () => {
  const token = localStorage.getItem("authToken");
  return { token };
};
