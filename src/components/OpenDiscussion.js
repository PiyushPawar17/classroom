import React from 'react';
import { history } from '../routes/AppRouter';
import { database } from '../firebase/firebase';

import Background from './Background';
import Header from './Header';

import '../styles/OpenDiscussion.css';

class OpenDiscussion extends React.Component {

	constructor() {
		super();

		this.state = {
			allMessages: [],
			userName: ''
		};

		this.displayMessages = this.displayMessages.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
	}

	componentDidMount() {
		const dbSubjectKey = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[5];
		let allMessages = [];

		database.ref('users/' + this.props.dbUserKey).on('value', (user) => {
			this.setState({ userName: user.val().userName });
		});

		database.ref('subjects/' + dbSubjectKey + '/openDiscussionMessages').on('value', (messages) => {
			messages.forEach((message) => {
				allMessages.push({ ...message.val() });
			});
			this.setState({ allMessages: allMessages || [] });
			allMessages = [];
		});
	}

	displayMessages() {
		return this.state.allMessages.map((message) => {
			return (
				<div className="message">
					<div className="message-user">{message.user}</div>
					<pre className="message-body">{message.message}</pre>
				</div>
			);
		});
	}

	sendMessage() {
		const dbSubjectKey = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[5];

		database.ref('subjects/' + dbSubjectKey + '/openDiscussionMessages').push({
			user: this.state.userName,
			message: this.refs.message.value
		});

		this.refs.message.value = '';
	}

	render() {
		const subjectName = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[1];
		const subjectCode = history.location.search.slice(1, history.location.search.length).split(/[=&]+/)[3];
		return (
			<div id="open-discussion-page">
				<Background />
				<div className="open-discussion-div">
					<Header subjectCode={subjectCode} subjectName={subjectName} />
					<div className="open-discussion-page-title">Open Discussion</div>
					{ this.displayMessages() }
					<div>
						<div className="extra-div"></div>
						<textarea type="text" className="message-input" ref="message"></textarea>
						<button className="message-send-button" onClick={this.sendMessage}>Send Message</button>
					</div>
				</div>
			</div>
		);
	}
}

export default OpenDiscussion;
