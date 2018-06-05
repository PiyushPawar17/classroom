import React from 'react';
import { firebase } from '../firebase/firebase';
import { history } from '../routes/AppRouter';

import '../styles/SignIn.css';

class SignIn extends React.Component {

	constructor() {
		super();

		this.signIn = this.signIn.bind(this);
	}

	signIn(event) {
		event.preventDefault();
		firebase.auth().signInWithEmailAndPassword(this.refs.email.value, this.refs.password.value).then((user) => {
			setTimeout(() => {
				history.push('/homepage');
			}, 500);
		}).catch((error) => {
			console.log(error.code, error.message);
		});
	}

	render() {
		return (
			<div className="sign-in" onSubmit={this.signIn}>
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
		);
	}
}

export default SignIn;
