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
import GestureRecognizer from 'react-native-swipe-gestures';

function formatDate(d, includeYear = false) {
	const monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	let s = monthNames[d.getMonth()] + " " + d.getDate();

	if (includeYear) {
		s = s + ", " + d.getFullYear();
	}

	return s;
}

export default class LeaderboardScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            sortBy: 'total',
            period: 'last-week',
			timeDiff: 0,
			loading: false,
            refreshing: false,
			error: null,
			start: new Date(),
			end: new Date(),
        };

        this.loadData = this.loadData.bind(this);
        this.refreshData = this.refreshData.bind(this);
    }

	static navigationOptions = {
		title: 'Leaderboard',
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

    loadData(sortBy = this.state.sortBy, period = this.state.period) {
        let start = new Date();
		start.setHours(0, 0, 0);
		let end;
        if (period === 'last-week') {
			start.setDate(start.getDate() - start.getDay() + 1 + (this.state.timeDiff * 7)); // set to Monday
			end = new Date(start);
			end.setDate(start.getDate() + 7);
        } else {
			start.setDate(1);
			start.setMonth(start.getMonth() + this.state.timeDiff);
			end = new Date(start);
			end.setMonth(start.getMonth() + 1);
        }
        end.setMinutes(-1);
        this.setState({loading: true, error: null});

        return api.get(`/leaderboard?limit=20&sortBy=${sortBy}&after=${Math.round(start.getTime()/1000)}&before=${Math.round(end.getTime()/1000)}`)
            .then(data => this.setState({data, sortBy, period, start, end}))
            .catch(error => this.setState({error}))
            .finally(() => this.setState({loading: false}));
    }

    refreshData() {
        this.setState({ refreshing: true });
        this.loadData()
            .finally(() => this.setState({ refreshing: false}));
    }

    handlePeriodChange = (newPeriod) => () => {
        const { period } = this.state;

        if (newPeriod !== period) {
            this.loadData(null, newPeriod);
        }
    };

    handleSort = (clickedColumn) => () => {
        const { sortBy } = this.state;

        if (clickedColumn !== sortBy) {
            this.loadData(clickedColumn);
        }
    };


	onSwipeLeft(gestureState) {
		const timeDiff = Math.min(0, ++this.state.timeDiff);
		this.setState({timeDiff}, this.loadData);
	}

	onSwipeRight(gestureState) {
		const timeDiff = --this.state.timeDiff;
		this.setState({timeDiff}, this.loadData);
	}

    render() {
        const { data, period, start, end } = this.state;
        return (
        	<View>
				{this.state.error ? <View style={styles.errorView}><Text style={styles.errorText}>Network error. Could not load leaderboard.</Text></View> : null}
				<ScrollView contentContainerStyle={styles.container} vertical={true}  refreshControl={<RefreshControl
					refreshing={this.state.refreshing}
					onRefresh={this.refreshData}
				/>}>
					<View style={{flexDirection: 'row'}}>
						<Text style={{ fontWeight: 'bold'}}>Show &nbsp;</Text>
						<Text onPress={this.handlePeriodChange('last-week')} style={{color: '#888', fontWeight: period === 'last-week' ? 'bold' : 'normal'}}>per week</Text>
						<Text> &nbsp; </Text>
						<Text onPress={this.handlePeriodChange('last-month')} style={{color: '#888', fontWeight: period === 'last-month' ? 'bold' : 'normal'}}>per month</Text>
					</View>
					<View style={{ marginTop: 12 }}>
						<Text style={{fontStyle: 'italic'}}>Showing {formatDate(start, false)} - {formatDate(end, true)}</Text>
					</View>
					<GestureRecognizer
						onSwipeLeft={(state) => this.onSwipeLeft(state)}
						onSwipeRight={(state) => this.onSwipeRight(state)}>
						<View style={styles.tableWrap}>
							<View style={styles.head}>
								<View style={{...styles.headerCell, flex: 1.25}}><Text style={styles.headerText}>#</Text></View>
								<View style={{...styles.headerCell, flex: 4}}><Text style={styles.headerText}>Athlete</Text></View>
								<View style={{...styles.headerCell, flex: 2}}><Text style={styles.headerText} onPress={this.handleSort('total')}>Total</Text></View>
								<View style={{...styles.headerCell, flex: 2}}><Text style={styles.headerText} onPress={this.handleSort('max')}>Max</Text></View>
							</View>
							{data.map((u, index) => (
								<View key={index} style={styles.row}>
									<View style={{...styles.rowCell,  flex: 1.25}}><Text style={styles.text}>{index+1}</Text></View>
									<View style={{...styles.rowCell, flex: 4}}><Text style={styles.linkText} onPress={() => this.props.navigation.push('Profile', { id: u.id })}>{u.username}</Text></View>
									<View style={{...styles.rowCell, flex: 2}}><Text style={styles.text}>{u.total}</Text></View>
									<View style={{...styles.rowCell, flex: 2}}><Text style={styles.text}>{u.max}</Text></View>
								</View>
							))}
						</View>
					</GestureRecognizer>
				</ScrollView>
			</View>
        )
    }
}

const styles = StyleSheet.create({
	container: {
		padding: 12
	},
    head: {
		flexDirection: 'row',
	},
	tableWrap: {
    	marginTop: 20,
		borderColor: 'rgba(34,36,38,.1)',
		borderBottomWidth: 1,
		borderRightWidth: 1,
	},
	headerCell: {
		backgroundColor: '#f9fafb',
		borderColor: 'rgba(34,36,38,.1)',
		borderWidth: 1,
		paddingVertical: 4,
		borderRightWidth: 0,
		borderBottomWidth: 0,
	},
    headerText: { margin: 6, fontWeight: 'bold'},
    text: { margin: 6 },
    row: { flexDirection: 'row' },
	rowCell: {
		borderColor: 'rgba(34,36,38,.1)',
		borderWidth: 1,
		paddingVertical: 4,
		borderRightWidth: 0,
		borderBottomWidth: 0,
	},
	linkText: {
    	margin: 6,
        paddingVertical: 2,
		color: '#4183c4'
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
