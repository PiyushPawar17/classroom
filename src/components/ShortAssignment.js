import React from 'react';
import { history } from '../routes/AppRouter';

import '../styles/ShortAssignment.css'

class ShortAssignment extends React.Component {

	constructor() {
		super();

		this.openAssignment = this.openAssignment.bind(this);
	}

	openAssignment() {
		history.push(
			'/assignment?assignmentIndex=' + this.props.index +
			'&subjectName=' + this.props.subjectName +
			'&subjectCode=' + this.props.subjectCode +
			'&dbSubjectKey=' + this.props.dbSubjectKey
		);
	}

	render() {
		return (
			<div className="short-assignment" onClick={this.openAssignment}>
				<div className="short-assignment-number">Assignment {this.props.assignment.assignmentNumber}</div>
				<div className="short-assignment-due">Due: {this.props.assignment.submissionDate}</div>
			</div>
		);
	}
}

export default ShortAssignment;
