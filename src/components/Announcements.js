import React from 'react';
import ReactModal from 'react-modal';
import database from '../firebase/firebase';
import { history } from '../routes/AppRouter';

import Announcement from './Announcement';
import Header from './Header';

import '../styles/Announcements.css';

class Announcements extends React.Component {

	constructor() {
		super();

		this.state = {
			allAnnouncements: [],
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
		let subIndex = history.location.search.slice(1, history.location.search.length).split('=')[1];
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
						this.setState({ allAnnouncements });
						allAnnouncements = [];
					});
				}
				currentIndex++;
			});
			currentIndex = 0;
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
		const title = this.refs.title.value;
		const description = this.refs.description.value;

		let subIndex = history.location.search.slice(1, history.location.search.length).split('=')[1];

		database.ref('users/' + this.props.dbUserKey + '/userSubjects').once('value').then((subjects) => {
			let currentIndex = 0;
			subjects.forEach((subject) => {
				if (currentIndex == subIndex) {
					database.ref('subjects/' + subject.val().dbSubjectKey + '/announcements').push({
						title: title,
						description: description
					});
				}
				currentIndex++;
			});

		});
		this.setState({ showModal: false });
	}

	editAnnouncement(updatedAnnouncement, index) {
		let announcementID = this.state.allAnnouncements[index].announcementID;
		let subIndex = history.location.search.slice(1, history.location.search.length).split('=')[1];
		database.ref('users/' + this.props.dbUserKey + '/userSubjects').once('value').then((subjects) => {
			let currentIndex = 0;
			subjects.forEach((subject) => {
				if (currentIndex == subIndex) {
					database.ref('subjects/' + subject.val().dbSubjectKey + '/announcements/' + announcementID).set(updatedAnnouncement);
				}
				currentIndex++;
			});
		});
	}

	deleteAnnouncement(announcementIndex) {
		let announcementID = this.state.allAnnouncements[announcementIndex].announcementID;
		let subIndex = history.location.search.slice(1, history.location.search.length).split('=')[1];
		database.ref('users/' + this.props.dbUserKey + '/userSubjects').once('value').then((subjects) => {
			let currentIndex = 0;
			subjects.forEach((subject) => {
				if (currentIndex == subIndex) {
					database.ref('subjects/' + subject.val().dbSubjectKey + '/announcements/' + announcementID).remove();
				}
				currentIndex++;
			});
		});
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
				/>
			);
		});
	}

	render() {
		return (
			<div className="announcements">
				<Header subjectCode="CS204" subject="Computer Networks" />
				{ this.displayAnnouncements() }
				<div className="new-announcement-div">
					<button onClick={this.handleOpenModal} className="new-announcement-button">+</button>
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
		);
	}
}

export default Announcements;
