import React from 'react';
import {
	BrowserRouter as Router,
	Route,Link,
	Switch
} from 'react-router-dom';
import Dashboard from './Dashboard';
import Recommendations from './Recommendations';
import BestMovies from './BestMovies';
import Map from './Map';
import Test from './Test';
import Nutrition from './Nutrition';

const Nav = () => (
	<div>
	  <ul>
		<li><Link to="/">Home</Link></li>
		<li><Link to="/nutrition">Nutrition</Link></li>
		{/* <li><Link to="/map">Map</Link></li> */}
		<li><Link to="/test">Test</Link></li>
		<li><Link to="/bestmovies">Best Movies</Link></li>
	  </ul>
	</div>
  );
  
//   const HomePage = () => <h1>Home Page</h1>;
//   const AboutPage = () => <h1>Map Page</h1>;
  
  class App extends React.Component {
	constructor() {
	  super();
	  this.state = {
		name: 'React'
	  };
	}
  
	render() {
	  return (
		<Router>
  
		  {/* Router component can have only 1 child. We'll use a simple
			div element for this example. */}
		  <div>
			<Nav />
			<Route exact path="/" component={Map} />
			<Route path="/nutrition" component={Nutrition} />
			{/* <Route path="/map" component={Map} /> */}
			<Route path="/test" component={Test} />
			<Route path="/bestmovies" component={BestMovies} />
		  </div>
		</Router>
	  );
	}
  }
  export default App;