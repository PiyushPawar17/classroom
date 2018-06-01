import React from 'react';

import '../styles/Header.css';

class Header extends React.Component {

	render() {
		return (
			<div className="header">
				<button className="back-button">Back</button>
				<button className="home-button">Home</button>
				<span className="subject-name">{this.props.subjectCode} : {this.props.subject}</span>
				<button className="logout-button">Logout</button>
			</div>
		);
	}
}

export default Header;
