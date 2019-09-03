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

export default class LeaderboardScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            sortBy: 'total',
            period: 'last-week',
			loading: false,
        };
        this.fetch = this.fetch.bind(this);
    }

	static navigationOptions = {
		title: 'Leaderboard',
	};

    componentDidMount() {
        this.fetch();
		AppState.addEventListener('change', this.handleAppStateChange);
    }

	handleAppStateChange = nextAppState => {
		if (nextAppState === 'active') {
			this.fetch();
		}
	};

    fetch(sortBy = this.state.sortBy, period = this.state.period) {
        let d = new Date();
        d.setHours(0, 0, 0);
        if (period === 'last-week') {
            d.setDate(d.getDate() - d.getDay());
        } else {
            d.setDate(1);
        }
        this.setState({loading: true});
        api.get(`/leaderboard?limit=20&sortBy=${sortBy}&after=${Math.round(d.getTime()/1000)}`)
            .then(data => this.setState({data, sortBy, period, loading: false}))
    }

    handlePeriodChange = (newPeriod) => () => {
        const { period } = this.state;

        if (newPeriod !== period) {
            this.fetch(null, newPeriod);
        }
    };

    handleSort = (clickedColumn) => () => {
        const { sortBy } = this.state;

        if (clickedColumn !== sortBy) {
            this.fetch(clickedColumn);
        }
    };

    render() {
        const { sortBy, data, period } = this.state;
        return (
            <ScrollView style={{ padding: 10 }} vertical={true}  refreshControl={<RefreshControl
				refreshing={this.state.loading}
				onRefresh={this.fetch}
			/>}>
                <Text style={{ marginTop: 20}}>
                    <Text style={{ fontWeight: 'bold'}}>Show &nbsp;</Text>
                    <Text onPress={this.handlePeriodChange('last-week')} style={{color: '#888', fontWeight: period === 'last-week' ? 'bold' : 'normal'}}>last week</Text>
                    &nbsp;
                    <Text onPress={this.handlePeriodChange('last-month')} style={{color: '#888', fontWeight: period === 'last-month' ? 'bold' : 'normal'}}>last month</Text>
                </Text>
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
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
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
		color: '#4183c4'
	},
});
