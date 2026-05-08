import { db } from "./firebaseAdmin.js";

const dbConnection = async () => {
  try {
    // Test Firestore connection
    await db.collection("_health").doc("ping").set({ ok: true });

    console.log("Firebase Firestore Connected");
  } catch (err) {
    console.error("Firebase connection error:", err);
  }
};

export default dbConnection;