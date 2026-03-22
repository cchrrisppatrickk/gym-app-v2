"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

import DashboardLayout from "@/components/layout/DashboardLayout";

export default function AdminDashboard() {
    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="font-sans">
                    <h1 className="text-3xl font-bold text-emerald-400 mb-4 tracking-tight">Panel de Administrador</h1>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
                        <p className="text-zinc-400">Contenido protegido. Solo visible con Token.</p>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
