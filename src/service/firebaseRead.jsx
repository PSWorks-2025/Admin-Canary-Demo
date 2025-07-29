import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export const readData = async () => {
  try {
    const docRef = doc(db, "Global", "components");
    const mainRef = doc(db, "Main pages", "components");
    
    const docSnap = await getDoc(docRef);
    const mainSnap = await getDoc(mainRef);    

    const globalData = docSnap.exists() ? docSnap.data() : {};
    const mainData = mainSnap.exists() ? mainSnap.data() : {};

    console.log(mainData);
    

    return {
      global: globalData,
      main: mainData,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { global: {}, main: {} };
  }
};