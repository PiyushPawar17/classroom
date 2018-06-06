import React from 'react';
import { firebase } from '../firebase/firebase';
import { history } from '../routes/AppRouter';

import '../styles/Header.css';

class Header extends React.Component {

	goBack() {
		history.goBack();
	}

	goHome() {
		history.push('/homepage');
	}

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
				<button className="back-button" onClick={this.goBack}>Back</button>
				<button className="home-button" onClick={this.goHome}>Home</button>
				<span className="subject-name">{this.props.subjectCode} : {this.props.subjectName}</span>
				<button className="logout-button" onClick={this.logout}>Logout</button>
			</div>
		);
	}
}

export default Header;
