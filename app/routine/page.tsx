import { connectDB } from "@/lib/db";
import { Routine } from "@/lib/models";
import { Activity } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/Button"; // Assuming we can use this, or just standard button

export const dynamic = 'force-dynamic';

async function getLatestRoutine() {
    await connectDB();
    const routine = await Routine.findOne({}).sort({ createdAt: -1 });
    return routine;
}

export default async function MyRoutinePage() {
    let routine = null;
    let error = null;

    try {
        routine = await getLatestRoutine();
    } catch (e) {
        console.error("Failed to fetch routine:", e);
        error = "Failed to load your routine. Please check your connection.";
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-bold mb-4 text-red-500">Connection Error</h1>
                <p className="text-zinc-500 mb-8 max-w-lg mx-auto">
                    We couldn't connect to the database. If you are the site owner, please check your `MONGODB_URI` environment variable and ensure your database allows connections from Vercel (IP whitelist 0.0.0.0/0).
                </p>
                <p className="text-xs text-zinc-400 font-mono bg-zinc-100 dark:bg-zinc-900 p-2 rounded inline-block">
                    {/* Detailed error suppressed for security/cleanliness in UI, check console */}
                    Check console logs for details.
                </p>
            </div>
        )
    }

    if (!routine) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-bold mb-4">No Routine Found</h1>
                <p className="text-zinc-500 mb-8">You haven't created a routine yet.</p>
                <Link href="/planner">
                    <span className="bg-zinc-900 text-white px-6 py-3 rounded-xl">Create Routine</span>
                </Link>
            </div>
        );
    }

    const activities: Activity[] = routine.activities || [];
    const totalMinutes = activities.reduce((acc, curr) => acc + curr.durationMinutes, 0);

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex justify-between items-end mb-8 border-b pb-6 dark:border-zinc-800">
                <div>
                    <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400">
                        My Weekly Routine
                    </h1>
                    <p className="text-zinc-500">
                        Total Play Time: <span className="font-bold text-zinc-900 dark:text-zinc-200">{totalMinutes * 5} mins / week</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/planner">
                        <span className="text-sm font-medium hover:underline text-zinc-500">Edit / Create New</span>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                    <div key={day} className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                        <h3 className="text-center font-bold text-zinc-400 uppercase tracking-widest text-xs mb-2">{day}</h3>

                        {["Morning", "After School", "Evening"].map(timeSlot => {
                            const slotActivities = activities.filter(r => {
                                if (r.timeOfDay === timeSlot) return true;
                                if (!r.timeOfDay && timeSlot === "After School") return true;
                                return false;
                            });

                            if (slotActivities.length === 0) return null;

                            return (
                                <div key={timeSlot} className="space-y-2">
                                    <h4 className="text-[10px] font-bold text-zinc-300 dark:text-zinc-600 uppercase">{timeSlot}</h4>
                                    {slotActivities.map((a, idx) => (
                                        <div key={idx} className="bg-zinc-50 dark:bg-black/30 p-2 rounded-lg border-l-2 border-teal-500">
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
                ))}
            </div>
        </div>
    );
}
