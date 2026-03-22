"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AdminDashboard() {
    return (
        <ProtectedRoute>
            <div className="p-10 text-white bg-zinc-950 min-h-screen font-sans">
                <h1 className="text-3xl font-bold text-emerald-400 mb-4 tracking-tight">Panel de Administrador</h1>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
                    <p className="text-zinc-400">Contenido protegido. Solo visible con Token.</p>
                </div>
            </div>
        </ProtectedRoute>
    );
}
