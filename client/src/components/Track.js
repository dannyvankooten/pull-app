import React from 'react';
import TimeAgo from 'timeago-react';
import api from './../lib/api.js';

class Track extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: localStorage.getItem('repetitions') || 1,
      buttonText: "Save",
      activities: [],
    };

    this.save = this.save.bind(this)
  }

  componentDidMount() {
    api.get('/activities').then((activities) => {
      activities = activities.map(a => {
        a.date = api.date(a.timestamp)
        return a;
      })
      this.setState({activities})
    })
  }

  save(evt) {
    this.setState({buttonText: "Saving"});
    localStorage.setItem('repetitions', this.state.count);

    api.post('/activities', {repetitions: this.state.count})
        .then((activity) => {
          this.setState({
            activities: [activity, ...this.state.activities],
            buttonText: "Save"
          })
        })
  }

  render() {
    return (<div>
      <div>
        <span className="control" onClick={(e) => {
          let count = Math.max(1, this.state.count - 1);
          this.setState({count})}
        }>-</span>
        <span className="count">{this.state.count}</span>
        <span className="control"  onMouseDown={(evt) => {
          evt.preventDefault()
          let count = this.state.count + 1;
          this.setState({count})}
        }>+</span>
      </div>
      <div>
        <button onClick={this.save} className="button">{this.state.buttonText}</button>
      </div>

      <div className="activity-list">
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