import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ActivityScreen from "../screens/ActivityScreen";
import FeedScreen from "../screens/FeedScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

HomeStack.path = '';

// activity
const ActivityStack = createStackNavigator(
    {
        Activity: ActivityScreen,
    },
    config
);
ActivityStack.navigationOptions = {
    tabBarLabel: 'Record',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-add-circle-outline' : 'md-add-circle-outline'} />
    ),
};
ActivityStack.path = '';

// feed
const FeedStack = createStackNavigator(
    {
        Feed: FeedScreen,
    },
    config
);
FeedStack.navigationOptions = {
    tabBarLabel: 'Feed',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-notifications' : 'md-notifications'} />
    ),
};
FeedStack.path = '';

// leaderboard
const LeaderboardStack = createStackNavigator(
    {
        Leaderboard: LeaderboardScreen,
    },
    config
);
LeaderboardStack.navigationOptions = {
    tabBarLabel: 'Leaderboard',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-podium' : 'md-podium'} />
    ),
};
LeaderboardStack.path = '';

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
ProfileStack.path = '';

const tabNavigator = createBottomTabNavigator({
    ActivityStack,
    FeedStack,
    LeaderboardStack,
    ProfileStack
});

tabNavigator.path = '';

export default tabNavigator;
