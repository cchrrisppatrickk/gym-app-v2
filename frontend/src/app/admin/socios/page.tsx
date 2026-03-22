"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { usersService } from "@/services/users.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Users, Plus, X, User, QrCode } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';

const userSchema = z.object({
    firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    dni: z.string().min(5, "Documento de identidad requerido"),
    email: z.string().email("Debe ser un correo electrónico válido"),
    phone: z.string().min(6, "Número de teléfono requerido"),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function Socios() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [serverError, setServerError] = useState("");
    const [qrModalUser, setQrModalUser] = useState<any>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            dni: "",
            email: "",
            phone: "",
        },
    });

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await usersService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const onSubmit = async (values: UserFormValues) => {
        setServerError("");
        try {
            const formattedData = {
                fullName: `${values.firstName} ${values.lastName}`,
                dni: values.dni,
                email: values.email,
                phone: values.phone,
                roleId: 3,
                password: "password_generico_cambiar" // Default password
            };

            await usersService.createUser(formattedData);
            setIsModalOpen(false);
            reset();
            await fetchUsers();
            alert("Socio registrado con éxito.");
        } catch (error: any) {
            console.error("Error registrando socio:", error);
            setServerError(error.response?.data?.message || "Ocurrió un error inesperado al registrar el socio.");
        }
    };

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="flex h-full flex-col font-sans">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <h1 className="text-3xl font-bold text-emerald-400 tracking-tight flex items-center gap-3">
                            <Users className="h-8 w-8 text-emerald-500" />
                            Directorio de Socios
                        </h1>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-500"
                        >
                            <Plus className="h-4 w-4" /> Registrar Socio
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
                                            <th className="px-6 py-4 font-bold tracking-wider">DNI</th>
                                            <th className="px-6 py-4 font-bold tracking-wider">Nombre Completo</th>
                                            <th className="px-6 py-4 font-bold tracking-wider">Teléfono</th>
                                            <th className="px-6 py-4 font-bold tracking-wider">Email</th>
                                            <th className="px-6 py-4 font-bold tracking-wider text-right">Estado</th>
                                            <th className="px-6 py-4 font-bold tracking-wider text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800/50">
                                        {users.map((user) => (
                                            <tr key={user.id} className="transition-colors hover:bg-zinc-800/20">
                                                <td className="whitespace-nowrap px-6 py-4 font-medium text-emerald-500">
                                                    #{user.id}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-white">
                                                    {user.dni || "-"}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 font-bold text-white">
                                                    {user.fullName}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-zinc-300">
                                                    {user.phone || "-"}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-zinc-300">
                                                    {user.email || "-"}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${user.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                        {user.isActive ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => setQrModalUser(user)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-500 transition-colors hover:bg-emerald-500 hover:text-white border border-emerald-500/20"
                                                    >
                                                        <QrCode className="h-4 w-4" />
                                                        Ver QR
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {users.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                                                    No hay socios registrados en el sistema.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal de Registro */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                        <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">

                            <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-4">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <User className="h-5 w-5 text-emerald-500" />
                                    Nuevo Socio
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase text-zinc-400">Nombre</label>
                                        <input
                                            type="text"
                                            {...register("firstName")}
                                            className={`w-full rounded-lg border bg-zinc-900 py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${errors.firstName ? 'border-red-500' : 'border-zinc-800'}`}
                                        />
                                        {errors.firstName && <p className="text-xs text-red-500 font-semibold">{errors.firstName.message}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase text-zinc-400">Apellido</label>
                                        <input
                                            type="text"
                                            {...register("lastName")}
                                            className={`w-full rounded-lg border bg-zinc-900 py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${errors.lastName ? 'border-red-500' : 'border-zinc-800'}`}
                                        />
                                        {errors.lastName && <p className="text-xs text-red-500 font-semibold">{errors.lastName.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase text-zinc-400">DNI / Documento</label>
                                    <input
                                        type="text"
                                        {...register("dni")}
                                        className={`w-full rounded-lg border bg-zinc-900 py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${errors.dni ? 'border-red-500' : 'border-zinc-800'}`}
                                    />
                                    {errors.dni && <p className="text-xs text-red-500 font-semibold">{errors.dni.message}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 md:col-span-1 space-y-1.5">
                                        <label className="text-xs font-bold uppercase text-zinc-400">Teléfono</label>
                                        <input
                                            type="text"
                                            {...register("phone")}
                                            className={`w-full rounded-lg border bg-zinc-900 py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${errors.phone ? 'border-red-500' : 'border-zinc-800'}`}
                                        />
                                        {errors.phone && <p className="text-xs text-red-500 font-semibold">{errors.phone.message}</p>}
                                    </div>
                                    <div className="col-span-2 md:col-span-1 space-y-1.5">
                                        <label className="text-xs font-bold uppercase text-zinc-400">Email</label>
                                        <input
                                            type="email"
                                            {...register("email")}
                                            className={`w-full rounded-lg border bg-zinc-900 py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${errors.email ? 'border-red-500' : 'border-zinc-800'}`}
                                        />
                                        {errors.email && <p className="text-xs text-red-500 font-semibold">{errors.email.message}</p>}
                                    </div>
                                </div>

                                {serverError && (
                                    <div className="rounded-lg bg-red-500/10 p-3 text-center text-sm font-semibold text-red-500 border border-red-500/20">
                                        {serverError}
                                    </div>
                                )}

                                <div className="pt-4 mt-6 border-t border-zinc-800">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full rounded-xl bg-emerald-600 py-3.5 font-bold uppercase tracking-wider text-white transition-all hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                        {isSubmitting ? "Guardando..." : "Guardar Socio"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal de Código QR */}
                {qrModalUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setQrModalUser(null)} />
                        <div className="relative w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl text-center">

                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <QrCode className="h-5 w-5 text-emerald-500" />
                                    Código de Acceso
                                </h3>
                                <button
                                    onClick={() => setQrModalUser(null)}
                                    className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <p className="text-lg font-medium text-white mb-6">
                                {qrModalUser.fullName}
                            </p>

                            <div className="bg-white p-4 rounded-xl inline-block mx-auto mb-6">
                                <QRCodeSVG value={String(qrModalUser.id)} size={256} />
                            </div>

                            <p className="text-sm font-medium text-zinc-400">
                                Escanea este código en el Torniquete
                            </p>
                        </div>
                    </div>
                )}

            </DashboardLayout>
        </ProtectedRoute>
    );
}
