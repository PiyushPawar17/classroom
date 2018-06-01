import React from 'react';
import { firebase } from '../firebase/firebase';

import AppRouter from '../routes/AppRouter';

import '../styles/App.css';

class App extends React.Component {

	render() {
		return ( <AppRouter /> );
	}
}

firebase.auth().onAuthStateChanged((user) => {
	if (user)
		console.log('Logged In');
	else
		console.log('Logged Out');
});

export default App;
