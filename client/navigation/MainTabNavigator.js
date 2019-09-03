import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import RecordScreen from "../screens/RecordScreen";
import FeedScreen from "../screens/FeedScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

// activity
const ActivityStack = createStackNavigator(
    {
        Activity: RecordScreen,
    },
    config
);
ActivityStack.navigationOptions = {
    tabBarLabel: 'Record',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-add-circle-outline' : 'md-add-circle-outline'} />
    ),
};

// feed
const FeedStack = createStackNavigator(
    {
        Feed: FeedScreen,
		Profile: ProfileScreen,
    },
    config
);
FeedStack.navigationOptions = {
    tabBarLabel: 'Feed',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-notifications' : 'md-notifications'} />
    ),
};

// leaderboard
const LeaderboardStack = createStackNavigator(
    {
        Leaderboard: LeaderboardScreen,
        Profile: ProfileScreen,
    },
    config
);
LeaderboardStack.navigationOptions = {
    tabBarLabel: 'Leaderboard',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-podium' : 'md-podium'} />
    ),
};

// profile
const ProfileStack = createStackNavigator(
    {
        Profile: ProfileScreen,
    },
    config
);
ProfileStack.navigationOptions = {
    tabBarLabel: 'Profile',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'} />
    ),
};

const tabNavigator = createBottomTabNavigator({
    ActivityStack,
    FeedStack,
    LeaderboardStack,
    ProfileStack
});

tabNavigator.path = '';

export default tabNavigator;
