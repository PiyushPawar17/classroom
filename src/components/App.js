import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Classroom from './Classroom';
import HomePage from './HomePage';
import Announcements from './Announcements';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Details from './Details';

import '../styles/App.css';

class App extends React.Component {

	render() {
		return (
			<div>
				<BrowserRouter>
					<Switch>
						<Route exact path='/' component={Details} />
						<Route path='/announcements' component={Announcements} />
					</Switch>
				</BrowserRouter>
			</div>
		);
	}
}

export default App;
