import React from 'react';
import { Link } from 'react-router-dom';
import database from '../firebase/firebase';

import '../styles/ShortAnnouncements.css';

class ShortAnnouncements extends React.Component {

	constructor() {
		super();

		this.state = {
			announcements: []
		};

		this.displayShortAnnouncements = this.displayShortAnnouncements.bind(this);
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
				<button className="more-announcement-button"><Link to="/announcements">more...</Link></button>
			</div>
		);
	}
}

export default ShortAnnouncements;
