import React from 'react';
import database from '../firebase/firebase';
import { history } from '../routes/AppRouter';

import Subject from './Subject';
import Header from './Header';

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
		});
	}

	addSubjectToList(subjectIndex) {
		let currentIndex = 0;
		console.log(this.props.dbUserKey);
		database.ref('subjects').once('value').then((subjects) => {
			subjects.forEach((subject) => {
				if (subjectIndex === currentIndex) {
					database.ref('users/' + this.props.dbUserKey + '/userSubjects').push({
						subjectName: subject.val().subjectName,
						subjectCode: subject.val().subjectCode
					}).then(() => history.push('/homepage'));
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
					instructor={subject.instructorName}
					key={index}
					index={index}
					addSubjectToList={this.addSubjectToList}
				/>
			)
		});
	}

	render() {
		return (
			<div className="all-subjects">
				<Header />
				{ this.displayAllSubjects() }
			</div>
		);
	}
}

export default AllSubjects;
