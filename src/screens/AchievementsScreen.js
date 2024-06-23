import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';

import Achievements from '../components/Achievements';
import useHealthData from '../hooks/useHealthData';

const API_KEY = 'e905c71e69c8a0b6b9bc39934efd9ee9';
const CITY = 'Hamburg'; // Example city


function AchievementsScreen() {
  const healthData = useHealthData();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      //console.log(`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`);
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
        );
        setWeather(response.data.weather[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.text}>Loading Achievements...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Achievements steps={healthData.totalSteps} distance={healthData.totalDistance} currentWeather={weather} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 12,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
    alignSelf: 'center',
  },
});

export default AchievementsScreen;