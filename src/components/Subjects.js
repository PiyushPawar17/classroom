import React from 'react';
import Subject from './Subject';

class Subjects extends React.Component {

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

		this.displaySubjects = this.displaySubjects.bind(this);
	}

	displaySubjects() {
		return this.state.subjects.map((subject, index) => {
			return (
				<Subject subjectCode={subject.subjectCode} subjectName={subject.subjectName} instructor={subject.instructor} key={index} />
			)
		});
	}

	render() {
		return (
			<div className="subjects">
				{ this.displaySubjects() }
			</div>
		);
	}
}

export default Subjects;
