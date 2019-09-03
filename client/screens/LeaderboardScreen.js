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
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';

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
                <Text style={{fontSize: 30, fontWeight: 'bold'}}>
                    Leaderboard
                </Text>
                <Text style={{ marginTop: 20}}>
                    <Text style={{ fontWeight: 'bold'}}>Show &nbsp;</Text>
                    <Text onPress={this.handlePeriodChange('last-week')} style={{color: '#888', fontWeight: period === 'last-week' ? 'bold' : 'normal'}}>last week</Text>
                    &nbsp;
                    <Text onPress={this.handlePeriodChange('last-month')} style={{color: '#888', fontWeight: period === 'last-month' ? 'bold' : 'normal'}}>last month</Text>
                </Text>
                <View style={{ marginTop: 20}}>
					<Table borderStyle={{borderWidth: 1, borderColor: '#efefef'}}>
						<Row data={["Rank", "Athlete", <Text onPress={this.handleSort('total')} style={styles.headerText}>Total</Text>, <Text onPress={this.handleSort('max')} style={styles.headerText}>Max</Text>]} style={styles.head} textStyle={styles.headerText}/>
						{data.map((u, index) => (
							<TableWrapper key={index} style={styles.row}>
								<Cell data={index+1} textStyle={styles.text}/>
								<Cell data={<Text style={styles.linkText} onPress={() => this.props.navigation.push('Profile', { id: u.id })}>{u.username}</Text>} textStyle={styles.text}/>
								<Cell data={u.total} textStyle={styles.text}  onPress={this.handleSort('total')} />
								<Cell data={u.max} textStyle={styles.text} onPress={this.handleSort('max')} />
							</TableWrapper>
						))}
					</Table>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    head: { backgroundColor: '#f9fafb' },
    headerText: { margin: 6, fontWeight: 'bold'},
    text: { margin: 6 },
    row: { flexDirection: 'row' },
	linkText: {
    	margin: 6,
		color: '#4183c4'
	},
});
