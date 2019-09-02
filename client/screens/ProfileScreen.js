import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
const empty = { average: 0, total: 0, biggest: 0 };
import api from './../util/api.js';

export default class ProfileScreen extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            week: empty,
            month: empty,
            year: empty,
            perDay: [],
            user: {},
            chartGroupBy: 'week',
        }
    }

    componentDidMount() {
        this.fetch(this.props.navigation.getParam('id', 1))
    }

    componentDidUpdate(prevProps) {
        console.log(this.props)
        const id = this.props.navigation.getParam('id');
        const prevId = prevProps.navigation.getParam('id');

        console.log(id, prevId)

        if (id !== prevId) {
            this.fetch(id);
        }
    }

    fetch(id) {
        api.get(`/users/${id}`)
            .then(d => this.setState(d));

        api.get(`/stats/${id}`)
            .then(d => this.setState(d))
    }

    render() {
        return (
            <View>
                <Text>{this.props.navigation.getParam('id')}</Text>
                <Text>{this.state.user.username}</Text>
                <Text>
                    This is a tab bar. You can edit it in:
                </Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({});