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
		  const decadesDivs = decadesList.map((decadesObj,i) =>
		  // Set the state of the keywords list to the value returned by the HTTP response from the server.
		  <option
				key = {i}
				className = "decadesOption"
				value = {decadesObj.Decade} > {decadesObj.Decade}
			</option>
		  );
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
		  console.log(genresList);
		  const genresDivs = genresList.map((genresObj,i) =>
		  // Set the state of the keywords list to the value returned by the HTTP response from the server.
		  <option
				key = {i}
				className = "genresOption"
				value = {genresObj.name} > {genresObj.name}
			</option>
		  );
		  console.log(genresDivs[0].props.value);
		  this.setState({
			genres: genresDivs,
			selectedGenre: genresDivs[0].props.value,
		  });
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		});
	};

	/* ---- Q3a (Best Movies) ---- */
	handleDecadeChange(e) {
		this.setState({
			selectedDecade: e.target.value
		});
	};

	handleGenreChange(e) {
		this.setState({
			selectedGenre: e.target.value
			
		});
		
	};

	/* ---- Q3b (Best Movies) ---- */
	submitDecadeGenre() {
		// Send an HTTP request to the server.
		fetch("http://localhost:8081/bestmovies/" + this.state.selectedDecade + "/" + this.state.selectedGenre,
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
		console.log(this.state.selectedGenre);
			
		  // Map each keyword in this.state.keywords to an HTML element:
		  // A button which triggers the showMovies function for each keyword.
		  
		  const bestmoviesDivs = movieList.map((keywordObj, i) =>
		  
			<BestMoviesRow
			  title = {keywordObj.title}
			  movie_id = {keywordObj.movie_id}
			  rating = {keywordObj.rating}
	
			/> 
		  );
		  // Set the state of the keywords list to the value returned by the HTTP response from the server.
		  this.setState({
			movies: bestmoviesDivs
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
