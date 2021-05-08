import React from 'react';
import PageNavbar from './PageNavbar';
import CaseDisplay from './CaseDisplay';
import '../style/CaseSituation.css';
import 'bootstrap/dist/css/bootstrap.min.css';


// import  'echarts/lib/chart/line';

export default class CaseSituation extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedCountry: "",
			selectedProvince: "",
			selectedStartTime: "",
			selectedEndTime: "",
			Country: [],
			Province: [],
			StartTime: [],
			EndTime:[],
			cases:[]

		};

		this.handleCountryChange = this.handleCountryChange.bind(this);
		this.handleProvinceChange = this.handleProvinceChange.bind(this);
		this.handleStartTime = this.handleStartTime.bind(this);
		this.handleEndTime = this.handleEndTime.bind(this);
		this.submitDisplay = this.submitDisplay.bind(this);
		// this.plotgraph = this.plotgraph(this);

	};

	componentDidMount() {
	

	//Get the Country name
	fetch("http://localhost:8081/country",
	{
	  method: 'GET' // The type of HTTP request.
	}).then(res => {
	  // Convert the response data to a JSON.
	 
	  return res.json();
	}, err => {
	  // Print the error if there is one.
	  console.log(err);
  }).then(CountryList => {
	  if (!CountryList) return;
	  console.log(CountryList)
	  const CountryDivs = CountryList.map((CountryObj, i) =>
	  <option
		  key={i}
		  className="CountryOption"
		  value={CountryObj.country_name}>{CountryObj.country_name}
	  </option>
	  );

	  // Set the state of the keywords list to the value returned by the HTTP response from the server.
	  this.setState({
		Country: CountryDivs,
	  });

	}, err => {
	  // Print the error if there is one.
	  console.log(err);
	});


	fetch("http://localhost:8081/startTime",
	{
	  method: 'GET' // The type of HTTP request.
	}).then(res => {
	  // Convert the response data to a JSON.
	  return res.json();
	}, err => {
	  // Print the error if there is one.
	  console.log(err);
  }).then(StartTimeList => {
	  if (!StartTimeList) return;
	  console.log(StartTimeList)
	  const StartTimeDivs = StartTimeList.map((StartTimeObj, i) =>
	  <option
		  key={i}
		  className="StartTimeOption"
		  value={StartTimeObj.StartDate}>{StartTimeObj.StartDate}
	  </option>
	  );

	  // Set the state of the keywords list to the value returned by the HTTP response from the server.
	  this.setState({
		StartTime: StartTimeDivs,
	  });

	}, err => {
	  // Print the error if there is one.
	  console.log(err);
	});
	

	};

	handleGenreChange(e) {
		console.log(e.target.value);
		this.setState({
			selectedGenre: e.target.value
		});

	};

	handleCountryChange(e) {
		console.log(e.target.value);
		this.setState({
			selectedCountry: e.target.value
		});
		//Get the Province name
		fetch("http://localhost:8081/province/" + e.target.value,
		{
		method: 'GET' // The type of HTTP request.
		}).then(res => {
		// Convert the response data to a JSON.
		return res.json();
		}, err => {
		// Print the error if there is one.
		console.log(err);
		}).then(ProvinceList => {
		console.log(ProvinceList)
		if (!ProvinceList) return;

		const ProvinceDivs = ProvinceList.map((ProvinceObj, j) =>
		<option
			key={j}
			className="ProvinceOption"
			value={ProvinceObj.province_name}>{ProvinceObj.province_name}
		</option>
		);

		// Set the state of the keywords list to the value returned by the HTTP response from the server.
		this.setState({
			Province: ProvinceDivs,
		});

		}, err => {
		// Print the error if there is one.
		console.log(err);
	});
	};

	handleDecadeChange(e) {
		console.log(e.target.value);
		this.setState({
			selectedDecade: e.target.value
		});
		
	};
	handleProvinceChange(e) {

		console.log(e.target.value);

		this.setState({
			selectedProvince: e.target.value
		});
	};



	handleStartTime(e){
		console.log(e.target.value);
		this.setState({
			selectedStartTime: e.target.value
		});
		fetch("http://localhost:8081/startTime/"+ e.target.value,
	{
	  method: 'GET' // The type of HTTP request.
	}).then(res => {
	  // Convert the response data to a JSON.
	  console.log(res)
	  return res.json();
	}, err => {
	  // Print the error if there is one.
	  console.log(err);
  }).then(EndTimeList => {
	  if (!EndTimeList) return;
	  console.log(EndTimeList)
	  const EndTimeDivs = EndTimeList.map((EndTimeObj, i) =>
	  <option
		  key={i}
		  className="EndTimeOption"
		  value={EndTimeObj.EndDate}>{EndTimeObj.EndDate}
	  </option>
	  );

	  // Set the state of the keywords list to the value returned by the HTTP response from the server.
	  this.setState({
		EndTime: EndTimeDivs,
	  });

	}, err => {
	  // Print the error if there is one.
	  console.log(err);
	});


	}
	handleEndTime(e){
		console.log(e.target.value);
		console.log(this.state.selectedCountry);
		console.log(this.state.selectedProvince);
		console.log(this.state.selectedStartTime);
		this.setState({
			selectedEndTime: e.target.value
		});
	}

	submitDisplay() {
		
		fetch("http://localhost:8081/display/"+this.state.selectedCountry+"/"+this.state.selectedProvince+"/"+this.state.selectedStartTime+"/"+this.state.selectedEndTime,
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res =>{
		{console.log(res);
		  return res.json();}
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
	  }).then(displayList => {
		  if (!displayList){
			
			return;}

         console.log(displayList);
		 const displayDivs = displayList.map((displayObj, i) =>
			<CaseDisplay
			    key={i}
				country={displayObj.Country}
				province={displayObj.Province}
				confirmed={displayObj.Confirm}
				death={displayObj.Death}
				recovered={displayObj.Recover}

			/>
		  );

		  // Set the state of the keywords list to the value returned by the HTTP response from the server.
		  this.setState({
			cases:displayDivs
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
						<div className="h5">Cases Situation</div>
						<div className="h4">This part returns the total number of confirmed, recovered and death cases with a given country and province.</div>
						<div className="dropdown-container">
							<select value={this.state.selectedCountry} onChange={this.handleCountryChange} className="dropdown" id="countryDropdown">
								{this.state.Country}
							</select>
							<select value={this.state.selectedProvince} onChange={this.handleProvinceChange} className="dropdown" id="provinceDropdown">
								{this.state.Province}
							</select>
							 <select value={this.state.selectedStartTime} onChange={this.handleStartTime} className="dropdown" id="decadesDropdown">
								{this.state.StartTime}
							</select>
							<select value={this.state.selectedEndTime} onChange={this.handleEndTime} className="dropdown" id="decadesDropdown">
								{this.state.EndTime}
							</select> 
							<button className="submit-btn" id="submitBtn" onClick={this.submitDisplay}>Submit</button>
						</div>
					</div>
					<div className="jumbotron">
						<div className="movies-container">
							<div className="movie">
			                    <div className="header"><strong>Country</strong></div>
								<div className="header"><strong>Province</strong></div>
			                    <div className="header"><strong>Confirmed</strong></div>
								<div className="header"><strong>Recovered</strong></div>
								<div className="header"><strong>Death</strong></div>
			        		</div>
							<div className="movies-container" id="results">
							{this.state.cases}
							</div>
			      		</div>
			    	</div>
				<div className="jumbotron">
				<div className="h5">Cases Situation</div>
				<div className="h4">This part returns the top5 countries with the highest total number of confirmed, recovered and death cases with a given time period.</div>
				  </div>
			  </div>
			</div>
		);
	};
};
