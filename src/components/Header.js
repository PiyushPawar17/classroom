import React from 'react';
import { firebase } from '../firebase/firebase';
import { history } from '../routes/AppRouter';

import '../styles/Header.css';

class Header extends React.Component {

	logout() {
		firebase.auth().signOut().then(() => {
			history.push('/');
		}).catch((error) => {
			console.log(error);
		});
	}

	render() {
		return (
			<div className="header">
				<button className="back-button">Back</button>
				<button className="home-button">Home</button>
				<span className="subject-name">{this.props.subjectCode} : {this.props.subject}</span>
				<button className="logout-button" onClick={this.logout}>Logout</button>
			</div>
		);
	}
}

export default Header;
