import React from 'react';
import moment from 'moment';
import { Line } from 'rc-progress';
import { history } from '../routes/AppRouter';
import { database, storage } from '../firebase/firebase';

import Background from './Background';
import Header from './Header';
import File from './File';

import '../styles/Assignment.css';

const { shell } = window.require('electron');

class Assignment extends React.Component {

	constructor() {
		super();

		this.state = {
			percentage: 0,
			file: null,
			uploadButton: false,
			isUploading: false,
			uploadedFiles: [],
			assignmentNumber: '',
			assignmentDescription: '',
			assignmentFiles: [],
			submissionDate: '',
			submittedOn: '',
			submissionStatus: '',
			userType: '',
			studentID: '',
			studentList: []
		};

		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.uploadFile = this.uploadFile.bind(this);
		this.addUploadButton = this.addUploadButton.bind(this);
		this.cancelUpload = this.cancelUpload.bind(this);
		this.displayFiles = this.displayFiles.bind(this);
		this.displayUploadedFiles = this.displayUploadedFiles.bind(this);
		this.displayStudentList = this.displayStudentList.bind(this);
		this.viewAssignmentFiles = this.viewAssignmentFiles.bind(this);
		this.submitAssignment = this.submitAssignment.bind(this);
	}

	componentDidMount() {
		const assignmentIndex = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[1];
		const subjectName = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[3];
		const subjectCode = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[5];
		const dbSubjectKey = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[7];
		let assignmentNumber, submissionDate, userType;

		database.ref('users/' + this.props.dbUserKey).on('value', (user) => {
			let studentID = '';
			userType = user.val().userType;
			if (user.val().userType === 'Student')
				studentID = user.val().studentID;
			this.setState({
				userType: user.val().userType,
				studentID
			});
		});

		database.ref('subjects/' + dbSubjectKey + '/assignments').on('value', (assignments) => {
			let currentIndex = 0;
			assignments.forEach((assignment) => {
				if (assignmentIndex == currentIndex) {
					this.setState({
						assignmentNumber: assignment.val().assignmentNumber,
						assignmentDescription: assignment.val().assignmentDescription,
						assignmentFiles: assignment.val().assignmentFiles || [],
						submissionDate: assignment.val().submissionDate
					});
					assignmentNumber = assignment.val().assignmentNumber;
					submissionDate = assignment.val().submissionDate;
				}
				currentIndex++;
			});
			currentIndex = 0;

			if (userType === 'Student') {
				database.ref('users/' + this.props.dbUserKey + '/userAssignments/' + subjectCode + '_' + subjectName + '/assignment_' + assignmentNumber + '/assignmentFiles').on('value', (assignmentFiles) => {
					let uploadedFiles = [];
					assignmentFiles.forEach((assignmentFile) => {
						uploadedFiles.push({ ...assignmentFile.val() });
					});
					this.setState({ uploadedFiles });
					uploadedFiles = [];
				});

				let submissionStatus;
				database.ref('users/' + this.props.dbUserKey + '/userAssignments/' + subjectCode + '_' + subjectName + '/assignment_' + assignmentNumber).on('value', (assignment) => {
					if (!assignment.val().isDone && moment().isSameOrBefore(submissionDate))
						submissionStatus = 'Pending';
					if (!assignment.val().isDone && !moment().isSameOrBefore(submissionDate))
						submissionStatus = 'Missing';
					if (assignment.val().isDone && !moment(assignment.val().submittedOn).isSameOrBefore(submissionDate))
						submissionStatus = 'Done Late';
					if (assignment.val().isDone && moment(assignment.val().submittedOn).isSameOrBefore(submissionDate))
						submissionStatus = 'Submitted';

					this.setState({
						submittedOn: assignment.val().submittedOn,
						submissionStatus
					});
				});
			}
			else {
				let studentList = [];
				let currentSubject = subjectCode + '_' + subjectName;
				database.ref('users').on('value', (users) => {
					users.forEach((user) => {
						if (user.val().userType === 'Student' && user.child('/userAssignments/' + currentSubject).exists()) {
							database.ref('users/' + user.key + '/userAssignments/' + currentSubject + '/assignment_' + assignmentNumber).on('value', (assignment) => {
								if (assignment.val().isDone) {
									let uploadedFiles = [];
									database.ref('users/' + user.key + '/userAssignments/' + currentSubject + '/assignment_' + assignmentNumber + '/assignmentFiles').on('value', (assignmentFiles) => {
										assignmentFiles.forEach((assignmentFile) => {
											uploadedFiles.push({ ...assignmentFile.val() });
										});
										studentList.push({
											studentID: user.val().studentID,
											submittedOn: assignment.val().submittedOn,
											assignmentFiles: uploadedFiles || []
										});
									});
									uploadedFiles = [];
								}
								this.setState({ studentList });
							});
						}
					});
					studentList = [];
				});
			}
		});
	}

	handleOpenModal() {
		this.setState({ showModal: true });
	}

	handleCloseModal() {
		this.setState({ showModal: false });
	}

	addUploadButton(event) {
		this.setState({
			uploadButton: true,
			file: event.target.files[0]
		});
	}

	uploadFile() {
		const { file, studentID, assignmentNumber } = this.state;
		const subjectName = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[3];
		const subjectCode = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[5];

		let path;
		this.setState({ isUploading: true });
		storage.ref('assignment_files/' + subjectCode + '_' + subjectName + '/assignment_' + assignmentNumber + '/student_submissions/' + studentID + '/' + file.name).put(file).on('state_changed',
			(fileSnapshot) => {
				let percentage = (fileSnapshot.bytesTransferred / fileSnapshot.totalBytes) * 100;
				path = fileSnapshot.ref.location.path;
				this.setState({ percentage });
			},
			(error) => {
				console.log(error);
			},
			() => {
				setTimeout(() => {
					this.setState({
						percentage: 0,
						file: null,
						uploadButton: false,
						isUploading: false
					});
				}, 1000);

				database.ref('users/' + this.props.dbUserKey + '/userAssignments/' + subjectCode + '_' + subjectName + '/assignment_' + assignmentNumber + '/assignmentFiles').push({
					filePath: path,
					fileName: file.name
				});
			}
		);
	}

	cancelUpload() {
		this.setState({ uploadButton: false });
	}

	viewAssignmentFiles(fileIndex) {
		let clickedFile = this.state.assignmentFiles.filter((file, index) => {
			return fileIndex === index;
		});

		storage.ref(clickedFile[0].filePath).getDownloadURL().then((url) => {
			shell.openExternal(url);
		});
	}

	viewUploadedFiles(fileIndex) {
		let clickedFile = this.state.uploadedFiles.filter((file, index) => {
			return fileIndex === index;
		});

		storage.ref(clickedFile[0].filePath).getDownloadURL().then((url) => {
			shell.openExternal(url);
		});
	}

	displayUploadedFiles() {
		return this.state.uploadedFiles.map((file, index) => {
			return (
				<div className="assignment-file" key={index}>
					<div className="assignment-file-name">{file.fileName}</div>
					<button className="assignment-file-view-button" onClick={() => this.viewUploadedFiles(index)}>View &#128065;</button>
				</div>
			);
		});
	}

	displayFiles() {
		return this.state.assignmentFiles.map((file, index) => {
			return (
				<div className="assignment-file" key={index}>
					<div className="assignment-file-name">{file.fileName}</div>
					<button className="assignment-file-view-button" onClick={() => this.viewAssignmentFiles(index)}>View &#128065;</button>
				</div>
			);
		});
	}

	displayStudentList() {
		return this.state.studentList.map((student, index) => {
			console.log(student);
			let uploadedAssignmentFiles = student.assignmentFiles.map((file, fileIndex) => {
				return (
					<File fileName={file.fileName} filePath={file.filePath} key={fileIndex} />
				);
			});
			return (
				<div className="student" key={index}>
					<div>Student ID: {student.studentID}</div>
					<div>Submitted On: {student.submittedOn}</div>
					<div>Submitted Files</div>
					{ uploadedAssignmentFiles }
				</div>
			);
		});
	}

	submitAssignment() {
		const { assignmentNumber } = this.state;
		const subjectName = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[3];
		const subjectCode = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[5];

		database.ref('users/' + this.props.dbUserKey + '/userAssignments/' + subjectCode + '_' + subjectName + '/assignment_' + assignmentNumber).update({
			isDone: true,
			submittedOn: moment().format('MMMM DD, YYYY, hh:mm A')
		});
	}

	render() {
		const subjectName = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[3];
		const subjectCode = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[5];

		let button = this.state.uploadButton ?
			<div>
				{
					this.state.isUploading ?
						<div>
							<Line
								percent={this.state.percentage}
								strokeWidth="4"
								strokeColor="#33CC00"
								trailWidth="4"
								trailColor="#CFCFCF"
								className="progress-bar"
							/>
							<br />
							<div className="percentage-uploaded">{this.state.percentage.toFixed(2)}% uploaded</div>
						</div> :
						null
				}
				{
					this.state.isUploading ?
						null :
						<div>
							<button className="upload-file-button" onClick={this.uploadFile}>Upload</button>
							<span className="upload-file-name">{this.state.file.name}</span>
							<button className="file-upload-cancel-button" onClick={this.cancelUpload}>Cancel</button>
						</div>
				}
			</div> :
			<div>
				<input type="file" name="file" id="file" className="inputfile" onChange={this.addUploadButton} />
				<label htmlFor="file">&#8686; Choose a file</label>
			</div>;

		let submissionStatus = null;

		if (this.state.submissionStatus === 'Submitted')
			submissionStatus = <span className="assignment-submitted">Submitted</span>;
		if (this.state.submissionStatus === 'Done Late')
			submissionStatus = <span className="assignment-done-late">Done Late</span>;
		if (this.state.submissionStatus === 'Missing')
			submissionStatus = <span className="assignment-missing">Missing</span>;
		if (this.state.submissionStatus === 'Pending')
			submissionStatus = <span className="assignment-pending">Pending</span>;

		let submissionDate = this.state.submissionStatus === 'Submitted' || this.state.submissionStatus === 'Done Late' ?
			<div className="submitted-on">Submitted On: {this.state.submittedOn}</div> : null;

		let submission = this.state.userType === 'Student' ?
			<div className="submission-info">
				<div className="submission-status">Submission Status: {submissionStatus}</div>
				{ submissionDate }
				<div className="submission-title">Files that your have submitted</div>
				{ this.displayUploadedFiles() }
				<br />
				{ button }
				<button className="submit-button" onClick={this.submitAssignment}>Submit Assignment</button>
			</div> : null;

		let studentList = this.state.userType === 'Teacher' ?
			<div className="student-submission-list">
				<div className="student-list-title">List of students who have submitted</div>
				{ this.displayStudentList() }
			</div> : null;

		return (
			<div id="assignment-page">
				<Background />
				<div className="assignment-page-div">
					<Header subjectCode={subjectCode} subjectName={subjectName} />
					<div className="assignment">
						<div className="assignment-info">
							<div className="assignment-title">Assignment {this.state.assignmentNumber}</div>
							<pre className="assignment-description">{this.state.assignmentDescription}</pre>
							{ this.displayFiles() }
							<div className="submission-date">Due: {this.state.submissionDate}</div>
						</div>
						{ submission }
					</div>
					{ studentList }
				</div>
			</div>
		);
	}
}

export default Assignment;
