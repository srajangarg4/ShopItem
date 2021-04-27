import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    loadingView: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    loadingText: {
        color: '#fd5437',
        fontSize: 14,
        fontWeight: 'bold'
    }
});

export const Loading = () => {
    return (
        <View style={styles.loadingView} >
            <ActivityIndicator size="large" color="#fd5437" />
            <Text style={styles.loadingText} >Loading . . .</Text>
        </View>
    );
}; 

/* #f4511e */