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

export default class LoginScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static navigationOptions = {
  	title: 'Please sign in',
  };

  handleSubmit() {
    const { username, password} = this.state;

	if ( username === "") {
		return this.setState({ error: "Enter a username."});
	}

	if (password === "" ) {
		return this.setState({ error: "Enter a password."});
	}

    api.post('/login', { username, password})
        .then(u => {
        	if (!u) {
        		this.setState({ error: "Whoops. Something went wrong."});
        		return;
			}

        	auth.setUser(u);
        	auth.setToken(u.token);
          	this.props.navigation.navigate("App")
		}).catch(error => this.setState({error: "Whoops. Something went wrong."}))
  }

  render() {
    return (
        <View style={styles.container}>
          <Text style={styles.titleText}>Login</Text>
			{this.state.error ? <Text style={{ color: 'red', marginTop: 10}}>{this.state.error}</Text> : []}
          <View style={styles.form}>
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
				blurOnSubmit={true}
				returnKeyType='done'
                secureTextEntry={true}
                style={styles.inputText}
                value={this.state.password}
            />

            <TouchableOpacity style={styles.buttonWrapper} onPress={this.handleSubmit}>
              <Text style={styles.buttonText}> Log in </Text>
            </TouchableOpacity>

			<View style={{ marginTop: 12}}>
				<Text>No account yet? <Text style={styles.linkText} onPress={() => this.props.navigation.navigate("Register")}>Register here</Text>.</Text>
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
