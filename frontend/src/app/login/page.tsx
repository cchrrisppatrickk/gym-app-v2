"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/lib/validations";
import { User, Lock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        setServerError("");
        try {
            const token = await authService.login(values.email, values.password);
            if (token) {
                const decoded = jwtDecode<{ roleId: number }>(token);

                // Redirección basada en roles
                if (decoded.roleId === 1) {
                    router.push("/admin/dashboard");
                } else if (decoded.roleId === 2) {
                    router.push("/recepcion/caja");
                } else if (decoded.roleId === 3) {
                    router.push("/mi-perfil");
                } else {
                    router.push("/");
                }
            }
        } catch (error: any) {
            console.error("Login error:", error);
            setServerError("Credenciales incorrectas o error en el servidor.");
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-white">
            <div className="w-full max-w-md space-y-8">
                {/* Header/Title */}
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-emerald-500 sm:text-5xl">
                        Gym-X Control
                    </h1>
                    <p className="mt-2 text-zinc-400">
                        Ingresa tus credenciales para acceder al panel.
                    </p>
                </div>

                {/* Login Card */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="flex items-center gap-2 text-sm font-medium text-zinc-300"
                            >
                                <User size={16} className="text-emerald-500" />
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="admin@gymx.com"
                                    {...register("email")}
                                    className={`w-full rounded-lg border bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-all focus:ring-2 focus:ring-emerald-500/50 ${errors.email ? "border-red-500 focus:border-red-500" : "border-zinc-700 focus:border-emerald-500"
                                        }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs font-semibold text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="flex items-center gap-2 text-sm font-medium text-zinc-300"
                            >
                                <Lock size={16} className="text-emerald-500" />
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("password")}
                                    className={`w-full rounded-lg border bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-all focus:ring-2 focus:ring-emerald-500/50 ${errors.password ? "border-red-500 focus:border-red-500" : "border-zinc-700 focus:border-emerald-500"
                                        }`}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-xs font-semibold text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex items-center justify-end">
                            <button
                                type="button"
                                className="text-xs font-medium text-zinc-500 hover:text-emerald-400"
                            >
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>

                        {/* Server Error Message */}
                        {serverError && (
                            <div className="rounded-lg bg-red-500/10 p-3 text-center text-sm font-semibold text-red-500 border border-red-500/20">
                                {serverError}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                "Accediendo..."
                            ) : (
                                <>
                                    Iniciar Sesión
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer info */}
                <p className="text-center text-xs text-zinc-500">
                    Gym-X Control © 2026 | Sistema de Gestión de Gimnasios.
                </p>
            </div>
        </div>
    );
}
