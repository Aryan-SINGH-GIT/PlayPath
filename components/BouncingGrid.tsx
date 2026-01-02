"use client";

import React, { useEffect, useState } from 'react';

export const BouncingGrid = () => {
    // We only render on client to avoid hydration mismatch for the random delays/positions if we used them
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Create enough dots to fill a large screen. 600 should be safe.
    // 25 cols x 24 rows approx 600 dots can cover a standard screen comfortably.
    const dots = Array.from({ length: 600 }, (_, i) => i);

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
            {/* Removed justify-center/content-center to allow filling the page */}
            <div className="absolute inset-0 grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] gap-8 p-4 content-start">
                {dots.map((i) => (
                    <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600 animate-bounce-grid"
                        style={{
                            // Random animation delay for the "wave" or "organic" effect
                            animationDelay: `${(i % 15) * 0.1 + Math.random() * 2}s`,
                            animationDuration: `${3 + Math.random() * 2}s`
                        }}
                    ></div>
                ))}
            </div>

            <style jsx global>{`
                @keyframes bounce-grid {
                    /* Start from scaling 1 and go up/scale larger, then back */
                    0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
                    50% { transform: translateY(-15px) scale(1.3); opacity: 0.8; }
                }
                .animate-bounce-grid {
                    animation-name: bounce-grid;
                    animation-timing-function: ease-in-out;
                    animation-iteration-count: infinite;
                }
            `}</style>
        </div>
    );
};
