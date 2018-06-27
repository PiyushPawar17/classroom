import React from 'react';
import { Notification } from 'react-notification';
import { firebase } from '../firebase/firebase';
import { history } from '../routes/AppRouter';

import Background from './Background';

import '../styles/SignIn.css';

class SignIn extends React.Component {

	constructor() {
		super();

		this.state = {
			errorSnackbar: false,
			errorMessage: ''
		};

		this.signIn = this.signIn.bind(this);
	}

	signIn(event) {
		event.preventDefault();
		firebase.auth().signInWithEmailAndPassword(this.refs.email.value, this.refs.password.value).then((user) => {
			if (user.user.emailVerified) {
				setTimeout(() => {
					history.push('/homepage');
				}, 500);
			}
			else {
				history.push('/verifyuser?email=' + user.user.email);
			}
		}).catch((error) => {
			this.setState({
				errorSnackbar: true,
				errorMessage: error.message
			}, () => {
				setTimeout(() => {
					this.setState({
						errorSnackbar: false,
						errorMessage: ''
					});
				}, 3000);
			});
		});
	}

	render() {
		return (
			<div id="sign-in-page">
				<Background />
				<div className="sign-in" onSubmit={this.signIn}>
					<Notification isActive={this.state.errorSnackbar} message={this.state.errorMessage} title="Error" />
					<div className="sign-in-title">Sign In</div>
					<form className="sign-in-form">
						<div>Email</div>
						<input type="text" className="sign-in-email" ref="email" />
						<div>Password</div>
						<input type="password" className="sign-in-password" ref="password" />
						<br />
						<input type="submit" value="Sign In" className="sign-in-button" />
						<input type="button" value="Cancel" className="sign-in-cancel-button" onClick={() => history.push('/')} />
					</form>
				</div>
			</div>
		);
	}
}

export default SignIn;
