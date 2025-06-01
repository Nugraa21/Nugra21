// import { initializeApp } from "firebase/app";
// import {
//   getFirestore,
//   collection,
//   addDoc,
//   serverTimestamp,
//   onSnapshot,
//   query,
//   orderBy,
//   getDocs,
//   deleteDoc,
//   doc,
//   updateDoc,
// } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyDw2lfjaYz04az7s0iuWt4CSgniK1tns40",
//   authDomain: "portfolio-362f4.firebaseapp.com",
//   projectId: "portfolio-362f4",
//   storageBucket: "portfolio-362f4.firebasestorage.app",
//   messagingSenderId: "464310848455",
//   appId: "1:464310848455:web:9342d947132f5653d527e2",
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// export {
//   db,
//   collection,
//   addDoc,
//   serverTimestamp,
//   onSnapshot,
//   query,
//   orderBy,
//   getDocs,
//   deleteDoc,
//   doc,
//   updateDoc,
// };

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDw2lfjaYz04az7s0iuWt4CSgniK1tns40",
  authDomain: "portfolio-362f4.firebaseapp.com",
  projectId: "portfolio-362f4",
  storageBucket: "portfolio-362f4.firebasestorage.app",
  messagingSenderId: "464310848455",
  appId: "1:464310848455:web:9342d947132f5653d527e2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
  db,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
};