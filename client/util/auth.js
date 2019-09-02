import { AsyncStorage } from 'react-native';

async function getToken() {
	const userToken = await AsyncStorage.getItem('userToken');
	return typeof (userToken) === "string" ? userToken : null;
}

function setToken(token) {
	return AsyncStorage.setItem("userToken", token);
}

function setUser(user) {
	return AsyncStorage.setItem("user", JSON.stringify(user));
}

async function getUser() {
	const data = await AsyncStorage.getItem('user');
	return JSON.parse(data);
}

export default { getToken, getUser, setToken, setUser }
