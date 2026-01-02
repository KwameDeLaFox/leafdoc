"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Sparkles, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MultiImageUpload } from "@/components/multi-image-upload";

export default function DiagnosePage() {
    const router = useRouter();
    const [plantImages, setPlantImages] = useState<File[]>([]);
    const [envImages, setEnvImages] = useState<File[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [isCorrecting, setIsCorrecting] = useState(false);
    const [manualPlantName, setManualPlantName] = useState("");

    const handleDiagnose = async (manualName?: string) => {
        if (plantImages.length === 0) {
            alert("Please add at least one photo of your plant.");
            return;
        }

        setIsAnalyzing(true);
        if (!manualName) setResult(null);
        setIsCorrecting(false);

        try {
            const formData = new FormData();
            plantImages.forEach((file) => formData.append("plantImages", file));
            envImages.forEach((file) => formData.append("envImages", file));
            if (manualName) formData.append("correctName", manualName);

            const response = await fetch("/api/diagnose", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Analysis failed");

            const data = await response.json();
            if (data.id) {
                router.push(`/diagnose/${data.id}`);
            } else {
                setResult(data);
            }
        } catch (error) {
            alert("Something went wrong. Please try again.");
            console.error(error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>

            <section>
                <h1 className="text-3xl font-extrabold tracking-tight">Diagnose My Plant</h1>
                <p className="text-muted-foreground mt-2 text-lg leading-relaxed">
                    Upload photos for a step-by-step health analysis.
                </p>
            </section>

            {!result ? (
                <div className="space-y-10">
                    <MultiImageUpload
                        label="Plant Images"
                        description="Take close-ups of leaves, stems, or pests."
                        onImagesChange={setPlantImages}
                    />

                    <MultiImageUpload
                        label="Environment (Optional)"
                        description="Show us where the plant lives (near windows, heaters, etc.)."
                        onImagesChange={setEnvImages}
                    />

                    <div className="pt-4">
                        <button
                            onClick={() => handleDiagnose()}
                            disabled={isAnalyzing || plantImages.length === 0}
                            className="w-full h-16 rounded-3xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-3 hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-xl shadow-primary/20"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Analyzing your plant...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-6 h-6" />
                                    Get Diagnosis
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8"
                >
                    {result.needsMoreInfo && (
                        <div className="p-6 rounded-3xl bg-accent/10 border border-accent/30 text-accent">
                            <h3 className="font-bold flex items-center gap-2 mb-2">
                                <Sparkles className="w-5 h-5" />
                                Wait, I need more details!
                            </h3>
                            <p className="text-sm leading-relaxed font-medium">
                                {result.moreInfoPrompt}
                            </p>
                        </div>
                    )}

                    <div className="p-8 rounded-[2.5rem] bg-primary/[0.03] border-2 border-primary/10 text-foreground shadow-sm space-y-6 relative overflow-hidden">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">
                            <span>AI Identification</span>
                            <span>{Math.round(result.confidence * 100)}% Match</span>
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-3xl font-black leading-tight text-primary">{result.plant}</h2>
                            {!isCorrecting && (
                                <button
                                    onClick={() => setIsCorrecting(true)}
                                    className="text-[10px] uppercase tracking-wider font-bold text-primary/40 hover:text-primary underline underline-offset-4 ring-offset-background focus:outline-none transition-all"
                                >
                                    Not the right plant?
                                </button>
                            )}
                        </div>

                        {/* Health Bar Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-primary/60">
                                <span>Plant Health</span>
                                <span className="text-primary font-black">{Math.round((result.healthScore || 0) * 100)}%</span>
                            </div>
                            <div className="relative h-4 bg-primary/10 rounded-full overflow-hidden border border-primary/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(result.healthScore || 0) * 100}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-500"
                                />
                                {/* Subtle gloss overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                            </div>
                            <div className="flex justify-between text-[8px] font-black uppercase tracking-tighter text-primary/30">
                                <span>Critical</span>
                                <span>Optimized</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] p-6 border border-primary/10 shadow-sm transition-all duration-300">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-2">Diagnosis</div>
                            <p className="font-bold text-lg leading-relaxed text-foreground/90">
                                {result.issue}
                            </p>
                        </div>

                        <AnimatePresence>
                            {isCorrecting && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="pt-2 space-y-3"
                                >
                                    <div className="h-px bg-primary/10 w-full" />
                                    <p className="text-xs font-medium text-primary/60">
                                        Tell us the correct name for a more accurate diagnosis:
                                    </p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={manualPlantName}
                                            onChange={(e) => setManualPlantName(e.target.value)}
                                            placeholder="e.g. Fiddle Leaf Fig"
                                            className="flex-1 bg-white border border-primary/20 rounded-xl px-4 py-2 text-sm placeholder:text-primary/30 outline-none focus:border-primary/50 transition-all font-medium text-primary"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleDiagnose(manualPlantName)}
                                            disabled={!manualPlantName.trim() || isAnalyzing}
                                            className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold hover:brightness-110 transition-all disabled:opacity-50"
                                        >
                                            {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : "Fix"}
                                        </button>
                                        <button
                                            onClick={() => setIsCorrecting(false)}
                                            className="p-2 hover:bg-primary/5 text-primary/60 rounded-xl transition-all"
                                        >
                                            <X className="w-4 h-4 ml-1" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold flex items-center gap-2 px-2">
                            Action Plan
                        </h3>
                        <div className="grid gap-4">
                            {result.steps.map((step: any, index: number) => (
                                <div
                                    key={index}
                                    className="p-5 rounded-3xl bg-card border hover:border-primary/30 transition-all"
                                >
                                    <div className="flex gap-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black">
                                            {index + 1}
                                        </span>
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-lg">{step.title}</h4>
                                            <p className="text-muted-foreground leading-relaxed">{step.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => setResult(null)}
                            className="w-full h-14 rounded-2xl bg-secondary text-secondary-foreground font-bold hover:brightness-95 transition-all"
                        >
                            Add more images to refine
                        </button>
                        <Link
                            href="/"
                            className="w-full h-14 rounded-2xl border flex items-center justify-center font-bold hover:bg-muted transition-all"
                        >
                            Done for now
                        </Link>
                    </div>

                    <section className="mt-8 p-6 rounded-3xl bg-muted/50 border border-dashed flex flex-col items-center text-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            ADVERTISEMENT
                        </span>
                        <div className="w-full h-32 bg-muted rounded-xl flex items-center justify-center text-muted-foreground/50 text-sm italic">
                            Google AdSense Placement
                        </div>
                    </section>
                </motion.div>
            )}
        </div>
    );
}
