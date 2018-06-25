import React from 'react';
import { history } from '../routes/AppRouter';
import { database } from '../firebase/firebase';

import Header from './Header';
import ShortAnnouncements from './ShortAnnouncements';
import Discussions from './Discussions';
import Assignments from './Assignments';

import '../styles/SubjectHomePage.css';

class SubjectHomePage extends React.Component {

	constructor() {
		super();

		this.state = {
			subjectName: '',
			subjectCode: '',
			dbSubjectKey: ''
		};

		this.goToStudyMaterials = this.goToStudyMaterials.bind(this);
	}

	componentDidMount() {
		let subIndex = history.location.search.slice(1, history.location.search.length).split('=')[1];

		database.ref('users/' + this.props.dbUserKey + '/userSubjects').on('value', (subjects) => {
			let currentIndex = 0;
			subjects.forEach((subject) => {
				if (currentIndex == subIndex) {
					database.ref('subjects/' + subject.val().dbSubjectKey).on('value', (currentSubject) => {
						this.setState({
							subjectName: currentSubject.val().subjectName,
							subjectCode: currentSubject.val().subjectCode,
							dbSubjectKey: subject.val().dbSubjectKey
						});
					});
				}
				currentIndex++;
			});
			currentIndex = 0;
		});
	}

	goToStudyMaterials() {
		history.push('/studymaterials?subjectName=' + this.state.subjectName + '&subjectCode=' + this.state.subjectCode);
	}

	render() {
		let subIndex = history.location.search.slice(1, history.location.search.length).split('=')[1];
		return (
			<div className="subject-home-page">
				<Header subjectCode={this.state.subjectCode} subjectName={this.state.subjectName} />
				<ShortAnnouncements subIndex={subIndex} dbUserKey={this.props.dbUserKey} />
				<Discussions
					subIndex={subIndex}
					dbUserKey={this.props.dbUserKey}
					subjectName={this.state.subjectName}
					subjectCode={this.state.subjectCode}
				/>
				<div className="assignments-study-material">
					<div className="study-material" onClick={this.goToStudyMaterials}>
						<div className="study-material-title">Study Materials</div>
						<p>Contains lecture slides uploaded by the instructor and other reference materials.</p>
					</div>
					<Assignments
						dbUserKey={this.props.dbUserKey}
						dbSubjectKey={this.state.dbSubjectKey}
						subjectCode={this.state.subjectCode}
						subjectName={this.state.subjectName}
					/>
				</div>
			</div>
		);
	}
}

export default SubjectHomePage;
