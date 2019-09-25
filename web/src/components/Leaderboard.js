import React from 'react';
import { NavLink } from "react-router-dom";
import api from './../lib/api.js';
import { Table, Menu } from 'semantic-ui-react'

export default class Feed extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            sortBy: 'total',
        };
    }

    componentDidMount() {
        this.fetch(this.state.sortBy);
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.period === prevProps.match.params.period) {
            return;
        }

        this.componentDidMount();
    }

    fetch(sortBy) {
        const period = this.props.match.params.period || 'week';
        let d = new Date();
        d.setHours(0, 0, 0);
        if (period === 'week') {
            d.setDate(d.getDate() - d.getDay() + 1); // set to Monday
        } else {
            d.setDate(1);
        }

        let now = new Date();
        now.setHours(23, 59,59);
        api.get(`/leaderboard?limit=20&sortBy=${sortBy}&after=${Math.round(d.getTime()/1000)}&before=${Math.round(now.getTime()/1000)}`)
            .then(data => this.setState({data, sortBy}))
            .catch(error => this.setState({error}))
    }

    handleSort = (clickedColumn) => () => {
        const { sortBy } = this.state;

        if (clickedColumn !== sortBy) {
            this.fetch(clickedColumn);
        }
    };

    render() {
        const { sortBy, data } = this.state;

        return (
            <div className="leaderboard">
                <h1>Leaderboard</h1>
                <Menu text>
                    <Menu.Item header>Show</Menu.Item>
                    <Menu.Item as={NavLink} to="/leaderboard" exact>this week</Menu.Item>
                    <Menu.Item as={NavLink} to="/leaderboard/month" exact>this month</Menu.Item>
                </Menu>
                <Table celled unstackable sortable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}>Rank</Table.HeaderCell>
                            <Table.HeaderCell width={5}>Athlete</Table.HeaderCell>
                            <Table.HeaderCell
                                width={2}
                                sorted={sortBy === 'total' ? 'descending' : null}
                                onClick={this.handleSort('total')}
                            >Total</Table.HeaderCell>
                            <Table.HeaderCell
                                width={2}
                                sorted={sortBy === 'max' ? 'descending' : null}
                                onClick={this.handleSort('max')}
                            >Max</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {data.map((u, i) => (
                            <Table.Row key={u.id}>
                                <Table.Cell>{i+1}</Table.Cell>
                                <Table.Cell><NavLink to={`/athlete/${u.id}`}>{u.username}</NavLink></Table.Cell>
                                <Table.Cell>{u.total}</Table.Cell>
                                <Table.Cell>{u.max}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        )
    }
}
