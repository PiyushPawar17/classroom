import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import database, { firebase } from '../firebase/firebase';

import Classroom from '../components/Classroom';
import SubjectHomePage from '../components/SubjectHomePage';
import Announcements from '../components/Announcements';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import Details from '../components/Details';
import Subject from '../components/Subject';
import UserSubjects from '../components/UserSubjects';
import HomePage from '../components/HomePage';
import AllSubjects from '../components/AllSubjects';

export const history = createHistory();

let dbUserKey;
firebase.auth().onAuthStateChanged((user) => {
	if (user) {
		console.log('Logged In');
		const uid = firebase.auth().currentUser.uid;

		database.ref('users').once('value').then((users) => {
			users.forEach((user) => {
				if (user.val().userUID === uid)
					dbUserKey = user.key;
			});
		});
	}
	else
		console.log('Logged Out');
});

const AppRouter = () => (
	<Router history={history}>
		<Switch>
			<Route exact path='/' component={Classroom} />
			<Route path='/signin' component={SignIn} />
			<Route path='/signup' component={SignUp} />
			<Route path='/details' component={Details} />
			<Route path='/homepage' render={(props) => <HomePage {...props} dbUserKey={dbUserKey} />} />
			<Route path='/allsubjects' render={(props) => <AllSubjects {...props} dbUserKey={dbUserKey} />} />
			<Route path='/subjecthomepage' render={(props) => <SubjectHomePage {...props} dbUserKey={dbUserKey} />} />
			<Route path='/announcements' render={(props) => <Announcements {...props} dbUserKey={dbUserKey} />} />
		</Switch>
	</Router>
);

export default AppRouter;
