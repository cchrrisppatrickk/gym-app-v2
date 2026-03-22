"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { catalogService } from "@/services/catalog.service";
import { membersService } from "@/services/members.service";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, CreditCard, ShieldCheck } from "lucide-react";

const newMemberSchema = z.object({
    firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    dni: z.string().min(5, "Documento de identidad requerido"),
    email: z.string().email("Debe ser un correo electrónico válido"),
    phone: z.string().min(6, "Número de teléfono requerido"),
    planId: z.number().min(1, "Debes seleccionar un plan"),
    shiftId: z.number().min(1, "Debes seleccionar un turno"),
    paymentAmount: z.number().min(0, "El monto no puede ser negativo"),
    paymentMethod: z.string().min(1, "Debes seleccionar un método de pago"),
});

type NewMemberFormValues = z.infer<typeof newMemberSchema>;

export default function NuevoSocio() {
    const [plans, setPlans] = useState<any[]>([]);
    const [shifts, setShifts] = useState<any[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<NewMemberFormValues>({
        resolver: zodResolver(newMemberSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            dni: "",
            email: "",
            phone: "",
            planId: 0,
            shiftId: 0,
            paymentAmount: 0,
            paymentMethod: "EFFECTIVE",
        },
    });

    // Watchers for Calculator
    const selectedPlanId = useWatch({ control, name: "planId" });
    const paymentAmountInput = useWatch({ control, name: "paymentAmount" });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingData(true);
            try {
                const [plansData, shiftsData] = await Promise.all([
                    catalogService.getPlans(),
                    catalogService.getShifts(),
                ]);
                setPlans(plansData);
                setShifts(shiftsData);
            } catch (error) {
                console.error("Error fetching catalogs:", error);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchData();
    }, []);

    // Calculator Logic
    const selectedPlan = plans.find((p) => p.id === Number(selectedPlanId));
    const totalPrice = selectedPlan ? parseFloat(selectedPlan.price) : 0;
    const paymentAmount = paymentAmountInput ? Number(paymentAmountInput) : 0;
    const pendingBalance = totalPrice - paymentAmount;

    const onSubmit = async (values: NewMemberFormValues) => {
        setServerError("");
        try {
            const formattedData = {
                ...values,
                planId: Number(values.planId),
                shiftId: Number(values.shiftId),
            };

            await membersService.registerNewMember(formattedData);

            alert('¡Socio registrado con éxito!');
            reset();
        } catch (error: any) {
            console.error("Error registrando socio:", error);
            setServerError(error.response?.data?.message || "Ocurrió un error inesperado al registrar el socio.");
        }
    };

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="flex h-full flex-col font-sans">

                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-emerald-400 tracking-tight flex items-center gap-3">
                            <User className="h-8 w-8 text-emerald-500" />
                            Inscribir Nuevo Socio
                        </h1>
                    </div>

                    {isLoadingData ? (
                        <div className="flex flex-1 items-center justify-center">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* Columna Izquierda: Datos Personales */}
                            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-xl backdrop-blur-sm h-fit">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-zinc-800 pb-3">
                                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                                    Datos Personales
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase text-zinc-400">Nombre</label>
                                        <input
                                            type="text"
                                            {...register("firstName")}
                                            className={`w-full rounded-lg border bg-zinc-950 py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors ${errors.firstName ? "border-red-500" : "border-zinc-800"}`}
                                            placeholder="Ej: Juan"
                                        />
                                        {errors.firstName && <p className="text-xs text-red-500 font-semibold">{errors.firstName.message}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase text-zinc-400">Apellido</label>
                                        <input
                                            type="text"
                                            {...register("lastName")}
                                            className={`w-full rounded-lg border bg-zinc-950 py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors ${errors.lastName ? "border-red-500" : "border-zinc-800"}`}
                                            placeholder="Ej: Pérez"
                                        />
                                        {errors.lastName && <p className="text-xs text-red-500 font-semibold">{errors.lastName.message}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase text-zinc-400">DNI / Documento</label>
                                        <input
                                            type="text"
                                            {...register("dni")}
                                            className={`w-full rounded-lg border bg-zinc-950 py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors ${errors.dni ? "border-red-500" : "border-zinc-800"}`}
                                            placeholder="Ej: 72839405"
                                        />
                                        {errors.dni && <p className="text-xs text-red-500 font-semibold">{errors.dni.message}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase text-zinc-400">Teléfono</label>
                                        <input
                                            type="text"
                                            {...register("phone")}
                                            className={`w-full rounded-lg border bg-zinc-950 py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors ${errors.phone ? "border-red-500" : "border-zinc-800"}`}
                                            placeholder="Ej: 987654321"
                                        />
                                        {errors.phone && <p className="text-xs text-red-500 font-semibold">{errors.phone.message}</p>}
                                    </div>

                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className="text-xs font-bold uppercase text-zinc-400">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            {...register("email")}
                                            className={`w-full rounded-lg border bg-zinc-950 py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors ${errors.email ? "border-red-500" : "border-zinc-800"}`}
                                            placeholder="Ej: juan.perez@email.com"
                                        />
                                        {errors.email && <p className="text-xs text-red-500 font-semibold">{errors.email.message}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Columna Derecha: Membresía y Caja */}
                            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-xl backdrop-blur-sm flex flex-col h-fit">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-zinc-800 pb-3">
                                    <CreditCard className="h-5 w-5 text-emerald-400" />
                                    Membresía y Caja
                                </h2>

                                <div className="space-y-5 flex-1">

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase text-zinc-400">Plan de Membresía</label>
                                        <select
                                            {...register("planId", { valueAsNumber: true })}
                                            className={`w-full rounded-lg border bg-zinc-950 py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none transition-colors ${errors.planId ? "border-red-500" : "border-zinc-800"}`}
                                        >
                                            <option value={0} disabled>Selecciona un plan...</option>
                                            {plans.map((p) => (
                                                <option key={p.id} value={p.id}>{p.name} - S/ {parseFloat(p.price).toFixed(2)}</option>
                                            ))}
                                        </select>
                                        {errors.planId && <p className="text-xs text-red-500 font-semibold">{errors.planId.message}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase text-zinc-400">Turno de Asistencia</label>
                                        <select
                                            {...register("shiftId", { valueAsNumber: true })}
                                            className={`w-full rounded-lg border bg-zinc-950 py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none transition-colors ${errors.shiftId ? "border-red-500" : "border-zinc-800"}`}
                                        >
                                            <option value={0} disabled>Selecciona el turno...</option>
                                            {shifts.map((s) => (
                                                <option key={s.id} value={s.id}>{s.name} ({new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</option>
                                            ))}
                                        </select>
                                        {errors.shiftId && <p className="text-xs text-red-500 font-semibold">{errors.shiftId.message}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold uppercase text-zinc-400">Abono Inicial (S/)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                {...register("paymentAmount", { valueAsNumber: true })}
                                                className={`w-full rounded-lg border bg-zinc-950 py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors ${errors.paymentAmount ? "border-red-500" : "border-zinc-800"}`}
                                                placeholder="0.00"
                                            />
                                            {errors.paymentAmount && <p className="text-xs text-red-500 font-semibold">{errors.paymentAmount.message}</p>}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold uppercase text-zinc-400">Método de Pago</label>
                                            <select
                                                {...register("paymentMethod")}
                                                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none transition-colors"
                                            >
                                                <option value="EFFECTIVE">Efectivo 💵</option>
                                                <option value="CARD">Tarjeta 💳</option>
                                                <option value="TRANSFER">Transf. / QR 📱</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Resumen y Calculadora en Vivo */}
                                    <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-5 shadow-inner">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-zinc-400 font-medium">Costo Total del Plan:</span>
                                            <span className="text-lg font-bold text-white">S/ {totalPrice.toFixed(2)}</span>
                                        </div>

                                        <div className="flex justify-between items-center pt-3 border-t border-zinc-800/80">
                                            <span className="text-base font-bold text-zinc-300">Estado de Cuenta:</span>
                                            {selectedPlanId ? (
                                                pendingBalance > 0 ? (
                                                    <span className="text-lg font-black text-red-500 animate-pulse">
                                                        Deuda: S/ {pendingBalance.toFixed(2)}
                                                    </span>
                                                ) : (
                                                    <span className="text-lg font-black text-emerald-400 flex items-center gap-1">
                                                        ✅ Pago Completo
                                                    </span>
                                                )
                                            ) : (
                                                <span className="text-sm text-zinc-500">- - -</span>
                                            )}
                                        </div>
                                    </div>

                                </div>

                                {serverError && (
                                    <div className="mt-4 rounded-lg bg-red-500/10 p-3 text-center text-sm font-semibold text-red-500 border border-red-500/20">
                                        {serverError}
                                    </div>
                                )}

                                <div className="pt-6 mt-6 border-t border-zinc-800/80">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 rounded-xl bg-emerald-600 font-black text-white uppercase tracking-wider transition-all hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-900/30 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                        {isSubmitting ? "Registrando..." : "Registrar y Cobrar"}
                                    </button>
                                </div>
                            </div>

                        </form>
                    )}

                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
