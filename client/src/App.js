import React from 'react';
import './App.css';
import { Router, Route, NavLink } from "react-router-dom";
import Track from './components/Track.js';
import Profile from './components/Profile.js';
import Feed from './components/Feed.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import { createBrowserHistory } from "history";
import api from './lib/api.js';

const history = createBrowserHistory();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
    this.onLogin = this.onLogin.bind(this);

    api.get('/session')
        .then(user => {
            this.setState({user});

            if (!user) {
                history.push('/login')
            } else if (['/login', '/register'].indexOf(history.location.pathname) > -1) {
                history.push('/')
            }
        }).catch(err => history.push('/login'))
  }

  onLogin(state) {
  	this.setState(state);
  	history.push('/');
  }

  render() {
    return (
      <div className="app">
        <Router history={history}>
          {this.state.user ?
                  <div>
                      <div className="menu">
                        <NavLink exact to="/">Track</NavLink>
                        <NavLink exact to="/feed">Feed</NavLink>
                        <NavLink exact to={`/athlete/${this.state.user.id}`}>Profile</NavLink>
                      </div>

                    <div>
                      <Route path="/" exact component={Track} />
                      <Route path="/feed" component={Feed} />
                      <Route path="/athlete/:id" component={Profile} />
                      <Route path="/login" render={props => <Login onSuccess={this.onLogin} />} />
                      <Route path="/register" render={props => <Register onSuccess={this.onLogin} />} />
                    </div>
                  </div>
              :

              <div>
                <Route path="/login" render={props => <Login onSuccess={this.onLogin} />} />
                <Route path="/register" render={props => <Register onSuccess={this.onLogin} />} />
              </div>
          }

        </Router>
      </div>
    )
  }
}

export default App;
