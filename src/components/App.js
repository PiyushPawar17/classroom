import React from 'react';
import database, { firebase } from '../firebase/firebase';

import AppRouter from '../routes/AppRouter';

import '../styles/App.css';

class App extends React.Component {

	render() {
		return ( <AppRouter /> );
	}
}

export default App;
