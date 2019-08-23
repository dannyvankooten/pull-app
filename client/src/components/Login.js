import React from 'react';
import { withRouter, NavLink } from "react-router-dom";
import { Form } from 'semantic-ui-react'
import api from './../lib/api.js';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.submit = this.submit.bind(this);
		this.state = {};
	}

	submit(evt) {
		evt.preventDefault();
		const form = evt.target;

		api.post('/login', {
			username: form.username.value,
			password: form.password.value,
		}).then(user => {
			if (!user) {
				this.setState({ error: 'Invalid credentials.'});
				return;
			}

			this.props.onSuccess({
				authenticated: true,
				user: user
			});
		}).catch(err => this.setState({error: "Network error. Please try again later."}))
	}

	render() {
	return (
		<div>
			<h1>Login</h1>
			<Form onSubmit={this.submit}>
				<Form.Input name={"username"} fluid type="text" label='Username' placeholder='Enter your username' htmlFor="login-username" id={"login-username"} required  />
				<Form.Input name={"password"} fluid type="password" label='Password' placeholder='Enter your password' htmlFor="login-password" id={"login-password"}  required minLength="6" maxLength="72" />
				<Form.Button>Log in</Form.Button>
				{this.state.error ? <div className="notice notice-warning">{this.state.error}</div> : ''}
			</Form>

			<div className="margin-s">
				<p>No account? <NavLink to="/register">Register here</NavLink>.</p>
			</div>
		</div>)
	}
}

export default withRouter(Login)
