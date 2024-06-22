import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Value from '../components/Value';
import RingProgress from '../components/RingProgress';

import useHealthData from '../hooks/useHealthData';


const HomeScreen = () => {
  // User data
  const [userXP, setUserXP] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [numberOfCompletedQuests, setNumberOfCompletedQuests] = useState(0);
  const [completedQuests, setCompletedQuests] = useState([]);
  // Health etc.
  const [date, setDate] = useState(new Date());
  const healthData = useHealthData();
  const [steps, setSteps] = useState(healthData.steps);
  const [totalSteps, setTotalSteps] = useState(healthData.totalSteps);
  const [distance, setDistance] = useState(healthData.distance);
  const [totalDistance, setTotalDistance] = useState(healthData.totalDistance);
  const stepLength = 0.762; // Average step length in meters
  //const distance = steps * stepLength; // convert steps to distance

  const isFocused = useIsFocused();

  // Call once on mount
  useEffect(() => {
    loadData();
    console.log('HomeScreen mounted');
  }, []);

  // Call also when health data changes
  // otherwise steps doesn't update correctly
  useEffect(() => {
    setSteps(healthData.steps);
    setTotalSteps(healthData.totalSteps);
    setDistance(healthData.distance);
    setTotalDistance(healthData.totalDistance);
  }, [healthData]);

  // Load user data and health data on mount and when the screen is focused
  useEffect(() => {
    loadData();

    console.log("Rerender triggered")
  }, [isFocused]); // Depend on isFocused to re-run this effect when the screen focus changes

  // Show updated user XP
  useEffect(() => {
    console.log('Updated User XP:', userXP);
    console.log('Updated User Level:', userLevel);
    console.log('Updated Number Completed Quests:', numberOfCompletedQuests);
    loadData();
  }, [userXP, userLevel, numberOfCompletedQuests]);

  const loadData = async () => {
    try {
      const xp = await AsyncStorage.getItem('userXP');
      const level = await AsyncStorage.getItem('userLevel');
      const numberOfCompletedQuests = await AsyncStorage.getItem('numberOfCompletedQuests');
      //const completed = await AsyncStorage.getItem('completedQuests');

      if (xp) setUserXP(parseInt(xp));
      if (level) setUserLevel(parseInt(level));
      if (numberOfCompletedQuests) setNumberOfCompletedQuests(parseInt(numberOfCompletedQuests));
      //Debugging
      //console.log('Home: Loaded XP:', xp);
      //console.log('Home: Loaded Level:', level);
      //if (completed) setCompletedQuests(JSON.parse(completed));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <RingProgress radius={150} strokeWidth={40} progress={userXP / 1000} />
      <View style={styles.level}>
        <Value label="Level" value={userLevel} />
        <Value label="XP" value={`${userXP}/1000`} />
      </View>
      <View style={styles.values}>
        <Value label="Daily Steps" value={steps.toString()} />
        <Value label="Daily Distance" value={`${(distance / 1000).toFixed(2)} km`} />
        <Value label="Quests Completed" value={numberOfCompletedQuests.toString()} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    padding: 12,
  },
  values: {
    flexDirection: 'row',
    rowGap: 5,
    columnGap: 30,
    flexWrap: 'wrap',
    marginTop: 50,
  },
  level: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 25,
    flexWrap: 'wrap',
    marginTop: 5,
  },
});

export default HomeScreen;