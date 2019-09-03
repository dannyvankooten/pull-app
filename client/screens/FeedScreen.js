import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    RefreshControl,
	AppState
} from 'react-native';

import api from './../util/api.js';
import TimeAgo from 'react-native-timeago';
import auth from "../util/auth";

export default class FeedScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activities: [],
            loading: true
        };
        this.refresh = this.refresh.bind(this);

        // auth.setUser(null)
		// auth.setToken(null);
    }

	static navigationOptions = {
		title: 'Activity feed',
	};

    componentDidMount() {
       this.refresh();
       AppState.addEventListener('change', this.handleAppStateChange);
    }

	handleAppStateChange = nextAppState => {
		if (nextAppState === 'active') {
			this.refresh();
		}
	};

    refresh() {
        this.setState({ loading: true });

        api.get('/activities?feed=1&limit=100')
            .then((activities) => {
                activities = activities.map(a => {
                    a.date = api.date(a.timestamp);
                    return a;
                });
                this.setState({activities, loading: false});
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainer} refreshControl={
                    <RefreshControl
                        refreshing={this.state.loading}
                        onRefresh={this.refresh}
                    />
                }>
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
