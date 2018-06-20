import React from 'react';
import { storage } from '../firebase/firebase';

import '../styles/Assignment.css';

const { shell } = window.require('electron');

class Assignment extends React.Component {

	constructor() {
		super();

		this.displayFiles = this.displayFiles.bind(this);
		this.view = this.view.bind(this);
	}

	view(fileIndex) {
		let clickedFile = this.props.assignmentFiles.filter((file, index) => {
			return fileIndex === index;
		});

		storage.ref(clickedFile[0].filePath).getDownloadURL().then((url) => {
			shell.openExternal(url);
		});
	}

	displayFiles() {
		return this.props.assignmentFiles.map((file, index) => {
			return (
				<div className="assignment-file" key={index}>
					<div className="assignment-file-name">{file.fileName}</div>
					<button className="assignment-file-view-button" onClick={() => this.view(index)}>View &#128065;</button>
				</div>
			);
		});
	}

	render() {
		return (
			<div className="assignment">
				<div className="assignment-info">
					<div className="assignment-title">{this.props.assignmentTitle}</div>
					<pre className="assignment-description">{this.props.assignmentDescription}</pre>
					{ this.displayFiles() }
					<div className="submission-date">Due: {this.props.submissionDate}</div>
				</div>
			</div>
		);
	}
}

export default Assignment;
