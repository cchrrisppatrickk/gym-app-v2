"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { membershipsService } from "@/services/memberships.service";
import { usersService } from "@/services/users.service";
import { catalogService } from "@/services/catalog.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreditCard, Plus, X, AlertCircle, Banknote } from "lucide-react";

const membershipSchema = z.object({
    userId: z.number().min(1, "Selecciona un socio"),
    planId: z.number().min(1, "Selecciona un plan"),
    shiftId: z.number().min(1, "Selecciona un turno"),
});

const paymentSchema = z.object({
    amount: z.number().min(0.1, "El monto debe ser mayor a 0"),
    paymentMethod: z.string().min(1, "Selecciona un método de pago"),
});

type MembershipFormValues = z.infer<typeof membershipSchema>;
type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function Membresias() {
    const [memberships, setMemberships] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [plans, setPlans] = useState<any[]>([]);
    const [shifts, setShifts] = useState<any[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(false);
    const [serverError, setServerError] = useState("");

    // Payment State
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedMembership, setSelectedMembership] = useState<any>(null);
    const [paymentError, setPaymentError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<MembershipFormValues>({
        resolver: zodResolver(membershipSchema),
        defaultValues: {
            userId: 0,
            planId: 0,
            shiftId: 0,
        },
    });

    const {
        register: registerPayment,
        handleSubmit: handleSubmitPayment,
        reset: resetPayment,
        formState: { errors: paymentErrors, isSubmitting: isPaying }
    } = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            amount: 0,
            paymentMethod: "CASH",
        }
    });

    const fetchMemberships = async () => {
        setIsLoading(true);
        try {
            const data = await membershipsService.getAll();
            setMemberships(data);
        } catch (error) {
            console.error("Error fetching memberships:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMemberships();
    }, []);

    useEffect(() => {
        if (isModalOpen && users.length === 0) {
            const fetchCatalogs = async () => {
                setIsLoadingCatalogs(true);
                try {
                    const [u, p, s] = await Promise.all([
                        usersService.getUsers(),
                        catalogService.getPlans(),
                        catalogService.getShifts(),
                    ]);
                    setUsers(u);
                    setPlans(p);
                    setShifts(s);
                } catch (error) {
                    console.error("Error fetching catalogs:", error);
                } finally {
                    setIsLoadingCatalogs(false);
                }
            };
            fetchCatalogs();
        }
    }, [isModalOpen, users.length]);

    const onSubmit = async (values: MembershipFormValues) => {
        setServerError("");
        try {
            const formattedData = {
                userId: Number(values.userId),
                planId: Number(values.planId),
                shiftId: Number(values.shiftId),
            };

            await membershipsService.create(formattedData);
            setIsModalOpen(false);
            reset();
            await fetchMemberships();
        } catch (error: any) {
            console.error("Error creating membership:", error);
            setServerError(error.response?.data?.message || "Ocurrió un error al crear la membresía.");
        }
    };

    const handleOpenPayment = (mem: any) => {
        setSelectedMembership(mem);
        setPaymentError("");
        resetPayment({
            amount: parseFloat(mem.pendingBalance),
            paymentMethod: "CASH"
        });
        setIsPaymentModalOpen(true);
    };

    const onPaymentSubmit = async (values: PaymentFormValues) => {
        setPaymentError("");
        if (!selectedMembership) return;

        try {
            await membershipsService.payDebt(selectedMembership.id, {
                amount: Number(values.amount),
                paymentMethod: values.paymentMethod
            });
            setIsPaymentModalOpen(false);
            setSelectedMembership(null);
            resetPayment();
            await fetchMemberships();
        } catch (error: any) {
            console.error("Error paying debt:", error);
            setPaymentError(error.response?.data?.message || "Ocurrió un error al registrar el pago.");
        }
    };

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="flex h-full flex-col font-sans">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <h1 className="text-3xl font-bold text-emerald-400 tracking-tight flex items-center gap-3">
                            <CreditCard className="h-8 w-8 text-emerald-500" />
                            Gestor de Membresías
                        </h1>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-500"
                        >
                            <Plus className="h-4 w-4" /> Nueva Membresía
                        </button>
                    </div>

                    <div className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-xl backdrop-blur-sm overflow-hidden flex flex-col">
                        {isLoading ? (
                            <div className="flex flex-1 items-center justify-center">
                                <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-zinc-400">
                                    <thead className="bg-zinc-950/50 text-xs uppercase text-zinc-500">
                                        <tr>
                                            <th className="px-6 py-4 font-bold tracking-wider">ID</th>
                                            <th className="px-6 py-4 font-bold tracking-wider">Socio</th>
                                            <th className="px-6 py-4 font-bold tracking-wider">Plan</th>
                                            <th className="px-6 py-4 font-bold tracking-wider">Fin</th>
                                            <th className="px-6 py-4 font-bold tracking-wider">Estado</th>
                                            <th className="px-6 py-4 font-bold tracking-wider text-right">Deuda</th>
                                            <th className="px-6 py-4 font-bold tracking-wider text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800/50">
                                        {memberships.map((mem) => {
                                            const debt = parseFloat(mem.pendingBalance);
                                            return (
                                                <tr key={mem.id} className="transition-colors hover:bg-zinc-800/20">
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-emerald-500">
                                                        #{mem.id}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 font-bold text-white">
                                                        {mem.user?.fullName || "Desconocido"}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-white">
                                                        {mem.plan?.name || "Plan Eliminado"}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-zinc-300">
                                                        {new Date(mem.endDate).toLocaleDateString()}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${mem.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                            {mem.status}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-right font-bold">
                                                        {debt > 0 ? (
                                                            <span className="text-red-400">S/ {debt.toFixed(2)}</span>
                                                        ) : (
                                                            <span className="text-emerald-400">S/ 0.00</span>
                                                        )}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-center">
                                                        {debt > 0 && mem.status === 'ACTIVE' && (
                                                            <button
                                                                onClick={() => handleOpenPayment(mem)}
                                                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-500 transition-colors hover:bg-emerald-500 hover:text-white border border-emerald-500/20"
                                                            >
                                                                <Banknote className="h-3.5 w-3.5" />
                                                                Cobrar
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {memberships.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                                                    No hay membresías registradas actualmente.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal de Nueva Membresía */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                        <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">

                            <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-4">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-emerald-500" />
                                    Nueva Membresía
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {isLoadingCatalogs ? (
                                <div className="flex items-center justify-center py-10">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase text-zinc-400">Socio</label>
                                        <select
                                            {...register("userId", { valueAsNumber: true })}
                                            className={`w-full rounded-lg border bg-zinc-900 py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none ${errors.userId ? 'border-red-500' : 'border-zinc-800'}`}
                                        >
                                            <option value={0} disabled>Selecciona un socio...</option>
                                            {users.map(u => (
                                                <option key={u.id} value={u.id}>{u.fullName} - {u.dni}</option>
                                            ))}
                                        </select>
                                        {errors.userId && <p className="text-xs text-red-500 font-semibold">{errors.userId.message}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase text-zinc-400">Plan de Entrenamiento</label>
                                        <select
                                            {...register("planId", { valueAsNumber: true })}
                                            className={`w-full rounded-lg border bg-zinc-900 py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none ${errors.planId ? 'border-red-500' : 'border-zinc-800'}`}
                                        >
                                            <option value={0} disabled>Selecciona un plan...</option>
                                            {plans.map(p => (
                                                <option key={p.id} value={p.id}>{p.name} - S/ {parseFloat(p.price).toFixed(2)}</option>
                                            ))}
                                        </select>
                                        {errors.planId && <p className="text-xs text-red-500 font-semibold">{errors.planId.message}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase text-zinc-400">Turno</label>
                                        <select
                                            {...register("shiftId", { valueAsNumber: true })}
                                            className={`w-full rounded-lg border bg-zinc-900 py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none ${errors.shiftId ? 'border-red-500' : 'border-zinc-800'}`}
                                        >
                                            <option value={0} disabled>Selecciona un turno...</option>
                                            {shifts.map(s => {
                                                const start = new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                                const end = new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                                return (
                                                    <option key={s.id} value={s.id}>{s.name} ({start} - {end})</option>
                                                );
                                            })}
                                        </select>
                                        {errors.shiftId && <p className="text-xs text-red-500 font-semibold">{errors.shiftId.message}</p>}
                                    </div>

                                    <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                                        <div className="flex gap-3">
                                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                                            <p className="text-sm font-medium text-amber-500/90 leading-relaxed">
                                                Nota: Al crear la membresía, el valor total del plan se registrará como <strong className="text-amber-500 font-extrabold">Deuda Pendiente</strong>. Los pagos de mensualidades se deben registrar en el módulo de Recepción/Caja.
                                            </p>
                                        </div>
                                    </div>

                                    {serverError && (
                                        <div className="rounded-lg bg-red-500/10 p-3 text-center text-sm font-semibold text-red-500 border border-red-500/20">
                                            {serverError}
                                        </div>
                                    )}

                                    <div className="pt-4 mt-2 border-t border-zinc-800">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full rounded-xl bg-emerald-600 py-3.5 font-bold uppercase tracking-wider text-white transition-all hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none"
                                        >
                                            {isSubmitting ? "Creando Membresía..." : "Crear Membresía"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}

                {/* Modal de Cobro */}
                {isPaymentModalOpen && selectedMembership && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsPaymentModalOpen(false)} />
                        <div className="relative w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">

                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Banknote className="h-5 w-5 text-emerald-500" />
                                    Registrar Abono
                                </h3>
                                <button
                                    onClick={() => setIsPaymentModalOpen(false)}
                                    className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <p className="text-zinc-400 mb-6 text-sm border-b border-zinc-800 pb-4">
                                Deuda Actual: <strong className="text-red-400">S/ {parseFloat(selectedMembership.pendingBalance).toFixed(2)}</strong>
                            </p>

                            <form onSubmit={handleSubmitPayment(onPaymentSubmit)} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase text-zinc-400">Monto a Cobrar (S/)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        max={parseFloat(selectedMembership.pendingBalance)}
                                        {...registerPayment("amount", { valueAsNumber: true })}
                                        className={`w-full rounded-lg border bg-zinc-900 py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${paymentErrors.amount ? 'border-red-500' : 'border-zinc-800'}`}
                                    />
                                    {paymentErrors.amount && <p className="text-xs text-red-500 font-semibold">{paymentErrors.amount.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase text-zinc-400">Método de Pago</label>
                                    <select
                                        {...registerPayment("paymentMethod")}
                                        className={`w-full rounded-lg border bg-zinc-900 py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none ${paymentErrors.paymentMethod ? 'border-red-500' : 'border-zinc-800'}`}
                                    >
                                        <option value="CASH">Efectivo</option>
                                        <option value="CARD">Tarjeta de Crédito/Débito</option>
                                        <option value="TRANSFER">Transferencia / Yape / Plin</option>
                                    </select>
                                    {paymentErrors.paymentMethod && <p className="text-xs text-red-500 font-semibold">{paymentErrors.paymentMethod.message}</p>}
                                </div>

                                {paymentError && (
                                    <div className="rounded-lg bg-red-500/10 p-3 text-center text-sm font-semibold text-red-500 border border-red-500/20">
                                        {paymentError}
                                    </div>
                                )}

                                <div className="pt-4 mt-2">
                                    <button
                                        type="submit"
                                        disabled={isPaying}
                                        className="w-full rounded-xl bg-emerald-600 py-3 font-bold uppercase tracking-wider text-white transition-all hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                        {isPaying ? "Procesando..." : "Cobrar"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </DashboardLayout>
        </ProtectedRoute>
    );
}
