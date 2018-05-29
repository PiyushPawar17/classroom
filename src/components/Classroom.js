import React from 'react';

import '../styles/Classroom.css';

class Classroom extends React.Component {

	render() {
		return (
			<div id="classroom">
				<div className="classroom-title">Classroom</div>
				<button className="to-sign-in">Sign In</button>
				<button className="to-sign-up">Sign Up</button>
			</div>
		);
	}
}

export default Classroom;
