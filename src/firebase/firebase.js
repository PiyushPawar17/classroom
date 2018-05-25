import * as firebase from 'firebase';

const config = {
	apiKey: "AIzaSyCG9Ls6Pyqdbg5k8aV3wyy8pEPO0qxoHMU",
	authDomain: "classroom-db620.firebaseapp.com",
	databaseURL: "https://classroom-db620.firebaseio.com",
	projectId: "classroom-db620",
	storageBucket: "classroom-db620.appspot.com",
	messagingSenderId: "65196655317"
};

firebase.initializeApp(config);

const database = firebase.database();

export { firebase, database as default };
