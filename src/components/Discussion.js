import React from 'react';
import { history } from '../routes/AppRouter';
import { database } from '../firebase/firebase';

import Background from './Background';
import Header from './Header';

import '../styles/Discussion.css';

class Discusson extends React.Component {

	constructor() {
		super();

		this.state = {
			discussionTitle: '',
			createdBy: '',
			createdOn: '',
			allComments: [],
			userName: '',
			userType: '',
			dbSubjectKey: '',
			discussionKey: '',
			isOpen: true
		};

		this.displayComments = this.displayComments.bind(this);
		this.addComment = this.addComment.bind(this);
		this.closeDiscussion = this.closeDiscussion.bind(this);
	}

	componentDidMount() {
		const discussionIndex = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[1];
		const subIndex = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[7];
		let allComments = [];
		database.ref('users/' + this.props.dbUserKey).on('value', (user) => {
			this.setState({
				userName: user.val().userName,
				userType: user.val().userType
			});
		});
		database.ref('users/' + this.props.dbUserKey + '/userSubjects').on('value', (subjects) => {
			let currentSubIndex = 0;
			subjects.forEach((subject) => {
				if (currentSubIndex == subIndex) {
					database.ref('subjects/' + subject.val().dbSubjectKey + '/discussions').on('value', (discussions) => {
						let currentDiscussionIndex = 0;
						discussions.forEach((discussion) => {
							if (currentDiscussionIndex == discussionIndex) {
								database.ref('subjects/' + subject.val().dbSubjectKey + '/discussions/' + discussion.key + '/comments').on('value', (comments) => {
									comments.forEach((comment) => {
										allComments.push({ ...comment.val() });
									});
									this.setState({
										discussionTitle: discussion.val().discussionTitle,
										createdBy: discussion.val().createdBy,
										createdOn: discussion.val().createdOn,
										dbSubjectKey: subject.val().dbSubjectKey,
										discussionKey: discussion.key,
										isOpen: discussion.val().isOpen,
										allComments
									});
									allComments = [];
								});
							}
							currentDiscussionIndex++;
						});
						currentDiscussionIndex = 0;
					});
				}
				currentSubIndex++;
			});
			currentSubIndex = 0;
		});
	}

	addComment() {
		database.ref('subjects/' + this.state.dbSubjectKey + '/discussions/' + this.state.discussionKey + '/comments').push({
			user: this.state.userName,
			comment: this.refs.comment.value
		});
		this.refs.comment.value = '';
	}

	closeDiscussion() {
		database.ref('subjects/' + this.state.dbSubjectKey + '/discussions/' + this.state.discussionKey).update({
			isOpen: false
		});
	}

	displayComments() {
		return this.state.allComments.map((comment, index) => {
			return (
				<div className="comments" key={index}>
					<div className="comment-user">{comment.user}</div>
					<pre className="comment">{comment.comment}</pre>
				</div>
			);
		});
	}

	render() {
		let subjectName = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[3];
		let subjectCode = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[5];
		let closeDiscussionButton = this.state.isOpen && (this.state.userName === this.state.createdBy || this.state.userType === 'Teacher') ?
			<button className="close-discussion-button" onClick={this.closeDiscussion}>Close Discussion</button> : null;
		let commentBox = this.state.isOpen ?
			<div>
				<div className="extra-div"></div>
				<textarea type="text" className="comment-input" ref="comment"></textarea>
				<button className="comment-submit-button" onClick={this.addComment}>Comment</button>
			</div> : <div className="comment-disabled">Discussion Closed</div>;
		return (
			<div id="discussion-page">
				<Background />
				<div className="discussion">
					<Header subjectCode={subjectCode} subjectName={subjectName} />
					<div className="discussion-title">{this.state.discussionTitle}</div>
					<div className="discussion-creator">Created by: {this.state.createdBy}</div>
					<div className="discussion-created-on">Created on: {this.state.createdOn}</div>
					{ closeDiscussionButton }
					{ this.displayComments() }
					{ commentBox }
				</div>
			</div>
		);
	}
}

export default Discusson;
