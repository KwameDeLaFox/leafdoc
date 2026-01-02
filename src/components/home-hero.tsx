"use client";

import { motion } from "framer-motion";
import { Camera, Search, Sparkles, ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

interface Feature {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    color: string;
    delay: number;
}

const features: Feature[] = [
    {
        title: "Diagnose My Plant",
        description: "Upload photos for AI-powered health analysis and repair steps.",
        icon: Camera,
        href: "/diagnose",
        color: "bg-primary text-primary-foreground",
        delay: 0.1,
    },
    {
        title: "Preset Diagnosis",
        description: "Search common plants and issues for quick guided solutions.",
        icon: Search,
        href: "/preset",
        color: "bg-accent/10 text-accent",
        delay: 0.2,
    },
    {
        title: "Recommend a Plant",
        description: "Upload a photo of your room for tailored plant suggestions.",
        icon: Sparkles,
        href: "/recommend",
        color: "bg-secondary text-secondary-foreground",
        delay: 0.3,
    },
];

export function HomeHero() {
    return (
        <>
            <section className="text-center space-y-4 pt-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                        Keep your plants <span className="text-primary italic">thriving</span>.
                    </h1>
                    <p className="mt-4 text-muted-foreground text-lg max-w-sm mx-auto">
                        Simple, structured guidance for every plant owner. No expertise required.
                    </p>
                </motion.div>
            </section>

            <section className="grid gap-4">
                {features.map((feature) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: feature.delay }}
                    >
                        <Link
                            href={feature.href}
                            className="group block p-6 rounded-3xl border bg-card hover:shadow-xl hover:border-primary/20 transition-all active:scale-[0.98]"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-4 rounded-2xl ${feature.color}`}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h2 className="font-bold text-xl">{feature.title}</h2>
                                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </section>
        </>
    );
}
