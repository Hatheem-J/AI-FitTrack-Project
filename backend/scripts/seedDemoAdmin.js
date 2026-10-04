const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const connectDB = require("../src/config/db");
const User = require("../src/models/User");

const DEMO_ADMIN = {
  name: "AI FitTrack Demo Admin",
  email: process.env.DEMO_ADMIN_EMAIL || "demo.admin@aifittrack.local",
  password: process.env.DEMO_ADMIN_PASSWORD || "AIFitTrackAdmin@12345",
};

const run = async () => {
  try {
    await connectDB();
    let admin = await User.findOne({ email: DEMO_ADMIN.email }).select("+password");

    if (!admin) {
      admin = await User.create({ ...DEMO_ADMIN, role: "admin" });
      console.log("[CREATED] AI FitTrack Demo Admin account");
    } else {
      admin.name = DEMO_ADMIN.name;
      admin.role = "admin";
      admin.password = DEMO_ADMIN.password;
      await admin.save();
      console.log("[UPDATED] AI FitTrack Demo Admin account");
    }

    console.log(`[PASS] Demo Admin ready: ${admin.email}`);
  } catch (error) {
    console.error("[FAIL]", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
