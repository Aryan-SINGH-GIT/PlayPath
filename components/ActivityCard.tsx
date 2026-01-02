import React from "react";
import { Card } from "./Card";
import { Activity } from "../lib/db";

interface ActivityCardProps {
    activity: Activity;
    onSelect?: () => void;
    selected?: boolean;
}

export function ActivityCard({ activity, onSelect, selected }: ActivityCardProps) {
    return (
        <div
            onClick={onSelect}
            className={`cursor-pointer transition-all ${selected ? 'ring-2 ring-primary' : ''}`}
        >
            <Card className="h-full hover:bg-zinc-50 dark:hover:bg-zinc-900">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{activity.title}</h3>
                    <span className="text-xs font-medium px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                        {activity.durationMinutes} min
                    </span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                    {activity.description}
                </p>
                <div className="flex flex-wrap gap-2">
                    {activity.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md text-zinc-600 dark:text-zinc-400">
                            {tag}
                        </span>
                    ))}
                </div>
            </Card>
        </div>
    );
}
