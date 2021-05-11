import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
// import KeywordButton from './KeywordButton';
// import DashboardMovieRow from './DashboardMovieRow';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of keywords,
    // and a list of movies for a specified keyword.
    this.state = {
      keywords: [],
      movies: []
    };

    // this.showMovies = this.showMovies.bind(this);
  };

 


  render() {
    return (
      <div className="Dashboard">

        <PageNavbar active="dashboard" />
        <div Class="container1">
					<img src={require('../image/covid1.png')} className="covid1"/>
          <div class="bottom-left">Coronavirus disease 2019 (COVID-19), also known as the coronavirus, COVID or Covid, is a contagious disease caused
           by severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2).
           The first known case was identified in Wuhan, China, in December 2019.The disease has since spread worldwide, leading to an ongoing pandemic.</div>
		  		</div>
          
          <div class="container">
					<img src={require('../image/covid2.png')} className="covid2"/>
						<div class="middle">
							<a href="https://www.cdc.gov/coronavirus/2019-ncov/index.html">
    							<div class="text">Symptoms of COVID-19</div>
							</a>
  						</div>
		  		</div>

          <div class="container3">
					<img src={require('../image/covid3.jpg')} className="covid3"/>
						<div class="overlay">
							<a href="https://www.cdc.gov/">
    							<div class="text3">News of COVID-19</div>
							</a>
  						</div>
		  		</div>


        
      </div>
    );
  };
};
