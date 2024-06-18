import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressBar } from 'react-native-paper';


const achievements = require('../data/achievements.json');

const Achievements = ({ steps }) => {

    return (
        <ScrollView style={styles.container}>
            {achievements.map((achievements) => {
                const progress = Math.min(steps / achievements.targetSteps, 1);
                return (
                    <View key={achievements.id} style={styles.achievementsItem}>
                        <Text style={styles.achievementsTitle}>{achievements.title}</Text>
                        <Text style={styles.achievementsDescription}>{achievements.description}</Text>
                        <Text style={styles.achievementsExp}>Reward: {achievements.xpReward} XP</Text>
                        <ProgressBar progress={progress} color='#EE0F55' style={styles.progressBar} />

                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Claim Reward</Text>
                        </TouchableOpacity>

                    </View>
                );
            })}
        </ScrollView>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    achievementsTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    achievementsDescription: {
        color: 'white',
        alignSelf: 'center',
    },
    achievementsGoal: {
        color: '#AFB3BE',
        alignSelf: 'center',
    },
    achievementsExp: {
        color: '#AFB3BE',
        alignSelf: 'center',
    },
    achievementsItem: {
        borderColor: '#AFB3BE',
        borderWidth: 4,
        borderRadius: 15,
        backgroundColor: 'transparent',
        padding: 12,
        marginVertical: 8,
    },
    progressBar: {
        flex: 1,
        marginVertical: 8,
        height: 8,
    },
    button: {
        backgroundColor: '#EE0F55',
        padding: 10,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonClaimed: {
        backgroundColor: '#0feea8',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Achievements;