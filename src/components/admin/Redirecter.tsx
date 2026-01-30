"use client";

import { useAdmin } from "@/contexts/AdminContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const Redirecter = ({children}: {
    children: React.ReactNode;
}) => {
    const {admin} = useAdmin();
    const router = useRouter();
    useEffect(() => {
        if (admin) {
            router.replace('/admin/dashboard');
        }
        else {
            router.replace('/admin');
        }
    }, [admin, router]);
    return <>{children}</>;
}