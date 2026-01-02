import Replicate from "replicate";
import { NextRequest, NextResponse } from "next/server";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const roomFiles = formData.getAll("roomImages") as File[];

        if (roomFiles.length === 0) {
            return NextResponse.json({ error: "No room images provided" }, { status: 400 });
        }

        const images = await Promise.all(
            roomFiles.map(async (file) => {
                const bytes = await file.arrayBuffer();
                const base64 = Buffer.from(bytes).toString("base64");
                return `data:${file.type};base64,${base64}`;
            })
        );

        const prompt = `
      You are a professional interior designer and botanist.
      Analyze these images of a room environment.
      
      1. Detect light levels (proximity to windows, direct vs indirect).
      2. Detect space availability (corners, tabletops, floor space).
      3. Recommend 2-3 specific plants that would thrive in this specific environment.

      Return ONLY a JSON object in this exact format (no markdown code blocks, just pure JSON):
      {
        "recommendations": [
          {
            "name": "Plant Name",
            "description": "Short care summary",
            "lightNeeds": "e.g. Low Light / Bright Indirect",
            "reason": "Specific reason why it fits this detected room (e.g. fits perfectly in that dim corner you have)"
          }
        ]
      }
    `;

        const output = await replicate.run(
            "google/gemini-2.5-flash",
            {
                input: {
                    image: images[0],
                    images: images, // Send all room images
                    prompt: prompt,
                    max_new_tokens: 1000,
                },
            }
        );

        const text = Array.isArray(output) ? output.join("") : (output as any).toString();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const resultJson = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

        if (!resultJson) {
            throw new Error("Failed to parse AI response");
        }

        return NextResponse.json(resultJson);
    } catch (error: any) {
        console.error("Recommendation Error:", error);
        return NextResponse.json({ error: "Failed to analyze room" }, { status: 500 });
    }
}
