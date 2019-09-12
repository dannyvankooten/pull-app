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

export default class FeedScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activities: [],
            loading: true,
            refreshing: false
        };
        this.refreshData = this.refreshData.bind(this);
    }

	static navigationOptions = {
		title: 'Activity feed',
	};

    componentDidMount() {
       this.loadData();
       AppState.addEventListener('change', this.handleAppStateChange);
    }

	handleAppStateChange = nextAppState => {
		if (nextAppState === 'active') {
			this.loadData();
		}
	};

    loadData() {
        this.setState({ loading: true, error: null });

        return api.get('/activities?feed=1&limit=100')
            .then((activities) => {
                activities = activities.map(a => {
                    a.date = api.date(a.timestamp);
                    return a;
                });
                this.setState({activities});
            })
            .catch(err => this.setState({error: err}))
            .finally(() => this.setState({ loading: false}));
    }

    refreshData() {
        this.setState({ refreshing: true });
        this.loadData()
            .finally(() => this.setState({ refreshing: false}));
    }

    render() {
        return (
            <View>
				{this.state.error ? <View style={styles.errorView}><Text style={styles.errorText}>Network error. Could not load feed.</Text></View> : null}
                <ScrollView style={styles.container} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.refreshData}
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
	container: { paddingHorizontal: 12, paddingVertical: 6},
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
		marginBottom: 10,
    },
	linkText: {
    	color: '#4183c4',
        paddingVertical: 2,
	},
	baseText: {
    	fontWeight: "600"
	},
	mutedText: {
    	color: 'rgba(0,0,0,.4)',
		fontSize: 12,
		fontWeight: 'normal',
	},
	errorView: {
    	margin: 6,
		padding: 6,
    	backgroundColor: "#fff6f6",
		borderColor: "#e0b4b4",
		borderWidth: 1,
		borderRadius: 2,
	},
	errorText: {
    	color: "#9f3a38"
	},
});
