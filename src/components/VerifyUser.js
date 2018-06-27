import React from 'react';
import { Notification } from 'react-notification';
import { history } from '../routes/AppRouter';
import { firebase } from '../firebase/firebase';

import Background from './Background';

import '../styles/VerifyUser.css';

class VerifyUser extends React.Component {

	constructor() {
		super();

		this.state = {
			emailVerificationSnackbar: false
		};

		this.sendVerification = this.sendVerification.bind(this);
	}

	cancel() {
		history.push('/');
	}

	sendVerification() {
		firebase.auth().currentUser.sendEmailVerification().then(() => {
			this.setState({ emailVerificationSnackbar: true } , () => {
				setTimeout(() => {
					this.setState({ emailVerificationSnackbar: false });
					history.push('/');
				}, 1500);
			});
		});
	}

	render() {
		const emailID = history.location.search.slice(1, history.location.search.length).split('=')[1];
		return (
			<div id="verify-user-page">
				<Background />
				<div className="verify-user">
					<Notification isActive={this.state.emailVerificationSnackbar} message="Email verification sent. Check your email." />
					<div className="ooops">Ooops!!</div>
					<div className="verify-user-info">Your Email is not verified.</div>
					<div className="verify-user-info">Check your inbox for the verification link or click the button below to send the verification link to the registered Email ID.</div>
					<div className="verify-user-info">Your Email ID : {emailID}</div>
					<button className="send-verification-button" onClick={this.sendVerification}>Send Verification Email</button>
					<button className="cancel-verification-button" onClick={this.cancel}>Cancel</button>
				</div>
			</div>
		);
	}
}

export default VerifyUser;
