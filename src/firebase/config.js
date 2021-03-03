import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseApp = firebase.initializeApp({ 
    //   YOUR FIREBASE CONFIG
});



const db = firebaseApp.firestore();
const fbAuth = firebaseApp.auth();

// collection list
const dbProducts = db.collection('products');
const dbCategories = db.collection('categories');

export {fbAuth, dbProducts, dbCategories, db};