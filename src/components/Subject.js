import React from 'react';

import '../styles/Subject.css';

class Subject extends React.Component {

	render() {
		return (
			<div className="subject">
				<div className="subject-info">
					<div className="subject-code">{this.props.subjectCode}</div>
					<div className="subject-name">{this.props.subjectName}</div>
				</div>
				<div className="instructor-name">Instructor: {this.props.instructor}</div>
			</div>
		);
	}
}

export default Subject;
