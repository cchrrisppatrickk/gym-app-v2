"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    MonitorPlay,
    ShoppingCart,
    QrCode,
    Users,
    Settings
} from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Recepción / Caja", href: "/recepcion/caja", icon: MonitorPlay },
    { name: "Kiosko POS", href: "/kiosko", icon: ShoppingCart },
    { name: "Torniquete", href: "/torniquete", icon: QrCode },
    { name: "Miembros", href: "/miembros", icon: Users },
    { name: "Configuración", href: "/configuracion", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-zinc-900 border-r border-zinc-800 transition-all duration-300 hidden lg:flex">
            {/* Logo Area */}
            <div className="flex h-16 items-center flex-shrink-0 px-6 border-b border-zinc-800/50">
                <h1 className="text-2xl font-black text-emerald-400 tracking-tight">Gym-X</h1>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                {navigation.map((item) => {
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
