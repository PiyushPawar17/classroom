import React from 'react';

import '../styles/TitleBar.css';

class TitleBar extends React.Component {

	render() {
		return (
			<h1 className="title-bar">{this.props.title}</h1>
		);
	}
}

export default TitleBar;
