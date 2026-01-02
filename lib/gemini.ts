import { GoogleGenerativeAI } from "@google/generative-ai";
import { Activity } from "./db";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateActivityRecommendations(age: string, interests: string[]): Promise<Activity[]> {
    const mockActivities: Activity[] = [
        {
            id: "mock-1",
            title: "Space Station Cardboard Build",
            description: "Use old boxes to build a spaceship. Great for future astronauts!",
            ageRange: age,
            tags: ["Creative", "Space"],
            durationMinutes: 45
        },
        {
            id: "mock-2",
            title: "Backyard Alien Hunt",
            description: "Search for 'alien' rocks and plants in the garden.",
            ageRange: age,
            tags: ["Outdoor", "Active"],
            durationMinutes: 30
        },
        {
            id: "mock-3",
            title: "Living Room Obstacle Course",
            description: "Use pillows and chairs to create a safe course to crawl under and over.",
            ageRange: age,
            tags: ["Active", "Indoor"],
            durationMinutes: 20
        }
    ];

    if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY is not set. Using mock data.");
        return mockActivities;
    }

    // 1. Define Foundational Activities (Consistent, Low Pressure)
    const foundationalActivities: Activity[] = [
        {
            id: "static-1",
            title: "Morning Stretch",
            description: "Reach for the sky, then touch your toes.",
            ageRange: "All",
            tags: ["Health", "Morning"],
            durationMinutes: 5,
            timeOfDay: "Morning" // Explicitly pinning this
        },
        {
            id: "static-2",
            title: "After-School Reset",
            description: "Drink water and take 5 deep breaths together.",
            ageRange: "All",
            tags: ["Calm", "Mindfulness"],
            durationMinutes: 5,
            timeOfDay: "After School"
        },
        {
            id: "static-3",
            title: "Tidy-Up Song",
            description: "Pick up 5 items before the song ends.",
            ageRange: "All",
            tags: ["Routine", "Habit"],
            durationMinutes: 8,
            timeOfDay: "Evening"
        }
    ];

    const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite"];

    const prompt = `
    You are a child development specialist designed to help parents plan calm, low-pressure offline play.
    
    Context:
    - Child Age: ${age}
    - Interests: ${interests.join(", ")}
    - Goal: 5 bite-sized, distinct activities (5-8 minutes each).
    
    Style Guide:
    - Calm, flexible, supportive.
    - NO screen time. All activities must be "Offline".
    
    Output Format:
    Return ONLY a valid JSON array of objects.
    Each object must have:
    - id: A unique string (e.g., "act_123")
    - title: String (Short, inviting)
    - description: String (Simple instruction, 1 sentence)
    - durationMinutes: Number (Integer, MUST be between 5 and 8)
    - tags: Array of strings (e.g., ["Creative", "Offline"])
    - ageRange: String (Target age)
    - timeOfDay: String (One of: "Morning", "After School", "Evening")
  `;

    for (const modelName of modelsToTry) {
        try {
            console.log(`Attempting to generate with model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();

            // Clean up if Gemini wraps in markdown
            text = text.replace(/```json/g, "").replace(/```/g, "").trim();

            const generatedActivities: Activity[] = JSON.parse(text);

            // 2. Combine Foundational + Generated
            // We put foundational ones first (or interspersed, but first is clearer for routine structure)
            return [...foundationalActivities, ...generatedActivities];

        } catch (error) {
            console.warn(`Model ${modelName} failed:`, error);
            // Continue to next model
        }
    }

    // If loop finishes without returning, all models failed
    console.error("All Gemini models failed. Falling back to mock data.");
    return mockActivities;
}
