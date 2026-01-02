import Replicate from "replicate";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: NextRequest) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const plantFiles = formData.getAll("plantImages") as File[];
        const envFiles = formData.getAll("envImages") as File[];
        const correctName = formData.get("correctName") as string | null;

        if (plantFiles.length === 0) {
            return NextResponse.json({ error: "No plant images provided" }, { status: 400 });
        }

        // Prepare images for Replicate (convert to data URIs)
        // We'll use the first plant image as the "main" one for storage
        const images = await Promise.all(
            [...plantFiles, ...envFiles].map(async (file) => {
                const bytes = await file.arrayBuffer();
                const base64 = Buffer.from(bytes).toString("base64");
                return `data:${file.type};base64,${base64}`;
            })
        );

        const prompt = `
      You are a professional botanist and plant doctor named "LeafDoc". 
      Analyze these images of a plant (and optional environment context).
      
      ${correctName ? `IMPORTANT: The user has identified this plant as "${correctName}". Please perform the diagnosis specifically for this species.` : "1. Identify the plant name (common and scientific)."}
      2. Diagnose the primary health issue.
      3. Rate the overall health of the plant from 0.0 (Near Dead/Critically Ill) to 1.0 (Perfectly Healthy).
      4. Provide a clear, actionable 3-step repair plan. Keep steps short and thumb-friendly.
      5. If you are not confident (below 70%), set "needsMoreInfo" to true and ask for specific missing details.

      Return ONLY a JSON object in this exact format (no markdown code blocks, just pure JSON):
      {
        "plant": "${correctName || "Common Name (Scientific Name)"}",
        "confidence": ${correctName ? 1.0 : "0.95"},
        "healthScore": 0.5,
        "issue": "Short description of issue",
        "steps": [
          { "title": "Step 1 Title", "text": "Actionable instruction" },
          { "title": "Step 2 Title", "text": "Actionable instruction" },
          { "title": "Step 3 Title", "text": "Actionable instruction" }
        ],
        "needsMoreInfo": false,
        "moreInfoPrompt": ""
      }
    `;

        // Using Google Gemini on Replicate with multi-image support
        const output = await replicate.run(
            "google/gemini-2.5-flash",
            {
                input: {
                    image: images[0],
                    images: images, // All plant and environment images
                    prompt: prompt,
                    max_new_tokens: 1000,
                },
            }
        );

        const text = Array.isArray(output) ? output.join("") : (output as any).toString();

        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const resultJson = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

        if (!resultJson) {
            throw new Error("Failed to parse AI response");
        }

        // --- DATABASE PERSISTENCE ---
        // Save the diagnosis to the database for this user
        const savedDiagnosis = await prisma.diagnosis.create({
            data: {
                userId: session.user.id,
                plantName: resultJson.plant,
                healthScore: resultJson.healthScore * 100, // Store as percentage 0-100
                issue: resultJson.issue,
                steps: JSON.stringify(resultJson.steps),
                imageUrl: images[0], // Store the main image as a data URI for simplicity (could be optimized with S3/uploadthing later)
            },
        });

        // Add the database ID to the response so the client can redirect
        return NextResponse.json({
            ...resultJson,
            id: savedDiagnosis.id
        });

    } catch (error: any) {
        console.error("Diagnosis Error:", error);
        return NextResponse.json({ error: "Failed to analyze images" }, { status: 500 });
    }
}
