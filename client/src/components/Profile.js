import React from 'react';
import './Profile.css';
import api from './../lib/api.js';
import Chart from './Chart.js';

const empty = { average: 0, total: 0, biggest: 0 };

class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			week: empty,
			month: empty,
			year: empty,
			perDay: [],
			user: {}
		}
	}

	componentDidMount() {
		api.get(`/users/${this.props.match.params.id}`)
			.then(this.setState.bind(this));

		api.get(`/stats/${this.props.match.params.id}`)
			.then(this.setState.bind(this))
	}

	render() {
		return (<div className="stats">
			<h1>{this.state.user.username}</h1>

			<Chart data={this.state.perDay} />

			<table>
				<tbody>
					<tr>
						<th colSpan="2">Last week</th>
					</tr>
					<tr>
						<td>Total</td>
						<td>{this.state.week.total}</td>
					</tr>
					<tr>
						<td>Average per set</td>
						<td>{this.state.week.average}</td>
					</tr>
					<tr>
						<td>Biggest set</td>
						<td>{this.state.week.biggest}</td>
					</tr>
				</tbody>
				<tbody>
					<tr>
						<th colSpan="2">Last month</th>
					</tr>
					<tr>
						<td>Total</td>
						<td>{this.state.month.total}</td>
					</tr>
					<tr>
						<td>Average per set</td>
						<td>{this.state.month.average}</td>
					</tr>
					<tr>
						<td>Biggest set</td>
						<td>{this.state.month.biggest}</td>
					</tr>
				</tbody>
				<tbody>
					<tr>
						<th colSpan="2">Last year</th>
					</tr>
					<tr>
						<td>Total</td>
						<td>{this.state.year.total}</td>
					</tr>
					<tr>
						<td>Average per set</td>
						<td>{this.state.year.average}</td>
					</tr>
					<tr>
						<td>Biggest set</td>
						<td>{this.state.year.biggest}</td>
					</tr>
				</tbody>
			</table>
		</div>)
	}
}

export default Profile