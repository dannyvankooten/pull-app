import React from 'react';
import TimeAgo from 'timeago-react';
import {Button, Divider, Feed} from 'semantic-ui-react'
import api from './../lib/api.js';

class Track extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: parseInt(localStorage.getItem('repetitions')) || 1,
      loading: false,
      disabled: 0,
      activities: [],
    };
    this.save = this.save.bind(this);
    this.confirmDeletion = this.confirmDeletion.bind(this);
    this.cancelDeletion = this.cancelDeletion.bind(this);
  }

  componentDidMount() {
    api.get(`/activities?limit=10&user_id=${this.props.user.id}`)
    .then((activities) => {
      activities = activities.map(a => {
        a.date = api.date(a.timestamp);
        return a;
      });
      this.setState({activities})
    }).catch(error => this.setState({error}))
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
    const {count, activities, disabled} = this.state;

    this.setState({
        loading: true,
        disabled: count * 3
    });
    localStorage.setItem('repetitions', count);

    api.post('/activities', {
    	repetitions: count
    }).then((activity) => {
    	activity.date = api.date(activity.timestamp);
        this.setState({
           activities: [activity, ...activities],
        })
      }).catch(error => this.setState({error}))
        .finally(() => this.setState({loading: false}));

    let interval = window.setInterval(() => {
        this.setState({ disabled: disabled - 1 });

        if (disabled <= 0) {
            window.clearInterval(interval);
        }
    }, 1000);
  }

  render() {
    const { count, disabled, activities, loading } = this.state;

    return (<div className="track">
        <div className={"margin-l"} >
            <div className="track-count">
            <table className={"margin-s"}>
                <tbody>
                <tr>
                    <td onMouseDown={(evt) => {
                        evt.preventDefault();
                        let count = Math.max(1, count - 1);
                        this.setState({count})}
                    }>
                        <span className="control">-</span>
                    </td>
                    <td onMouseDown={evt => evt.preventDefault()}>
                        <span className="count" onClick={evt => evt.preventDefault()}>{count}</span><br />
                        <small className="muted">repetitions</small>
                    </td>
                    <td onMouseDown={(evt) => {
                        evt.preventDefault();
                        let count = count + 1;
                        this.setState({count})}
                    }>
                        <span className="control">+</span>
                    </td>
                </tr>
                </tbody>
            </table>
          </div>
          <div>
              <Button fluid size='big' onClick={this.save} primary disabled={!!disabled} loading={loading} >{disabled > 0 ? `Wait ${disabled}s` : `Save`}</Button>
          </div>
       </div>
       <Divider horizontal>History</Divider>
        <Feed>
            {activities.map(a => (
                    <Feed.Event onTouchStart={() => this.confirmDeletion(a)}
                                onTouchEnd={this.cancelDeletion}
                                onMouseDown={() => this.confirmDeletion(a)}
                                onMouseUp={this.cancelDeletion}
                                onMouseLeave={this.cancelDeletion}
                                key={`activity-${a.id}`}>
                        <Feed.Content>
                            <Feed.Summary>
                                You did <strong>{a.repetitions}</strong> reps
                                <Feed.Date><TimeAgo datetime={a.date} /></Feed.Date>
                            </Feed.Summary>
                        </Feed.Content>
                    </Feed.Event>
            ))}
        </Feed>
    </div>)
  }
}

export default Track
