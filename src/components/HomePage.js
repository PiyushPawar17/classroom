import React from 'react';

import TitleBar from './TitleBar';
import ShortAnnouncements from './ShortAnnouncements';

import '../styles/HomePage.css';

class HomePage extends React.Component {

	render() {
		return (
			<div className="home-page">
				<TitleBar title="Main Page" />
				<ShortAnnouncements />
			</div>
		);
	}
}

export default HomePage;
