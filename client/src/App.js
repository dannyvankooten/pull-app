import React from 'react';
import './App.css';
import { Router, Route, NavLink, Switch } from "react-router-dom";
import Track from './components/Track.js';
import Profile from './components/Profile.js';
import Feed from './components/Feed.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Leaderboard from './components/Leaderboard.js';
import NotFound from './components/NotFound.js';
import { createBrowserHistory } from "history";
import api from './lib/api.js';
import { Menu } from 'semantic-ui-react'

const history = createBrowserHistory();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
    this.onLogin = this.onLogin.bind(this);
  }

  componentDidMount() {
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
        <Router history={history}>
             <div className="app">
                 {this.state.user ?
                     <Menu inverted fluid size='tiny' style={{ borderRadius: 0}}>
                         <div className={"container"}>
                             <Menu.Item as={NavLink} exact to="/">Record</Menu.Item>
                             <Menu.Item as={NavLink} exact to="/feed" >Feed</Menu.Item>
                             <Menu.Item as={NavLink} to="/leaderboard" >Leaderboard</Menu.Item>
                             <Menu.Item as={NavLink} exact to={`/athlete/${this.state.user.id}`}>Profile</Menu.Item>
                         </div>
                     </Menu> : ''}
                 <div className="main container">
                     {this.state.user ? // logged in
                         <Switch>
                             <Route path="/" exact component={Track} />
                             <Route path="/feed" exact component={Feed} />
                             <Route path="/leaderboard/:period?" component={Leaderboard} />
                             <Route path="/athlete/:id" component={Profile} />
                             <Route path="/login" exact render={props => <Login onSuccess={this.onLogin} />} />
                             <Route path="/register" exact render={props => <Register onSuccess={this.onLogin} />} />
                             <Route component={NotFound} />
                         </Switch>
                         : // not logged in
                         <Switch>
                             <Route path="/login" exact render={props => <Login onSuccess={this.onLogin} />} />
                             <Route path="/register" exact render={props => <Register onSuccess={this.onLogin} />} />
                             <Route component={NotFound} />
                         </Switch>
                     }
                 </div>
         </div>
      </Router>
    )
  }
}

export default App;
