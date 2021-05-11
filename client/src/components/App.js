import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Dashboard from './Dashboard';
import BestMovies from './BestMovies';
import Map from './Map';
import Nutrition from './Nutrition';
import CaseSituation from './CaseSituation';

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => <Dashboard />}
						/>
						<Route
							exact
							path="/dashboard"
							render={() => <Dashboard />}
						/>
						<Route
							path="/groups"
							render={() => <BestMovies />}
						/>
						<Route
							path="/map"
							render={() => <Map />}
						/>
						<Route
							path="/nutrition"
							render={() => <Nutrition />}
						/>
						<Route
							path="/cases"
							render={() => <CaseSituation />}
						/>
					</Switch>
				</Router>
			</div>
		);
	};
};