import React from 'react';
import './Chart.css';
const monthNames = [
	"Jan", "Feb", "Mar",
	"Apr", "May", "Jun", "Jul",
	"Aug", "Sep", "Oct",
	"Nov", "Dec"
];

function Chart(props) {
	let now = new Date();
	let data = props.data.map(d => {
		d.date = new Date(d.date);
		return d;
	});
	let max = 0;
	let bars = [];

	for(let i = 12; i >= 0; i--) {
		let weekStart = new Date();
		weekStart.setDate(now.getDate() - (i*7));
		weekStart.setDate(weekStart.getDate() + (0 - weekStart.getDay())); // set to Sunday
		let weekEnd = new Date(weekStart);
		weekEnd.setDate(weekStart.getDate() + 7);
		let total = 0;

		data.forEach(d => {
			if (d.date > weekStart && d.date <= weekEnd) {
				total += d.total
			}
		});

		if (total > max) {
			max = total;
		}
		bars.push({ x: weekStart, y: total });
		weekStart = weekEnd
	}

	max = Math.ceil(max / 10) * 10;
	max = Math.max(10, max);
	return (
		<div className={"chart margin-s"}>
			<div className="y-axis">
				<div style={{bottom: '100%'}}>{max}</div>
				<div style={{bottom: '50%'}}>{max/2}</div>
				<div style={{bottom: '0%'}}>0</div>
			</div>
			<div className="bars">
				{bars.map((b, i) => {
					return (<div className="interval" key={i} style={{
						left: (i / bars.length*100) + '%',
						width: (100 / bars.length) + '%'
					}}>
						<div className={"bar"}  style={{
							height: (b.y / max * 100) + '%',
						}}>
							<span>{b.y}</span>
						</div>
					</div>)
				})}
			</div>
			<div className={"x-axis"}>
				{bars.map((b, i) => {
					return (
						<div key={i} style={{
							left: (i / bars.length*100) + '%',
						}}>
							<div className="tick" />
							<span className="label">{b.x.getDate() <= 7 ? monthNames[b.x.getMonth()] : ''}</span>
						</div>)
				})}
			</div>
		</div>
	)
}

export default Chart;

