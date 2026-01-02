"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ActivityCard } from "@/components/ActivityCard";
import { Activity } from "@/lib/db";

export default function PlannerPage() {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [age, setAge] = useState("");
    const [interests, setInterests] = useState("");
    const [recommendations, setRecommendations] = useState<Activity[]>([]);
    const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());

    async function handleGenerate() {
        if (!age || !interests) return;
        setStep(2);

        try {
            const interestsArray = interests.split(",").map((s) => s.trim());
            const res = await fetch("/api/recommend-activities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ age, interests: interestsArray }),
            });
            const data = await res.json();
            if (data.activities) {
                setRecommendations(data.activities);
                setStep(3);
            } else {
                // Handle error
                setStep(1);
            }
        } catch (error) {
            console.error(error);
            setStep(1);
        }
    }

    function toggleApproval(id: string) {
        const next = new Set(approvedIds);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setApprovedIds(next);
    }

    async function handleFinalizeRoutine() {
        const approvedActivities = recommendations.filter(a => approvedIds.has(a.id));

        try {
            const res = await fetch('/api/routine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activities: approvedActivities })
            });

            if (res.ok) {
                setStep(4);
            } else {
                console.error("Failed to save routine");
            }
        } catch (e) {
            console.error("Network error saving routine", e);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[80vh]">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">Guided Play Planner</h1>
                <p className="text-zinc-500">
                    Step {step} of 4: {step === 1 ? "Child Profile" : step === 2 ? "Thinking..." : step === 3 ? "Review Suggestions" : "Your Routine"}
                </p>
            </div>

            {step === 1 && (
                <Card className="max-w-xl mx-auto space-y-6 p-8">
                    <div>
                        <label className="block text-sm font-medium mb-2">Child's Age (e.g. "4 years", "6 months")</label>
                        <input
                            type="text"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="5 years old"
                            className="w-full px-4 py-3 rounded-xl border border-input bg-background"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Interests (comma separated)</label>
                        <input
                            type="text"
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                            placeholder="Dinosaurs, Painting, Puddles"
                            className="w-full px-4 py-3 rounded-xl border border-input bg-background"
                        />
                    </div>
                    <Button onClick={handleGenerate} disabled={!age || !interests} className="w-full">
                        Generate Activities
                    </Button>
                </Card>
            )}

            {step === 2 && (
                <div className="text-center py-20 animate-pulse space-y-4">
                    <div className="text-4xl">✨</div>
                    <h2 className="text-xl font-medium">Consulting our play experts...</h2>
                    <p className="text-zinc-500">We're finding the best low-screen activities for you.</p>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6">
                    <p className="text-center text-zinc-600 max-w-2xl mx-auto">
                        We've designed a balanced routine for you.
                        It includes <b>Foundational Habits</b> (for consistency) and <b>Creative Play</b> (based on interests).
                        Select the ones you want to keep.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendations.map((activity) => (
                            <div key={activity.id} className="relative group">
                                <ActivityCard
                                    activity={activity}
                                    onSelect={() => toggleApproval(activity.id)}
                                    selected={approvedIds.has(activity.id)}
                                />
                                <div className="absolute top-4 right-4 text-2xl cursor-pointer pointer-events-none transition-opacity">
                                    {approvedIds.has(activity.id) && "✅"}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center gap-4 pt-8 border-t dark:border-zinc-800">
                        <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                        <Button onClick={handleFinalizeRoutine} disabled={approvedIds.size === 0}>
                            Save Routine ({approvedIds.size})
                        </Button>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="space-y-8 animate-fade-in">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400">
                            Your Weekly Routine
                        </h2>
                        <p className="text-zinc-500 max-w-lg mx-auto">
                            A flexible, low-pressure plan.
                            <br />
                            <span className="font-semibold text-zinc-900 dark:text-zinc-200">
                                Total: {Array.from(approvedIds).map(id => recommendations.find(r => r.id === id)?.durationMinutes || 0).reduce((a, b) => a + b, 0) * 5} mins / week
                            </span>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                        {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => {
                            // Simple distribution logic for demo:
                            // Assign foundational to every day? Or specific ones?
                            // Let's just show the only specific timeOfDay ones in their slots,
                            // AND distribute the 'generic' ones (no timeOfDay) across different slots or just "After School" by default.

                            return (
                                <div key={day} className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="text-center font-bold text-zinc-400 uppercase tracking-widest text-xs mb-2">{day}</h3>

                                    {["Morning", "After School", "Evening"].map(timeSlot => {
                                        // Find activities for this slot. 
                                        // If 'timeOfDay' matches OR if it's generic and we map it to 'After School' as default
                                        const slotActivities = recommendations.filter(r => approvedIds.has(r.id)).filter(r => {
                                            if (r.timeOfDay === timeSlot) return true;
                                            // Default fallback for items without explicit time
                                            if (!r.timeOfDay && timeSlot === "After School") return true;
                                            return false;
                                        });

                                        if (slotActivities.length === 0) return null;

                                        return (
                                            <div key={timeSlot} className="space-y-2">
                                                <h4 className="text-[10px] font-bold text-zinc-300 dark:text-zinc-600 uppercase">{timeSlot}</h4>
                                                {slotActivities.map(a => (
                                                    <div key={a.id + day} className="bg-zinc-50 dark:bg-black/30 p-2 rounded-lg border-l-2 border-teal-500">
                                                        <div className="flex justify-between items-start">
                                                            <span className="font-medium text-sm leading-tight">{a.title}</span>
                                                            <span className="text-[10px] text-zinc-400 whitespace-nowrap">{a.durationMinutes}m</span>
                                                        </div>
                                                        <div className="flex gap-1 mt-1 flex-wrap">
                                                            <span className="text-[8px] px-1.5 py-0.5 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 rounded-full">
                                                                Offline
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-center gap-4">
                        <Button variant="outline" onClick={() => { setStep(1); setApprovedIds(new Set()); }}>
                            Regenerate
                        </Button>
                        <Button onClick={() => window.print()} className="bg-zinc-900 text-white hover:bg-zinc-800">
                            Print Weekly Plan
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
