import React from 'react';
import ReactModal from 'react-modal';

import Announcement from './Announcement';

class Announcements extends React.Component {

	constructor() {
		super();

		this.state = {
			announcementList: [
				{ title: '1', description: 'One' },
				{ title: '2', description: 'Two' },
				{ title: '3', description: 'Three' },
				{ title: '4', description: 'Four' }
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
			<div>
				{ this.displayAnnouncements() }
				<div>
					<button onClick={this.handleOpenModal}>New Announcement</button>
					<ReactModal isOpen={this.state.showModal} contentLabel="Add Announcement" ariaHideApp={false}>
						<button onClick={this.handleCloseModal}>x</button>
						<form className="new-announcement-form" onSubmit={this.addAnnouncement}>
							<label>Announcement Title</label>
							<input type="text" className="new-announcement-title" ref="title" />
							<label>Announcement Description</label>
							<input type="text" className="new-announcement-description" ref="description" />
							<input type="submit" value="Add Announcement" />
						</form>
					</ReactModal>
				</div>
			</div>
		);
	}
}

export default Announcements;
