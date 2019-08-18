import React from 'react';
import './Stats.css';
import api from './../lib/api.js';
const empty = { average: 0, total: 0, biggest: 0 }
class Stats extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			week: empty,
			month: empty,
			year: empty
		}
	}

	componentDidMount() {
		api.get('/stats')
			.then(data => {
				this.setState(data)
			})
	}

	render() {
		return (<div className="stats">
			<h1>Stats</h1>

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

export default Stats
