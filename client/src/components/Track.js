import React from 'react';
import TimeAgo from 'timeago-react';
import api from './../lib/api.js';

class Track extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: parseInt(localStorage.getItem('repetitions')) || 1,
      buttonText: "Save",
      activities: [],
    };

    this.save = this.save.bind(this)
  }

  componentDidMount() {
    api.get('/activities?limit=10')
    .then((activities) => {
      activities = activities.map(a => {
        a.date = api.date(a.timestamp);
        return a;
      });
      this.setState({activities})
    })
  }

  save(evt) {
    this.setState({buttonText: "Saving"});
    localStorage.setItem('repetitions', this.state.count);

    api.post('/activities', {
    	repetitions: this.state.count
    }).then((activity) => {
    	activity.date = api.date(activity.timestamp);

        this.setState({
           activities: [activity, ...this.state.activities],
           buttonText: "Save"
        })
      })
  }

  render() {
    return (<div className="track">
    	<div className="track-count">
  		<table>
  			<tbody>
  			<tr>
  				<td>
		        <span className="control" onClick={(e) => {
		          let count = Math.max(1, this.state.count - 1);
		          this.setState({count})}
		        }>-</span>
  				</td>
  				<td>
  					 <span className="count">{this.state.count}</span>
  				</td>
  				<td>
  					<span className="control"  onMouseDown={(evt) => {
			          let count = this.state.count + 1;
			          this.setState({count})}
			        }>+</span>
  				</td>
  			</tr>
  			</tbody>
  		</table>
      </div>
			<div>
        <button onClick={this.save} className="button">{this.state.buttonText}</button>
      </div>
      <div className="activity-list margin-s">
        {this.state.activities.map(a => (
            <div key={`activity-${a.id}`}>
              <strong>you</strong> did <strong>{a.repetitions}</strong> reps <span className="activity-ts"><TimeAgo datetime={a.date} /></span>
            </div>
        ))}
      </div>
    </div>)
  }
}

export default Track
