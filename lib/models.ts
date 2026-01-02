import mongoose, { Schema, model, models } from "mongoose";

// Activity Schema (Subdocument)
const ActivitySchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    ageRange: { type: String, required: true },
    tags: [{ type: String }],
    durationMinutes: { type: Number, required: true },
    timeOfDay: { type: String }, // Optional
});

// Routine Schema
const RoutineSchema = new Schema({
    parentEmail: { type: String }, // Optional, for future use
    activities: [ActivitySchema],  // Embedded activities (User selected only)
    createdAt: { type: Date, default: Date.now },
});

// Waitlist Schema
const WaitlistSchema = new Schema({
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
});

export const Routine = models.Routine || model("Routine", RoutineSchema);
export const Waitlist = models.Waitlist || model("Waitlist", WaitlistSchema);
