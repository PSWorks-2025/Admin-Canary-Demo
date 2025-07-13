import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"
const firebaseConfig = {
  apiKey: "AIzaSyCH2SEBLRFf_g_aWqiW3Y6Qk---kmWaNPY",
  authDomain: "canary-demo-dc73e.firebaseapp.com",
  projectId: "canary-demo-dc73e",
  storageBucket: "canary-demo-dc73e.firebasestorage.app",
  messagingSenderId: "129602806738",
  appId: "1:129602806738:web:30666a74acafffbc505e0b",
  measurementId: "G-3LBLWMX6QC"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const storage = getStorage(app)
