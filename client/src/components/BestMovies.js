import React from 'react';
import PageNavbar from './PageNavbar';
import BestMoviesRow from './BestMoviesRow';
import '../style/BestMovies.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BestMovies extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedDecade: "",
			selectedGenre: "",
			decades: [],
			genres: [],
			movies: []
		};

		this.submitDecadeGenre = this.submitDecadeGenre.bind(this);
		this.handleDecadeChange = this.handleDecadeChange.bind(this);
		this.handleGenreChange = this.handleGenreChange.bind(this);
	};

	/* ---- Q3a (Best Movies) ---- */
	componentDidMount() {
		// Send an HTTP request to the server.
		fetch("http://localhost:8081/decades",
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res => {
		  // Convert the response data to a JSON.
		  return res.json();
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
	  }).then(decadesList => {
		  if (!decadesList) return;

		  const decadesDivs = decadesList.map((decadesObj, i) =>
		  <option
		      key={i}
		      className="decadesOption"
			  value={decadesObj.Decade}>{decadesObj.Decade}
		  </option>
		  );
          console.log(decadesDivs);
		   console.log(decadesList);
		  this.setState({
			decades: decadesDivs,
			selectedDecade: decadesDivs[0].props.value,
		  });
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		});

		fetch("http://localhost:8081/genres",
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res => {
		  // Convert the response data to a JSON.
		  return res.json();
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
	  }).then(genresList => {
		  if (!genresList) return;

		  const genresDivs = genresList.map((genresObj, i) =>
		  <option
		      key={i}
		      className="genresOption"
			  value={genresObj.name}>{genresObj.name}
		  </option>
		  );

		  // Set the state of the keywords list to the value returned by the HTTP response from the server.
		  this.setState({
			genres: genresDivs,
			selectedGenre: genresDivs[0].props.value
		  });

		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		});

	};

	/* ---- Q3a (Best Movies) ---- */
	handleDecadeChange(e) {
		console.log(e.target.value);
		this.setState({
			selectedDecade: e.target.value
		});


	};

	handleGenreChange(e) {
		console.log(e.target.value);
		this.setState({
			selectedGenre: e.target.value
		});

	};

	/* ---- Q3b (Best Movies) ---- */
	submitDecadeGenre() {
		fetch("http://localhost:8081/bestmovies/"+this.state.selectedDecade+"/"+this.state.selectedGenre,
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res =>{
		  return res.json();
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
	  }).then(movsList => {
		  if (!movsList) return;

         console.log(movsList);
		  const movsDivs = movsList.map((movsObj, i) =>
			<BestMoviesRow
			    key={i}
				title={movsObj.title}
				movie_id={movsObj.movie_id}
				rating={movsObj.rating}
			/>
		  );

		  // Set the state of the keywords list to the value returned by the HTTP response from the server.
		  this.setState({
			movies:movsDivs
		  });
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		});

	};

	render() {
		return (
			<div className="BestMovies">

				<PageNavbar active="bestgenres" />

				<div className="container bestmovies-container">
					<div className="jumbotron">
						<div className="h5">Best Movies</div>
						<div className="dropdown-container">
							<select value={this.state.selectedDecade} onChange={this.handleDecadeChange} className="dropdown" id="decadesDropdown">
								{this.state.decades}
							</select>
							<select value={this.state.selectedGenre} onChange={this.handleGenreChange} className="dropdown" id="genresDropdown">
								{this.state.genres}
							</select>
							<button className="submit-btn" id="submitBtn" onClick={this.submitDecadeGenre}>Submit</button>
						</div>
					</div>
					<div className="jumbotron">
						<div className="movies-container">
							<div className="movie">
			                    <div className="header"><strong>Title</strong></div>
			                    <div className="header"><strong>Movie ID</strong></div>
								<div className="header"><strong>Rating</strong></div>
			        </div>
			        <div className="movies-container" id="results">
			          {this.state.movies}
			        </div>
			      </div>
			    </div>
			  </div>
			</div>
		);
	};
};
