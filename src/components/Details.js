import React from 'react';
import { history } from '../routes/AppRouter';
import { database, firebase } from '../firebase/firebase';

import Background from './Background';

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
		this.submitDetails = this.submitDetails.bind(this);
	}

	setBranch(branch) {
		this.setState({ branch });
	}

	setUser(user) {
		this.setState({ user });
	}

	cancelSignUp() {
		const uid = firebase.auth().currentUser.uid;
		let key;

		database.ref('users').once('value', (users) => {
			users.forEach((user) => {
				if (user.val().userUID === uid)
					key = user.key;
			});
		}).then(() => {
			database.ref('users/' + key).remove().then(() => {
				firebase.auth().currentUser.delete();
				history.push('/');
			});
		});
	}

	submitDetails(event) {
		event.preventDefault();

		const uid = firebase.auth().currentUser.uid;
		let key;

		firebase.auth().currentUser.updateProfile({
			displayName: this.refs.userName.value
		}).catch((error) => {
			console.log(error);
		});

		database.ref('users').once('value', (users) => {
			users.forEach((user) => {
				if (user.val().userUID === uid)
					key = user.key;
			});
		}).then(() => {
			database.ref('users/' + key).update({
				userName: this.refs.userName.value,
				userType: this.state.user
			});
			if (this.state.user === 'Student') {
				database.ref('users/' + key).update({
					studentID: this.refs.studentID.value,
					branch: this.state.branch
				});
			}
			history.push('/');
		});
	}

	renderStudent() {
		return (
			<div>
				<div>ID</div>
					<input type="text" className="details-id" ref="studentID" required />
				<div>Branch</div>
				<label><input type="radio" name="branch" value="Computer Science" onClick={() => this.setBranch('Computer Science')}/> Computer Science </label>
				<label><input type="radio" name="branch" value="Information Technology" onClick={() => this.setBranch('Information Technology')} /> Information Technology </label>
			</div>
		);
	}

	render() {

		const student = this.state.user === 'Student' ? this.renderStudent() : <div></div>;

		return (
			<div id="details-page">
				<Background />
				<div className="details" onSubmit={this.submitDetails}>
					<div className="details-title">Details</div>
					<form className="details-form">
						<div>Name</div>
						<input type="text" className="details-name" ref="userName" required />
						<div>You are a...</div>
						<div>
							<label><input type="radio" name="user" value="Teacher" onClick={() => this.setUser('Teacher')}/> Teacher </label>
							<label><input type="radio" name="user" value="Student" onClick={() => this.setUser('Student')} /> Student </label>
						</div>
						{ student }
						<input type="submit" className="details-submit" />
						<input type="button" value="Cancel" className="details-cancel-button" onClick={this.cancelSignUp} />
					</form>
				</div>
			</div>
		);
	}
}

export default Details;
