import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  AsyncStorage
} from 'react-native';

import api from './../util/api.js';

export default class LoginScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit() {
    const { username, password} = this.state;

    api.post('/login', { username, password})
        .then(async (u) => {
          console.log(u);
          await AsyncStorage.setItem("userToken", u.token);
          this.props.navigation.navigate("App")
        })
  }

  render() {
    return (
        <View style={styles.container}>
          <Text style={styles.titleText}>Login</Text>
          <View style={styles.form}>
            <TextInput
                editable={true}
                onChangeText={(username) => this.setState({username})}
                placeholder='Username'
                ref='username'
                returnKeyType='next'
                style={styles.inputText}
                value={this.state.username}
            />

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

            <TouchableOpacity style={styles.buttonWrapper} onPress={this.handleSubmit}>
              <Text style={styles.buttonText}> Log in </Text>
            </TouchableOpacity>


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
  inputText: {
    padding: 6,
    borderWidth: 1,
    borderColor: "#efefef",
    marginTop: 20,
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
});
