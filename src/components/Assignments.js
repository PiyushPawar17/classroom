import React from 'react';
import ReactModal from 'react-modal';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Line } from 'rc-progress';

import Header from './Header';
import Assignment from './Assignment';
import { history } from '../routes/AppRouter';
import { database, storage } from '../firebase/firebase';

import '../styles/Assignments.css';
import 'react-datepicker/dist/react-datepicker.css';

class Assignments extends React.Component {

	constructor() {
		super();

		this.state = {
			allAssignments: [],
			showModal: false,
			date: moment(),
			percentage: 0,
			uploadedFiles: [],
			file: null,
			uploadButton: false,
			isUploading: false,
			isTeacher: false,
			dbSubjectKey: ''
		};

		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.addUploadButton = this.addUploadButton.bind(this);
		this.uploadFile = this.uploadFile.bind(this);
		this.cancelUpload = this.cancelUpload.bind(this);
		this.createAssignment = this.createAssignment.bind(this);
		this.displayUploadedFiles = this.displayUploadedFiles.bind(this);
		this.displayAssignments = this.displayAssignments.bind(this);
	}

	componentDidMount() {
		let allAssignments = [];
		const subjectName = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[1];
		const subjectCode = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[3];

		database.ref('users/' + this.props.dbUserKey).on('value', (user) => {
			if (user.val().userType === 'Teacher') {
				this.setState({ isTeacher: true });
			}
		});

		database.ref('subjects').on('value', (subjects) => {
			subjects.forEach((subject) => {
				if (subject.val().subjectCode === subjectCode && subject.val().subjectName === subjectName) {
					database.ref('subjects/' + subject.key + '/assignments').once('value').then((assignments) => {
						assignments.forEach((assignment) => {
							allAssignments.push({ ...assignment.val() });
						});
						this.setState({
							allAssignments,
							dbSubjectKey: subject.key
						});
						allAssignments = [];
					});
				}
			});
		});
	}

	handleOpenModal() {
		this.setState({ showModal: true });
	}

	handleCloseModal() {
		this.setState({
			showModal: false,
			file: null,
			uploadedFiles: []
		});
	}

	handleChange(date) {
		this.setState({
			date: date
		});
	}

	addUploadButton(event) {
		this.setState({
			uploadButton: true,
			file: event.target.files[0]
		});
	}

	cancelUpload() {
		this.setState({ uploadButton: false });
	}

	uploadFile() {
		const { file } = this.state;
		const subjectName = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[1];
		const subjectCode = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[3];
		const assignmentTitle = this.refs.title.value.replace(/ /g, '_');
		let uploadedFiles = [...this.state.uploadedFiles];
		let metadata;

		this.setState({ isUploading: true });

		storage.ref('assignment_files/' + subjectCode + '_' + subjectName + '/' + assignmentTitle + '/' + file.name).put(file).on('state_changed',
			(fileSnapshot) => {
				let percentage = (fileSnapshot.bytesTransferred / fileSnapshot.totalBytes) * 100;
				metadata = fileSnapshot.metadata;
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

				uploadedFiles.push({
					filePath: metadata.fullPath,
					fileName: metadata.name
				});

				this.setState({ uploadedFiles });
			}
		);
	}

	displayUploadedFiles() {
		return this.state.uploadedFiles.map((file, index) => {
			return (
				<span className="uploaded-file-name" key={index}>{file.fileName}</span>
			);
		});
	}

	createAssignment(event) {
		event.preventDefault();
		const subjectName = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[1];
		const subjectCode = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[3];

		database.ref('subjects').once('value').then((subjects) => {
			subjects.forEach((subject) => {
				if (subject.val().subjectCode === subjectCode && subject.val().subjectName === subjectName) {
					database.ref('subjects/' + subject.key + '/assignments').push({
						assignmentTitle: this.refs.title.value,
						assignmentDescription: this.refs.description.value,
						submissionDate: this.state.date.format('MMMM DD, YYYY, hh:mm A'),
						assignmentFiles: this.state.uploadedFiles
					}).then(() => {
						this.setState({
							uploadedFiles: [],
							showModal: false
						});
					});
				}
			});
		});
	}

	displayAssignments() {
		return this.state.allAssignments.map((assignment, index) => {
			let files = [];
			assignment.assignmentFiles.forEach((file, index) => {
				files.push({
					...file,
					fileIndex: index
				});
			});
			return (
				<Assignment
					assignmentTitle={assignment.assignmentTitle}
					assignmentDescription={assignment.assignmentDescription}
					submissionDate={assignment.submissionDate}
					assignmentFiles={files}
					isTeacher={this.state.isTeacher}
					index={index}
					key={index}
				/>
			);
		});
	}

	render() {
		let subjectName = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[1];
		let subjectCode = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[3];

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

		let createAssignments = this.state.isTeacher ? <button className="new-assignment-button" onClick={this.handleOpenModal}>Create a new assignment</button> : null;

		return (
			<div className="assignments">
				<Header subjectCode={subjectCode} subjectName={subjectName} />
				{ this.displayAssignments() }
				{ createAssignments }
				<ReactModal isOpen={this.state.showModal} contentLabel="Add Assignment" ariaHideApp={false} className="new-assignment-modal">
					<form className="new-assignment-form" onSubmit={this.createAssignment}>
						<div>Assignment Title</div>
						<textarea type="text" className="new-assignment-title" ref="title" required></textarea>
						<div>Assignment Description (Optional)</div>
						<textarea type="text" className="new-assignment-description" ref="description"></textarea>
						<br />
						{ this.displayUploadedFiles() }
						<br />
						{ button }
						<br />
						<div>To be submitted before</div>
						<DatePicker
							selected={this.state.date}
							onChange={this.handleChange}
							timeFormat="HH:mm"
							timeIntervals={10}
							timeCaption="Time"
							dateFormat="LLL"
							className="date-picker"
							placeholderText="Select Date and Time"
							showTimeSelect
						/>
						<input type="submit" value="Create Assignment" className="create-assignment-button" />
						<button className="close-modal" onClick={this.handleCloseModal}>Cancel</button>
					</form>
				</ReactModal>
			</div>
		);
	}
}

export default Assignments;
