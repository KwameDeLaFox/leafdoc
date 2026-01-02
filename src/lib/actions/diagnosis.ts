"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function getRecentDiagnoses(limit: number = 6) {
    const session = await auth();

    if (!session?.user?.id) {
        return [];
    }

    try {
        const diagnoses = await prisma.diagnosis.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: limit,
        });

        return diagnoses;
    } catch (error) {
        console.error("Failed to fetch diagnoses:", error);
        return [];
    }
}

export async function getDiagnosisById(id: string) {
    const session = await auth();

    if (!session?.user?.id) {
        return null;
    }

    try {
        const diagnosis = await prisma.diagnosis.findUnique({
            where: {
                id: id,
                userId: session.user.id, // Security: Ensure it's the user's own diagnosis
            },
        });

        return diagnosis;
    } catch (error) {
        console.error("Failed to fetch diagnosis:", error);
        return null;
    }
}
