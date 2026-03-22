"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { catalogService } from "@/services/catalog.service";
import { salesService } from "@/services/sales.service";
import { Trash2, Plus, Minus, ShoppingCart, Ticket, X, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
}

interface CartItem {
    product: Product;
    quantity: number;
}

// Zod schema para Day Pass
const dayPassSchema = z.object({
    buyerName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    dni: z.string().optional(),
    price: z.number().min(0, "El precio no puede ser negativo"),
    paymentMethod: z.string().min(1, "Selecciona método de pago"),
});

type DayPassFormValues = z.infer<typeof dayPassSchema>;

export default function Kiosko() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState("EFFECTIVE");

    // Day Pass States
    const [isDayPassModalOpen, setIsDayPassModalOpen] = useState(false);
    const [qrCodeResult, setQrCodeResult] = useState("");
    const [dayPassError, setDayPassError] = useState("");

    const {
        register: registerDayPass,
        handleSubmit: handleDayPassSubmit,
        formState: { errors: dayPassErrors, isSubmitting: isSubmittingDayPass },
        reset: resetDayPass,
    } = useForm<DayPassFormValues>({
        resolver: zodResolver(dayPassSchema),
        defaultValues: { buyerName: "", dni: "", price: 20, paymentMethod: "EFFECTIVE" },
    });

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const data = await catalogService.getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const addToCart = (product: Product) => {
        if (product.stock <= 0) return;

        setCart((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) return prev; // Límite de stock
                return prev.map((item) =>
                    item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: number) => {
        setCart((prev) => prev.filter((item) => item.product.id !== productId));
    };

    const updateQuantity = (productId: number, newQty: number) => {
        if (newQty <= 0) {
            removeFromCart(productId);
            return;
        }

        setCart((prev) =>
            prev.map((item) => {
                if (item.product.id === productId) {
                    // No superar stock
                    if (newQty > item.product.stock) return { ...item, quantity: item.product.stock };
                    return { ...item, quantity: newQty };
                }
                return item;
            })
        );
    };

    const cartTotal = cart.reduce((total, item) => total + parseFloat(item.product.price.toString()) * item.quantity, 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        try {
            const items = cart.map((c) => ({
                productId: c.product.id,
                quantity: c.quantity,
            }));

            await salesService.sellProducts({ items, paymentMethod });

            setCart([]);
            alert('Venta registrada con éxito');

            // MUY IMPORTANTE: Recargar el catálogo para que la UI refleje el nuevo stock inmediatamente
            await fetchProducts();
        } catch (error) {
            console.error("Error en checkout:", error);
            alert('Hubo un error al procesar la venta.');
        }
    };

    const onDayPassSubmit = async (values: DayPassFormValues) => {
        setDayPassError("");
        try {
            const result = await salesService.sellDayPass(values);
            if (result && result.qrCode) {
                setQrCodeResult(result.qrCode);
            } else {
                setDayPassError("Venta procesada, pero no se recuperó el QR.");
            }
        } catch (error: any) {
            console.error("Error creating pass:", error);
            setDayPassError(error?.response?.data?.message || "Ocurrió un error al vender el Day Pass.");
        }
    };

    const closeDayPassModal = () => {
        setIsDayPassModalOpen(false);
        setQrCodeResult("");
        setDayPassError("");
        resetDayPass();
    };

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="flex h-full flex-col lg:flex-row gap-6 font-sans">

                    {/* Columna Izquierda: Catálogo Visual (70%) */}
                    <div className="flex-1 flex flex-col h-full overflow-hidden">
                        <h1 className="text-3xl font-bold text-emerald-400 mb-6 tracking-tight">Kiosko POS</h1>

                        <div className="flex-1 overflow-y-auto pr-2 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                            {isLoading ? (
                                <div className="flex h-full items-center justify-center">
                                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="flex h-full items-center justify-center text-zinc-500">
                                    No hay productos disponibles en el catálogo.
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {products.map((product) => (
                                        <button
                                            key={product.id}
                                            onClick={() => addToCart(product)}
                                            disabled={product.stock <= 0}
                                            className={`relative flex flex-col items-start justify-between rounded-xl border p-4 text-left transition-all ${product.stock > 0
                                                    ? "border-zinc-800 bg-zinc-900 hover:border-emerald-500/50 hover:bg-zinc-800/80 active:scale-95 cursor-pointer"
                                                    : "border-red-900/30 bg-red-900/10 opacity-60 cursor-not-allowed"
                                                }`}
                                        >
                                            {/* Categoría y Stock */}
                                            <div className="w-full flex justify-between items-start mb-2">
                                                <span className="text-xs font-semibold uppercase text-zinc-500">
                                                    {product.category}
                                                </span>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${product.stock > 5 ? "bg-zinc-800 text-zinc-300" : product.stock > 0 ? "bg-amber-500/20 text-amber-500" : "bg-red-500/20 text-red-500"
                                                    }`}>
                                                    {product.stock} {product.stock === 1 ? 'ud.' : 'uds.'}
                                                </span>
                                            </div>

                                            {/* Nombre */}
                                            <h3 className="text-sm font-bold text-zinc-100 leading-tight mb-4 flex-1">
                                                {product.name}
                                            </h3>

                                            {/* Precio */}
                                            <div className="text-lg font-black text-emerald-400 mt-auto">
                                                S/ {parseFloat(product.price.toString()).toFixed(2)}
                                            </div>

                                            {product.stock <= 0 && (
                                                <div className="absolute inset-0 flex items-center justify-center rounded-xl backdrop-blur-[1px]">
                                                    <span className="bg-red-600 px-3 py-1 font-bold text-white text-xs rounded shadow-lg transform -rotate-12 outline outline-2 outline-zinc-900">
                                                        AGOTADO
                                                    </span>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Columna Derecha: Recibo / Carrito (30%) */}
                    <div className="w-full lg:w-[350px] shrink-0 flex flex-col h-full rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden">

                        <div className="p-4 bg-zinc-950/50 border-b border-zinc-800">
                            <button
                                onClick={() => setIsDayPassModalOpen(true)}
                                className="w-full flex items-center justify-center gap-2 rounded-lg border border-emerald-500/50 bg-emerald-500/10 py-3 text-sm font-bold text-emerald-400 transition-colors hover:bg-emerald-500/20 hover:border-emerald-500"
                            >
                                <Ticket className="h-5 w-5" />
                                Vender Pase Diario
                            </button>
                        </div>

                        {/* Header Carrito */}
                        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 p-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-emerald-400" />
                                Pedido Actual
                            </h2>
                            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                                {cart.reduce((acc, item) => acc + item.quantity, 0)} items
                            </span>
                        </div>

                        {/* Lista de Ítems */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {cart.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center text-zinc-500 space-y-3">
                                    <ShoppingCart className="h-12 w-12 opacity-20" />
                                    <p className="text-sm font-medium">El carrito está vacío</p>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.product.id} className="flex flex-col gap-2 rounded-lg border border-zinc-800/50 bg-zinc-950/50 p-3">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-sm font-semibold text-zinc-200 leading-tight pr-2">{item.product.name}</h4>
                                            <p className="text-sm font-bold text-emerald-400 whitespace-nowrap">
                                                S/ {(parseFloat(item.product.price.toString()) * item.quantity).toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-1">
                                            {/* Controles de Cantidad */}
                                            <div className="flex items-center rounded-md border border-zinc-700 bg-zinc-800">
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                    className="p-1 text-zinc-400 hover:text-white transition-colors"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="w-8 text-center text-xs font-bold text-white">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.product.stock}
                                                    className="p-1 text-zinc-400 hover:text-emerald-400 disabled:opacity-30 transition-colors"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>

                                            {/* Eliminar */}
                                            <button
                                                onClick={() => removeFromCart(item.product.id)}
                                                className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Zona de Resumen y Cobro */}
                        <div className="border-t border-zinc-800 bg-zinc-950 p-5 space-y-4">

                            <div className="flex justify-between items-end">
                                <span className="text-sm font-medium text-zinc-400">Total a Pagar</span>
                                <span className="text-3xl font-black text-emerald-400 tracking-tight">
                                    S/ {cartTotal.toFixed(2)}
                                </span>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase text-zinc-500">Método de Pago</label>
                                <div className="relative">
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full appearance-none rounded-lg border border-zinc-700 bg-zinc-800 p-3 pr-10 text-sm font-semibold text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    >
                                        <option value="EFFECTIVE">Efectivo 💵</option>
                                        <option value="CARD">Tarjeta 💳</option>
                                        <option value="TRANSFER">Yape/Plin/Transf. 📱</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={cart.length === 0}
                                className="w-full rounded-xl bg-emerald-600 py-4 text-lg font-black text-white uppercase tracking-wider transition-all hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-900/30 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                            >
                                Cobrar
                            </button>
                        </div>

                    </div>

                    {/* Modal Venta Day Pass */}
                    {isDayPassModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
                            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden flex flex-col">

                                <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                                    <h2 className="text-xl font-bold text-white flex gap-2 items-center">
                                        <Ticket className="text-emerald-400" />
                                        Pase Diario (Day Pass)
                                    </h2>
                                    <button
                                        onClick={closeDayPassModal}
                                        className="rounded-full p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="p-6">
                                    {qrCodeResult ? (
                                        <div className="flex flex-col items-center py-6 space-y-4 text-center">
                                            <div className="rounded-full bg-emerald-500/20 p-4">
                                                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white">¡Vendido con Éxito!</h3>
                                            <p className="text-sm text-zinc-400 mb-2">Aquí está el código de acceso del visitante:</p>

                                            {/* Mostrar QR Code */}
                                            <div className="w-48 h-48 bg-white p-2 rounded-xl border-4 border-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                                <img src={qrCodeResult} alt="QR Code" className="w-full h-full object-contain" />
                                            </div>

                                            <p className="text-xs text-zinc-500 mt-4">* El visitante puede usar este código en los torniquetes por el día de hoy.</p>

                                            <button
                                                onClick={closeDayPassModal}
                                                className="mt-6 w-full rounded-lg bg-zinc-800 px-4 py-3 font-bold text-white transition-all hover:bg-zinc-700"
                                            >
                                                Finalizar
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleDayPassSubmit(onDayPassSubmit)} className="space-y-4">

                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase text-zinc-400">Nombre del Visitante</label>
                                                <input
                                                    type="text"
                                                    {...registerDayPass("buyerName")}
                                                    className={`w-full rounded-lg border bg-zinc-950 py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${dayPassErrors.buyerName ? "border-red-500" : "border-zinc-800"}`}
                                                />
                                                {dayPassErrors.buyerName && <p className="text-xs text-red-500 font-semibold">{dayPassErrors.buyerName.message}</p>}
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase text-zinc-400">Documento IDE (Opcional)</label>
                                                <input
                                                    type="text"
                                                    {...registerDayPass("dni")}
                                                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold uppercase text-zinc-400">Precio (S/)</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        {...registerDayPass("price", { valueAsNumber: true })}
                                                        className={`w-full rounded-lg border bg-zinc-950 py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${dayPassErrors.price ? "border-red-500" : "border-zinc-800"}`}
                                                    />
                                                    {dayPassErrors.price && <p className="text-xs text-red-500 font-semibold">{dayPassErrors.price.message}</p>}
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold uppercase text-zinc-400">Método de Pago</label>
                                                    <select
                                                        {...registerDayPass("paymentMethod")}
                                                        className="w-full h-[46px] rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                                                    >
                                                        <option value="EFFECTIVE">Efectivo</option>
                                                        <option value="CARD">Tarjeta</option>
                                                        <option value="TRANSFER">Tranf. / Pago Móvil</option>
                                                    </select>
                                                    {dayPassErrors.paymentMethod && <p className="text-xs text-red-500 font-semibold">{dayPassErrors.paymentMethod.message}</p>}
                                                </div>
                                            </div>

                                            {dayPassError && (
                                                <div className="rounded-lg bg-red-500/10 p-3 text-center text-sm font-semibold text-red-500 border border-red-500/20 mt-2">
                                                    {dayPassError}
                                                </div>
                                            )}

                                            <div className="pt-4 mt-6 border-t border-zinc-800">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmittingDayPass}
                                                    className="w-full py-3 px-4 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 font-bold text-white transition-all hover:bg-emerald-500 disabled:opacity-50"
                                                >
                                                    {isSubmittingDayPass ? "Generando..." : "Confirmar Venta y Generar QR"}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
