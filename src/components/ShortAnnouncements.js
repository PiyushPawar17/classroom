import React from 'react';

import database from '../firebase/firebase';
import { history } from '../routes/AppRouter';

import '../styles/ShortAnnouncements.css';

class ShortAnnouncements extends React.Component {

	constructor() {
		super();

		this.state = {
			announcements: []
		};

		this.displayShortAnnouncements = this.displayShortAnnouncements.bind(this);
		this.linkToAnnouncements = this.linkToAnnouncements.bind(this);
	}

	componentDidMount() {
		let announcements = [];

		database.ref('announcements').on('value', (snapshot) => {
			snapshot.forEach((childSnapshot) => {
				announcements.push({
					_id: childSnapshot.key,
					title: childSnapshot.val().title
				});
			});
			announcements.reverse();

			if (announcements.length > 4)
				announcements = announcements.slice(0, 4);

			this.setState({ announcements });
			announcements = [];
		});
	}

	linkToAnnouncements() {
		history.push('/announcements?subIndex=' + this.props.subIndex);
	}

	displayShortAnnouncements() {
		return this.state.announcements.map((announcement, index) => {
			return (
				<div key={index} className="short-announcement">{announcement.title}</div>
			)
		});
	}

	render() {
		return (
			<div className="short-announcements">
				<div className="short-announcements-title">Announcements</div>
				{ this.displayShortAnnouncements() }
				<button className="more-announcement-button" onClick={this.linkToAnnouncements}>more...</button>
			</div>
		);
	}
}

export default ShortAnnouncements;
