"use client";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full bg-zinc-950 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden lg:pl-64">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-6 bg-zinc-950">
                    {children}
                </main>
            </div>
        </div>
    );
}
