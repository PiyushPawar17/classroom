import React from 'react';
import { database } from '../firebase/firebase';
import { history } from '../routes/AppRouter';

import '../styles/ShortAnnouncements.css';

class ShortAnnouncements extends React.Component {

	constructor() {
		super();

		this.state = {
			allAnnouncements: []
		};

		this.displayShortAnnouncements = this.displayShortAnnouncements.bind(this);
		this.linkToAnnouncements = this.linkToAnnouncements.bind(this);
	}

	componentDidMount() {
		let allAnnouncements = [];

		database.ref('users/' + this.props.dbUserKey + '/userSubjects').on('value', (subjects) => {
			let currentIndex = 0;
			subjects.forEach((subject) => {
				if (currentIndex == this.props.subIndex) {
					database.ref('subjects/' + subject.val().dbSubjectKey + '/announcements').on('value', (announcements) => {
						announcements.forEach((announcement) => {
							allAnnouncements.push({ ...announcement.val() });
						});
						allAnnouncements.reverse();
					});
					this.setState({ allAnnouncements });
					allAnnouncements = [];
				}
				currentIndex++;
			});
			currentIndex = 0;
		});
	}

	linkToAnnouncements() {
		history.push('/announcements?subIndex=' + this.props.subIndex);
	}

	displayShortAnnouncements() {
		return this.state.allAnnouncements.map((announcement, index) => {
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
