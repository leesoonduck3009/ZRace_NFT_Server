// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, collection } = require('firebase/firestore');

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLovHgkm6XhZCMplxDrueBGQGsa7UME5Q",
  authDomain: "test-377a4.firebaseapp.com",
  projectId: "test-377a4",
  storageBucket: "test-377a4.appspot.com",
  messagingSenderId: "1080312480220",
  appId: "1:1080312480220:web:9967587ccce206d87ccf19",
  measurementId: "G-CPQCD28Z9Q"
};
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firebaseApp);
module.exports = {firebaseApp, db};
