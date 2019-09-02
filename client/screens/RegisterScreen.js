import React from 'react';
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import api from './../util/api.js';
import auth from './../util/auth.js';

export default class RegisterScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			passwordConfirmation: '',
			error: '',
		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit() {
		const { username, password, passwordConfirmation } = this.state;

		if (username === "") {
			return this.setState({error: "Enter a username."});
		}

		if (password === "") {
			return this.setState({error: "Enter a password."});
		}

		if (password !== passwordConfirmation) {
			return this.setState({error: "Passwords do not match."});
		}

		api.post('/register', {
			username: username,
			password: password,
			passwordConfirmation: passwordConfirmation,
		}).then(user => {
			if (!user || user.error) {
				this.setState({error: user.error || "Whoops. Something went wrong."});
				return;
			}

			auth.setUser(user);
			auth.setToken(user.token);
		}).catch(err => this.setState({error: "Whoops. Something went wrong."}))
	}


	render() {
    return (
		<View style={styles.container}>
			<Text style={styles.titleText}>Register</Text>
			<View style={styles.form}>
				{this.state.error ? <Text style={{ color: 'red', marginTop: 10}}>{this.state.error}</Text> : []}

				<Text style={styles.labelText}>Username</Text>
				<TextInput
					editable={true}
					onChangeText={(username) => this.setState({username})}
					placeholder='Username'
					ref='username'
					returnKeyType='next'
					style={styles.inputText}
					value={this.state.username}
				/>

				<Text style={styles.labelText}>Password</Text>
				<TextInput
					editable={true}
					onChangeText={(password) => this.setState({password})}
					placeholder='Password'
					ref='password'
					returnKeyType='next'
					secureTextEntry={true}
					style={styles.inputText}
					value={this.state.password}
				/>

				<Text style={styles.labelText}>Confirm password</Text>
				<TextInput
					editable={true}
					onChangeText={(passwordConfirmation) => this.setState({passwordConfirmation})}
					placeholder='Password (again)'
					ref='password'
					returnKeyType='next'
					secureTextEntry={true}
					style={styles.inputText}
					value={this.state.passwordConfirmation}
				/>

				<TouchableOpacity style={styles.buttonWrapper} onPress={this.handleSubmit}>
					<Text style={styles.buttonText}> Register</Text>
				</TouchableOpacity>

				<View style={{ marginTop: 12}}>
					<Text>Already have an account? <Text style={styles.linkText} onPress={() => this.props.navigation.navigate("Login")}>Login here</Text>.</Text>
				</View>
			</View>
		</View>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: '#fff',
		padding: 20,
	},
	form: {
		alignItems: 'flex-start',
	},
	titleText: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	labelText: {
		marginTop: 20,
	},
	inputText: {
		padding: 6,
		borderWidth: 1,
		borderColor: "#efefef",
		width: '100%',
	},
	buttonWrapper: {
		marginTop: 20,
		backgroundColor: "#333",
		padding: 12,
	},
	buttonText: {
		color: "#fff"
	},
	linkText: {
		color: '#4183c4'
	},
});

