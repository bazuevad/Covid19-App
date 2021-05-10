import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class CaseDisplay extends React.Component {
	render() {
        console.log('12314');
        console.log(this.props);
		return (
			<div className="movieResults">
				<div className="Country">{this.props.country}</div>
				<div className="Province">{this.props.province}</div>
				<div className="Confirmed">{this.props.confirmed}</div>
                <div className="Recovered">{this.props.recovered}</div>
                <div className="Death">{this.props.death}</div>
			</div>
		);
	};
};
