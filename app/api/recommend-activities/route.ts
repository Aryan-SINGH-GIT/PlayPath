import { NextResponse } from "next/server";
import { generateActivityRecommendations } from "@/lib/gemini";
import { z } from "zod";

const requestSchema = z.object({
    age: z.string().min(1),
    interests: z.array(z.string()),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { age, interests } = requestSchema.parse(body);

        const activities = await generateActivityRecommendations(age, interests);

        return NextResponse.json({ activities });
    } catch (error) {
        console.error("Recommendation API Error:", error);
        return NextResponse.json({ error: "Invalid request or AI failure" }, { status: 400 });
    }
}
