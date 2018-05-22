import React from 'react';
import ReactModal from 'react-modal';

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

	render() {
		return (
			<div className="announcement">
				<h3 className="announcement-title">{this.props.announcement.title}</h3>
				<div className="announcement-description">{this.props.announcement.description}</div>
				<button className="edit-announcement-button" onClick={this.handleOpenModal}>Edit Announcement</button>
				<button className="delete-announcement-button" onClick={this.deleteAnnouncement}>Delete Announcement</button>
				<ReactModal isOpen={this.state.showModal} contentLabel="Edit Announcement" ariaHideApp={false}>
					<button onClick={this.handleCloseModal}>x</button>
					<form className="edit-announcement-form" onSubmit={this.editAnnouncement}>
						<label>Announcement Title</label>
						<input type="text" className="edit-announcement-title" ref="title" defaultValue={this.props.announcement.title} />
						<label>Announcement Description</label>
						<input type="text" className="edit-announcement-description" ref="description" defaultValue={this.props.announcement.description} />
						<input type="submit" value="Update Announcement" />
					</form>
				</ReactModal>
			</div>
		);
	}
}

export default Announcement;
