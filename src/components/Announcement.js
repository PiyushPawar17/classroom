import React from 'react';
import ReactModal from 'react-modal';

import '../styles/Announcement.css';

class Announcement extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			showModal: false
		};

		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.editAnnouncement = this.editAnnouncement.bind(this);
		this.deleteAnnouncement = this.deleteAnnouncement.bind(this);
	}

	handleOpenModal() {
		this.setState({ showModal: true });
	}

	handleCloseModal() {
		this.setState({ showModal: false });
	}

	editAnnouncement(event) {
		event.preventDefault();
		let updatedAnnouncement = { title: this.refs.title.value, description: this.refs.description.value };
		this.props.editAnnouncement(updatedAnnouncement, this.props.index);
		this.setState({ showModal: false });
	}

	deleteAnnouncement() {
		this.props.deleteAnnouncement(this.props.index);
	}

	displayCustomizeButtons() {
		return (
			<div>
				<button className="edit-announcement-button" onClick={this.handleOpenModal}>&#9998; Edit Announcement</button>
				<button className="delete-announcement-button" onClick={this.deleteAnnouncement}>Delete Announcement &#10007;</button>
			</div>
		);
	}

	render() {
		let editAnnouncements = this.props.userType === 'Teacher' ? this.displayCustomizeButtons() : <div></div>;
		return (
			<div className="announcement">
				<div className="announcement-title">{this.props.announcement.title}</div>
				<pre className="announcement-description">{this.props.announcement.description}</pre>
				{ editAnnouncements }
				<ReactModal isOpen={this.state.showModal} contentLabel="Edit Announcement" ariaHideApp={false} className="edit-announcement-modal">
					<form className="edit-announcement-form" onSubmit={this.editAnnouncement}>
						<div>Announcement Title</div>
						<textarea type="text" className="edit-announcement-title" ref="title" defaultValue={this.props.announcement.title}></textarea>
						<div>Announcement Description</div>
						<textarea type="text" className="edit-announcement-description" ref="description" defaultValue={this.props.announcement.description}></textarea>
						<br />
						<input type="submit" value="Update Announcement" className="update-announcement-button" />
						<button onClick={this.handleCloseModal} className="close-modal-button">Cancel</button>
					</form>
				</ReactModal>
			</div>
		);
	}
}

export default Announcement;
