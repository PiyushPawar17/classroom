import React from 'react';
import { history } from '../routes/AppRouter';

import '../styles/Details.css';

class Details extends React.Component {

	constructor() {
		super();

		this.state = {
			user: '',
			branch: ''
		}

		this.setBranch = this.setBranch.bind(this);
		this.setUser = this.setUser.bind(this);
	}

	setBranch(branch) {
		this.setState({ branch });
	}

	setUser(user) {
		this.setState({ user });
	}

	renderStudent() {
		return (
			<div>
				<div>ID</div>
					<input type="text" className="details-id" />
				<div>Branch</div>
				<label><input type="radio" name="branch" value="Computer Science" onClick={() => this.setBranch('CS')}/> Computer Science </label>
				<label><input type="radio" name="branch" value="Information Technology" onClick={() => this.setBranch('IT')} /> Information Technology </label>
			</div>
		);
	}

	render() {

		const student = this.state.user === 'Student' ? this.renderStudent() : <div></div>

		return (
			<div className="details">
				<div className="details-title">Details</div>
				<form className="details-form">
					<div>Name</div>
					<input type="text" className="details-name" />
					<div>You are a...</div>
					<div>
						<label><input type="radio" name="user" value="Teacher" onClick={() => this.setUser('Teacher')}/> Teacher </label>
						<label><input type="radio" name="user" value="Student" onClick={() => this.setUser('Student')} /> Student </label>
					</div>
					{ student }
					<input type="submit" className="details-submit" />
					<input type="button" value="Cancel" className="details-cancel-button" onClick={() => history.push('/')} />
				</form>
			</div>
		);
	}
}

export default Details;
