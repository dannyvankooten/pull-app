import React from 'react';
import { withRouter, NavLink } from "react-router-dom";
import api from './../lib/api.js';

class Register extends React.Component { 
	constructor(props) {
		super(props)

		this.submit = this.submit.bind(this)
		this.state = {}
	}

	submit(evt) {
		evt.preventDefault();
		const form = evt.target;

		if (form.password.value !== form.password_confirmation.value) {
			this.setState({error: "Passwords do not match."})
			return
		}

		api.post('/register', {
			username: form.username.value,
			password: form.password.value,
			passwordConfirmation: form.password_confirmation.value,
		}).then(user => {
			if (!user) {
				return;
			}

			this.props.onSuccess({authenticated: true, user: user})
			this.props.history.push('/')
		})
	}

	render() {
	return (
		<div>
			<h1>Register</h1> 
			<form method="POST" onSubmit={this.submit}>
				<div className="margin-s">
					<label>Username</label>
					<input type="text" name="username" required minLength="2" />
				</div>

				<div className="margin-s">
					<label>Password</label>
					<input type="password" name="password" required minLength="6" maxLength="72" />
				</div>

				<div className="margin-s">
					<label>Repeat password</label>
					<input type="password" name="password_confirmation" required minLength="6" maxLength="72" />
				</div>

				<div className="margin-s">
					<button type="submit">Register</button>
				</div>

				{this.state.error ? <div className="notice notice-warning">{this.state.error}</div> : ''}
			</form>

			<div className="margin-s">
				<p>Already registered? <NavLink to="/login">Login here</NavLink>.</p>
			</div>
		</div>)
	}
}

export default withRouter(Register)