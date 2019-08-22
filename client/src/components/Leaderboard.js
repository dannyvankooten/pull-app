import React from 'react';
import { NavLink } from "react-router-dom";
import api from './../lib/api.js';
import { Table, Menu } from 'semantic-ui-react'

class Feed extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
        };
    }

    componentDidMount() {
        const period = this.props.match.params.period || 'week';
        let d = new Date();
        if (period === 'week') {
            d.setDate(d.getDate() - d.getDay());
        } else {
            d.setDate(0);
        }
        api.get(`/leaderboard?limit=20&after=${Math.round(d.getTime()/1000)}`)
            .then(data => this.setState({data}))
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.period === prevProps.match.params.period) {
            return;
        }

        this.componentDidMount();
    }

    render() {
        return (
            <div className="leaderboard">
                <h1>Leaderboard</h1>
                <Menu text>
                    <Menu.Item header>Show</Menu.Item>
                    <Menu.Item as={NavLink} to="/leaderboard" exact>this week</Menu.Item>
                    <Menu.Item as={NavLink} to="/leaderboard/month" exact>this month</Menu.Item>
                </Menu>
                <Table celled unstackable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}>Rank</Table.HeaderCell>
                            <Table.HeaderCell>Athlete</Table.HeaderCell>
                            <Table.HeaderCell>Total</Table.HeaderCell>
                            <Table.HeaderCell>Max</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.data.map((u, i) => (
                            <Table.Row key={u.id}>
                                <Table.Cell>{i+1}</Table.Cell>
                                <Table.Cell><NavLink to={`/athlete/${u.id}`}>{u.username}</NavLink></Table.Cell>
                                <Table.Cell>{u.total}</Table.Cell>
                                <Table.Cell>{u.biggest}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        )
    }
}

export default Feed
