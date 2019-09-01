import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function FeedScreen() {
    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.contentContainer}>
                <Text style={styles.baseText}>
                    <Text style={styles.titleText}>
                        Activities {'\n'}
                    </Text>
                    <Text>Nothing here, yet</Text>
                </Text>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    contentContainer: {
        padding: 15,
    },
    baseText: {
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});