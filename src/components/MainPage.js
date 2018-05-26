import React from 'react';

import TitleBar from './TitleBar';
import ShortAnnouncements from './ShortAnnouncements';

import '../styles/MainPage.css';

class MainPage extends React.Component {

	render() {
		return (
			<div className="main-page">
				<TitleBar title="Main Page" />
				<ShortAnnouncements />
			</div>
		);
	}
}

export default MainPage;
