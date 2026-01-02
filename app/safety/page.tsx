export default function SafetyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">Safety & Privacy</h1>

            <div className="space-y-8 bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl">
                <section>
                    <h2 className="text-xl font-bold mb-2">Our Privacy Promise</h2>
                    <ul className="list-disc leading-relaxed pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                        <li>We do not store personally identifiable information (PII) about children.</li>
                        <li>Age and interest data is used solely to generate recommendations and is not permanently linked to a user profile in our current beta.</li>
                        <li>We do not sell data to third parties.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">AI Safety</h2>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                        Our AI is instructed to follow strict safety guidelines:
                    </p>
                    <ul className="list-disc leading-relaxed pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                        <li>No recommendations involving dangerous chemicals or sharp objects without explicit supervision warnings.</li>
                        <li>Age-appropriateness checks for every suggestion.</li>
                        <li>Emphasis on parent-supervised activities.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
