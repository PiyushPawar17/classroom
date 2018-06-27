import React from 'react';
import { history } from '../routes/AppRouter';
import { firebase } from '../firebase/firebase';

import Background from './Background';

import '../styles/Classroom.css';

class Classroom extends React.Component {

	constructor() {
		super();

		firebase.auth().signOut();
	}

	render() {
		return (
			<div id="classroom">
				<Background />
				<div id="classroom-login-signup">
					<div className="classroom-title">Classroom</div>
					<button className="to-sign-in" onClick={() => history.push('/signin')}>Sign In</button>
					<button className="to-sign-up" onClick={() => history.push('/signup')}>Sign Up</button>
				</div>
			</div>
		);
	}
}

export default Classroom;
