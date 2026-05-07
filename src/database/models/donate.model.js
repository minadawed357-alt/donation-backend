import { db } from "../firebaseAdmin.js";

const donatesCollection = db.collection("donates");

const donateModel = {
  create: async (data) => {
    const ref = donatesCollection.doc();
    const docData = { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    await ref.set(docData);
    return { _id: ref.id, id: ref.id, ...docData };
  },

  find: async (filters = {}) => {
    let query = donatesCollection;
    if (filters.status) query = query.where("status", "==", filters.status);
    if (filters.user) query = query.where("user", "==", filters.user);
    const snap = await query.get();
    return snap.docs.map((d) => ({ _id: d.id, id: d.id, ...d.data() }));
  },

  findById: async (id) => {
    const doc = await donatesCollection.doc(id).get();
    if (!doc.exists) return null;
    return { _id: doc.id, id: doc.id, ...doc.data() };
  },

  findByIdAndUpdate: async (id, update, options = {}) => {
    const ref = donatesCollection.doc(id);
    const doc = await ref.get();
    if (!doc.exists) return null;
    await ref.update({ ...update, updatedAt: new Date().toISOString() });
    if (options.new) {
      const updated = await ref.get();
      return { _id: updated.id, id: updated.id, ...updated.data() };
    }
    return null;
  },

  findByIdAndDelete: async (id) => {
    const ref = donatesCollection.doc(id);
    const doc = await ref.get();
    if (!doc.exists) return null;
    const data = { _id: doc.id, id: doc.id, ...doc.data() };
    await ref.delete();
    return data;
  },
};

export default donateModel;