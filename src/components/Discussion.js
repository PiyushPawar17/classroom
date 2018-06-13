import React from 'react';
import { history } from '../routes/AppRouter';
import database from '../firebase/firebase';
import Header from './Header';

import '../styles/Discussion.css';

class Discusson extends React.Component {

	constructor() {
		super();

		this.state = {
			discussionTitle: '',
			createdBy: '',
			allComments: [],
			userName: '',
			dbSubjectKey: '',
			discussionKey: ''
		};

		this.displayComments = this.displayComments.bind(this);
		this.addComment = this.addComment.bind(this);
	}

	componentDidMount() {
		let discussionIndex = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[1];
		let subIndex = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[7];
		let allComments = [];
		database.ref('users/' + this.props.dbUserKey).on('value', (user) => {
			this.setState({ userName: user.val().userName });
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
										dbSubjectKey: subject.val().dbSubjectKey,
										discussionKey: discussion.key,
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
		return (
			<div className="discussion">
				<Header subjectCode={subjectCode} subjectName={subjectName} />
				<div className="discussion-title">{this.state.discussionTitle}</div>
				<div className="discussion-creator">Created by: {this.state.createdBy}</div>
				{ this.displayComments() }
				<div className="extra-div"></div>
				<textarea type="text" className="comment-input" ref="comment"></textarea>
				<button className="comment-submit-button" onClick={this.addComment}>Comment</button>
			</div>
		);
	}
}

export default Discusson;
