import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import MainPage from './MainPage';
import Announcements from './Announcements';
import SignIn from './SignIn';

import '../styles/App.css';

class App extends React.Component {

	render() {
		return (
			<div>
				<BrowserRouter>
					<Switch>
						<Route exact path='/' component={SignIn} />
						<Route path='/announcements' component={Announcements} />
					</Switch>
				</BrowserRouter>
			</div>
		);
	}
}

export default App;
