import React from 'react';

import { withRouter, NavLink } from "react-router-dom";
import api from './../lib/api.js';

class Login extends React.Component { 
	constructor(props) {
		super(props)

		this.submit = this.submit.bind(this)
		this.state = {}
	}

	submit(evt) {
		evt.preventDefault();
		const form = evt.target;

		api.post('/login', {
			username: form.username.value,
			password: form.password.value,
		}).then(user => {
			if (!user) {
				this.setState({ error: 'Invalid credentials.'})
				return;
			}

			this.props.onSuccess({ 
				authenticated: true,
				user: user
			})
			this.props.history.push('/') 
		})
	}

	render() {
	return (
		<div>
			<h1>Login</h1> 
			<form method="post" onSubmit={this.submit}>
				<div className="margin-s">
					<label>Username</label>
					<input type="text" name="username"/>
				</div>

				<div className="margin-s">
					<label>Password</label>
					<input type="password" name="password" />
				</div>

				<div className="margin-s">
					<button type="submit">Login</button>
				</div>

				{this.state.error ? <div className="notice notice-warning">{this.state.error}</div> : ''}
			</form>

			<div className="margin-s">
				<p>No account? <NavLink to="/register">Register here</NavLink>.</p>
			</div>
		</div>)
	}
}

export default withRouter(Login)