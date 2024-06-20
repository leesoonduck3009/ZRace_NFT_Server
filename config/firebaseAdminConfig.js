// firebaseInit.js
const admin = require('firebase-admin');
const serviceAccount = require('../googleApi.json');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const firestore = getFirestore();
module.exports = {admin,firestore};