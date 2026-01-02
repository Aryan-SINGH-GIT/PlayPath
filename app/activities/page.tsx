import { connectDB } from "@/lib/db";
import { Routine } from "@/lib/models";
import { ActivityCard } from "@/components/ActivityCard";
import { Activity } from "@/lib/db";

export const dynamic = 'force-dynamic';

async function getSavedActivities() {
    await connectDB();
    // Fetch all routines, sort strictly by creation
    const routines = await Routine.find({}).sort({ createdAt: -1 });

    // Flatten all activities from all routines
    const allActivities: Activity[] = routines.flatMap((r: any) => r.activities || []);

    // Deduplicate by ID
    const uniqueActivities = Array.from(new Map(allActivities.map(item => [item.id, item])).values());

    return uniqueActivities;
}

export default async function ActivitiesPage() {
    const activities = await getSavedActivities();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">My Activity Library</h1>
                <p className="text-zinc-600 dark:text-zinc-400">
                    All the activities you've saved from your routines.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                ))}
            </div>

            {activities.length === 0 && (
                <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
                    <p className="text-zinc-500 mb-4">
                        You haven't saved any routines yet.
                    </p>
                    <a href="/planner" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity">
                        Create Your First Routine
                    </a>
                </div>
            )}
        </div>
    );
}
