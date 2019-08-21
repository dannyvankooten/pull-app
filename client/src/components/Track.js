import React from 'react';
import TimeAgo from 'timeago-react';
import {Button, Divider, Feed} from 'semantic-ui-react'
import api from './../lib/api.js';

class Track extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: parseInt(localStorage.getItem('repetitions')) || 1,
      isLoading: false,
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
    this.setState({isLoading: true});
    localStorage.setItem('repetitions', this.state.count);

    api.post('/activities', {
    	repetitions: this.state.count
    }).then((activity) => {
    	activity.date = api.date(activity.timestamp);

        this.setState({
           activities: [activity, ...this.state.activities],
           isLoading: false,
        })
      })
  }

  render() {
    return (<div className="track">
        <div className={"margin-m"} >
            <div className="track-count">
            <table className={"margin-s"}>
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
              <Button fluid size='big' onClick={this.save} loading={this.state.isLoading} primary>Save</Button>
          </div>
       </div>
       <Divider horizontal>History</Divider>
        <Feed>
            {this.state.activities.map(a => (
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
