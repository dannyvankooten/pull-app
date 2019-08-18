import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, NavLink, Redirect } from "react-router-dom";
import Track from './components/Track.js';
import Stats from './components/Stats.js';
import Feed from './components/Feed.js';
import Login from './components/Login.js';
import Register from './components/Register.js';

class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      authenticated: true,
    }
  }

  render() {
    return (
      <div className="app">
        <Router>
          {this.state.authenticated ? 
            <div className="menu">
              <NavLink exact to="/">Track</NavLink>
              <NavLink exact to="/feed">Feed</NavLink>
              <NavLink exact to="/stats">Stats</NavLink>
            </div> : <Redirect to="/login" />}

            <div>
              <Route path="/" exact component={Track} />
              <Route path="/feed" component={Feed} />
              <Route path="/stats" component={Stats} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
            </div> 
          
        </Router>
      </div>
    )
  }
}

export default App;
