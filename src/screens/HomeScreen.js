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
  const [completedQuests, setCompletedQuests] = useState([]);
  // Health etc.
  const [date, setDate] = useState(new Date());
  const healthData = useHealthData();
  const [steps, setSteps] = useState(healthData.steps);
  const [distance, setDistance] = useState(healthData.distance);
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
    setDistance(healthData.distance);
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
    console.log('Updated Completed Quests:', completedQuests);
  }, [userXP, userLevel]);

  const loadData = async () => {
    const xp = await AsyncStorage.getItem('userXP');
    const level = await AsyncStorage.getItem('userLevel');
    const completed = await AsyncStorage.getItem('completedQuests');

    if (xp) setUserXP(parseInt(xp));
    if (level) setUserLevel(parseInt(level));
    if (completed) setCompletedQuests(JSON.parse(completed));
  };

  // Load health data
  /*
  useEffect(() => {
    setSteps(healthData.steps);
    setDistance(healthData.distance);
    console.log(`Steps: ${steps} | Distance: ${distance}m`);
  }, [healthData]);
  */

  // currently unused
  const changeDate = (numDays) => {
    const currentDate = new Date(date); // Create copy of current date
    // Update date by adding/subtracting numDays
    currentDate.setDate(currentDate.getDate() + numDays);

    setDate(currentDate); // Update state
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
        <Value label="Quests Completed" value='0' />
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
    gap: 25,
    flexWrap: 'wrap',
    marginTop: 100,
  },
  level: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 25,
    flexWrap: 'wrap',
    marginTop: 20,
  },
});

export default HomeScreen;