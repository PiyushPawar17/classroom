import React from 'react';
import ReactModal from 'react-modal';
import { database } from '../firebase/firebase';
import { history } from '../routes/AppRouter';

import Background from './Background';
import Header from './Header';
import Announcement from './Announcement';

import '../styles/Announcements.css';

class Announcements extends React.Component {

	constructor() {
		super();

		this.state = {
			allAnnouncements: [],
			dbSubjectKey: '',
			subjectName: '',
			subjectCode: '',
			userType: '',
			showModal: false
		}

		this.displayAnnouncements = this.displayAnnouncements.bind(this);
		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.addAnnouncement = this.addAnnouncement.bind(this);
		this.editAnnouncement = this.editAnnouncement.bind(this);
		this.deleteAnnouncement = this.deleteAnnouncement.bind(this);
	}

	componentDidMount() {
		let allAnnouncements = [];
		const subIndex = history.location.search.slice(1, history.location.search.length).split('=')[1];

		database.ref('users/' + this.props.dbUserKey + '/userSubjects').on('value', (subjects) => {
			let currentIndex = 0;
			subjects.forEach((subject) => {
				if (currentIndex == subIndex) {
					database.ref('subjects/' + subject.val().dbSubjectKey + '/announcements').on('value', (announcements) => {
						announcements.forEach((announcement) => {
							allAnnouncements.push({
								announcementID: announcement.key,
								...announcement.val()
							});
						});
						allAnnouncements.reverse();
						database.ref('subjects/' + subject.val().dbSubjectKey).on('value', (currentSubject) => {
							this.setState({
								subjectName: currentSubject.val().subjectName,
								subjectCode: currentSubject.val().subjectCode
							});
						});
						this.setState({
							allAnnouncements,
							dbSubjectKey: subject.val().dbSubjectKey
						});
						allAnnouncements = [];
					});
				}
				currentIndex++;
			});
			currentIndex = 0;
		});

		database.ref('users/' + this.props.dbUserKey).once('value').then((user) => {
			this.setState({ userType: user.val().userType });
		});
	}

	handleOpenModal() {
		this.setState({ showModal: true });
	}

	handleCloseModal() {
		this.setState({ showModal: false });
	}

	addAnnouncement(event) {
		event.preventDefault();
		database.ref('subjects/' + this.state.dbSubjectKey + '/announcements').push({
			title: this.refs.title.value,
			description: this.refs.description.value
		});

		this.setState({ showModal: false });
	}

	editAnnouncement(updatedAnnouncement, index) {
		const announcementID = this.state.allAnnouncements[index].announcementID;
		database.ref('subjects/' + this.state.dbSubjectKey + '/announcements/' + announcementID).set(updatedAnnouncement);
	}

	deleteAnnouncement(announcementIndex) {
		const announcementID = this.state.allAnnouncements[announcementIndex].announcementID;
		database.ref('subjects/' + this.state.dbSubjectKey + '/announcements/' + announcementID).remove();
	}

	displayAnnouncements() {
		return this.state.allAnnouncements.map((announcement, index) => {
			return (
				<Announcement
					announcement={announcement}
					key={index}
					index={index}
					editAnnouncement={this.editAnnouncement}
					deleteAnnouncement={this.deleteAnnouncement}
					userType={this.state.userType}
				/>
			);
		});
	}

	render() {
		let addAnnouncements = this.state.userType === 'Teacher' ? <button onClick={this.handleOpenModal} className="new-announcement-button">+</button> : <div></div>;
		return (
			<div id="announcements-page">
				<Background />
				<div className="announcements">
					<Header subjectCode={this.state.subjectCode} subjectName={this.state.subjectName} />
					{ this.displayAnnouncements() }
					<div className="new-announcement-div">
						{ addAnnouncements }
						<ReactModal isOpen={this.state.showModal} contentLabel="Add Announcement" ariaHideApp={false} className="new-announcement-modal">
							<form className="new-announcement-form" onSubmit={this.addAnnouncement}>
								<div>Announcement Title</div>
								<textarea type="text" className="new-announcement-title" ref="title"></textarea>
								<div>Announcement Description</div>
								<textarea type="text" className="new-announcement-description" ref="description"></textarea>
								<br />
								<input type="submit" value="Add Announcement" className="add-announcement-button" />
								<button onClick={this.handleCloseModal} className="close-modal-button">Cancel</button>
							</form>
						</ReactModal>
					</div>
				</div>
			</div>
		);
	}
}

export default Announcements;
