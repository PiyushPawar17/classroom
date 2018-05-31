import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import Classroom from '../components/Classroom';
import HomePage from '../components/HomePage';
import Announcements from '../components/Announcements';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import Details from '../components/Details';

export const history = createHistory();

const AppRouter = () => (
	<Router history={history}>
		<Switch>
			<Route exact path='/' component={Classroom} />
			<Route path='/signin' component={SignIn} />
			<Route path='/signup' component={SignUp} />
			<Route path='/details' component={Details} />
			<Route path='/homepage' component={HomePage} />
		</Switch>
	</Router>
);

export default AppRouter;
