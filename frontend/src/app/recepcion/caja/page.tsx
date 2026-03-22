"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { cashRegisterService } from "@/services/cashRegister.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LockOpen, DollarSign, LogOut } from "lucide-react";

// Esquema de validación para apertura
const openBoxSchema = z.object({
    openingAmount: z.number({ invalid_type_error: "Debe ser un número" }).min(0, "El monto debe ser mínimo 0"),
});

type OpenBoxValues = z.infer<typeof openBoxSchema>;

// Esquema de validación para cierre
const closeBoxSchema = z.object({
    closingAmountReal: z.number({ invalid_type_error: "Debe ser un número" }).min(0, "El monto debe ser mínimo 0"),
});

type CloseBoxValues = z.infer<typeof closeBoxSchema>;

export default function RecepcionCaja() {
    const [box, setBox] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [openError, setOpenError] = useState("");
    const [isClosingMode, setIsClosingMode] = useState(false);
    const [closeError, setCloseError] = useState("");

    const {
        register: registerOpen,
        handleSubmit: handleSubmitOpen,
        formState: { errors: errorsOpen, isSubmitting: isSubmittingOpen },
    } = useForm<OpenBoxValues>({
        resolver: zodResolver(openBoxSchema),
        defaultValues: { openingAmount: 0 },
    });

    const {
        register: registerClose,
        handleSubmit: handleSubmitClose,
        formState: { errors: errorsClose, isSubmitting: isSubmittingClose },
        reset: resetClose,
    } = useForm<CloseBoxValues>({
        resolver: zodResolver(closeBoxSchema),
        defaultValues: { closingAmountReal: 0 },
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
            await fetchBox();
        } catch (error) {
            setOpenError("Error al intentar abrir la caja.");
            console.error(error);
        }
    };

    const handleCloseBox = async (values: CloseBoxValues) => {
        setCloseError("");
        try {
            await cashRegisterService.close(values.closingAmountReal);
            setIsClosingMode(false);
            resetClose();
            await fetchBox();
        } catch (error) {
            setCloseError("Error al intentar cerrar la caja.");
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
                        // CAJA ABIERTA - DASHBOARD
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-zinc-100">Resumen de Caja Actual</h2>
                                <button
                                    onClick={() => setIsClosingMode(true)}
                                    className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-bold text-white transition-all hover:bg-red-500 shadow-lg shadow-red-900/20"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Cerrar Turno (Cuadrar Caja)
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
                                    <p className="text-sm font-medium text-zinc-400 mb-2">Estado</p>
                                    <span className="inline-flex items-center rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-400">
                                        Operativa
                                    </span>
                                </div>

                                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
                                    <p className="text-sm font-medium text-zinc-400 mb-2">Monto Inicial</p>
                                    <p className="text-2xl font-bold text-white">S/ {parseFloat(box.openingAmount).toFixed(2)}</p>
                                </div>

                                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
                                    <p className="text-sm font-medium text-zinc-400 mb-2">Hora de Apertura</p>
                                    <p className="text-2xl font-bold text-white">
                                        {new Date(box.openingDate).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>

                            {/* MODAL DE CIERRE (Superpuesto) */}
                            {isClosingMode && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
                                    <div className="w-full max-w-md rounded-2xl border border-red-900/50 bg-zinc-900 p-8 shadow-2xl">
                                        <div className="flex flex-col items-center mb-6">
                                            <div className="rounded-full bg-red-500/20 p-4 mb-4">
                                                <LogOut className="h-8 w-8 text-red-500" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-white text-center">Cierre de Caja</h2>
                                            <p className="text-sm text-zinc-400 mt-2 text-center">
                                                Ingresa el dinero total en efectivo que tienes físicamente en la gaveta en este momento.
                                            </p>
                                        </div>

                                        <form onSubmit={handleSubmitClose(handleCloseBox)} className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-zinc-300">
                                                    Efectivo Físico
                                                </label>
                                                <div className="relative">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <DollarSign className="h-5 w-5 text-zinc-500" />
                                                    </div>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        {...registerClose("closingAmountReal", { valueAsNumber: true })}
                                                        className={`w-full rounded-lg border bg-zinc-800 py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 ${errorsClose.closingAmountReal ? "border-red-500" : "border-zinc-700"
                                                            }`}
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                {errorsClose.closingAmountReal && (
                                                    <p className="text-xs text-red-500 font-semibold">{errorsClose.closingAmountReal.message}</p>
                                                )}
                                            </div>

                                            {closeError && (
                                                <div className="rounded-lg bg-red-500/10 p-3 text-center text-sm font-semibold text-red-500 border border-red-500/20">
                                                    {closeError}
                                                </div>
                                            )}

                                            <div className="flex gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsClosingMode(false)}
                                                    disabled={isSubmittingClose}
                                                    className="w-full rounded-lg border border-zinc-700 bg-transparent px-4 py-3 font-bold text-zinc-300 transition-all hover:bg-zinc-800 disabled:opacity-50"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isSubmittingClose}
                                                    className="w-full rounded-lg bg-red-600 px-4 py-3 font-bold text-white transition-all hover:bg-red-500 focus:ring-2 focus:ring-red-500/50 disabled:opacity-50"
                                                >
                                                    {isSubmittingClose ? "Validando..." : "Confirmar Cierre"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
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

                                <form onSubmit={handleSubmitOpen(onOpenBox)} className="space-y-6">
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
                                                {...registerOpen("openingAmount", { valueAsNumber: true })}
                                                className={`w-full rounded-lg border bg-zinc-800 py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${errorsOpen.openingAmount ? "border-red-500" : "border-zinc-700"
                                                    }`}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        {errorsOpen.openingAmount && (
                                            <p className="text-xs text-red-500 font-semibold">{errorsOpen.openingAmount.message}</p>
                                        )}
                                    </div>

                                    {openError && (
                                        <div className="rounded-lg bg-red-500/10 p-3 text-center text-sm font-semibold text-red-500 border border-red-500/20">
                                            {openError}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmittingOpen}
                                        className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-bold text-white transition-all hover:bg-emerald-500 focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50"
                                    >
                                        {isSubmittingOpen ? "Abriendo..." : "Abrir Caja"}
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
