"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authService } from "@/services/auth.service";
import { jwtDecode } from "jwt-decode";
import {
    LayoutDashboard,
    MonitorPlay,
    ShoppingCart,
    ScanFace,
    Users,
    ShoppingBag,
    ClipboardList,
    Clock
} from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, roles: [1] },
    { name: "Recepción / Caja", href: "/recepcion/caja", icon: MonitorPlay, roles: [1, 2] },
    { name: "Kiosko POS", href: "/kiosko", icon: ShoppingCart, roles: [1, 2] },
    { name: "Torniquete", href: "/acceso", icon: ScanFace, roles: [1, 2] },
    { name: "Socios", href: "/admin/socios", icon: Users, roles: [1, 2] },
    { name: "Productos (Kiosko)", href: "/admin/config/productos", icon: ShoppingBag, roles: [1] },
    { name: "Planes de Membresía", href: "/admin/config/planes", icon: ClipboardList, roles: [1] },
    { name: "Turnos (Horarios)", href: "/admin/config/turnos", icon: Clock, roles: [1] },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [roleId, setRoleId] = useState<number | null>(null);

    useEffect(() => {
        const token = authService.getToken();
        if (token) {
            try {
                const decoded = jwtDecode<{ roleId: number }>(token);
                setRoleId(decoded.roleId);
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }
    }, []);

    return (
        <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-zinc-900 border-r border-zinc-800 transition-all duration-300 hidden lg:flex">
            {/* Logo Area */}
            <div className="flex h-16 items-center flex-shrink-0 px-6 border-b border-zinc-800/50">
                <h1 className="text-2xl font-black text-emerald-400 tracking-tight">Gym-X</h1>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                {navigation
                    .filter((item) => roleId && item.roles.includes(roleId))
                    .map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center px-3 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${isActive
                                    ? "bg-emerald-600/20 text-emerald-400"
                                    : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100"
                                    }`}
                            >
                                <Icon
                                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${isActive ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300"
                                        }`}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        );
                    })}
            </nav>
        </aside>
    );
}
