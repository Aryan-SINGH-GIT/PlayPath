import { NextResponse } from "next/server";

export async function POST(request: Request) {
    // In a real app, this would update the user's database record to mark these activities as "liked" or "approved"
    const body = await request.json();
    console.log("Approved activities:", body.activityIds);

    return NextResponse.json({ success: true });
}
