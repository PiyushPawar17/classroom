import React from 'react';

import ShortAnnouncements from './ShortAnnouncements';

import '../styles/SubjectHomePage.css';

class SubjectHomePage extends React.Component {

	render() {
		return (
			<div className="subject-home-page">
				<ShortAnnouncements />
			</div>
		);
	}
}

export default SubjectHomePage;
