import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
	RefreshControl
} from 'react-native';
import { VictoryChart, VictoryTheme, VictoryBar, VictoryAxis, VictoryTooltip, VictoryLabel } from "victory-native";
const empty = { average: 0, total: 0, biggest: 0 };
import api from './../util/api.js';
import Chart from "../components/Chart";
import auth from "../util/auth";

function Table(props) {
	return (
		<View style={{ marginTop: 20}}>
			<View style={styles.row}>
				<Text style={styles.headerText}>{props.title}</Text>
			</View>
			<View style={styles.rowOdd}>
				<Text style={styles.rowTitleText}>Total</Text>
				<Text style={styles.rowValueText}>{props.data.total}</Text>
			</View>
			<View style={styles.row}>
				<Text style={styles.rowTitleText}>Average</Text>
				<Text style={styles.rowValueText}>{props.data.average}</Text>
			</View>
			<View style={styles.rowOdd}>
				<Text style={styles.rowTitleText}>Max</Text>
				<Text style={styles.rowValueText}>{props.data.biggest}</Text>
			</View>
		</View>
	)
}

export default class ProfileScreen extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            week: empty,
            month: empty,
            year: empty,
            perDay: [ 1],
            user: {},
            chartPeriod: 'week',
        }
    }

    componentDidMount() {
    	this.refresh()
    }

    componentDidUpdate(prevProps) {
        const id = this.props.navigation.getParam('id');
        const prevId = prevProps.navigation.getParam('id');

        if (id !== prevId) {
            this.fetch(id);
        }
    }

    refresh = () => {
		const id = this.props.navigation.getParam('id');

		if (id) {
			this.fetch(id);
		} else {
			auth.getUser().then(u => this.fetch(u.id))
		}
	};

    fetch(id) {
    	this.setState({ loading: true });
        api.get(`/users/${id}`)
            .then(d => this.setState(d));

        api.get(`/stats/${id}`)
            .then(d => this.setState({...d, loading: false}))
    }

    render() {
        return (
            <ScrollView  vertical={true} style={styles.container} refreshControl={
				<RefreshControl
					refreshing={this.state.loading}
					onRefresh={this.refresh}
				/>
			}>
                <Text style={styles.titleText}>{this.state.user.username}</Text>

				<View>
					<Chart data={this.state.perDay} period={this.state.chartPeriod} />
				</View>

				<View style={{ marginTop: 20}}>
					<Table title="Last week" data={this.state.week} />
					<Table title="Last month" data={this.state.month} />
					<Table title="Last year" data={this.state.year} />
				</View>
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
	container: {
		padding: 15,
	},
	titleText: {
		fontWeight: 'bold',
		fontSize: 26,
	},
	headerText: {
		fontWeight: 'bold',
	},
	row: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#e6e6eb',
		paddingVertical: 6,
		paddingHorizontal: 4
	},
	rowTitleText: { flex: 3},
	rowValueText: { flex: 7},
});
styles.rowOdd = {
	...styles.row,
	backgroundColor: 'rgba(0,0,0,.02)',
};
