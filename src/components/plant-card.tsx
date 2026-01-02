"use client";

import { motion } from "framer-motion";
import { Calendar, ChevronRight, Activity } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PlantCardProps {
    diagnosis: {
        id: string;
        plantName: string;
        healthScore: number;
        issue: string;
        imageUrl: string | null;
        createdAt: Date;
    };
}

export function PlantCard({ diagnosis }: PlantCardProps) {
    const isHealthy = diagnosis.healthScore >= 80;
    const healthColor = isHealthy ? "text-green-500" : "text-amber-500";
    const healthBg = isHealthy ? "bg-green-50" : "bg-amber-50";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
        >
            <Link
                href={`/diagnose/${diagnosis.id}`}
                className="group block bg-card border rounded-3xl overflow-hidden hover:shadow-lg transition-all"
            >
                <div className="relative aspect-[4/3] bg-muted">
                    {diagnosis.imageUrl ? (
                        <Image
                            src={diagnosis.imageUrl}
                            alt={diagnosis.plantName}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No Image
                        </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${healthBg} ${healthColor} border border-current/20 backdrop-blur-md`}>
                            {isHealthy ? "Healthy" : "Needs Attention"}
                        </div>
                    </div>
                </div>

                <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                                {diagnosis.plantName}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(diagnosis.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-medium text-muted-foreground uppercase">Health</span>
                            <div className="flex items-center gap-1">
                                <Activity className={`w-3.5 h-3.5 ${healthColor}`} />
                                <span className="font-bold text-sm">{Math.round(diagnosis.healthScore)}%</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-1">
                        {diagnosis.issue}
                    </p>

                    <div className="pt-2 flex items-center text-primary text-xs font-semibold gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details <ChevronRight className="w-3 h-3" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
