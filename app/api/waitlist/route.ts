import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Waitlist } from "@/lib/models";
import { z } from "zod";

const waitlistSchema = z.object({
    email: z.string().email(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = waitlistSchema.parse(body);

        await connectDB();

        try {
            await Waitlist.create({ email });
        } catch (error: any) {
            if (error.code === 11000) {
                // Duplicate email, just return success to not leak info or suggest it's already there
                return NextResponse.json({ success: true, message: "Added to waitlist" });
            }
            throw error;
        }

        return NextResponse.json({ success: true, message: "Added to waitlist" });
    } catch (error) {
        console.error("Waitlist Error:", error);
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
}
