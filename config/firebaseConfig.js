// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, collection } = require('firebase/firestore');
const { getAuth, updateProfile } = require("firebase/auth");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0QjDdhqU3M3e8jsDLX3UpNq1VY63vJPo",
  authDomain: "strideup-94d1a.firebaseapp.com",
  projectId: "strideup-94d1a",
  storageBucket: "strideup-94d1a.appspot.com",
  messagingSenderId: "19643724169",
  appId: "1:19643724169:web:6b6c2775bf5c7f9494b158",
  measurementId: "G-7V8DKRZE0J"
};
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
module.exports = {firebaseApp, db,auth};
