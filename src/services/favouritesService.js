import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import app from "../config/firebase";

const db = getFirestore(app);

export const favouritesService = {
  async getFavorites(userId, type = "hatao") {
    try {
      const docRef = doc(db, "favorites", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data()[type] || [];
      }

      // Initialize empty favorites for new users
      await setDoc(docRef, { [type]: [] }, { merge: true });
      return [];
    } catch (error) {
      console.error("Error getting favorites:", error);
      return [];
    }
  },

  async addFavorite(userId, tuneId, type = "hatao") {
    try {
      const docRef = doc(db, "favorites", userId);
      await setDoc(
        docRef,
        {
          [type]: arrayUnion(tuneId),
        },
        { merge: true }
      );
      return true;
    } catch (error) {
      console.error("Error adding favorite:", error);
      return false;
    }
  },

  async removeFavorite(userId, tuneId, type = "hatao") {
    try {
      const docRef = doc(db, "favorites", userId);
      await setDoc(
        docRef,
        {
          [type]: arrayRemove(tuneId),
        },
        { merge: true }
      );
      return true;
    } catch (error) {
      console.error("Error removing favorite:", error);
      return false;
    }
  },
};
