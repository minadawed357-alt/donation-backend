import { db } from "../firebaseAdmin.js";

const usersCollection = db.collection("users");

const userModel = {
  // Find user by email
  findOne: async ({ email, active } = {}) => {
    let query = usersCollection;
    if (email !== undefined) query = query.where("email", "==", email);
    if (active !== undefined) query = query.where("active", "==", active);
    const snap = await query.limit(1).get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return { _id: doc.id, id: doc.id, ...doc.data() };
  },

  // Find user by ID
  findById: async (id) => {
    const doc = await usersCollection.doc(id).get();
    if (!doc.exists) return null;
    return { _id: doc.id, id: doc.id, ...doc.data() };
  },

  // Create new user
  create: async (data) => {
    const ref = usersCollection.doc();
    const userData = {
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role || "user",
      phone: data.phone,
      age: data.age || null,
      gender: data.gender || null,
      active: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await ref.set(userData);
    return { _id: ref.id, id: ref.id, ...userData };
  },

  // Find by ID and update
  findByIdAndUpdate: async (id, update, options = {}) => {
    const ref = usersCollection.doc(id);
    await ref.update({ ...update, updatedAt: new Date().toISOString() });
    if (options.new) {
      const doc = await ref.get();
      return { _id: doc.id, id: doc.id, ...doc.data() };
    }
    return null;
  },

  // Save method (for instance-like usage)
  save: async (id, data) => {
    await usersCollection.doc(id).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },
};

export default userModel;