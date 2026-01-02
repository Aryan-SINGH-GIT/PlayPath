import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Routine } from "@/lib/models";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        await connectDB();

        const routine = await Routine.create({
            activities: body.activities,
            // parentEmail: body.email // If we collected it
        });

        return NextResponse.json({ success: true, routineId: routine._id });
    } catch (error) {
        console.error("Routine Save Error:", error);
        return NextResponse.json({ error: "Failed to save routine" }, { status: 500 });
    }
}
