import React from 'react';
import { firebase } from '../firebase/firebase';
import { history } from '../routes/AppRouter';

import '../styles/SignUp.css';

class SignUp extends React.Component {

	constructor() {
		super();

		this.signUp = this.signUp.bind(this);
	}

	signUp(event) {
		event.preventDefault();
		firebase.auth().createUserWithEmailAndPassword(this.refs.email.value, this.refs.password.value).then((user) => {
			/*console.log(user);
			firebase.auth().currentUser.sendEmailVerification().then(() => {
				console.log('Email Sent');
			});*/
		}).catch((error) => {
			console.log(error.code, error.message);
		});
	}

	render() {
		return (
			<div className="sign-up" onSubmit={this.signUp}>
				<div className="sign-up-title">Sign Up</div>
				<form className="sign-up-form">
					<div>Email</div>
					<input type="text" className="sign-up-email" ref="email" />
					<div>Password</div>
					<input type="password" className="sign-up-password" ref="password" />
					<div>Confirm Password</div>
					<input type="password" className="sign-up-password" ref="confirmPassword" />
					<br />
					<input type="submit" value="Sign Up" className="sign-up-submit" />
					<input type="button" value="Cancel" className="sign-up-cancel-button" onClick={() => history.push('/')} />
				</form>
			</div>
		);
	}
}

export default SignUp;
