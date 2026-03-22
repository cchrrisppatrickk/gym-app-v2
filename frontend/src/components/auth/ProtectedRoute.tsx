"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = authService.getToken();

        // Si no hay token, lo pateamos al login inmediatamente
        if (!token) {
            router.replace("/login");
        } else {
            // Si hay token, le damos luz verde para ver la página
            setIsAuthorized(true);
        }
    }, [router]);

    // Mientras verifica (milisegundos), mostramos una pantalla de carga oscura
    if (!isAuthorized) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
            </div>
        );
    }

    return <>{children}</>;
}
