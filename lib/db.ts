import mongoose from "mongoose";

export interface Activity {
  id: string;
  title: string;
  description: string;
  ageRange: string;
  tags: string[];
  durationMinutes: number;
  timeOfDay?: "Morning" | "After School" | "Evening" | string;
}

export interface Routine {
  id: string;
  parentEmail?: string;
  activities: Activity[];
  createdAt: Date;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("MongoDB connected");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Helper to maintain compatibility with existing consumers (optional)
// In a full migration, we might remove this or make it fetch from a standardized "Library" collection.
export function getActivities() {
  // Return seed data for display purposes since we don't save a global library in Mongo yet
  return [
    {
      id: "seed-1",
      title: "Sock Puppet Show",
      description: "Create puppets using old socks and put on a show behind the sofa.",
      ageRange: "3-6",
      tags: ["Creative", "Indoor"],
      durationMinutes: 30
    },
    {
      id: "seed-2",
      title: "Nature Scavenger Hunt",
      description: "Find a smooth rock, a green leaf, and a brown stick in the backyard.",
      ageRange: "4-8",
      tags: ["Outdoor", "Active"],
      durationMinutes: 45
    }
  ];
}
