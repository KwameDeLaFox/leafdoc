import { getDiagnosisById } from "@/lib/actions/diagnosis";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles, Activity } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// Note: We need a client component for animations, so we'll wrap the inner content
import { DiagnosisDetailClient } from "@/components/diagnosis-detail-client";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function DiagnosisPage({ params }: PageProps) {
    const { id } = await params;
    const diagnosis = await getDiagnosisById(id);

    if (!diagnosis) {
        notFound();
    }

    // Parse steps if they are stringified
    const steps = typeof diagnosis.steps === "string" ? JSON.parse(diagnosis.steps) : diagnosis.steps;

    return (
        <div className="space-y-8 pb-12">
            <Link
                href="/diagnoses"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Collection
            </Link>

            <DiagnosisDetailClient diagnosis={{ ...diagnosis, steps }} />
        </div>
    );
}
