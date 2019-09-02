import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import api from './../util/api.js';
import TimeAgo from 'react-native-timeago';

export default class FeedScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activities: [],
        };
    }

    componentDidMount() {
        api.get('/activities?feed=1&limit=100')
            .then((activities) => {
                activities = activities.map(a => {
                    a.date = api.date(a.timestamp);
                    return a;
                });
                this.setState({activities});
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.baseText}>
                        {this.state.activities.map(a => (
                            <Text key={a.id}>{a.username} did {a.repetitions} repetitions. <TimeAgo time={a.date} />{'\n'}</Text>
                        ))}
                    </Text>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    contentContainer: {
        padding: 15,
    },
    baseText: {
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});