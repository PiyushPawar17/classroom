import React from 'react';
import { history } from '../routes/AppRouter';

import '../styles/SignIn.css';

class SignIn extends React.Component {

	render() {
		return (
			<div className="sign-in">
				<div className="sign-in-title">Sign In</div>
				<form className="sign-in-form">
					<div>Enter your email address</div>
					<input type="text" className="sign-in-email" />
					<div>Enter your password</div>
					<input type="password" className="sign-in-password" />
					<br />
					<input type="submit" value="Sign In" className="sign-in-button" />
					<input type="button" value="Cancel" className="sign-in-cancel-button" onClick={() => history.push('/')} />
				</form>
			</div>
		);
	}
}

export default SignIn;
