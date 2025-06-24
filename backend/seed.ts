import mongoose from "mongoose";
import dotenv from "dotenv";
import { Workplace } from "./models/workplace"; // contains Workplace model
import { User } from "./models/user"; // contains User model
import { Incident } from "./models/incident"; // create this file if needed
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/dbLAA";


const TITANIC_WORKPLACE = {
  name: "RMS Titanic",
  location: "ICEBERG DEAD AHEAD"
};


const usersData = [
  { name: "Annie McGowan", email: "mcgowan@iced.1912", role: "user", password: "sunk123" },
  { name: "Rizk Hanna", email: "rizk@iced.1912", role: "user", password: "sunk123" },
  { name: "Anders Johan Andersson", email: "andersson@iced.1912", role: "foreman", password: "sunk123" },
  { name: "Viktor Richard Lindahl", email: "lindahl@iced.1912", role: "user", password: "sunk123" },
  { name: "Signe Ohman", email: "ohman@iced.1912", role: "user", password: "sunk123" },
  { name: "Elias Nicola-Yarred", email: "nicola@iced.1912", role: "user", password: "sunk123" },
  { name: "Mauritz Hakan Björnström", email: "bjornstrom@iced.1912", role: "foreman", password: "sunk123" },
  { name: "Ali Lam", email: "lam@iced.1912", role: "user", password: "sunk123" },
  { name: "William Sloper", email: "sloper@iced.1912", role: "user", password: "sunk123" },
  { name: "Carl Olof Lindblom", email: "lindblom@iced.1912", role: "foreman", password: "sunk123" }
];

const seed = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("🌊 Connected to DB");

    // Clear collections
    await Promise.all([
      Workplace.deleteMany({}),
      User.deleteMany({}),
      Incident.deleteMany({})
    ]);
    console.log("🧼 Cleared previous data");

    // Create workplace
    const workplace = await Workplace.create(TITANIC_WORKPLACE);
    console.log(`🚢 Created workplace: ${workplace.name}`);

    // Create users
    const createdUsers = await User.insertMany(
      usersData.map(u => ({
        ...u,
        workplaceId: workplace._id
      }))
    );
    console.log(`👥 Inserted ${createdUsers.length} users`);

    // Create incidents for each user
    const incidentEntries = createdUsers.map(user => ({
      title: "Iceberg Patch for Titanic",
      description: "critical error Titanic needs further Patching",
      photoPath: "",
      reportedBy: user._id,
      workplaceId: workplace._id,
      status: "closed",
      createdAt: new Date(),
      riskLevel: "High"
    }));

    await Incident.insertMany(incidentEntries);
    console.log(`❄️  Logged ${incidentEntries.length} tragic incidents`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

seed();