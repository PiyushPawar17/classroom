import React from 'react';
import { database } from '../firebase/firebase';

import Subject from './Subject';

class UserSubjects extends React.Component {

	constructor() {
		super();

		this.state = {
			userSubjects: []
		};

		this.displayUserSubjects = this.displayUserSubjects.bind(this);
	}

	componentDidMount() {
		let userSubjectKeys = [];
		let userSubjects = [];
		database.ref('users/' + this.props.dbUserKey + '/userSubjects').on('value', (subjects) => {
			subjects.forEach((subject) => {
				userSubjectKeys.push(subject.val().dbSubjectKey);
			});
			userSubjectKeys.forEach((key) => {
				database.ref('subjects/' + key).once('value').then((subject) => {
					userSubjects.push({
						subjectName: subject.val().subjectName,
						subjectCode: subject.val().subjectCode,
						instructorName: subject.val().instructorName
					});
					this.setState({ userSubjects });
				});
			});
			userSubjectKeys = [];
			userSubjects = [];
		});
	}

	displayUserSubjects() {
		return this.state.userSubjects.map((subject, index) => {
			return (
				<Subject
					subjectCode={subject.subjectCode}
					subjectName={subject.subjectName}
					instructorName={subject.instructorName}
					key={index}
					index={index}
				/>
			);
		});
	}

	render() {
		return (
			<div className="subjects">
				{ this.displayUserSubjects() }
			</div>
		);
	}
}

export default UserSubjects;
