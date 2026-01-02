import { getRecentDiagnoses } from "@/lib/actions/diagnosis";
import { PlantCard } from "@/components/plant-card";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

export default async function DiagnosesPage() {
    const diagnoses = await getRecentDiagnoses(50); // Fetch a larger set for the full collection

    return (
        <div className="space-y-8 pb-12">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>

            <section className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight">My Plant Collection</h1>
                <p className="text-muted-foreground text-lg">
                    Revisit your diagnoses and care instructions.
                </p>
            </section>

            {diagnoses.length === 0 ? (
                <div className="p-12 rounded-3xl border border-dashed flex flex-col items-center text-center gap-4 bg-muted/30">
                    <p className="font-semibold text-lg text-muted-foreground">No plants in your collection yet.</p>
                    <Link
                        href="/diagnose"
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:scale-[1.02] transition-all"
                    >
                        Start First Scan
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {diagnoses.map((diagnosis) => (
                        <PlantCard key={diagnosis.id} diagnosis={diagnosis} />
                    ))}
                </div>
            )}
        </div>
    );
}
