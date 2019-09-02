import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
    Button,
    StyleSheet,
    Text,
    View,
} from 'react-native';

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
        // api.get('/activities?limit=10')
        //     .then((activities) => {
        //         activities = activities.map(a => {
        //             a.date = api.date(a.timestamp);
        //             return a;
        //         });
        //         this.setState({activities})
        //     })
    }

    save(evt) {
        this.setState({
            loading: true,
        });

        // api.post('/activities', {
        //     repetitions: this.state.count
        // }).then((activity) => {
        //     activity.date = api.date(activity.timestamp);
        //
        //     this.setState({
        //         activities: [activity, ...this.state.activities],
        //         loading: false,
        //     })
        // });

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <View style={styles.controlView}>
                            <View styles={styles.foo}>
                                <Text style={styles.controlText} onPress={e => this.setState({reps: Math.max(1, --this.state.reps) })}> - </Text>
                            </View>
                            <View styles={styles.foo}><Text style={styles.repText}>{this.state.reps}</Text></View>
                            <View styles={styles.foo}><Text style={styles.controlText} onPress={e => this.setState({reps: Math.min(100, ++this.state.reps) })}> + </Text></View>
                    </View>
                    <Button
                        onPress={this.save}
                        title={this.state.loading ? "Wait" : "Save"}
                        color="#841584"
                        accessibilityLabel="Learn more about this purple button"
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    foo: {flex: 0.333 },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
    },
    controlView: { flexDirection: 'row' },
    formContainer: {

    },
    formText: {
        textAlign: 'center',
    },
    controlText: {
        fontSize: 40,
        color: "#aaa",
        margin: 10,
    },
    repText: {
        fontSize: 80,

    },

});