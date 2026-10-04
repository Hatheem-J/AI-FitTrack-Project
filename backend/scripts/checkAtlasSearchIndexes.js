const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const connectDB = require("../src/config/db");
const Workout = require("../src/models/Workout");
const {
  ATLAS_SEARCH_INDEX,
  ATLAS_VECTOR_INDEX,
} = require("../src/services/workoutSearchService");

const main = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required");
  }

  await connectDB();

  const indexes = await Workout.collection.listSearchIndexes().toArray();
  const required = [ATLAS_SEARCH_INDEX, ATLAS_VECTOR_INDEX];

  for (const name of required) {
    const index = indexes.find((item) => item.name === name);

    if (!index) {
      console.log(`${name} STATUS: MISSING QUERYABLE: false`);
      continue;
    }

    console.log(
      `${name} STATUS: ${index.status || "UNKNOWN"} QUERYABLE: ${Boolean(index.queryable)} TYPE: ${index.type || "search"}`
    );
  }
};

main()
  .catch((error) => {
    console.error(`Atlas Search index status check failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
