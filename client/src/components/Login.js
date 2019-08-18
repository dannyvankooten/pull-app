import React from 'react';

import { NavLink } from "react-router-dom";


export default class Login extends React.Component { 
	constructor(props) {
		super(props)

		this.submit = this.submit.bind(this)
	}

	submit(evt) {
		// TODO: perform login
	}

	render() {
	return (
		<div>
			<h1>Login</h1> 
			<form onSubmit={this.submit}>
				<div className="margin-s">
					<label>Username</label>
					<input type="text" />
				</div>

				<div className="margin-s">
					<label>Password</label>
					<input type="password" />
				</div>

				<div className="margin-s">
					<button type="submit">Login</button>
				</div>

			</form>
			<div className="margin-s">
				<p>No account? <NavLink to="/register">Register here</NavLink>.</p>
			</div>
		</div>)
	}
}