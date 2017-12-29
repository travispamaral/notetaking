import * as firebase from 'firebase'

const config = {
  apiKey: "AIzaSyA2hSonkTzbBHGJTEafniAB0IFueG8JQTA",
  authDomain: "notesapp-2181f.firebaseapp.com",
  databaseURL: "https://notesapp-2181f.firebaseio.com",
  projectId: "notesapp-2181f",
  storageBucket: "notesapp-2181f.appspot.com",
  messagingSenderId: "486188889011"
}

firebase.initializeApp(config)

export default firebase

export const database = firebase.database()
export const auth = firebase.auth()
export const provider = new firebase.auth.GoogleAuthProvider()
