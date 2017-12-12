import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as firebase from 'firebase'

import './App.css'

const config = {
  apiKey: "AIzaSyA2hSonkTzbBHGJTEafniAB0IFueG8JQTA",
  authDomain: "notesapp-2181f.firebaseapp.com",
  databaseURL: "https://notesapp-2181f.firebaseio.com",
  projectId: "notesapp-2181f",
  storageBucket: "notesapp-2181f.appspot.com",
  messagingSenderId: "486188889011"
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'))
