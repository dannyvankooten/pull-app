import React from 'react';

import { NavLink } from "react-router-dom";

export default class Register extends React.Component { 
	constructor(props) {
		super(props)

		this.submit = this.submit.bind(this)
	}

	submit(evt) {
		// TODO: perform registration
	}

	render() {
	return (
		<div>
			<h1>Register</h1> 
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
					<label>Repeat password</label>
					<input type="password" />
				</div>

				<div className="margin-s">
					<button type="submit">Register</button>
				</div>
			</form>

			<div className="margin-s">
				<p>Already registered? <NavLink to="/login">Login here</NavLink>.</p>
			</div>
		</div>)
	}
}