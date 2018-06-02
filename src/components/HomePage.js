import React from 'react';
import Subjects from './Subjects';

import '../styles/HomePage.css';

class HomePage extends React.Component {

	render() {
		return (
			<div className="home-page">
				<Subjects />
				<div className="add-subject-div">
					<div className="add-subject-button">+</div>
					<div className="add-subject-label">Add Subject</div>
				</div>
			</div>
		);
	}
}

export default HomePage;
