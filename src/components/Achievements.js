import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const achievements = require('../data/achievements.json');



const Achievements = ({ steps, distance, currentWeather }) => {
    // Filter achievements based on type (steps or distance)
    const stepsAchievements = achievements.filter((achievement) => achievement.type === 'steps');
    const distanceAchievements = achievements.filter((achievement) => achievement.type === 'distance');

    const weatherAchievements = achievements.filter((achievement) => achievement.type === 'steps_weather');


    // Filter weather-specific achievements
    /*
    const weatherAchievements = achievements.filter(
        (achievement) => achievement.weather && achievement.weather === currentWeather.main
    );
    */

    const renderWeatherIcon = (weather) => {
        let iconName = 'weather-sunny'; // Default icon for unknown conditions

        // Map weather condition to appropriate icon
        switch (weather) {
            case 'Thunderstorm':
                iconName = 'weather-lightning';
                break;
            case 'Drizzle':
            case 'Rain':
                iconName = 'weather-rainy';
                break;
            case 'Snow':
                iconName = 'weather-snowy';
                break;
            case 'Clear':
                iconName = 'weather-sunny';
                break;
            case 'Clouds':
                iconName = 'weather-cloudy';
                break;
            default:
                iconName = 'weather-sunny';
                break;
        }

        return <MaterialCommunityIcons name={iconName} size={30} color="#AFB3BE" />;
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Steps Achievements</Text>
                {stepsAchievements.map((achievement) => (
                    <AchievementItem
                        key={achievement.id}
                        achievement={achievement}
                        currentValue={steps}
                        renderWeatherIcon={renderWeatherIcon}
                    />
                ))}
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Distance Achievements</Text>
                {distanceAchievements.map((achievement) => (
                    <AchievementItem
                        key={achievement.id}
                        achievement={achievement}
                        currentValue={distance}
                        renderWeatherIcon={renderWeatherIcon}
                    />
                ))}
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Weather-Specific Achievements</Text>
                {weatherAchievements.map((achievement) => (
                    <AchievementItem
                        key={achievement.id}
                        achievement={achievement}
                        currentValue={steps}
                        renderWeatherIcon={renderWeatherIcon}
                    />
                ))}
            </View>
        </ScrollView>
    );

};

const AchievementItem = ({ achievement, currentValue, renderWeatherIcon }) => {
    let progress = 0;
    if (achievement.type === 'steps') {
        progress = Math.min(currentValue / achievement.target, 1);
    } else if (achievement.type === 'distance') {
        progress = Math.min(currentValue / achievement.target, 1);
    }


    return (
        <View style={styles.achievementsItem}>
            <Text style={styles.achievementsTitle}>{achievement.title}</Text>
            <Text style={styles.achievementsDescription}>{achievement.description}</Text>
            <View style={styles.weatherIconContainer}>
                {achievement.weather && renderWeatherIcon(achievement.weather)}
            </View>
            <Text style={styles.achievementsExp}>Reward: {achievement.xpReward} XP</Text>
            <ProgressBar progress={progress} color='#EE0F55' style={styles.progressBar} />

            <TouchableOpacity style={[styles.button, styles.buttonDisabled]} disabled={true}>
                <Text style={styles.buttonText}>Achievement Incomplete</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    section: {
        marginVertical: 10,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 5,
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
    weatherIconContainer: {
        alignItems: 'center',
        marginVertical: 8,
    },
});

export default Achievements;