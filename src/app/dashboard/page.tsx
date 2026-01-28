"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    const router = useRouter();
    
    useEffect(() => {
        if (typeof window != undefined) {
            if (!localStorage.getItem("accessToken")) {
                router.push("/login");
            }
        }

    }, [])
    return (
        <div>
            dashboard
        </div>
    )
}