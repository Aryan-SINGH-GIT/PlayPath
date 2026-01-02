"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export default function WaitlistPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("loading");

        try {
            const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) throw new Error("Failed");
            setStatus("success");
            setEmail("");
        } catch (err) {
            setStatus("error");
        }
    }

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <Card className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">Join the Waitlist</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Be the first to know when PlayPath launches its mobile app.
                    </p>
                </div>

                {status === "success" ? (
                    <div className="text-center py-8 text-green-600 bg-green-50 rounded-lg">
                        Thanks for joining! We'll be in touch.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                type="email"
                                id="email"
                                required
                                placeholder="parent@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        {status === "error" && (
                            <p className="text-sm text-red-500 text-center">Something went wrong. Please try again.</p>
                        )}
                        <Button type="submit" disabled={status === "loading"} className="w-full">
                            {status === "loading" ? "Joining..." : "Join Waitlist"}
                        </Button>
                    </form>
                )}
            </Card>
        </div>
    );
}
