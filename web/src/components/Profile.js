import React from 'react';
import './Profile.css';
import api from './../lib/api.js';
import Chart from './Chart.js';
import { Menu } from 'semantic-ui-react'

function initDates(data) {
	return data.map(d => {
		if (typeof(d.date) === "string") {
			d.date = new Date(d.date + 'T00:00:00Z');
		}
		return d;
	});
}


function Table(props) {
	const {data, altData, period, title, userName} = props;
	const stats = (data, since) => {
		let sets = 0, total = 0, average = 0, max = 0;
		data.forEach(d => {
			if (d.date >= since) {
				sets += d.sets;
				total += d.total;
				average = Math.round(total / sets);
				max = Math.max(max, d.max);
			}
		});
		return {total, average, max, sets};
	};

	let since;
	const now = new Date();
	switch(period) {
		case 'all-time':
		default:
			since = new Date(2000, 0, 1);
			break;
		case 'last-4-weeks':
			since = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (4*7));
			break;
		case 'this-year':
			since = new Date(now.getFullYear(), 0, 1);
			break;
	}

	const userStats = stats(data, since);
	const myStats = stats(altData, since);
	const comparing = !!altData.length;

	return (
		<tbody>
			<tr>
				<th width={"50%"}>{title}</th>
				<th width={"25%"}className={"muted"}>{comparing ? userName : ''}</th>
				<th width={"25%"} className={"muted"}>{comparing ? 'You' : ''}</th>
			</tr>
			<tr>
				<td>Total</td>
				<td>{userStats.total}</td>
				<td>{comparing ? myStats.total : ''}</td>
			</tr>
			<tr>
				<td>Average per set</td>
				<td>{userStats.average}</td>
				<td>{comparing ? myStats.total : ''}</td>
			</tr>
			<tr>
				<td>Biggest set</td>
				<td>{userStats.max}</td>
				<td>{comparing ? myStats.max : ''}</td>
			</tr>
		</tbody>
	)
}

class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {},
			chartGroupBy: 'week',
			data: [],
			altData: []
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

		api.get(`/v1/stats/${this.props.match.params.id}`)
			.then(d => this.setState({data: initDates(d)}))

		if (this.props.match.params.id != this.props.user.id) {
			api.get(`/v1/stats/${this.props.user.id}`)
				.then(d => this.setState({altData: initDates(d)}))
		}
	}

	render() {
		const {user, data, altData} = this.state;

		return (
		<div className="stats">
			<h1>{this.state.user.username}</h1>

			<Chart data={this.state.data} per={this.state.chartGroupBy} />
			<div style={{textAlign: 'center'}}>
				<Menu compact size={'mini'} >
					<Menu.Item onClick={evt => this.setState({chartGroupBy: 'day'})} active={this.state.chartGroupBy === 'day'}>daily</Menu.Item>
					<Menu.Item onClick={evt => this.setState({chartGroupBy: 'week'})}  active={this.state.chartGroupBy === 'week'}>weekly</Menu.Item>
				</Menu>
			</div>

			<table>
				<Table title="Last 4 weeks" data={data} altData={altData} period={"last-4-weeks"} userName={user.username}/>
				<Table title="This year" data={data} altData={altData} period={"this-year"} userName={user.username}/>
				<Table title="All-time" data={data} altData={altData}  period={"all-time"} userName={user.username} />
			</table>
		</div>)
	}
}

export default Profile
