import React from 'react';
import api from './../lib/api.js';
import TimeAgo from 'timeago-react';

class Feed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activities: [],
    };
  }

  componentDidMount() {
  	api.get('/activities?feed=1')
    .then((activities) => {
      activities = activities.map(a => {
        a.date = api.date(a.timestamp)
        return a;
      })
      this.setState({activities})
    })
  }

  render() {
  	return (
  		<div className="feed activity-list">
  			 {this.state.activities.map(a => (
            <div key={`activity-${a.id}`}>
              <strong>{a.username}</strong> did <strong>{a.repetitions}</strong> reps <span className="activity-ts"><TimeAgo datetime={a.date} /></span>
            </div>
        ))}
  		</div>
  	)
  }
}

export default Feed