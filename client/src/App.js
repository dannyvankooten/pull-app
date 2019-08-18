import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import Track from './components/Track.js';
import Stats from './components/Stats.js';
import Feed from './components/Feed.js';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Router>
          <div className="menu">
            <NavLink exact to="/">Track</NavLink>
            <NavLink exact to="/feed">Feed</NavLink>
            <NavLink exact to="/stats">Stats</NavLink>
          </div>

          <div>
            <Route path="/" exact component={Track} />
            <Route path="/feed" component={Feed} />
            <Route path="/stats" component={Stats} />
          </div>
        </Router>
      </div>
    )
  }
}

export default App;
