"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Loader2, Home as HomeIcon } from "lucide-react";
import Link from "next/link";
import { MultiImageUpload } from "@/components/multi-image-upload";

export default function RecommendPage() {
    const [roomImages, setRoomImages] = useState<File[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [recommendations, setRecommendations] = useState<any[] | null>(null);

    const handleRecommend = async () => {
        if (roomImages.length === 0) {
            alert("Please upload at least one photo of your room.");
            return;
        }

        setIsAnalyzing(true);

        try {
            const formData = new FormData();
            roomImages.forEach((file) => formData.append("roomImages", file));

            const response = await fetch("/api/recommend", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Recommendation failed");

            const data = await response.json();
            setRecommendations(data.recommendations);
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
                <h1 className="text-3xl font-extrabold tracking-tight">Recommend a Plant</h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Upload a photo of your room to find the perfect plant match.
                </p>
            </section>

            {!recommendations ? (
                <div className="space-y-10">
                    <MultiImageUpload
                        label="Room Photos"
                        description="Show us the space, windows, and light levels."
                        onImagesChange={setRoomImages}
                    />

                    <div className="pt-4">
                        <button
                            onClick={handleRecommend}
                            disabled={isAnalyzing || roomImages.length === 0}
                            className="w-full h-16 rounded-3xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-3 hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-xl shadow-primary/20"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Analyzing Room...
                                </>
                            ) : (
                                <>
                                    <HomeIcon className="w-6 h-6" />
                                    Get Suggestions
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
                    <div className="p-8 rounded-[2.5rem] bg-primary/[0.03] border-2 border-primary/10 text-foreground space-y-2 text-center">
                        <div className="inline-flex p-3 bg-white rounded-2xl shadow-sm mb-2 border border-primary/5">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-black text-primary">
                            Perfect Fits for Your Room
                        </h2>
                        <p className="text-sm text-primary/60 font-medium leading-relaxed">Based on the natural light and space detected in your photos.</p>
                    </div>

                    <div className="grid gap-6">
                        {recommendations.map((plant: any, index: number) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 rounded-3xl bg-card border hover:border-primary/30 transition-all shadow-sm group"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-primary">{plant.name}</h3>
                                        <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                                            {plant.lightNeeds}
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">{plant.description}</p>
                                    <div className="p-4 rounded-2xl bg-muted/30 border-l-4 border-primary">
                                        <p className="text-sm font-semibold italic">Why it fits:</p>
                                        <p className="text-sm text-muted-foreground">{plant.reason}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => setRecommendations(null)}
                            className="w-full h-14 rounded-2xl bg-secondary text-secondary-foreground font-bold hover:brightness-95 transition-all"
                        >
                            Try another room
                        </button>
                        <Link
                            href="/"
                            className="w-full h-14 rounded-2xl border flex items-center justify-center font-bold hover:bg-muted transition-all"
                        >
                            Done
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
