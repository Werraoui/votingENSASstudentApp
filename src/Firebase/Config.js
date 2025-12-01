// src/Firebase/Config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✔️ Ta config Firebase — OK
const firebaseConfig = {
  apiKey: "AIzaSyCMcynWqQNLUmgFz3J5ciaRTQ9WRTAunGY",
  authDomain: "votingapp-84be6.firebaseapp.com",
  projectId: "votingapp-84be6",
  storageBucket: "votingapp-84be6.appspot.com",
  messagingSenderId: "471576810234",
  appId: "1:471576810234:web:b326850d0363c991676f43"
};

// ✔️ Initialisation propre
const app = initializeApp(firebaseConfig);

// ✔️ Auth (très important)
const auth = getAuth(app);

// ✔️ Firestore
const db = getFirestore(app);

// ✔️ Export pour le reste de l'application
export { auth, db };
