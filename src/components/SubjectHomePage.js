import React from 'react';
import { history } from '../routes/AppRouter';
import Header from './Header';
import ShortAnnouncements from './ShortAnnouncements';

import '../styles/SubjectHomePage.css';

class SubjectHomePage extends React.Component {

	render() {
		let subIndex = history.location.search.slice(1, history.location.search.length).split('=')[1];
		return (
			<div className="subject-home-page">
				<Header />
				<ShortAnnouncements subIndex={subIndex} dbUserKey={this.props.dbUserKey} />
			</div>
		);
	}
}

export default SubjectHomePage;
