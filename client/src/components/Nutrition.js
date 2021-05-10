import React, { Component, Chart } from 'react';
import { MapContainer, CircleMarker, TileLayer,Tooltip } from "react-leaflet";
import { PieChart } from 'react-minimal-pie-chart';
import PageNavbar from './PageNavbar';
import '../style/Nutrition.css';
function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  };
export default class Nutrition extends React.Component {
    constructor(props) {
		super(props);

		this.state = {
			countries: [],
            selectedCountry: "",
            chart: "",
            options: "",
            stats:"",
            alcohol:"",
            oil:"",
            sugar:"",
            milk:"",
            fruits:"",
            fish:"",
            cereals:"",
            roots:"",
            animP:"",
            animF:"",
            veg:"",
            meat:""

		};

		this.submitCountryChange = this.submitCountryChange.bind(this);
	    this.handleCountryChange = this.handleCountryChange.bind(this);
		// this.handleGenreChange = this.handleGenreChange.bind(this);
	};

	/* ---- Q3a (Best Movies) ---- */
	componentDidMount() {
        //fetch the weeks options
        fetch("http://localhost:8081/nutrition",
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res => {
		  // Convert the response data to a JSON.
		  return res.json();
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
	  }).then(countryList => {
		  if (!countryList) return;

		  const countryDivs = countryList.map((countryObj, i) =>
		  <option
		      key={i}
		      className="countryOption"
			  value={countryObj.Country}>{countryObj.Country}
		  </option>
		  );
        //   console.log(decadesDivs);
		//    console.log(decadesList);
		  this.setState({
			countries: countryDivs,
			selectedCountry: countryDivs[0].props.value,
		  });
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		});

	};
 
    handleCountryChange(e) {
        let tmp = e.target.value;
		this.setState({
			selectedCountry: tmp
		});

	};

    async submitCountryChange(e) {
        fetch("http://localhost:8081/byCountry/"+this.state.selectedCountry,
        {
            method: 'GET' // The type of HTTP request.
        }).then(res =>{
            return res.json();
        }, err => {
            // Print the error if there is one.
            console.log(err);
        }).then(nutr => {
            if (!nutr) return;
            const pieChart = nutr.map((nutrObj, i) =>
            
            <PieChart
            
            // labelPosition="25%"
            
            label={(x) => { return x.dataEntry.title;}}
            labelStyle={{ color: "white",fontSize:"2px",fill:"white" }}
            labelPosition="105"
            radius = "25"
            background='#FFF0F5'
            data={[
                { title: 'Alcoholic Beverages, '+ round(nutrObj.Alcoholic_Beverages/(nutrObj.Alcoholic_Beverages+nutrObj.Animal_fats+ nutrObj.Animal_Products+nutrObj.Cereals+nutrObj.Fish_Seafood+nutrObj.Fruits+nutrObj.Milk+nutrObj.Starchy_Roots+nutrObj.Sugar+nutrObj.Vegetable_Oils+nutrObj.Vegetable_Products)*100,3)+'%', value: nutrObj.Alcoholic_Beverages/(nutrObj.Alcoholic_Beverages+nutrObj.Animal_fats+ nutrObj.Animal_Products+nutrObj.Cereals+nutrObj.Fish_Seafood+nutrObj.Fruits+nutrObj.Milk+nutrObj.Starchy_Roots+nutrObj.Sugar+nutrObj.Vegetable_Oils+nutrObj.Vegetable_Products)*100, color: '#E38627' },
                { title: 'Animal Products, '+ round(nutrObj.Animal_Products/(nutrObj.Alcoholic_Beverages+nutrObj.Animal_fats+ nutrObj.Animal_Products+nutrObj.Cereals+nutrObj.Fish_Seafood+nutrObj.Fruits+nutrObj.Milk+nutrObj.Starchy_Roots+nutrObj.Sugar+nutrObj.Vegetable_Oils+nutrObj.Vegetable_Products)*100,3)+'%', value: nutrObj.Animal_Products/(nutrObj.Alcoholic_Beverages+nutrObj.Animal_fats+ nutrObj.Animal_Products+nutrObj.Cereals+nutrObj.Fish_Seafood+nutrObj.Fruits+nutrObj.Milk+nutrObj.Starchy_Roots+nutrObj.Sugar+nutrObj.Vegetable_Oils+nutrObj.Vegetable_Products)*100, color: '#6A2135' },
                { title: 'Starchy roots, '+ round(nutrObj.Starchy_Roots/(nutrObj.Alcoholic_Beverages+nutrObj.Animal_fats+ nutrObj.Animal_Products+nutrObj.Cereals+nutrObj.Fish_Seafood+nutrObj.Fruits+nutrObj.Milk+nutrObj.Starchy_Roots+nutrObj.Sugar+nutrObj.Vegetable_Oils+nutrObj.Vegetable_Products)*100,3)+'%', value: nutrObj.Starchy_Roots/(nutrObj.Alcoholic_Beverages+nutrObj.Animal_fats+ nutrObj.Animal_Products+nutrObj.Cereals+nutrObj.Fish_Seafood+nutrObj.Fruits+nutrObj.Milk+nutrObj.Starchy_Roots+nutrObj.Sugar+nutrObj.Vegetable_Oils+nutrObj.Vegetable_Products)*100, color: '#F0FFF0' },
                { title: 'Cereals, '+ round(nutrObj.Cereals/(nutrObj.Alcoholic_Beverages+nutrObj.Animal_fats+ nutrObj.Animal_Products+nutrObj.Cereals+nutrObj.Fish_Seafood+nutrObj.Fruits+nutrObj.Milk+nutrObj.Starchy_Roots+nutrObj.Sugar+nutrObj.Vegetable_Oils+nutrObj.Vegetable_Products)*100,3)+'%', value: nutrObj.Cereals/(nutrObj.Alcoholic_Beverages+nutrObj.Animal_fats+ nutrObj.Animal_Products+nutrObj.Cereals+nutrObj.Fish_Seafood+nutrObj.Fruits+nutrObj.Milk+nutrObj.Starchy_Roots+nutrObj.Sugar+nutrObj.Vegetable_Oils+nutrObj.Vegetable_Products)*100, color: '#FFE4C4' },
                { title: 'Fish and Seafood, '+ round(nutrObj.Fish_Seafood/(nutrObj.Alcoholic_Beverages+nutrObj.Animal_fats+ nutrObj.Animal_Products+nutrObj.Cereals+nutrObj.Fish_Seafood+nutrObj.Fruits+nutrObj.Milk+nutrObj.Starchy_Roots+nutrObj.Sugar+nutrObj.Vegetable_Oils+nutrObj.Vegetable_Products)*100,3)+'%', value: nutrObj.Fish_Seafood/(nutrObj.Alcoholic_Beverages+nutrObj.Animal_fats+ nutrObj.Animal_Products+nutrObj.Cereals+nutrObj.Fish_Seafood+nutrObj.Fruits+nutrObj.Milk+nutrObj.Starchy_Roots+nutrObj.Sugar+nutrObj.Vegetable_Oils+nutrObj.Vegetable_Products)*100, color: '#black' },
                { title: 'Fruits, '+ round(nutrObj.Fruits/(nutrObj.Alcoholic_Beverages+nutrObj.Animal_fats+ nutrObj.Animal_Products+nutrObj.Cereals+nutrObj.Fish_Seafood+nutrObj.Fruits+nutrObj.Milk+nutrObj.Starchy_Roots+nutrObj.Sugar+nutrObj.Vegetable_Oils+nutrObj.Vegetable_Products)*100,3)+'%', value: nutrObj.Fruits/(nutrObj.Alcoholic_Beverages+nutrObj.Animal_fats+ nutrObj.Animal_Products+nutrObj.Cereals+nutrObj.Fish_Seafood+nutrObj.Fruits+nutrObj.Milk+nutrObj.Starchy_Roots+nutrObj.Sugar+nutrObj.Vegetable_Oils+nutrObj.Vegetable_Products)*100, color: '#9932CC' },
                { title: 'Milk, '+ round(nutrObj.Milk/(nutrObj.Alcoholic_Beverages+nutrObj.Animal_fats+ nutrObj.Animal_Products+nutrObj.Cereals+nutrObj.Fish_Seafood+nutrObj.Fruits+nutrObj.Milk+nutrObj.Starchy_Roots+nutrObj.Sugar+nutrObj.Vegetable_Oils+nutrObj.Vegetable_Products)*100,3)+'%', value: nutrObj.Milk/(nutrObj.Alcoholic_Beverages+nutrObj.Animal_fats+ nutrObj.Animal_Products+nutrObj.Cereals+nutrObj.Fish_Seafood+nutrObj.Fruits+nutrObj.Milk+nutrObj.Starchy_Roots+nutrObj.Sugar+nutrObj.Vegetable_Oils+nutrObj.Vegetable_Products)*100, color: '#E9967A' },
                { title: 'Animal Fats, '+ round(nutrObj.Animal_fats/(nutrObj.Alcoholic_Beverages+nutrObj.Animal_fats+ nutrObj.Animal_Products+nutrObj.Cereals+nutrObj.Fish_Seafood+nutrObj.Fruits+nutrObj.Milk+nutrObj.Starchy_Roots+nutrObj.Sugar+nutrObj.Vegetable_Oils+nutrObj.Vegetable_Products)*100,3)+'%', value: nutrObj.Animal_fats/(nutrObj.Alcoholic_Beverages+nutrObj.Animal_fats+ nutrObj.Animal_Products+nutrObj.Cereals+nutrObj.Fish_Seafood+nutrObj.Fruits+nutrObj.Milk+nutrObj.Starchy_Roots+nutrObj.Sugar+nutrObj.Vegetable_Oils+nutrObj.Vegetable_Products)*100, color: '#C13C37' },
                { title: 'Sugar, '+ round(nutrObj.Sugar/(nutrObj.Alcoholic_Beverages+nutrObj.Animal_fats+ nutrObj.Animal_Products+nutrObj.Cereals+nutrObj.Fish_Seafood+nutrObj.Fruits+nutrObj.Milk+nutrObj.Starchy_Roots+nutrObj.Sugar+nutrObj.Vegetable_Oils+nutrObj.Vegetable_Products)*100,3)+'%', value: nutrObj.Sugar/(nutrObj.Alcoholic_Beverages+nutrObj.Animal_fats+ nutrObj.Animal_Products+nutrObj.Cereals+nutrObj.Fish_Seafood+nutrObj.Fruits+nutrObj.Milk+nutrObj.Starchy_Roots+nutrObj.Sugar+nutrObj.Vegetable_Oils+nutrObj.Vegetable_Products)*100, color: '#F0E68C' },
                { title: 'Vegetable Oil, '+ round(nutrObj.Vegetable_Oils/(nutrObj.Alcoholic_Beverages+nutrObj.Animal_fats+ nutrObj.Animal_Products+nutrObj.Cereals+nutrObj.Fish_Seafood+nutrObj.Fruits+nutrObj.Milk+nutrObj.Starchy_Roots+nutrObj.Sugar+nutrObj.Vegetable_Oils+nutrObj.Vegetable_Products)*100,3)+'%', value: nutrObj.Vegetable_Oils/(nutrObj.Alcoholic_Beverages+nutrObj.Animal_fats+ nutrObj.Animal_Products+nutrObj.Cereals+nutrObj.Fish_Seafood+nutrObj.Fruits+nutrObj.Milk+nutrObj.Starchy_Roots+nutrObj.Sugar+nutrObj.Vegetable_Oils+nutrObj.Vegetable_Products)*100, color: '#FFF0F5' },
                { title: 'Vegetable Products, '+ round(nutrObj.Vegetable_Products/(nutrObj.Alcoholic_Beverages+nutrObj.Animal_fats+ nutrObj.Animal_Products+nutrObj.Cereals+nutrObj.Fish_Seafood+nutrObj.Fruits+nutrObj.Milk+nutrObj.Starchy_Roots+nutrObj.Sugar+nutrObj.Vegetable_Oils+nutrObj.Vegetable_Products)*100,3)+'%', value: nutrObj.Vegetable_Products/(nutrObj.Alcoholic_Beverages+nutrObj.Animal_fats+ nutrObj.Animal_Products+nutrObj.Cereals+nutrObj.Fish_Seafood+nutrObj.Fruits+nutrObj.Milk+nutrObj.Starchy_Roots+nutrObj.Sugar+nutrObj.Vegetable_Oils+nutrObj.Vegetable_Products)*100, color: '#FFF0F5' },
            ]}
            viewBoxSize={[200, 200]}
/>
            
            );
            this.setState({
                chart: pieChart
              });
    }, err => {
        // Print the error if there is one.
        console.log(err);
      });

      fetch("http://localhost:8081/foodRecommendation/"+this.state.selectedCountry,
        {
            method: 'GET' // The type of HTTP request.
        }).then(res =>{
            return res.json();
        }, err => {
            // Print the error if there is one.
            console.log(err);
        }).then(nutr => {
            console.log("HERE");
            console.log(nutr);
            if (!nutr) return;
            // const statsU = nutr.map((nutrObj, i) =>
            

            
            // );
            this.setState({
                alcohol: nutr[1].Alcohol,
                oil:nutr[1].Vegetable_Oils,
                sugar: nutr[1].Sugar,
                milk:nutr[1].Milk,
                fruits:nutr[1].Fruits,
                fish:nutr[1].Fish_Seafood,
                cereals:nutr[1].Cereals,
                roots:nutr[1].Starchy_Roots,
                animP:nutr[1].Animal_Products,
                animF:nutr[1].Animal_fats,
                veg:nutr[1].Vegetable_Products,
                meat:nutr[1].Meat
              });
    }, err => {
        // Print the error if there is one.
        console.log(err);
      });
    
	};
  render() {
    return (
    <div id = "nutrition">
         <PageNavbar active="nutrition" />
        <div className="dropdown-container">
            <select value={this.state.selectedCountry} onChange={this.handleCountryChange} className="dropdown" id="countryDropdown">
                {this.state.countries}
            </select>
            <button className="submit-btn" id="submitBtn" onClick={this.submitCountryChange}>Submit</button>
        </div>
        
        <div id = "chart"class="jumbotron jumbotron-fluid bg-dark text-white">
        <div id = "foodStats"class="jumbotron jumbotron-fluid bg-dark text-white">
            <p>On average, people in countries with best death to confirmed cases ratio consume: </p>
                <table style={{border: "2px solid white"}}>
                    <tr style={{border: "2px solid white"}}>
                        <th style={{border: "2px solid white"}}>alcohol, %  </th>
                        <th style={{border: "2px solid white"}}>vegetable oil,%  </th>
                        <th style={{border: "2px solid white"}}>sugar,%  </th>
                        <th style={{border: "2px solid white"}}>milk,%  </th>
                        <th style={{border: "2px solid white"}}>fruits,%  </th>
                        <th style={{border: "2px solid white"}}>fish,%  </th>
                        <th style={{border: "2px solid white"}}>cereals,%  </th>
                        <th style={{border: "2px solid white"}}>starchy roots,%  </th>
                        <th style={{border: "2px solid white"}}>animal prod,%  </th>
                        <th style={{border: "2px solid white"}}>animal fats,%  </th>
                        <th style={{border: "2px solid white"}}>vegetable prod,%  </th>
                        <th style={{border: "2px solid white"}}>meat,%  </th>
                    </tr>
                    <tr>
                    <td style={{border: "2px solid white"}}>{this.state.alcohol}</td>
                    <td style={{border: "2px solid white"}}>{this.state.oil}</td>
                    <td style={{border: "2px solid white"}}>{this.state.sugar} </td>
                    <td style={{border: "2px solid white"}}>{this.state.milk}</td>
                    <td style={{border: "2px solid white"}}>{this.state.fruits} </td>
                    <td style={{border: "2px solid white"}}>{this.state.fish} </td>
                    <td style={{border: "2px solid white"}}>{this.state.cereals} </td>
                    <td style={{border: "2px solid white"}}>{this.state.roots} </td>
                    <td style={{border: "2px solid white"}}>{this.state.animP} </td>
                    <td style={{border: "2px solid white"}}>{this.state.animF} </td>
                    <td style={{border: "2px solid white"}}>{this.state.veg} </td>
                    <td style={{border: "2px solid white"}}>{this.state.meat} </td>
                    </tr>
                </table>
        </div>
        <div className="chart" id="chart" >
            {this.state.chart}
        </div>

        </div>
    </div>
    );
  }
}

