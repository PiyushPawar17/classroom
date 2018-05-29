import React from 'react';

import '../styles/Details.css';

class Details extends React.Component {

	render() {
		return (
			<div className="details">
				<div className="details-title">Details</div>
				<form className="details-form">
					<div>Name</div>
					<input type="text" className="details-name" />
					<div>ID</div>
					<input type="text" className="details-id" />
					<div>Branch</div>
					<div>
						<label><input type="radio" name="branch" />Computer Science</label>
					</div>
					<div>
						<label><input type="radio" name="branch" />Information Techology</label>
					</div>
					<input type="submit" className="details-submit" />
					<input type="button" value="Cancel" className="details-cancel-button" />
				</form>
			</div>
		);
	}
}

export default Details;
