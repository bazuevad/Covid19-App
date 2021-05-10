import React from 'react';
import PageNavbar from './PageNavbar';
import BestMoviesRow from './BestMoviesRow';
import '../style/BestMovies.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BestMovies extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedSex:"",
			selectedAgegroup: "",
			selectedRace: "",
			sexes: [],
			agegroups: [],
			races: [],
			results: []
		};

		this.submitDecadeGenre = this.submitDecadeGenre.bind(this);

		this.handleSexChange = this.handleSexChange.bind(this);
		this.handleAgegroupChange = this.handleAgegroupChange.bind(this);
		this.handleRaceChange = this.handleRaceChange.bind(this);
	};

	/* ---- Q3a (Best Movies) ---- */
	componentDidMount() {

		   this.setState({
			sexes:  [{sex: "Male"}, {sex: "Female"}].map((sexesObj, i) =>
  		  <option
  		      key={i}
  		      className="sexesOption"
  			  value={sexesObj.sex}>{sexesObj.sex}
  		  </option>
  		  ),
			selectedSex: 'Male',
		  });

		  this.setState({
			agegroups: [{Decade: "0 - 9 Years"},
  		                       {Decade: "10 - 19 Years"},
  							   {Decade: "20 - 29 Years"},
  							   {Decade: "30 - 39 Years"},
  							   {Decade: "40 - 49 Years"},
  							   {Decade: "50 - 59 Years"},
  							   {Decade: "60 - 69 Years"},
  							   {Decade: "70 - 79 Years"},
  							   {Decade: "80+ Years"}].map((decadesObj, i) =>
  		  <option
  		      key={i}
  		      className="decadesOption"
  			  value={decadesObj.Decade}>{decadesObj.Decade}
  		  </option>
  		  ),
			selectedAgegroup: "0 - 9 Years",
		  });


		  this.setState({
			races: [{Race: "American Indian-Alaska Native"},
  		                     {Race: "Asian"},
  							 {Race: "Black"},
  							 {Race: "Hispanic-Latino"},
  							 {Race: "Multiple-Other"},
  							 {Race: "Native Hawaiian-Other Pacific Islander"},
  							 {Race: "White"}].map((racesObj, i) =>
  		  <option
  		      key={i}
  		      className="racesOption"
  			  value={racesObj.Race}>{racesObj.Race}
  		  </option>
  		  ),
			selectedRace: "American Indian-Alaska Native",
		  });


	};

	/* ---- Q3a (Best Movies) ---- */
	handleSexChange(e) {
		console.log(e.target.value);
		this.setState({
			selectedSex: e.target.value
		});


	};

	handleAgegroupChange(e) {
		console.log(e.target.value);
		this.setState({
			selectedAgegroup: e.target.value
		});


	};

	handleRaceChange(e) {
		console.log(e.target.value);
		this.setState({
			selectedRace: e.target.value
		});

	};

	/* ---- Q3b (Best Movies) ---- */
	submitDecadeGenre() {
		fetch("http://localhost:8081/groups/"+ this.state.selectedSex +"/" +this.state.selectedAgegroup+"/"+this.state.selectedRace,
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res =>{
		  return res.json();
		}, err => {
		  // Print the error if there is one.
		  console.log('nononononononono');
		  console.log(err);
	  }).then(resList => {
		  if (!resList) return;
         console.log(resList);
		  const resDivs = resList.map((resObj, i) =>
			<BestMoviesRow
			    key={i}
				title={resObj.ratio1}
				movie_id={resObj.ratio2}
				rating={resObj.ratio3}
			/>
		  );

		  // Set the state of the keywords list to the value returned by the HTTP response from the server.
		  this.setState({
			results:resDivs
		  });
		}, err => {
		  console.log(err);
		});

	};

	render() {
		return (
			<div className="BestMovies">

				<PageNavbar active="groups" />

				<div className="container bestmovies-container">
				<div class="jumbotron bg-dark text-white">
						<div className="h5">Covid Group Exploration</div>
						<br></br>
						<div className="h6">By choosing sex, race and age group, we can see three the percentage of whether people infected by <br></br>COVID-19 among their group are in hospital, in icu or death.
                        </div>
						<div className="dropdown-container">
						    <select value={this.state.selectedSex} onChange={this.handleSexChange} className="dropdown" id="sexesDropdown">
							    {this.state.sexes}
						    </select>
							<select value={this.state.selectedAgegroup} onChange={this.handleAgegroupChange} className="dropdown" id="agegroupsDropdown">
								{this.state.agegroups}
							</select>
							<select value={this.state.selectedRace} onChange={this.handleRaceChange} className="dropdown" id="racesDropdown">
								{this.state.races}
							</select>
							<button className="submit-btn" id="submitBtn" onClick={this.submitDecadeGenre}>Submit</button>
						</div>
					</div>
					<div class="jumbotron bg-dark text-white">
					<div className="h6">The result is shown below, in which 1 means people who are infected among the selected group are 100% in hospital/in icu/death<br></br>
					and 0 means people who are infected among the selected group are 0% in hospital/in icu/death</div>
					<br></br>
						<div className="movies-container">
							<div className="movie">
								<div className="header"><strong>Ratio of In Hospitial</strong></div>
								<div className="header"><strong>Ratio of In ICU</strong></div>
								<div className="header"><strong>Ratio of Death</strong></div>
					</div>
			        <div className="movies-container" id="results">
			          {this.state.results}
			        </div>
			      </div>
			    </div>
			  </div>
			</div>
		);
	};
};
