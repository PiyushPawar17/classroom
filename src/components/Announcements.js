import React from 'react';
import ReactModal from 'react-modal';

import Announcement from './Announcement';
import TitleBar from './TitleBar';

import '../styles/Announcements.css';

class Announcements extends React.Component {

	constructor() {
		super();

		this.state = {
			announcementList: [
				{
					title: 'Class Postponed',
					description: 'Today\'s class will start at 11:00 A.M.'
				},
				{
					title: 'In-Semester 2 Exam Syllabus',
					description: 'Syllabus for In-Semester 2 will be chapters 3 to 5.'
				},
				{
					title: 'Class Test',
					description: 'There will a test of 20 marks in next week\'s lecture. Syllabus for that will be chapter 3.'
				},
				{
					title: 'No Lectures',
					description: 'There will be no lectues this week. Complete last week\'s lab work in this week\'s lab.'
				}
			],
			showModal: false
		}

		this.displayAnnouncements = this.displayAnnouncements.bind(this);
		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.addAnnouncement = this.addAnnouncement.bind(this);
		this.editAnnouncement = this.editAnnouncement.bind(this);
		this.deleteAnnouncement = this.deleteAnnouncement.bind(this);
	}

	handleOpenModal() {
		this.setState({ showModal: true });
	}

	handleCloseModal() {
		this.setState({ showModal: false });
	}

	displayAnnouncements() {
		return this.state.announcementList.map((announcement, index) => {
			return (
				<Announcement announcement={announcement} key={index} index={index} editAnnouncement={this.editAnnouncement} deleteAnnouncement={this.deleteAnnouncement} />
			);
		});
	}

	addAnnouncement(event) {
		event.preventDefault();
		let newAnnouncement = { title: this.refs.title.value, description: this.refs.description.value };
		let announcementList = [...this.state.announcementList, newAnnouncement];

		this.setState({ announcementList, showModal: false });
	}

	editAnnouncement(updatedAnnouncement, index) {
		let announcementList = [...this.state.announcementList];
		announcementList[index] = updatedAnnouncement;

		this.setState({ announcementList });
	}

	deleteAnnouncement(announcementIndex) {
		let announcementList = this.state.announcementList.filter((announcement, index) => {
			return announcementIndex !== index;
		});

		this.setState({ announcementList });
	}

	render() {
		return (
			<div className="announcements">
				<TitleBar title="Announcements" />
				{ this.displayAnnouncements() }
				<div className="new-announcement-div">
					<button onClick={this.handleOpenModal} className="new-announcement-button">New Announcement</button>
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
