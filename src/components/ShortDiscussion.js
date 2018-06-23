import React from 'react';
import { history } from '../routes/AppRouter';

import '../styles/ShortDiscussion.css';

class ShortDiscussion extends React.Component {

	constructor() {
		super();

		this.openDiscussion = this.openDiscussion.bind(this);
	}

	openDiscussion() {
		history.push(
			'/discussion?discussionIndex=' + this.props.index +
			'&subjectName=' + this.props.subjectName +
			'&subjectCode=' + this.props.subjectCode +
			'&subIndex=' + this.props.subIndex
		);
	}

	render() {
		return (
			<div className="short-discussion" onClick={this.openDiscussion}>
				<div className="short-discussion-title">{this.props.discussion.discussionTitle}</div>
				<div className="short-discussion-creator">Created by: {this.props.discussion.createdBy}</div>
				<div className="short-discussion-created-on">Created on: {this.props.discussion.createdOn}</div>
			</div>
		);
	}
}

export default ShortDiscussion;
