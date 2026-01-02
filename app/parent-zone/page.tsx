import { connectDB } from "@/lib/db";
import { Routine } from "@/lib/models";
import Link from "next/link";
import { Activity } from "@/lib/db";

export const dynamic = 'force-dynamic';

async function getLatestRoutine() {
    await connectDB();
    const routine = await Routine.findOne({}).sort({ createdAt: -1 });
    return routine;
}

export default async function ParentZonePage() {
    const routine = await getLatestRoutine();
    const activities: Activity[] = routine?.activities || [];
    const totalMinutes = activities.reduce((acc, curr) => acc + curr.durationMinutes, 0);

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">Parent Zone</h1>

            {/* Active Routine Widget */}
            {routine && (
                <div className="mb-10 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 border border-teal-100 dark:border-teal-800 p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-teal-900 dark:text-teal-100">Your Active Routine</h2>
                            <p className="text-sm text-teal-700 dark:text-teal-300">
                                {activities.length} activities • {totalMinutes * 5} mins/week
                            </p>
                        </div>
                        <Link href="/routine">
                            <span className="bg-white dark:bg-black text-teal-700 dark:text-teal-300 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:shadow hover:scale-105 transition-all">
                                View Full Plan
                            </span>
                        </Link>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {activities.slice(0, 5).map((a, i) => (
                            <div key={i} className="flex-shrink-0 bg-white dark:bg-black/40 h-16 w-16 flex items-center justify-center rounded-xl border border-teal-100 dark:border-teal-800 text-xs text-center p-1 text-teal-800 dark:text-teal-200">
                                {a.title.split(" ")[0]}...
                            </div>
                        ))}
                        {activities.length > 5 && (
                            <div className="flex-shrink-0 h-16 w-16 flex items-center justify-center text-teal-600 dark:text-teal-400 font-medium text-xs">
                                +{activities.length - 5} more
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="prose dark:prose-invert">
                <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8">
                    Resources and articles on child development, screen-free play, and building healthy routines.
                </p>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold mb-3">Why Offline Play Matters</h2>
                        <p className="text-zinc-500 leading-relaxed">
                            In a digital world, tactile, physical play is crucial for developing fine motor skills,
                            social intelligence, and emotional regulation. PlayPath focuses on bridging the gap
                            between digital convenience and physical reality.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">Building Routines</h2>
                        <p className="text-zinc-500 leading-relaxed">
                            Consistency helps children feel safe. By scheduling regular "PlayPath time",
                            you verify a habit of creativity that doesn't rely on screens.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
