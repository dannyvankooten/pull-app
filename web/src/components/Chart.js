import React from 'react';
import './Chart.css';
const monthNames = [
	"Jan", "Feb", "Mar",
	"Apr", "May", "Jun", "Jul",
	"Aug", "Sep", "Oct",
	"Nov", "Dec"
];

function label(date, per, i, len) {
	if (per === 'week') {
		if (date.getDate() <= 7) {
			return monthNames[date.getMonth()];
		}
	} else if(per === 'day') {
		if ((date.getDate() === 1 && i > 7 ) || i === 0 || i === len-3) {
			return monthNames[date.getMonth()] + ' ' + date.getDate() ;
		}
	}

	return '';
}

function Chart(props) {
	let now = new Date();
	let data = props.data.map(d => {
		if (typeof(d.date) === "string") {
			d.date = new Date(d.date + 'T00:00:00Z');
		}
		return d;
	});
	let max = 0;
	let bars = [];
	const per = props.per || 'day';
	const numberOfBars = per === 'day' ? 21 : 12;

	for(let i = numberOfBars; i >= 0; i--) {
		let iStart = new Date();
		iStart.setHours(0);
		iStart.setMinutes(0);

		if (per === 'week') {
			iStart.setDate(now.getDate() - (i*7));
			iStart.setDate(iStart.getDate() + (0 - iStart.getDay())); // set to Sunday
		} else {
			iStart.setDate(now.getDate() - i);
		}

		let iEnd = new Date(iStart);
		iEnd.setDate(iStart.getDate() + (per === 'week' ? 7 : 1));

		let total = 0;
		data.forEach(d => {
			if (d.date >= iStart && d.date < iEnd) {
				total += d.total
			}
		});

		if (total > max) {
			max = total;
		}
		bars.push({ date: iStart, value: total });
		iStart = iEnd
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
							height: (b.value / max * 100) + '%',
						}}>
							<span>{b.value}</span>
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
							<span className="label">{label(b.date, per, i, bars.length)}</span>
						</div>)
				})}
			</div>
		</div>
	)
}

export default Chart;

