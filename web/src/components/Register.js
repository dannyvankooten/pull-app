import React from 'react';
import { withRouter, NavLink } from "react-router-dom";
import { Form } from 'semantic-ui-react'

import api from './../lib/api.js';

class Register extends React.Component {
	constructor(props) {
		super(props);
		this.submit = this.submit.bind(this);
		this.state = {}
	}

	submit(evt) {
		evt.preventDefault();
		const form = evt.target;

		if (form.password.value !== form.password_confirmation.value) {
			this.setState({error: "Passwords do not match."});
			return
		}

		api.post('/register', {
			username: form.username.value,
			password: form.password.value,
			passwordConfirmation: form.password_confirmation.value,
		}).then(user => {
			if (!user || user.error) {
				this.setState({error: user.error || "Whoops. Something went wrong."});
				return;
			}

			this.props.onSuccess({authenticated: true, user: user});
		}).catch(err => this.setState({error: "Whoops. Something went wrong."}))
	}

	render() {
	return (
		<div>
			<h1>Register</h1>
			<Form onSubmit={this.submit}>
				<Form.Input name={"username"} fluid type="text" label='Username' placeholder='Enter your username' required minLength="2" maxLength="36" htmlFor="register-username" id={"register-username"} />
				<Form.Input name={"password"} fluid type="password" label='Password' placeholder='Enter your password' required minLength="6" maxLength="72" htmlFor={"register-password"} id={"register-password"} />
				<Form.Input name={"password_confirmation"} fluid type="password" label='Confirm password' placeholder='Enter your password (again)' minLength="6" maxLength="72" required htmlFor={"register-password-confirmation"} id={"register-password-confirmation"} />
				<Form.Button>Register</Form.Button>
				{this.state.error ? <div className="notice notice-warning">{this.state.error}</div> : ''}
			</Form>

			<div className="margin-s">
				<p>Already registered? <NavLink to="/login">Login here</NavLink>.</p>
			</div>
		</div>)
	}
}

export default withRouter(Register)
