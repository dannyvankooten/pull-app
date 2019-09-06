import React from 'react';
import './Profile.css';
import api from './../lib/api.js';
import Chart from './Chart.js';
import { Menu } from 'semantic-ui-react'
const empty = { average: 0, total: 0, biggest: 0 };

class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			week: empty,
			month: empty,
			year: empty,
			perDay: [],
			user: {},
			chartGroupBy: 'week',
		}
	}

	componentDidMount() {
		this.fetch()
	}

	componentDidUpdate(prevProps) {
		// Typical usage (don't forget to compare props):
		if (this.props.match.params.id !== prevProps.match.params.id) {
			this.fetch();
		}
	}

	fetch() {
		api.get(`/users/${this.props.match.params.id}`)
			.then(d => this.setState(d));

		api.get(`/stats/${this.props.match.params.id}`)
			.then(d => this.setState(d))
	}

	render() {
		return (<div className="stats">
			<h1>{this.state.user.username}</h1>

			<Chart data={this.state.perDay} per={this.state.chartGroupBy} />
			<div style={{textAlign: 'center'}}>
				<Menu compact size={'mini'} >
					<Menu.Item onClick={evt => this.setState({chartGroupBy: 'day'})} active={this.state.chartGroupBy === 'day'}>daily</Menu.Item>
					<Menu.Item onClick={evt => this.setState({chartGroupBy: 'week'})}  active={this.state.chartGroupBy === 'week'}>weekly</Menu.Item>
				</Menu>
			</div>

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
