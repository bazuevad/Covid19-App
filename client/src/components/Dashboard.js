import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import KeywordButton from './KeywordButton';
import DashboardMovieRow from './DashboardMovieRow';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of keywords,
    // and a list of movies for a specified keyword.
    this.state = {
      keywords: [],
      movies: []
    };

    this.showMovies = this.showMovies.bind(this);
  };

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/keywords",
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(keywordsList => {
      if (!keywordsList) return;

      // Map each keyword in this.state.keywords to an HTML element:
      // A button which triggers the showMovies function for each keyword.
      const keywordsDivs = keywordsList.map((keywordObj, i) =>
        <KeywordButton
          id={"button-" + keywordObj.Province_State}
          onClick={() => this.showMovies(keywordObj.Province_State)}
          keyword={keywordObj.Province_State}
        />
      );

      // Set the state of the keywords list to the value returned by the HTTP response from the server.
      this.setState({
        keywords: keywordsDivs
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
  };

  /* ---- Q1b (Dashboard) ---- */
  /* Set this.state.movies to a list of <DashboardMovieRow />'s. */
  showMovies(keyword) {
      // Send an HTTP request to the server.
      fetch("http://localhost:8081/keywords/:"+keyword,
      {
        method: 'GET' // The type of HTTP request.
      }).then(res => {
        // Convert the response data to a JSON.
        return res.json();
      }, err => {
        // Print the error if there is one.
        console.log(err);
    }).then(movieList => {
        if (!movieList) return;

        const movieDivs = movieList.map((movieObj, i) =>
          <DashboardMovieRow
              title={movieObj.title}
              rating={movieObj.rating}
              num_ratings={movieObj.num_ratings}
          />
        );

        // Set the state of the keywords list to the value returned by the HTTP response from the server.
        this.setState({
          movies:movieDivs
        });
      }, err => {
        // Print the error if there is one.
        console.log(err);
      });

  };


  render() {
    return (
      <div className="Dashboard">

        <PageNavbar active="dashboard" />
        <div class="container">
					<img src={require('C:/Users/Cong Han/OneDrive/Desktop/CIS550/hw2/client/src/image/mina.jpg')} className="image"/>
						<div class="middle">
							<a href="https://baidu.com">
    							<div class="text">Mina</div>
							</a>
  						</div>
		  		</div>
          
        
      </div>
    );
  };
};
