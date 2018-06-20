import React from 'react';
import { storage } from '../firebase/firebase';

import '../styles/File.css';

const { shell } = window.require('electron');

class File extends React.Component {

	constructor() {
		super();

		this.view = this.view.bind(this);
	}

	view() {
		storage.ref(this.props.filePath).getDownloadURL().then((url) => {
			shell.openExternal(url);
		});
	}

	render() {
		return (
			<div className="file">
				<div className="file-name">{this.props.fileName}</div>
				<button className="file-view-button" onClick={this.view}>View &#128065;</button>
			</div>
		);
	}
}

export default File;
