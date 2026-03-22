"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { accessService } from "@/services/access.service";
import { ArrowLeft } from "lucide-react";

export default function AccesoScanner() {
    const router = useRouter();
    const [scanStatus, setScanStatus] = useState<'IDLE' | 'GRANTED' | 'WARNING' | 'DENIED'>('IDLE');
    const [scanResult, setScanResult] = useState<any>(null);

    useEffect(() => {
        let isMounted = true;
        let scanner: any = null;

        import('html5-qrcode').then(({ Html5QrcodeScanner }) => {
            if (!isMounted) return;

            scanner = new Html5QrcodeScanner("reader", {
                fps: 10,
                qrbox: { width: 250, height: 250 },
            }, false);

            scanner.render(async (decodedText: string) => {
                scanner.pause();

                try {
                    const parsedId = Number(decodedText);
                    if (isNaN(parsedId)) {
                        throw new Error("Invalid QR Code");
                    }
                    const res = await accessService.scan(parsedId);
                    setScanResult(res);
                    setScanStatus(res.status as any);

                    setTimeout(() => {
                        setScanStatus('IDLE');
                        setScanResult(null);
                        if (scanner) scanner.resume();
                    }, 4000);

                } catch (error) {
                    console.error('Scan Error:', error);
                    setScanStatus('DENIED');
                    setScanResult({ message: 'Error de Lectura QR' });

                    setTimeout(() => {
                        setScanStatus('IDLE');
                        setScanResult(null);
                        if (scanner) scanner.resume();
                    }, 4000);
                }
            }, (error: any) => {
                // ignorar
            });
        });

        // CLEANUP VITAL: Destruir la instancia al salir de la página
        return () => {
            isMounted = false;
            if (scanner) {
                scanner.clear().catch((error: any) => console.error("Error limpiando el escáner:", error));
            }
        };
    }, []);

    let bgClass = "bg-black/95";
    if (scanStatus === 'GRANTED') bgClass = "bg-green-600";
    if (scanStatus === 'WARNING') bgClass = "bg-yellow-500";
    if (scanStatus === 'DENIED') bgClass = "bg-red-600";

    return (
        <ProtectedRoute>
            <div className={`fixed inset-0 min-h-screen w-full transition-colors duration-500 flex flex-col items-center justify-center font-sans p-6 ${bgClass}`}>

                {/* Back to Dashboard Button */}
                <button
                    onClick={() => router.push('/admin/dashboard')}
                    className="absolute top-6 left-6 flex items-center gap-2 rounded-xl bg-black/20 hover:bg-black/40 px-4 py-2 text-sm font-bold text-white transition-colors border border-white/10 backdrop-blur-sm shadow-xl z-50"
                >
                    <ArrowLeft className="h-4 w-4" /> Volver al Dashboard
                </button>

                {/* Main Content Area */}
                <div className="w-full max-w-2xl text-center">

                    <div className={scanStatus === 'IDLE' ? "flex flex-col items-center animate-in fade-in zoom-in duration-500" : "hidden"}>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight drop-shadow-lg">
                            Escanee su Acceso
                        </h1>

                        {/* Estilos forzados para la librería de QR */}
                        <style dangerouslySetInnerHTML={{
                            __html: `
                        #reader { border: none !important; border-radius: 1rem; overflow: hidden; background: #18181b; }
                        #reader__scan_region { background: #000; }
                        #reader__dashboard_section_csr button { 
                            background-color: #059669 !important; /* Emerald 600 */
                            color: white !important; 
                            border: none !important; 
                            padding: 10px 20px !important; 
                            border-radius: 8px !important; 
                            font-weight: bold !important; 
                            cursor: pointer !important;
                            margin-top: 10px !important;
                            transition: all 0.3s ease;
                        }
                        #reader__dashboard_section_csr button:hover { background-color: #047857 !important; /* Emerald 700 */ }
                        #reader__dashboard_section_swaplink { color: #10b981 !important; text-decoration: none !important; }
                        `}} />

                        {/* Contenedor Principal del Lector */}
                        <div className="relative p-2 bg-zinc-900 rounded-2xl shadow-2xl shadow-emerald-900/20 border border-zinc-800 w-full max-w-md mx-auto">
                            <div id="reader" className="w-full"></div>
                        </div>

                        <p className="mt-8 text-emerald-400 font-medium text-lg tracking-wide uppercase">
                            Torniquete de Entrada Activo
                        </p>
                    </div>

                    {scanStatus === 'GRANTED' && scanResult && (
                        <div className="text-white animate-in slide-in-from-bottom-10 fade-in duration-500">
                            <h2 className="text-6xl md:text-8xl font-black mb-6 drop-shadow-xl tracking-tighter uppercase leading-none">
                                ¡Bienvenido! <br /> <span className="text-white/90 text-5xl md:text-7xl">{scanResult.user}</span>
                            </h2>
                            <p className="text-3xl font-bold text-green-100 flex items-center justify-center gap-3">
                                <span className="text-6xl text-white drop-shadow-lg">{scanResult.daysLeft}</span>
                                <span>DÍAS<br />RESTANTES</span>
                            </p>
                            <p className="mt-12 text-green-200 font-bold uppercase tracking-[0.2em] text-sm animate-pulse">
                                Torniquete Abierto
                            </p>
                        </div>
                    )}

                    {scanStatus === 'WARNING' && scanResult && (
                        <div className="text-zinc-950 animate-in slide-in-from-bottom-10 fade-in duration-500 drop-shadow-sm">
                            <h2 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase leading-none">
                                ¡Bienvenido! <br /> <span className="text-zinc-900/90 text-5xl md:text-7xl">{scanResult.user}</span>
                            </h2>
                            <p className="text-3xl font-bold flex items-center justify-center gap-3 mb-10">
                                <span className="text-6xl ">{scanResult.daysLeft}</span>
                                <span>DÍAS<br />RESTANTES</span>
                            </p>

                            <div className="inline-block bg-black text-yellow-500 px-8 py-6 rounded-2xl shadow-2xl border-4 border-black/10 transform -rotate-2">
                                <p className="text-xl font-bold uppercase tracking-widest mb-1">Cuidado</p>
                                <p className="text-3xl md:text-4xl font-black">
                                    DEUDA: S/ {Number(scanResult.pendingBalance).toFixed(2)}
                                </p>
                            </div>

                            <p className="mt-12 text-zinc-900 font-bold uppercase tracking-[0.2em] text-sm animate-pulse">
                                Torniquete Abierto
                            </p>
                        </div>
                    )}

                    {scanStatus === 'DENIED' && scanResult && (
                        <div className="text-white animate-in swing-in-top-fwd duration-500">
                            <h2 className="text-6xl md:text-8xl font-black mb-8 drop-shadow-2xl tracking-tighter uppercase leading-none">
                                ACCESO <br /> DENEGADO
                            </h2>

                            <div className="inline-block bg-black/30 backdrop-blur-md px-10 py-6 rounded-3xl border border-white/20 shadow-2xl">
                                <p className="text-2xl md:text-3xl font-bold text-red-100 uppercase tracking-wider">
                                    {scanResult.message}
                                </p>
                            </div>

                            <p className="mt-16 text-red-200 font-bold uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                                Torniquete Bloqueado
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
