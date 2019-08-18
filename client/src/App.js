import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import Track from './components/Track.js';
import Stats from './components/Stats.js';
import Feed from './components/Feed.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import { createBrowserHistory } from "history";
import api from './lib/api.js';

const history = createBrowserHistory();

class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      user: null
    }

    api.get('/session')
      .then(user => {
        this.setState({user})

        if (!user) {
          history.push('/login')
        }
      })
  }

  render() {
    return (
      <div className="app">
        <Router>
          {this.state.user ? 
            <div className="menu">
              <NavLink exact to="/">Track</NavLink>
              <NavLink exact to="/feed">Feed</NavLink>
              <NavLink exact to="/stats">Stats</NavLink>
            </div> : ''}

            <div>
              <Route path="/" exact component={Track} />
              <Route path="/feed" component={Feed} />
              <Route path="/stats" component={Stats} />
              <Route path="/login" render={props => <Login onSuccess={s => this.setState(s) } />} />
              <Route path="/register" render={props => <Register onSuccess={s => this.setState(s) } />} />
            </div> 
          
        </Router>
      </div>
    )
  }
}

export default App;
