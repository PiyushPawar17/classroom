import React from 'react';
import ReactModal from 'react-modal';
import { database, firebase } from '../firebase/firebase';
import { history } from '../routes/AppRouter';

import Background from './Background';
import UserSubjects from './UserSubjects';

import '../styles/HomePage.css';

class HomePage extends React.Component {

	constructor() {
		super();

		this.state = {
			addSubjectModal: false
		};

		this.addSubject = this.addSubject.bind(this);
		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.addSubjectHandler = this.addSubjectHandler.bind(this);
	}

	handleOpenModal() {
		this.setState({ addSubjectModal: true });
	}

	handleCloseModal() {
		this.setState({ addSubjectModal: false });
	}

	addSubjectHandler() {
		let userType;
		console.log(this.props.dbUserKey);
		database.ref('users/' + this.props.dbUserKey).once('value').then((user) => {
			userType = user.val().userType;
			if (userType === 'Teacher')
				this.handleOpenModal();
			else
				this.studentAddSubject();
		});
	}

	addSubject(event) {
		event.preventDefault();

		const { dbUserKey } = this.props;
		const subjectName = this.refs.subjectName.value;
		const subjectCode = this.refs.subjectCode.value;

		database.ref('users/' + dbUserKey).once('value').then((user) => {
			database.ref('subjects').push({
				subjectName: subjectName,
				subjectCode: subjectCode,
				instructorName: user.val().userName
			}).then((subject) => {
				database.ref('users/' + dbUserKey + '/userSubjects').push({
					dbSubjectKey: subject.key
				});
			});
		});
		this.handleCloseModal();
	}

	studentAddSubject() {
		history.push('/allsubjects');
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
			<div id="home-page">
				<Background />
				<div className="home">
					<div className="home-page-header">
						<span className="home-page-header-title">Your Subjects</span>
						<button className="logout-button" onClick={this.logout}>Logout</button>
					</div>
					<UserSubjects dbUserKey={this.props.dbUserKey} />
					<div className="add-subject-div" onClick={this.addSubjectHandler}>
						<div className="add-subject-div-button">+</div>
						<div className="add-subject-label">Add Subject</div>
					</div>
					<ReactModal isOpen={this.state.addSubjectModal} contentLabel="Add Announcement" ariaHideApp={false} className="add-subject-modal">
						<form className="add-subject-form" onSubmit={this.addSubject}>
							<div>Subject Name</div>
							<input type="text" className="new-subject-name" ref="subjectName" required />
							<div>Subject Code</div>
							<input type="text" className="new-subject-code" ref="subjectCode" required />
							<br />
							<input type="submit" value="Add Subject" className="add-subject-button" />
							<button onClick={this.handleCloseModal} className="close-modal-button">Cancel</button>
						</form>
					</ReactModal>
				</div>
			</div>
		);
	}
}

export default HomePage;
