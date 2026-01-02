"use client";

import { motion } from "framer-motion";
import { Sparkles, Activity, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Step {
    title?: string;
    step?: string;
    text?: string;
    details?: string;
}

interface DiagnosisDetailClientProps {
    diagnosis: {
        plantName: string;
        healthScore: number;
        issue: string;
        steps: Step[];
        imageUrl: string | null;
    };
}

export function DiagnosisDetailClient({ diagnosis }: DiagnosisDetailClientProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="p-8 rounded-[2.5rem] bg-primary/[0.03] border-2 border-primary/10 text-foreground shadow-sm space-y-6 relative overflow-hidden">
                {diagnosis.imageUrl && (
                    <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 border">
                        <Image
                            src={diagnosis.imageUrl}
                            alt={diagnosis.plantName}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">
                    <span>Saved Diagnosis</span>
                    <span>Verified Match</span>
                </div>

                <div className="space-y-1">
                    <h2 className="text-3xl font-black leading-tight text-primary">
                        {diagnosis.plantName}
                    </h2>
                    <p className="text-xs font-bold text-primary/40 uppercase tracking-wider">
                        Persistent Care Plan
                    </p>
                </div>

                {/* Health Bar Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-primary/60">
                        <span>Plant Health</span>
                        <span className="text-primary font-black">
                            {Math.round(diagnosis.healthScore)}%
                        </span>
                    </div>
                    <div className="relative h-4 bg-primary/10 rounded-full overflow-hidden border border-primary/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${diagnosis.healthScore}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-6 border border-primary/10 shadow-sm">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-2">
                        Issue Diagnosed
                    </div>
                    <p className="font-bold text-lg leading-relaxed text-foreground/90">
                        {diagnosis.issue}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2 px-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    Care Instructions
                </h3>
                <div className="grid gap-4">
                    {diagnosis.steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-5 rounded-3xl bg-card border hover:border-primary/30 transition-all shadow-sm"
                        >
                            <div className="flex gap-4">
                                <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black">
                                    {index + 1}
                                </span>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-lg">
                                        {step.title || step.step || "Recommended Action"}
                                    </h4>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {step.text || step.details}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="pt-6">
                <Link
                    href="/diagnose"
                    className="w-full h-16 rounded-3xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-3 hover:brightness-110 transition-all active:scale-[0.98] shadow-xl shadow-primary/20"
                >
                    <Sparkles className="w-6 h-6" />
                    New Diagnosis
                </Link>
            </div>
        </motion.div>
    );
}
