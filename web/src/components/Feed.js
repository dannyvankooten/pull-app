import React from 'react';
import api from './../lib/api.js';
import TimeAgo from 'timeago-react';
import { NavLink } from "react-router-dom";
import { Feed as Sfeed } from 'semantic-ui-react'

class Feed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activities: [],
    };
  }

  componentDidMount() {
  	api.get('/activities?feed=1&limit=100')
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
            <Sfeed>
                {this.state.activities.map(a => (
                    <Sfeed.Event key={`activity-${a.id}`}>
                        <Sfeed.Content>
                            <Sfeed.Summary>
                                <NavLink to={`/athlete/${a.user_id}`}>{a.username}</NavLink> did <strong>{a.repetitions}</strong> reps
                                <Sfeed.Date><TimeAgo datetime={a.date} /></Sfeed.Date>
                            </Sfeed.Summary>
                        </Sfeed.Content>
                    </Sfeed.Event>
                ))}

            </Sfeed>
  		</div>
  	)
  }
}

export default Feed
