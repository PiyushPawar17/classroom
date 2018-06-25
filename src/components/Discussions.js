import React from 'react';
import ReactModal from 'react-modal';
import moment from 'moment';
import { database } from '../firebase/firebase';

import ShortDiscussion from './ShortDiscussion';

import '../styles/Discussions.css';

class Discussions extends React.Component {

	constructor() {
		super();

		this.state = {
			allDiscussions: [],
			showModal: false,
			dbSubjectKey: ''
		};

		this.displayDiscussions = this.displayDiscussions.bind(this);
		this.createNewDiscussion = this.createNewDiscussion.bind(this);
		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
	}

	componentDidMount() {
		let allDiscussions = [];

		database.ref('users/' + this.props.dbUserKey + '/userSubjects').on('value', (subjects) => {
			let currentIndex = 0;
			subjects.forEach((subject) => {
				if (currentIndex == this.props.subIndex) {
					database.ref('subjects/' + subject.val().dbSubjectKey + '/discussions').on('value', (discussions) => {
						discussions.forEach((discussion) => {
							allDiscussions.push({
								discussionID: discussion.key,
								...discussion.val()
							});
						});
						allDiscussions.reverse();
						this.setState({
							dbSubjectKey: subject.val().dbSubjectKey,
							allDiscussions
						});
						allDiscussions = [];
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

	createNewDiscussion(event) {
		event.preventDefault();

		database.ref('users/' + this.props.dbUserKey).once('value').then((user) => {
			database.ref('subjects/' + this.state.dbSubjectKey + '/discussions').push({
				discussionTitle: this.refs.title.value,
				createdBy: user.val().userName,
				createdOn: moment().format('MMMM DD, YYYY, hh:mm A'),
				isOpen: true
			});
			this.handleCloseModal();
		});
	}

	displayDiscussions() {
		return this.state.allDiscussions.map((discussion, index) => {
			const discussionIndex = this.state.allDiscussions.length - index - 1;
			return (
				<ShortDiscussion
					discussion={discussion}
					key={index}
					index={discussionIndex}
					subIndex={this.props.subIndex}
					dbUserKey={this.props.dbUserKey}
					subjectName={this.props.subjectName}
					subjectCode={this.props.subjectCode}
				/>
			);
		});
	}

	render() {
		return (
			<div className="discussions">
				<div className="discussions-title">Discussions</div>
				{ this.displayDiscussions() }
				<button className="new-discussion-button" onClick={this.handleOpenModal}>Create a new discussion</button>
				<ReactModal isOpen={this.state.showModal} contentLabel="Create Discussion" ariaHideApp={false} className="new-discussion-modal">
					<form className="new-discussion-form" onSubmit={this.createNewDiscussion}>
						<div>Discussion Title</div>
						<input type="text" className="new-discussion-title" ref="title" />
						<br />
						<input type="submit" value="Create Discussion" className="create-discussion-button" />
						<button onClick={this.handleCloseModal} className="discussion-close-modal-button">Cancel</button>
					</form>
				</ReactModal>
			</div>
		);
	}
}

export default Discussions;
