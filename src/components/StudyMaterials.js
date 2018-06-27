import React from 'react';
import { history } from '../routes/AppRouter';
import { database } from '../firebase/firebase';

import Background from './Background';
import Header from './Header';
import LectureNotes from './LectureNotes';
import References from './References';

import '../styles/StudyMaterials.css';

class StudyMaterials extends React.Component {

	constructor() {
		super();

		this.state = {
			isTeacher: false
		};
	}

	componentDidMount() {
		database.ref('users/' + this.props.dbUserKey).on('value', (user) => {
			if (user.val().userType === 'Teacher') {
				this.setState({ isTeacher: true });
			}
		});
	}

	render() {
		const subjectName = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[1];
		const subjectCode = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[3];
		return (
			<div id="study-materials-page">
				<Background />
				<div className="study-materials">
					<Header subjectCode={subjectCode} subjectName={subjectName} />
					<LectureNotes isTeacher={this.state.isTeacher} subjectCode={subjectCode} subjectName={subjectName} />
					<References isTeacher={this.state.isTeacher} subjectCode={subjectCode} subjectName={subjectName} />
				</div>
			</div>
		);
	}
}

export default StudyMaterials;
