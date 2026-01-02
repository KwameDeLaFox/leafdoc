"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import plantsData from "@/data/plants.json";

export default function PresetDiagnosis() {
    const [search, setSearch] = useState("");
    const [selectedPlant, setSelectedPlant] = useState<any>(null);
    const [selectedIssue, setSelectedIssue] = useState<any>(null);

    const filteredPlants = useMemo(() => {
        if (!search) return [];
        return plantsData.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.scientific_name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    return (
        <div className="space-y-6">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>

            <section>
                <h1 className="text-3xl font-extrabold tracking-tight">Preset Diagnosis</h1>
                <p className="text-muted-foreground mt-2">
                    Find your plant and select symptoms for a quick guide.
                </p>
            </section>

            {!selectedPlant ? (
                <section className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search plant name (e.g. Monstera)..."
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-card focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        {filteredPlants.map((plant) => (
                            <button
                                key={plant.id}
                                onClick={() => setSelectedPlant(plant)}
                                className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/50 text-left transition-all active:scale-[0.98]"
                            >
                                <div>
                                    <div className="font-bold">{plant.name}</div>
                                    <div className="text-xs text-muted-foreground italic">{plant.scientific_name}</div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            </button>
                        ))}
                        {search && filteredPlants.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No plants found. Try a different name.
                            </div>
                        )}
                        {!search && (
                            <div className="grid gap-4 mt-4">
                                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-2">
                                    Popular Plants
                                </span>
                                {plantsData.slice(0, 3).map((plant) => (
                                    <button
                                        key={plant.id}
                                        onClick={() => setSelectedPlant(plant)}
                                        className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/50 text-left transition-all"
                                    >
                                        <div className="font-medium">{plant.name}</div>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            ) : !selectedIssue ? (
                <motion.section
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">{selectedPlant.name}</h2>
                        <button
                            onClick={() => setSelectedPlant(null)}
                            className="text-xs text-primary font-medium hover:underline"
                        >
                            Change Plant
                        </button>
                    </div>
                    <p className="text-sm text-muted-foreground">What symptoms are you seeing?</p>
                    <div className="grid gap-3">
                        {selectedPlant.issues.map((issue: any) => (
                            <button
                                key={issue.id}
                                onClick={() => setSelectedIssue(issue)}
                                className="flex items-stretch gap-4 p-4 rounded-2xl border bg-card hover:bg-primary/5 hover:border-primary/30 text-left transition-all"
                            >
                                <div className="flex-1 font-semibold">{issue.symptom}</div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground self-center" />
                            </button>
                        ))}
                    </div>
                </motion.section>
            ) : (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="flex flex-col gap-1">
                        <span className="text-primary font-bold text-sm">{selectedPlant.name}</span>
                        <h2 className="text-2xl font-extrabold">{selectedIssue.symptom}</h2>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold flex items-center gap-2">
                            <span className="bg-primary/10 text-primary p-1 rounded-md">
                                <CheckCircle2 className="w-4 h-4" />
                            </span>
                            Step-by-Step Guide
                        </h3>
                        <div className="grid gap-3">
                            {selectedIssue.steps.map((step: string, index: number) => (
                                <div
                                    key={index}
                                    className="p-4 rounded-2xl bg-muted/30 border flex gap-4"
                                >
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </span>
                                    <p className="leading-relaxed">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => setSelectedIssue(null)}
                        className="w-full py-4 rounded-2xl bg-secondary text-secondary-foreground font-bold hover:brightness-95 transition-all"
                    >
                        Check another symptom
                    </button>
                </motion.section>
            )}
        </div>
    );
}
