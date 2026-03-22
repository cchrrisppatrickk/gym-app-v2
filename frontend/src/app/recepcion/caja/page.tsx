"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { cashRegisterService } from "@/services/cashRegister.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LockOpen, DollarSign } from "lucide-react";

// Esquema de validación para apertura
const openBoxSchema = z.object({
    openingAmount: z.number({ invalid_type_error: "Debe ser un número" }).min(0, "El monto debe ser mínimo 0"),
});

type OpenBoxValues = z.infer<typeof openBoxSchema>;

export default function RecepcionCaja() {
    const [box, setBox] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [openError, setOpenError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<OpenBoxValues>({
        resolver: zodResolver(openBoxSchema),
        defaultValues: {
            openingAmount: 0,
        },
    });

    const fetchBox = async () => {
        setIsLoading(true);
        const data = await cashRegisterService.getCurrent();
        setBox(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchBox();
    }, []);

    const onOpenBox = async (values: OpenBoxValues) => {
        setOpenError("");
        try {
            await cashRegisterService.open(values.openingAmount);
            await fetchBox(); // Recargar el estado de la caja
        } catch (error) {
            setOpenError("Error al intentar abrir la caja.");
            console.error(error);
        }
    };

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="flex h-full flex-col font-sans">
                    <h1 className="text-3xl font-bold text-emerald-400 mb-6 tracking-tight">Recepción y Caja</h1>

                    {isLoading ? (
                        <div className="flex flex-1 items-center justify-center">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
                        </div>
                    ) : box ? (
                        // CAJA ABIERTA
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
                            <h2 className="text-2xl text-emerald-400">✅ Caja Abierta. (El Dashboard se construirá en la siguiente fase)</h2>
                        </div>
                    ) : (
                        // CAJA CERRADA - MODAL DE APERTURA BLOQUEANTE
                        <div className="flex flex-1 items-center justify-center">
                            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
                                <div className="flex flex-col items-center mb-6">
                                    <div className="rounded-full bg-emerald-500/20 p-4 mb-4">
                                        <LockOpen className="h-8 w-8 text-emerald-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white text-center">Apertura de Caja Requerida</h2>
                                    <p className="text-sm text-zinc-400 mt-2 text-center">
                                        Ingresa el monto base en efectivo para iniciar tu turno de atención.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit(onOpenBox)} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300">
                                            Monto Base en Efectivo
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <DollarSign className="h-5 w-5 text-zinc-500" />
                                            </div>
                                            <input
                                                type="number"
                                                step="0.01"
                                                {...register("openingAmount", { valueAsNumber: true })}
                                                className={`w-full rounded-lg border bg-zinc-800 py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${errors.openingAmount ? "border-red-500" : "border-zinc-700"
                                                    }`}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        {errors.openingAmount && (
                                            <p className="text-xs text-red-500 font-semibold">{errors.openingAmount.message}</p>
                                        )}
                                    </div>

                                    {openError && (
                                        <div className="rounded-lg bg-red-500/10 p-3 text-center text-sm font-semibold text-red-500 border border-red-500/20">
                                            {openError}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-bold text-white transition-all hover:bg-emerald-500 focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Abriendo..." : "Abrir Caja"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
