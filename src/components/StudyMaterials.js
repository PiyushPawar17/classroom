import React from 'react';
import { history } from '../routes/AppRouter';
import { database } from '../firebase/firebase';

import LectureNotes from './LectureNotes';
import References from './References';
import Header from './Header';

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
		let subjectName = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[1];
		let subjectCode = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[3];
		return (
			<div className="study-materials">
				<Header subjectCode={subjectCode} subjectName={subjectName} />
				<LectureNotes isTeacher={this.state.isTeacher} subjectCode={subjectCode} subjectName={subjectName} />
				<References isTeacher={this.state.isTeacher} subjectCode={subjectCode} subjectName={subjectName} />
			</div>
		);
	}
}

export default StudyMaterials;
