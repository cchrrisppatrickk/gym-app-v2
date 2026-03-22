"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { catalogService } from "@/services/catalog.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, X } from "lucide-react";

// Esquema Zod: name (min 2), description (opcional), durationDays (min 1), price (min 0), y allowsFreeze (boolean).
const planSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    description: z.string().optional(),
    durationDays: z.number().min(1, "La duración mínima es de 1 día").int("Debe ser en días enteros"),
    price: z.number().min(0, "El precio no puede ser negativo"),
    allowsFreeze: z.boolean(),
});

type PlanFormValues = z.infer<typeof planSchema>;

export default function GestionPlanes() {
    const [plans, setPlans] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<PlanFormValues>({
        resolver: zodResolver(planSchema),
        defaultValues: { name: "", description: "", durationDays: 30, price: 0, allowsFreeze: false },
    });

    const fetchPlans = async () => {
        setIsLoading(true);
        try {
            const data = await catalogService.getPlans();
            setPlans(data);
        } catch (error) {
            console.error("Error fetching plans:", error);
            setPlans([]); // Fallback
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const onSubmit = async (values: PlanFormValues) => {
        setSubmitError("");
        try {
            await catalogService.createPlan(values);
            setIsModalOpen(false);
            reset();
            await fetchPlans();
        } catch (error: any) {
            console.error("Error creating plan:", error);
            setSubmitError(error?.response?.data?.message || "Ocurrió un error al crear el plan.");
        }
    };

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="flex h-full flex-col font-sans">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-emerald-400 tracking-tight">Gestión de Planes</h1>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white transition-all hover:bg-emerald-500 shadow-lg shadow-emerald-900/20"
                        >
                            <Plus className="h-5 w-5" />
                            Nuevo Plan
                        </button>
                    </div>

                    {/* Tabla de Planes */}
                    <div className="flex-1 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-sm backdrop-blur-sm">
                        <div className="overflow-x-auto h-full">
                            <table className="w-full text-left text-sm text-zinc-300">
                                <thead className="bg-zinc-800/80 text-xs font-semibold uppercase text-zinc-400 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Nombre</th>
                                        <th className="px-6 py-4">Duración (Días)</th>
                                        <th className="px-6 py-4">Precio</th>
                                        <th className="px-6 py-4">Permite Congelar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-zinc-500">
                                                <div className="flex justify-center">
                                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : plans.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-zinc-500">
                                                No hay planes de membresía registrados.
                                            </td>
                                        </tr>
                                    ) : (
                                        plans.map((plan) => (
                                            <tr key={plan.id} className="transition-colors hover:bg-zinc-800/50">
                                                <td className="px-6 py-4 font-mono text-zinc-500">#{plan.id}</td>
                                                <td className="px-6 py-4 font-medium text-zinc-100">{plan.name}</td>
                                                <td className="px-6 py-4">{plan.durationDays}</td>
                                                <td className="px-6 py-4 font-semibold text-emerald-400">
                                                    S/ {parseFloat(plan.price).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {plan.allowsFreeze ? (
                                                        <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                                                            Sí
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex rounded-full bg-red-500/10 px-2 py-1 text-xs font-medium text-red-500">
                                                            No
                                                        </span>
                                                    )}
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
                                    <h2 className="text-xl font-bold text-white">Nuevo Plan de Membresía</h2>
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
                                            <label className="text-xs font-bold uppercase text-zinc-400">Nombre del Plan</label>
                                            <input
                                                type="text"
                                                {...register("name")}
                                                className={`w-full rounded-lg border bg-zinc-950 py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${errors.name ? "border-red-500" : "border-zinc-800"}`}
                                                placeholder="Ej: Plan Anual VIP"
                                            />
                                            {errors.name && <p className="text-xs text-red-500 font-semibold">{errors.name.message}</p>}
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase text-zinc-400">Descripción (Opcional)</label>
                                            <textarea
                                                {...register("description")}
                                                className="w-full rounded-lg border bg-zinc-950 py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border-zinc-800"
                                                placeholder="Detalles del plan..."
                                                rows={2}
                                            />
                                            {errors.description && <p className="text-xs text-red-500 font-semibold">{errors.description.message}</p>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase text-zinc-400">Duración (Días)</label>
                                                <input
                                                    type="number"
                                                    {...register("durationDays", { valueAsNumber: true })}
                                                    className={`w-full rounded-lg border bg-zinc-950 py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${errors.durationDays ? "border-red-500" : "border-zinc-800"}`}
                                                    placeholder="30"
                                                />
                                                {errors.durationDays && <p className="text-xs text-red-500 font-semibold">{errors.durationDays.message}</p>}
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase text-zinc-400">Precio (S/)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    {...register("price", { valueAsNumber: true })}
                                                    className={`w-full rounded-lg border bg-zinc-950 py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${errors.price ? "border-red-500" : "border-zinc-800"}`}
                                                    placeholder="0.00"
                                                />
                                                {errors.price && <p className="text-xs text-red-500 font-semibold">{errors.price.message}</p>}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 bg-zinc-800/30 p-3 rounded-lg border border-zinc-800">
                                            <input
                                                type="checkbox"
                                                {...register("allowsFreeze")}
                                                id="allowsFreeze"
                                                className="h-5 w-5 rounded border-zinc-700 bg-zinc-950 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900"
                                            />
                                            <label htmlFor="allowsFreeze" className="text-sm font-medium text-zinc-300 cursor-pointer flex-1">
                                                Permitir congelamiento (Freeze)
                                            </label>
                                        </div>
                                        {errors.allowsFreeze && <p className="text-xs text-red-500 font-semibold">{errors.allowsFreeze.message}</p>}

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
                                                {isSubmitting ? "Guardando..." : "Guardar Plan"}
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
