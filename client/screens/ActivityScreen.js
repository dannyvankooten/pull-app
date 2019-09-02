import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
    Button,
    StyleSheet,
    Text,
    View,
	TouchableOpacity
} from 'react-native';
import TimeAgo from 'react-native-timeago';
import api from "../util/api.js";
import auth from "../util/auth.js";

export default class ActivityScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            reps: 1,
            loading: false,
            activities: [],
        };
        this.save = this.save.bind(this);
    }

    componentDidMount() {
		auth.getUser()
			.then(u => {
				this.user = u;
				api.get(`/activities?user_id=${u.id}limit=10`)
					.then((activities) => {
						activities = activities.map(a => {
							a.date = api.date(a.timestamp);
							return a;
						});
						this.setState({activities})
					})
			});
    }



    save(evt) {
        this.setState({
            loading: true,
        });

        api.post('/activities', {
        	user_id: this.user.id,
            repetitions: this.state.reps
        }).then((activity) => {
            activity.date = api.date(activity.timestamp);

            this.setState({
                activities: [activity, ...this.state.activities],
                loading: false,
            })
        });
    }

    render() {
		return (
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <View style={styles.controlView}>
                            <View>
                                <Text style={styles.controlText} onPress={e => this.setState({reps: Math.max(1, --this.state.reps) })}> - </Text>
                            </View>
                            <View>
								<Text style={styles.repText}>{this.state.reps}</Text>
								<Text style={styles.mutedText}>repetitions</Text>
                            </View>
                            <View><Text style={styles.controlText} onPress={e => this.setState({reps: Math.min(100, ++this.state.reps) })}> + </Text></View>
                    </View>
                    <TouchableOpacity onPress={this.save} style={styles.button}>
						<Text style={styles.buttonText}>{this.state.loading ? "Wait" : "Save"}</Text>
					</TouchableOpacity>
                </View>
				<View style={{ marginTop: 20}}>
					<View style={{ borderBottomWidth: 1, borderBottomColor: "#efefef",  marginBottom: 6}}><Text style={{fontSize: 16, fontWeight: "bold"}}>History</Text></View>
					{this.state.activities.map(a => (
						<View key={a.id}>
							<Text>
								<Text>You</Text>
								<Text> did </Text>
								<Text>{a.repetitions}</Text>
								<Text> reps </Text>
								<TimeAgo time={a.date} style={styles.mutedText} />
							</Text>
						</View>
					))}
				</View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
		padding: 15,
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
    	backgroundColor: '#333',
		paddingVertical: 12,
		alignItems: 'center',
		marginTop: 12
	},
	buttonText: {
    	color: "#FFF"
	},
	mutedText: {
		color: 'rgba(0,0,0,.4)',
		fontSize: 12,
		fontWeight: 'normal',
	}

});
