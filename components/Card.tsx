import React from "react";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6 ${className}`}>
            {children}
        </div>
    );
}
