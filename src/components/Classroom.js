import React from 'react';
import { Link } from 'react-router-dom';
import { history } from '../routes/AppRouter';

import '../styles/Classroom.css';

class Classroom extends React.Component {

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
