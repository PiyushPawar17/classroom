import React from 'react';
import { Notification } from 'react-notification';
import { database, firebase } from '../firebase/firebase';
import { history } from '../routes/AppRouter';

import Background from './Background';

import '../styles/SignUp.css';

class SignUp extends React.Component {

	constructor() {
		super();

		this.state = {
			passwordMatchSnackbar: false,
			errorSnackbar: false,
			emailVerificationSnackbar: false,
			errorMessage: ''
		};

		this.signUp = this.signUp.bind(this);
	}

	signUp(event) {
		event.preventDefault();

		if (this.refs.password.value !== this.refs.confirmPassword.value) {
			this.setState({ passwordMatchSnackbar: true }, () => {
				setTimeout(() => {
					this.setState({ passwordMatchSnackbar: false });
				}, 2500);
			});
			return;
		}

		firebase.auth().createUserWithEmailAndPassword(this.refs.email.value, this.refs.password.value).then((user) => {
			database.ref('users').push({
				userEmail: user.user.email,
				userUID: user.user.uid
			});

			firebase.auth().currentUser.sendEmailVerification().then(() => {
				this.setState({ emailVerificationSnackbar: true } , () => {
					setTimeout(() => {
						this.setState({ emailVerificationSnackbar: false });
						history.push('/details');
					}, 1500);
				});
			});
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
			<div id="sign-up-page">
				<Background />
				<div className="sign-up" onSubmit={this.signUp}>
					<Notification isActive={this.state.passwordMatchSnackbar} message="Password does not match" title="Error" />
					<Notification isActive={this.state.errorSnackbar} message={this.state.errorMessage} title="Error" />
					<Notification isActive={this.state.emailVerificationSnackbar} message="Email verification sent. Check your email." />
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
			</div>
		);
	}
}

export default SignUp;
