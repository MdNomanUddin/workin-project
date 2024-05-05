import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBoscq6vNgvS8UbvpO17yTSv8IreJ7pTK0",
  authDomain: "pothole-detection-174e8.firebaseapp.com",
  projectId: "pothole-detection-174e8",
  storageBucket: "pothole-detection-174e8.appspot.com",
  messagingSenderId: "526995283864",
  appId: "1:526995283864:web:b44a401f0f7f80e20615ed",
  measurementId: "G-7J3E4JBKVX"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage  = getStorage(app);

// import { initializeApp, getApps } from "firebase/app";

// import { getAuth } from "firebase/auth";
// import { getFirestore, collection, getDocs } from "firebase/firestore";

// export const firebaseConfig = {
//     apiKey: "AIzaSyCdNLyy2P8YVXV_9ZtKMMFZiWDJmmsKh7M",
//     authDomain: "onlineounotes.firebaseapp.com",
//     projectId: "onlineounotes",
//     storageBucket: "onlineounotes.appspot.com",
//     messagingSenderId: "567815505682",
//     appId: "1:567815505682:web:54233388f6633d27a3d5cb",
//     measurementId: "G-HN50T8CSK6",
// };

