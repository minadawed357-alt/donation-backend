import { createRequire } from "module";
import admin from "firebase-admin";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const require = createRequire(import.meta.url);
const serviceAccount = require("../../serviceAccount.json");

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();

const createAdmin = async () => {
  const email = "admin@donation.com";
  const password = "Admin@12345";

  // Check if admin already exists
  const snap = await db.collection("users")
    .where("email", "==", email)
    .limit(1)
    .get();

  if (!snap.empty) {
    console.log("Admin already exists!");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const ref = db.collection("users").doc();
  await ref.set({
    username: "Admin",
    email,
    password: hashedPassword,
    role: "admin",
    phone: "01000000000",
    age: 30,
    gender: "male",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  console.log("✅ Admin created successfully!");
  console.log("Email:", email);
  console.log("Password:", password);
  process.exit(0);
};

createAdmin().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});