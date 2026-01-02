import Link from "next/link";
import { Button } from "../components/Button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="max-w-2xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
            Play with purpose.
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            PlayPath helps you build meaningful playtime routines for your children,
            backed by science and suggested by AI, but always approved by you.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/planner">
            <Button className="w-full sm:w-auto text-lg px-8 py-6">
              Start Guided Planner
            </Button>
          </Link>
          <Link href="/activities">
            <Button variant="outline" className="w-full sm:w-auto text-lg px-8 py-6">
              Browse Activities
            </Button>
          </Link>
        </div>

        <div className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
          <div className="space-y-2">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">AI-Powered</h3>
            <p className="text-sm text-zinc-500 text-balance">
              Personalized activity suggestions based on your child's age and interests.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Parent Control</h3>
            <p className="text-sm text-zinc-500 text-balance">
              You review and approve every activity before it makes it to the routine.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Offline Fun</h3>
            <p className="text-sm text-zinc-500 text-balance">
              Creative, physical, and educational activities to do away from screens.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
