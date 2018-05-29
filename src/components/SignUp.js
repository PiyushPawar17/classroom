import React from 'react';

import '../styles/SignUp.css';

class SignUp extends React.Component {

	render() {
		return (
			<div className="sign-up">
				<div className="sign-up-title">Sign Up</div>
				<form className="sign-up-form">
					<div>Email</div>
					<input type="text" className="sign-up-email" />
					<div>Password</div>
					<input type="password" className="sign-up-password" />
					<div>Confirm Password</div>
					<input type="password" className="sign-up-password" />
					<br />
					<input type="submit" value="Sign Up" className="sign-up-submit" />
					<input type="button" value="Cancel" className="sign-up-cancel-button" />
				</form>
			</div>
		);
	}
}

export default SignUp;
