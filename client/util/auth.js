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

function setToken(_token) {
	userToken = _token;
	AsyncStorage.setItem("userToken", _token);
}

function setUser(_user) {
	user = _user;
	AsyncStorage.setItem("user", JSON.stringify(_user));
}

function getUser() {
	return user;
}

export default { init, getToken, getUser, setToken, setUser }
