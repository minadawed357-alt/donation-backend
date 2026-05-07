import { db } from "../firebaseAdmin.js";

const addictionsCollection = db.collection("addictions");

const Addiction = {
  findOne: async ({ user }) => {
    const snap = await addictionsCollection.where("user", "==", user).limit(1).get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    const data = { _id: doc.id, id: doc.id, ...doc.data() };
    // Add save method
    data.save = async () => {
      await addictionsCollection.doc(doc.id).update({
        addictions: data.addictions,
        updatedAt: new Date().toISOString(),
      });
    };
    return data;
  },

  create: async (data) => {
    const ref = addictionsCollection.doc();
    const docData = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await ref.set(docData);
    const result = { _id: ref.id, id: ref.id, ...docData };
    result.save = async () => {
      await addictionsCollection.doc(ref.id).update({
        addictions: result.addictions,
        updatedAt: new Date().toISOString(),
      });
    };
    return result;
  },
};

export default Addiction;