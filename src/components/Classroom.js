import React from 'react';
import { history } from '../routes/AppRouter';
import { firebase } from '../firebase/firebase';

import '../styles/Classroom.css';

class Classroom extends React.Component {

	constructor() {
		super();

		firebase.auth().signOut();
	}

	render() {
		return (
			<div id="classroom">
				<div className="classroom-title">Classroom</div>
				<button className="to-sign-in" onClick={() => history.push('/signin')}>Sign In</button>
				<button className="to-sign-up" onClick={() => history.push('/signup')}>Sign Up</button>
			</div>
		);
	}
}

export default Classroom;
