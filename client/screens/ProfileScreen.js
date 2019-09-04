import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
	RefreshControl
} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
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
            perDay: [],
            user: {},
            chartPeriod: 'week',
			periodAgo: 0,
			loading: false,
			refreshing: false,
        }
    }

	static navigationOptions = {
		title: 'Profile',
	};

    componentDidMount() {
    	this.loadData()
    }

    componentDidUpdate(prevProps) {
        const id = this.props.navigation.getParam('id');
        const prevId = prevProps.navigation.getParam('id');

        if (id && id !== prevId) {
            this.loadData();
        }
    }

    refreshData= () => {
		this.setState({ refreshing: true });
		this.loadData()
			.finally(() => this.setState({refreshing: false}));
	};

    loadData() {
		this.setState({ loading: true,  week: empty, month: empty, year: empty, perDay: [] });
		const user = auth.getUser();
		const id = this.props.navigation.getParam('id', user.id);

        api.get(`/users/${id}`)
            .then(d => this.setState(d));

        return api.get(`/stats/${id}`)
            .then(d => this.setState(d))
			.finally(() => this.setState({ loading: false }));
    }

	onSwipeLeft(gestureState) {
		const periodAgo = Math.min(0, ++this.state.periodAgo);
		this.setState({periodAgo});
	}

	onSwipeRight(gestureState) {
		const periodAgo = --this.state.periodAgo;
		this.setState({periodAgo});
	}

    render() {
        return (
            <ScrollView vertical={true} style={styles.container} refreshControl={
				<RefreshControl
					refreshing={this.state.refreshing}
					onRefresh={this.refreshData}
				/>
			}>
                <Text style={styles.titleText}>{this.state.user.username}</Text>

				<View>
					<GestureRecognizer
						onSwipeLeft={(state) => this.onSwipeLeft(state)}
						onSwipeRight={(state) => this.onSwipeRight(state)}
						config={{}}
					>
						<Chart data={this.state.perDay} period={this.state.chartPeriod} periodAgo={this.state.periodAgo} />
					</GestureRecognizer>
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
