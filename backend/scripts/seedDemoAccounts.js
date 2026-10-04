const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const connectDB = require("../src/config/db");
const User = require("../src/models/User");
const Workout = require("../src/models/Workout");
const { refreshWorkoutSearchMetadata } = require("../src/services/workoutSearchService");

const DEMO_USER = {
  name: "AI FitTrack Demo User",
  email: process.env.DEMO_USER_EMAIL || "demo.user@aifittrack.local",
  password: process.env.DEMO_USER_PASSWORD || "AIFitTrackDemo@12345",
  role: "user",
};

const DEMO_ADMIN = {
  name: "AI FitTrack Demo Admin",
  email: process.env.DEMO_ADMIN_EMAIL || "demo.admin@aifittrack.local",
  password: process.env.DEMO_ADMIN_PASSWORD || "AIFitTrackAdmin@12345",
  role: "admin",
};

const SAMPLE_WORKOUTS = [
  {
    workoutName: "Full Body Strength",
    category: "Strength",
    duration: 35,
    caloriesBurned: 240,
    workoutDate: new Date("2026-10-01"),
  },
  {
    workoutName: "Morning Mobility",
    category: "Mobility",
    duration: 25,
    caloriesBurned: 120,
    workoutDate: new Date("2026-09-30"),
  },
];

async function upsertAccount(account) {
  let user = await User.findOne({ email: account.email }).select("+password");

  if (!user) {
    return User.create(account);
  }

  user.name = account.name;
  user.role = account.role;
  user.password = account.password;
  await user.save();
  return user;
}

async function run() {
  try {
    await connectDB();
    console.log("\\n=== AI FITTRACK DEMO SEED ===");

    const demoUser = await upsertAccount(DEMO_USER);
    const demoAdmin = await upsertAccount(DEMO_ADMIN);

    for (const item of SAMPLE_WORKOUTS) {
      const workout = await Workout.findOneAndUpdate(
        { user: demoUser._id, workoutName: item.workoutName },
        { ...item, user: demoUser._id },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      await refreshWorkoutSearchMetadata(workout);
    }

    console.log(`[PASS] Demo User : ${demoUser.email}`);
    console.log(`[PASS] Demo Admin: ${demoAdmin.email}`);
    console.log(`[PASS] Sample workouts: ${SAMPLE_WORKOUTS.length}`);
    console.log(`[PASS] Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("[FAIL]", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
