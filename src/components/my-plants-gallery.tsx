import { getRecentDiagnoses } from "@/lib/actions/diagnosis";
import { PlantCard } from "./plant-card";
import { Camera, ArrowRight } from "lucide-react";
import Link from "next/link";

export async function MyPlantsGallery() {
    const diagnoses = await getRecentDiagnoses(4);

    if (diagnoses.length === 0) {
        return (
            <section className="space-y-4">
                <h2 className="text-2xl font-bold px-1">My Plants</h2>
                <div className="p-8 rounded-3xl border border-dashed flex flex-col items-center text-center gap-4 bg-muted/30">
                    <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                        <Camera className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-semibold text-lg">No plants scanned yet</p>
                        <p className="text-muted-foreground text-sm max-w-[240px]">
                            Scan your first plant to start building your digital collection and track its health.
                        </p>
                    </div>
                    <Link
                        href="/diagnose"
                        className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Scan Now
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-6">
            <div className="flex items-end justify-between px-1">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold">My Plants</h2>
                    <p className="text-sm text-muted-foreground">Keep track of your plant family</p>
                </div>
                <Link
                    href="/diagnoses"
                    className="text-sm font-bold text-primary flex items-center gap-1 hover:underline underline-offset-4"
                >
                    See All <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {diagnoses.map((diagnosis) => (
                    <PlantCard key={diagnosis.id} diagnosis={diagnosis} />
                ))}
            </div>
        </section>
    );
}
