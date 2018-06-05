import React from 'react';
import { history } from '../routes/AppRouter';

import '../styles/Subject.css';

class Subject extends React.Component {

	constructor() {
		super();

		this.subjectClickHandler = this.subjectClickHandler.bind(this);
	}

	subjectClickHandler() {
		if (history.location.pathname === '/allsubjects')
			this.props.addSubjectToList(this.props.index);
		else
			this.props.goToSubjectHomePage(this.props.index);
	}

	render() {
		return (
			<div className="subject" onClick={this.subjectClickHandler}>
				<div className="subject-info">
					<div className="subject-code">{this.props.subject.subjectCode}</div>
					<div className="subject-name">{this.props.subject.subjectName}</div>
				</div>
				<div className="instructor-name">Instructor: {this.props.subject.instructorName}</div>
			</div>
		);
	}
}

export default Subject;
