
import React, { Component } from 'react';
import PageNavbar from './PageNavbar';
import { MapContainer, CircleMarker, TileLayer,Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import '../style/Map.css';
class Map extends Component {
    constructor(props) {
		super(props);

		this.state = {
			countries: [],
            week: [],
            selectedWeek: ""
		};

		this.submitWeekChange = this.submitWeekChange.bind(this);
	    this.handleWeekChange = this.handleWeekChange.bind(this);
		// this.handleGenreChange = this.handleGenreChange.bind(this);
	};

	/* ---- Q3a (Best Movies) ---- */
	componentDidMount() {
	
		fetch("http://localhost:8081/map",
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res => {
		  // Convert the response data to a JSON.
		// console.log(res.json());
          return res.json();
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
	  }).then(casesList => {
            if (!casesList) return;
            const countriesDivs = casesList.map((casesObj, i) =>
        <CircleMarker
            key={i}
            center={[casesObj.latitude, casesObj.longitude]}
            // radius={20 * Math.log(casesObj.Confirmed / 100000)}
            radius={casesObj.Confirmed / 400000}
            fillOpacity={0.5}
            color="red"
            stroke={false}
            name={casesObj.Country}
        >
            <Tooltip direction="right" offset={[-8, -2]} opacity={1}>
                <span>{casesObj.Country }</span>
                <br />
                <span>{ "Confirmed \n" + ": " + casesObj.Confirmed}</span>
                <br />
                <span>{ "Deaths \n" + ": " + casesObj.Deaths}</span>
            </Tooltip>
        </CircleMarker>
        );

        // Set the state of the keywords list to the value returned by the HTTP response from the server.
        this.setState({
            countries:countriesDivs
        });
        // console.log(this.state.countries[0]);
    }, err => {
        // Print the error if there is one.
        console.log(err);
      });

        //fetch the weeks options
        fetch("http://localhost:8081/week",
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res => {
		  // Convert the response data to a JSON.
		  return res.json();
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
	  }).then(weekList => {
		  if (!weekList) return;

		  const weekDivs = weekList.map((weekObj, i) =>
		  <option
		      key={i}
		      className="weekOption"
			  value={weekObj.Date.substring(0,10)}>{weekObj.Date.substring(0,10)}
		  </option>
		  );
        //   console.log(decadesDivs);
		//    console.log(decadesList);
		  this.setState({
			week: weekDivs,
			selectedWeek: weekDivs[0].props.value,
		  });
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		});

	};
    handleWeekChange(e) {
		console.log(e.target.value);
        let tmp = e.target.value;
        let date = tmp.substring(0,10);
        console.log(date);
		this.setState({
			selectedWeek: date
		});

	};

    submitWeekChange(e) {
        fetch("http://localhost:8081/byWeek/"+this.state.selectedWeek,
        {
            method: 'GET' // The type of HTTP request.
        }).then(res =>{
            return res.json();
        }, err => {
            // Print the error if there is one.
            console.log(err);
        }).then(casesList => {
            if (!casesList) return;
            const countriesDivs = casesList.map((casesObj, i) =>
        <CircleMarker
            key={i}
            center={[casesObj.latitude, casesObj.longitude]}
            // radius={20 * Math.log(casesObj.Confirmed / 100000)}
            radius={casesObj.Confirmed / 400000}
            fillOpacity={0.5}
            color="red"
            stroke={false}
            name={casesObj.Country}
        >
            <Tooltip direction="right" offset={[-8, -2]} opacity={1}>
                <span>{casesObj.Country }</span>
                <br />
                <span>{ "Confirmed \n" + ": " + casesObj.Confirmed}</span>
                <br />
                <span>{ "Deaths \n" + ": " + casesObj.Deaths}</span>
            </Tooltip>
        </CircleMarker>
        );

        // Set the state of the keywords list to the value returned by the HTTP response from the server.
        this.setState({
            countries:countriesDivs
        });
        console.log(this.state.countries[0]);
    }, err => {
        // Print the error if there is one.
        console.log(err);
      });
    
	};
  render() {
    return (
        <div>
        <PageNavbar active="map" />
        <div className="dropdown-container">
        <select value={this.state.selectedWeek} onChange={this.handleWeekChange} className="dropdown" id="weekDropdown">
            {this.state.week}
        </select>
        <button className="submit-btn" id="submitBtn" onClick={this.submitWeekChange}>Submit</button>
        </div>
      <div id = "myMap">
        <MapContainer
          style={{ height: "680px", width: "100%", backgroundColor: "#696969",color:"blue" }}
          zoom={2}
          center={[0, 0]}>
              <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" />
              <div className="movies-container" id="results">
			          {this.state.countries}
			        </div>
        </MapContainer>
      </div>
      </div>
    );
  }
}

export default Map;