import React from 'react';
import './App.css';
import TimeAgo from 'timeago-react';

function request(method, path, args) {
  args = {...args, ...{
      method: method,
      credentials: 'include',
      headers: {...args.headers || {}}, ...{
          'Accept': 'application/json',
        }
   }};

  const base = window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'http://pull-app.dvk.co';

  return window.fetch(base + path, args)
      .then(r => r.json())
}

function get(path) {
  return request('GET', path, {});
}

function post(path, data) {
  return request('POST', path, {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

function date(utcDatetimeString) {
  utcDatetimeString = utcDatetimeString.replace(' ', 'T');
  utcDatetimeString = utcDatetimeString + "Z";
  let d = new Date(utcDatetimeString);
  //d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d;
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 1,
      buttonText: "Save",
      activities: [],
    };

    this.save = this.save.bind(this)
  }

  componentDidMount() {
    get('/activities').then((activities) => {
      activities = activities.map(a => {
        a.date = date(a.timestamp)
        return a;
      })
      this.setState({activities})
    })
  }

  save(evt) {
    this.setState({buttonText: "Saving"});

    post('/activities', {repetitions: this.state.count})
        .then((activity) => {
          this.setState({
            activities: [activity, ...this.state.activities],
            buttonText: "Save"
          })
        })
  }

  render() {
    return (
    <div className="App">
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
    </div>
    )
  }
}

export default App;
