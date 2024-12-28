import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import app from "../config/firebase";

const db = getFirestore(app);

export const tunePreferencesService = {
  async getTunePreferences(userId, tuneId) {
    try {
      const docRef = doc(db, "tunePreferences", `${userId}_${tuneId}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      }

      return { versionOrder: [] };
    } catch (error) {
      console.error("Error getting tune preferences:", error);
      return { versionOrder: [] };
    }
  },

  async saveTunePreferences(userId, tuneId, versionOrder) {
    try {
      const docRef = doc(db, "tunePreferences", `${userId}_${tuneId}`);
      await setDoc(
        docRef,
        {
          userId,
          tuneId,
          versionOrder,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      return true;
    } catch (error) {
      console.error("Error saving tune preferences:", error);
      return false;
    }
  },
};
