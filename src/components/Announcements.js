import React from 'react';
import ReactModal from 'react-modal';
import database from '../firebase/firebase';

import Announcement from './Announcement';
import Header from './Header';

import '../styles/Announcements.css';

class Announcements extends React.Component {

	constructor() {
		super();

		this.state = {
			announcements: [],
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
		let announcements = [];

		database.ref('announcements').on('value', (snapshot) => {
			snapshot.forEach((childSnapshot) => {
				announcements.push({
					_id: childSnapshot.key,
					...childSnapshot.val()
				});
			});
			announcements.reverse();
			this.setState({ announcements });
			announcements = [];
		});
	}

	handleOpenModal() {
		this.setState({ showModal: true });
	}

	handleCloseModal() {
		this.setState({ showModal: false });
	}

	displayAnnouncements() {
		return this.state.announcements.map((announcement, index) => {
			return (
				<Announcement announcement={announcement} key={index} index={index} editAnnouncement={this.editAnnouncement} deleteAnnouncement={this.deleteAnnouncement} />
			);
		});
	}

	addAnnouncement(event) {
		event.preventDefault();

		database.ref('announcements').push({
			title: this.refs.title.value,
			description: this.refs.description.value
		});

		this.setState({ showModal: false });
	}

	editAnnouncement(updatedAnnouncement, index) {
		let key = this.state.announcements[index]._id;
		database.ref('announcements/' + key).set(updatedAnnouncement);
	}

	deleteAnnouncement(announcementIndex) {
		let key = this.state.announcements[announcementIndex]._id;
		database.ref('announcements/' + key).remove();
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
