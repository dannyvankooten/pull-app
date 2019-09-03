import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';

import auth from '../util/auth.js';

export default class AuthLoadingScreen extends React.Component {
    componentDidMount() {
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
    	await auth.init();

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate(auth.getUser() ? 'App' : 'Auth');
    };

    // Render any loading content that you like here
    render() {
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}
