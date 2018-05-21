import React from 'react';

class Announcement extends React.Component {

	render() {

		return (
			<div className="announcement">
				<h3 className="announcement-title">{this.props.announcement.title}</h3>
				<div className="announcement-description">{this.props.announcement.description}</div>
			</div>
		);
	}
}

export default Announcement;
