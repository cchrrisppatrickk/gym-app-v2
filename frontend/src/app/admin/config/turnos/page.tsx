"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { catalogService } from "@/services/catalog.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, X } from "lucide-react";

const shiftSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    startTime: z.string().min(1, "Hora de inicio requerida"),
    endTime: z.string().min(1, "Hora de fin requerida"),
});

type ShiftFormValues = z.infer<typeof shiftSchema>;

export default function GestionTurnos() {
    const [shifts, setShifts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ShiftFormValues>({
        resolver: zodResolver(shiftSchema),
        defaultValues: { name: "", startTime: "", endTime: "" },
    });

    const fetchShifts = async () => {
        setIsLoading(true);
        try {
            const data = await catalogService.getShifts();
            setShifts(data);
        } catch (error) {
            console.error("Error fetching shifts:", error);
            setShifts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchShifts();
    }, []);

    const onSubmit = async (values: ShiftFormValues) => {
        setSubmitError("");
        try {
            const formattedData = {
                name: values.name,
                startTime: `1970-01-01T${values.startTime}:00.000Z`,
                endTime: `1970-01-01T${values.endTime}:00.000Z`,
            };

            await catalogService.createShift(formattedData);
            setIsModalOpen(false);
            reset();
            await fetchShifts();
        } catch (error: any) {
            console.error("Error creating shift:", error);
            setSubmitError(error?.response?.data?.message || "Ocurrió un error al crear el turno.");
        }
    };

    const formatTimeStr = (isoString?: string) => {
        if (!isoString) return "-";
        const dateStr = new Date(isoString).toISOString(); // Use standard ISO to avoid browser timezone offsetting local time incorrectly
        const timeMatch = dateStr.match(/T(\d{2}:\d{2})/);
        return timeMatch ? timeMatch[1] : "-";
    };

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="flex h-full flex-col font-sans">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-emerald-400 tracking-tight">Gestión de Turnos</h1>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white transition-all hover:bg-emerald-500 shadow-lg shadow-emerald-900/20"
                        >
                            <Plus className="h-5 w-5" />
                            Nuevo Turno
                        </button>
                    </div>

                    {/* Tabla de Turnos */}
                    <div className="flex-1 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-sm backdrop-blur-sm">
                        <div className="overflow-x-auto h-full">
                            <table className="w-full text-left text-sm text-zinc-300">
                                <thead className="bg-zinc-800/80 text-xs font-semibold uppercase text-zinc-400 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Nombre</th>
                                        <th className="px-6 py-4">Hora Inicio</th>
                                        <th className="px-6 py-4">Hora Fin</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-zinc-500">
                                                <div className="flex justify-center">
                                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : shifts.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-zinc-500">
                                                No hay turnos registrados.
                                            </td>
                                        </tr>
                                    ) : (
                                        shifts.map((shift) => (
                                            <tr key={shift.id} className="transition-colors hover:bg-zinc-800/50">
                                                <td className="px-6 py-4 font-mono text-zinc-500">#{shift.id}</td>
                                                <td className="px-6 py-4 font-medium text-zinc-100">{shift.name}</td>
                                                <td className="px-6 py-4 font-mono tracking-wider font-semibold text-emerald-400">
                                                    {formatTimeStr(shift.startTime)}
                                                </td>
                                                <td className="px-6 py-4 font-mono tracking-wider font-semibold text-emerald-400">
                                                    {formatTimeStr(shift.endTime)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Modal de Creación */}
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
                            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                                <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                                    <h2 className="text-xl font-bold text-white">Nuevo Turno</h2>
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            reset();
                                        }}
                                        className="rounded-full p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="p-6 overflow-y-auto">
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase text-zinc-400">Nombre del Turno</label>
                                            <input
                                                type="text"
                                                {...register("name")}
                                                className={`w-full rounded-lg border bg-zinc-950 py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${errors.name ? "border-red-500" : "border-zinc-800"}`}
                                                placeholder="Ej: Turno Mañana"
                                            />
                                            {errors.name && <p className="text-xs text-red-500 font-semibold">{errors.name.message}</p>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase text-zinc-400">Hora de Inicio</label>
                                                <input
                                                    type="time"
                                                    {...register("startTime")}
                                                    className={`w-full rounded-lg border bg-zinc-950 py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 [color-scheme:dark] ${errors.startTime ? "border-red-500" : "border-zinc-800"}`}
                                                />
                                                {errors.startTime && <p className="text-xs text-red-500 font-semibold">{errors.startTime.message}</p>}
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase text-zinc-400">Hora de Fin</label>
                                                <input
                                                    type="time"
                                                    {...register("endTime")}
                                                    className={`w-full rounded-lg border bg-zinc-950 py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 [color-scheme:dark] ${errors.endTime ? "border-red-500" : "border-zinc-800"}`}
                                                />
                                                {errors.endTime && <p className="text-xs text-red-500 font-semibold">{errors.endTime.message}</p>}
                                            </div>
                                        </div>

                                        {submitError && (
                                            <div className="rounded-lg bg-red-500/10 p-3 text-center text-sm font-semibold text-red-500 border border-red-500/20">
                                                {submitError}
                                            </div>
                                        )}

                                        <div className="pt-4 flex gap-3 border-t border-zinc-800 mt-6">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsModalOpen(false);
                                                    reset();
                                                }}
                                                className="flex-1 rounded-lg bg-zinc-800 px-4 py-2.5 font-bold text-zinc-300 transition-all hover:bg-zinc-700"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 font-bold text-white transition-all hover:bg-emerald-500 disabled:opacity-50"
                                            >
                                                {isSubmitting ? "Guardando..." : "Guardar Turno"}
                                            </button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
