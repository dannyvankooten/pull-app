import React from 'react';
import api from './../lib/api.js';
import TimeAgo from 'timeago-react';
import { NavLink } from "react-router-dom";

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
        a.date = api.date(a.timestamp);
        return a;
      });
      this.setState({activities})
    })
  }

  render() {
  	return (
  		<div className="feed">
			<h1>Activity feed</h1>

			<div className={"activity-list margin-s"}>
  			 {this.state.activities.map(a => (
				<div key={`activity-${a.id}`}>
				  <NavLink to={`/athlete/${a.user_id}`}>{a.username}</NavLink> did <strong>{a.repetitions}</strong> reps <span className="activity-ts"> &middot; <TimeAgo datetime={a.date} /></span>
				</div>
        	))}
			</div>
  		</div>
  	)
  }
}

export default Feed
