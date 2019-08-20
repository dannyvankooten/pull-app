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
    this.save = this.save.bind(this);
    this.confirmDeletion = this.confirmDeletion.bind(this);
    this.cancelDeletion = this.cancelDeletion.bind(this);
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

  confirmDeletion (activity) {
      this.buttonPressTimer = setTimeout(() => {
          if (!window.confirm("Delete this activity?")) {
              return;
          }

          api.del(`/activities/${activity.id}`)
              .then(r => {
                  let index = this.state.activities.indexOf(activity);
                  let activities = this.state.activities;
                  activities.splice(index, 1);
                  this.setState({activities})
              });
        }, 1200);
  }

    cancelDeletion () {
      clearTimeout(this.buttonPressTimer);
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
            <div key={`activity-${a.id}`} data-id={a.id}
                 onTouchStart={() => this.confirmDeletion(a)}
                 onTouchEnd={this.cancelDeletion}
                 onMouseDown={() => this.confirmDeletion(a)}
                 onMouseUp={this.cancelDeletion}
                 onMouseLeave={this.cancelDeletion}>
                <strong>you</strong> did <strong>{a.repetitions}</strong> reps <span className="activity-ts"> &middot; <TimeAgo datetime={a.date} /></span>
            </div>
        ))}
      </div>
    </div>)
  }
}

export default Track
