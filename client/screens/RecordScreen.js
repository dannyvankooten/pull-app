import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
	TouchableOpacity,
    AsyncStorage,
	Alert
} from 'react-native';
import TimeAgo from 'react-native-timeago';
import api from "../util/api.js";
import auth from "../util/auth.js";

export default class RecordScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            reps: 1,
            loading: false,
            activities: [],
        };
        this.save = this.save.bind(this);
    }

	static navigationOptions = {
		title: 'Record new activity',
	};

    componentDidMount() {
    	this.setState({error: null});
		const user = auth.getUser();
		api.get(`/activities?user_id=${user.id}&limit=10`)
			.then((activities) => {
				activities = activities.map(a => {
					a.date = api.date(a.timestamp);
					return a;
				});
				this.setState({activities})
			}).catch(error => this.setState({error}));

        AsyncStorage.getItem("reps")
			.then(reps => reps ? this.setState({reps}) : false);
    }

    save() {
        this.setState({
            loading: true,
        });

		const user = auth.getUser();
        AsyncStorage.setItem("reps", String(this.state.reps));

        api.post('/activities', {
        	user_id: user.id,
            repetitions: this.state.reps
        }).then((activity) => {
            activity.date = api.date(activity.timestamp);
            this.setState({
                activities: [activity, ...this.state.activities],
            })
        }).catch(error => Alert.alert("Uh oh", "Something went wrong saving your effort.. Please try again later."))
		  .finally(() => this.setState({loading: false}));
    }

    render() {
    	const {error, activities, reps, loading} = this.state;
		return (
			<View>
				{error ? <View style={styles.errorView}><Text style={styles.errorText}>Network error. Could not load recent activity.</Text></View> : null}
				<View style={styles.container}>
					<View style={styles.formContainer}>
						<View style={styles.controlView}>
								<View>
									<Text style={styles.controlText} onPress={e => this.setState({reps: Math.max(1, --this.state.reps) })}> - </Text>
								</View>
								<View>
									<Text style={styles.repText}>{reps}</Text>
									<Text style={styles.mutedText}>repetitions</Text>
								</View>
								<View><Text style={styles.controlText} onPress={e => this.setState({reps: Math.min(100, ++this.state.reps) })}> + </Text></View>
						</View>
						<TouchableOpacity onPress={this.save} style={styles.button}>
							<Text style={styles.buttonText}>{loading ? "Wait" : "Save"}</Text>
						</TouchableOpacity>
					</View>
					<View style={{ marginTop: 20}}>
						<View style={styles.titleView}><Text style={styles.titleText}>History</Text></View>
						<ScrollView vertical={true}>
						{activities.length > 0 ? activities.map(a => (
							<View key={a.id} style={{ marginBottom: 4}}>
								<Text>
									<Text>You</Text>
									<Text> did </Text>
									<Text>{a.repetitions}</Text>
									<Text> reps </Text>
									<TimeAgo time={a.date} style={styles.mutedText} />
								</Text>
							</View>
						)) : <Text>Nothing here, yet.</Text>}
						</ScrollView>
					</View>
				</View>
			</View>

		)
    }
}

const styles = StyleSheet.create({
    container: {
		padding: 12
	},
    controlView: {
    	flexDirection: 'row',
		alignItems: 'center',
		alignContent: 'center',
		justifyContent: 'center',
	},
    formContainer: {
		alignItems: 'center',
		textAlign: "center"
    },
    controlText: {
        fontSize: 60,
        color: "#aaa",
        margin: 10,
    },
    repText: {
        fontSize: 80,
		textAlign: "center"
    },
	button: {
    	width: '100%',
    	backgroundColor: '#2185d0',
		paddingVertical: 12,
		alignItems: 'center',
		marginTop: 12,
        borderRadius: 2,
	},
	buttonText: {
    	color: "#FFF",
        fontWeight: "700"
	},
	mutedText: {
		color: 'rgba(0,0,0,.4)',
		fontSize: 12,
		fontWeight: 'normal',
	},
	titleView: {
		borderBottomWidth: 1, borderBottomColor: "#efefef",  marginBottom: 6, paddingBottom: 6
	},
	titleText: {
		fontSize: 16, fontWeight: "bold"
	},
	errorView: {
		margin: 12,
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
