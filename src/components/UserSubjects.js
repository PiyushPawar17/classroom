import React from 'react';
import Subject from './Subject';

class UserSubjects extends React.Component {

	constructor() {
		super();

		this.state = {
			subjects: [
				{ subjectCode: 'CS204', subjectName: 'Computer Networks', instructor: 'NK' },
				{ subjectCode: 'CS204', subjectName: 'Computer Networks', instructor: 'NK' },
				{ subjectCode: 'CS204', subjectName: 'Computer Networks', instructor: 'NK' },
				{ subjectCode: 'CS204', subjectName: 'Computer Networks', instructor: 'NK' },
				{ subjectCode: 'CS204', subjectName: 'Computer Networks', instructor: 'NK' },
				{ subjectCode: 'CS204', subjectName: 'Computer Networks', instructor: 'NK' }
			]
		};

		this.displayUserSubjects = this.displayUserSubjects.bind(this);
	}

	displayUserSubjects() {
		return this.state.subjects.map((subject, index) => {
			return (
				<Subject
					subjectCode={subject.subjectCode}
					subjectName={subject.subjectName}
					instructor={subject.instructor}
					key={index}
					index={index}
				/>
			)
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
