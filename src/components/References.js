import React from 'react';
import { Line } from 'rc-progress';
import ReactModal from 'react-modal';
import { database, storage } from '../firebase/firebase';

import File from './File';

import '../styles/References.css';

class LectureNotes extends React.Component {

	constructor() {
		super();

		this.state = {
			percentage: 0,
			file: null,
			upload: false,
			showModal: false,
			isUploading: false,
			files: []
		};

		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.uploadFile = this.uploadFile.bind(this);
		this.addUploadButton = this.addUploadButton.bind(this);
		this.cancelUpload = this.cancelUpload.bind(this);
		this.displayFiles = this.displayFiles.bind(this);
	}

	componentDidMount() {
		let files = [];
		const { subjectCode, subjectName } = this.props;
		database.ref('subjects').on('value', (subjects) => {
			subjects.forEach((subject) => {
				if (subject.val().subjectCode === subjectCode && subject.val().subjectName === subjectName) {
					database.ref('subjects/' + subject.key + '/references').on('value', (references) => {
						references.forEach((reference) => {
							files.push({ ...reference.val() });
						});
						this.setState({ files });
						files = [];
					});
				}
			});
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
			upload: true,
			file: event.target.files[0]
		});
	}

	cancelUpload() {
		this.setState({ upload: false });
	}

	uploadFile() {
		const { file } = this.state;
		const { subjectCode, subjectName } = this.props;
		let path;
		this.setState({ isUploading: true });
		storage.ref('references/' + this.props.subjectCode + '_' + this.props.subjectName + '/' + file.name).put(file).on('state_changed',
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
						upload: false,
						showModal: false,
						isUploading: false
					});
				}, 1000);

				database.ref('subjects').once('value').then((subjects) => {
					subjects.forEach((subject) => {
						if (subject.val().subjectCode === subjectCode && subject.val().subjectName === subjectName) {
							database.ref('subjects/' + subject.key + '/references').push({
								filePath: path,
								fileName: file.name
							});
						}
					});
				});
			}
		);
	}

	displayFiles() {
		return this.state.files.map((file, index) => {
			return (
				<File fileName={file.fileName} filePath={file.filePath} key={index} />
			);
		});
	}

	render() {
		let button = this.state.upload ?
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
				<button className="close-modal" onClick={this.handleCloseModal}>Cancel</button>
			</div>;
		let uploadNotes = this.props.isTeacher ? <button className="upload-references-button" onClick={this.handleOpenModal}>+</button> : null;
		return (
			<div className="references">
				<div className="references-heading">References And Other Study Materials</div>
				{ this.displayFiles() }
				{ uploadNotes }
				<ReactModal isOpen={this.state.showModal} contentLabel="Add References" ariaHideApp={false} className="add-references-modal">
					{ button }
				</ReactModal>
			</div>
		);
	}
}

export default LectureNotes;
