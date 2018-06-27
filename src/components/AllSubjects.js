import React from 'react';
import { database, firebase } from '../firebase/firebase';
import { history } from '../routes/AppRouter';

import Background from './Background';
import Subject from './Subject';

import '../styles/AllSubjects.css';

class AllSubjects extends React.Component {

	constructor() {
		super();

		this.state = {
			allSubjects: []
		};

		this.displayAllSubjects = this.displayAllSubjects.bind(this);
		this.addSubjectToList = this.addSubjectToList.bind(this);
	}

	componentDidMount() {
		let allSubjects = [];
		database.ref('subjects').once('value').then((subjects) => {
			subjects.forEach((subject) => {
				allSubjects.push({
					subjectName: subject.val().subjectName,
					subjectCode: subject.val().subjectCode,
					instructorName: subject.val().instructorName
				});
			});
			this.setState({ allSubjects });
			allSubjects = [];
		});
	}

	goBack() {
		history.goBack();
	}

	goHome() {
		history.push('/homepage');
	}

	logout() {
		firebase.auth().signOut().then(() => {
			history.push('/');
		}).catch((error) => {
			console.log(error);
		});
	}

	addSubjectToList(subjectIndex) {
		let currentIndex = 0;
		database.ref('subjects').once('value').then((subjects) => {
			subjects.forEach((subject) => {
				if (subjectIndex === currentIndex) {
					database.ref('users/' + this.props.dbUserKey + '/userSubjects').push({
						dbSubjectKey: subject.key
					});
					let allAssignments = [];
					database.ref('subjects/' + subject.key + '/assignments').once('value').then((assignments) => {
						assignments.forEach((assignment) => {
							allAssignments.push(assignment.val().assignmentNumber);
						});
						allAssignments.forEach((assignment) => {
							database.ref('users/' +
								this.props.dbUserKey +
								'/userAssignments/' +
								subject.val().subjectCode + '_' + subject.val().subjectName +
								'/assignment_' + assignment
							).set({ isDone: false }).then(() => history.push('/homepage'));
						});
					});
				}
				currentIndex++;
			});
		});
	}

	displayAllSubjects() {
		return this.state.allSubjects.map((subject, index) => {
			return (
				<Subject
					subjectCode={subject.subjectCode}
					subjectName={subject.subjectName}
					instructorName={subject.instructorName}
					key={index}
					index={index}
					addSubjectToList={this.addSubjectToList}
				/>
			)
		});
	}

	render() {
		return (
			<div id="all-subjects-page">
				<Background />
				<div className="all-subjects">
					<div className="home-page-header">
						<button className="back-button" onClick={this.goBack}>Back</button>
						<button className="home-button" onClick={this.goHome}>Home</button>
						<button className="logout-button" onClick={this.logout}>Logout</button>
					</div>
					{ this.displayAllSubjects() }
				</div>
			</div>
		);
	}
}

export default AllSubjects;
