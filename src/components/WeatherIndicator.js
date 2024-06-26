import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

const API_KEY = 'e905c71e69c8a0b6b9bc39934efd9ee9';
const CITY = 'Hamburg'; // Example city

const WeatherIndicator = ({}) => {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            //console.log(`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`);
            //console.log(weather.description)
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
                );
                setWeather(response.data.weather[0]);
            } catch (error) {
                console.error('Error fetching weather:', error);
            }
        };

        fetchWeather();
    }, []);

    const renderWeatherIcon = () => {
        if (!weather) return null;

        let iconName = 'weather-sunny'; // Default icon for unknown conditions

        // Map weather condition to appropriate icon
        switch (weather.main) {
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
                if (weather.description === 'few clouds' || weather.description === 'scattered clouds') {
                    iconName = 'weather-partly-cloudy';
                    break;
                } else {
                    iconName = 'weather-cloudy';
                    break;
                }           
            default:
                iconName = 'weather-sunny';
                break;
        }

        return <MaterialCommunityIcons name={iconName} size={100} color="#AFB3BE" />;
    };


    return (
        <View>
            <Text style={styles.title}>Current Weather</Text>
            <View style={styles.iconContainer}>
                {renderWeatherIcon()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        color: 'white',
        fontSize: 20,
    },
    iconContainer: {
        alignItems: 'left',
    },
    error: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default WeatherIndicator;
