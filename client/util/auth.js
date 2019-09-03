import { AsyncStorage } from 'react-native';

let userToken, user;

async function init() {
	userToken = await AsyncStorage.getItem('userToken');
	const data = await AsyncStorage.getItem('user');
	user = JSON.parse(data);
}

function getToken() {
	return userToken;
}

function setToken(token) {
	return AsyncStorage.setItem("userToken", token);
}

function setUser(user) {
	return AsyncStorage.setItem("user", JSON.stringify(user));
}

function getUser() {
	return user;
}

export default { init, getToken, getUser, setToken, setUser }
