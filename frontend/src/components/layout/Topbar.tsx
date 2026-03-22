"use client";

import { usePathname } from "next/navigation";
import { Bell, LogOut, User } from "lucide-react";

export default function Topbar() {
    const pathname = usePathname();

    // Mapeo simple para mostrar el título en el header
    const getPageTitle = (path: string) => {
        if (path.includes("/admin/dashboard")) return "Dashboard";
        if (path.includes("/recepcion/caja")) return "Recepción / Caja";
        if (path.includes("/kiosko")) return "Kiosko POS";
        if (path.includes("/torniquete")) return "Torniquete";
        if (path.includes("/miembros")) return "Miembros";
        if (path.includes("/configuracion")) return "Configuración";
        return "Inicio";
    };

    const title = getPageTitle(pathname || "");

    return (
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-zinc-800 bg-zinc-900/80 px-4 shadow-sm backdrop-blur-md sm:gap-x-6 sm:px-6 lg:px-8 transition-colors">
            <div className="flex flex-1 items-center gap-x-4 lg:gap-x-6">

                {/* Route Name */}
                <div className="flex-1 text-xl flex items-center font-bold tracking-tight text-zinc-100">
                    {title}
                </div>

                {/* Right side icons */}
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    {/* Notification Bell */}
                    <button
                        type="button"
                        className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-emerald-400"
                    >
                        <span className="sr-only">Ver notificaciones</span>
                        <Bell className="h-5 w-5" aria-hidden="true" />
                    </button>

                    {/* Separator */}
                    <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-zinc-800" aria-hidden="true" />

                    {/* Profile & Logout */}
                    <div className="flex items-center gap-x-4">
                        {/* Avatar Placeholder */}
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600/20 border border-emerald-500/30 overflow-hidden shadow-sm">
                            <User className="h-5 w-5 text-emerald-500" />
                        </div>

                        {/* Logout Button */}
                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-lg p-2 text-sm font-semibold text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                            title="Cerrar Sesión"
                            onClick={() => {
                                // To be implemented fully in future
                                console.log("Logout clicked");
                            }}
                        >
                            <LogOut className="h-5 w-5" aria-hidden="true" />
                            <span className="hidden sm:inline-block">Salir</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
