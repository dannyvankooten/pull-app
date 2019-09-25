import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
	RefreshControl,
	TouchableOpacity
} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import api from './../util/api.js';
import Chart from "../components/Chart";
import auth from "../util/auth";

function initDates(data) {
	return data.map(d => {
		if (typeof(d.date) === "string") {
			d.date = new Date(d.date + 'T00:00:00Z');
		}
		return d;
	});
}

function Table(props) {
	const {data, altData, period, title, userName} = props;
	const stats = (data, since) => {
		let sets = 0, total = 0, average = 0, max = 0;
		data.forEach(d => {
			if (d.date >= since) {
				sets += d.sets;
				total += d.total;
				average = Math.round(total / sets);
				max = Math.max(max, d.max);
			}
		});
		return {total, average, max, sets};
	};

	let since;
	const now = new Date();
	switch(period) {
		case 'all-time':
		default:
			since = new Date(2000, 0, 1);
			break;
		case 'last-4-weeks':
			since = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (4*7));
			break;
		case 'this-year':
			since = new Date(now.getFullYear(), 0, 1);
			break;
	}

	const userStats = stats(data, since);
	const myStats = stats(altData, since);

	return (
		<View style={{ marginTop: 20}}>
			<View style={styles.row}>
				<Text style={{...styles.headerText, flex: 6}}>{title}</Text>
				<Text style={{...styles.headerText, flex: 3, color: "#999", fontWeight: "normal"}}>{altData.length ? userName : ''}</Text>
				<Text style={{...styles.headerText, flex: 3, color: "#999", fontWeight: "normal"}}>{altData.length ? 'You' : ''}</Text>
			</View>
			<View style={styles.rowOdd}>
				<Text style={styles.rowTitleText}>Total</Text>
				<Text style={styles.rowValueText}>{userStats.total}</Text>
				<Text style={styles.rowValueText}>{altData.length ? myStats.total : ''}</Text>
			</View>
			<View style={styles.row}>
				<Text style={styles.rowTitleText}>Average</Text>
				<Text style={styles.rowValueText}>{userStats.average}</Text>
				<Text style={styles.rowValueText}>{altData.length ? myStats.average : ''}</Text>
			</View>
			<View style={styles.rowOdd}>
				<Text style={styles.rowTitleText}>Max</Text>
				<Text style={styles.rowValueText}>{userStats.max}</Text>
				<Text style={styles.rowValueText}>{altData.length ? myStats.max : ''}</Text>
			</View>
		</View>
	)
}

export default class ProfileScreen extends React.Component{
	static navigationOptions = {
		title: 'Profile',
	};

    constructor(props) {
        super(props);
        this.state = {
			loading: false,
			refreshing: false,
			error: null,

			user: {},
			chartGroupBy: 'week',
			chartDateOffset: 0,

			data: [],
			altData: []
		};

		this.loadData = this.loadData.bind(this);
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
		this.setState({ loading: true, data: [], altData: [], user: {}, error: null});
		const user = auth.getUser();
		const id = this.props.navigation.getParam('id', user.id);

        api.get(`/users/${id}`)
			.catch(error => this.setState({error}))
            .then(d => this.setState(d));

		if (user && id !== user.id) {
			api.get(`/v1/stats/${user.id}`)
				.catch(error => null)
				.then(altData => this.setState({altData: initDates(altData)}))
		}

        return api.get(`/v1/stats/${id}`)
            .then(data => this.setState({data: initDates(data)}))
			.catch(error => this.setState({error}))
			.finally(() => this.setState({ loading: false }));
    }

	onSwipeLeft(gestureState) {
		const chartDateOffset = Math.min(0, ++this.state.chartDateOffset);
		this.setState({chartDateOffset});
	}

	onSwipeRight(gestureState) {
		const chartDateOffset = --this.state.chartDateOffset;
		this.setState({chartDateOffset});
	}

    render() {
    	const { chartDateOffset, chartGroupBy, refreshing, user, data, altData } = this.state;

        return (
        	<View>
				{this.state.error ? <View style={styles.errorView}><Text style={styles.errorText}>Network error. Could not load profile.</Text></View> : null}
				<ScrollView vertical={true} contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.refreshData} />}>
					<Text style={styles.titleText}>{user.username}</Text>
					<View>
						<GestureRecognizer
							onSwipeLeft={(state) => this.onSwipeLeft(state)}
							onSwipeRight={(state) => this.onSwipeRight(state)}>
							<Chart data={data} groupBy={chartGroupBy} dateOffset={chartDateOffset} />
							<View style={styles.chartGroupByContainer}>
								<TouchableOpacity style={chartGroupBy === 'day' ? styles.chartGroupbyChoiceActive : styles.chartGroupByChoice} onPress={() => this.setState({chartGroupBy: 'day'})}><Text style={styles.chartGroupByChoiceText}>Daily</Text></TouchableOpacity>
								<TouchableOpacity style={chartGroupBy === 'week' ? styles.chartGroupbyChoiceActive : styles.chartGroupByChoice} onPress={() => this.setState({chartGroupBy: 'week'})}><Text style={styles.chartGroupByChoiceText}>Weekly</Text></TouchableOpacity>
								<TouchableOpacity style={chartGroupBy === 'month' ? styles.chartGroupbyChoiceActive : styles.chartGroupByChoice} onPress={() => this.setState({chartGroupBy: 'month'})}><Text style={styles.chartGroupByChoiceText}>Monthly</Text></TouchableOpacity>
							</View>
						</GestureRecognizer>
					</View>
					<View style={{ marginTop: 20}}>
						<Table title="Last 4 weeks" data={data} altData={altData} period={"last-4-weeks"} userName={user.username}/>
						<Table title="This year" data={data} altData={altData} period={"this-year"} userName={user.username}/>
						<Table title="All-time" data={data} altData={altData}  period={"all-time"} userName={user.username} />
					</View>

					{__DEV__ && <Text style={{ marginTop: 20}} onPress={() => {auth.setUser(''); auth.setToken(''); this.props.navigation.navigate("Auth"); }}>Log out</Text>}
            	</ScrollView>
			</View>
        )
    }
}
const styles = StyleSheet.create({
	container: {
		padding: 12
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
	rowTitleText: { flex: 6},
	rowValueText: { flex: 3},
	chartGroupByContainer: {
		marginTop: 10,
		textAlign: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		flex: 1,
	},
	chartGroupByChoice: {
		paddingVertical: 4,
		paddingHorizontal: 8,
		borderColor: "#EEE",
		borderWidth: 1,
	},
	chartGroupByChoiceText: {
		color: '#AAA',
		fontSize: 12,
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
styles.rowOdd = {
	...styles.row,
	backgroundColor: 'rgba(0,0,0,.02)',
};
styles.chartGroupbyChoiceActive = {
	...styles.chartGroupByChoice,
	backgroundColor: 'rgba(0,0,0,.05)',
};
