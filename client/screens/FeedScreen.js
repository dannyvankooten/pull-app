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
				<Text style={styles.titleText}>Activities</Text>
                <ScrollView contentContainerStyle={styles.contentContainer}>
					{this.state.activities.map(a => (
						<View key={a.id} style={{ padding: 3 }}>
						<Text style={styles.baseText}>
							<Text style={styles.linkText} onPress={() => this.props.navigation.push("Profile", { id: a.user_id })}>{a.username}</Text>
							<Text> did {a.repetitions} reps </Text>
							<TimeAgo time={a.date} interval={60000} style={styles.mutedText}/>
						</Text>
						</View>
					))}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
		marginBottom: 10,
    },
	linkText: {
    	color: '#4183c4'
	},
	baseText: {
    	fontWeight: "600"
	},
	mutedText: {
    	color: 'rgba(0,0,0,.4)',
		fontSize: 12,
		fontWeight: 'normal',
	}
});
