import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';

import Value from '../components/Value';
import RingProgress from '../components/RingProgress';

import useHealthData from '../hooks/useHealthData';


const HomeScreen = () => {
  const [date, setDate] = useState(new Date());
  const healthData = useHealthData();
  const [steps, setSteps] = useState(healthData.steps);
  const [distance, setDistance] = useState(healthData.distance);
  const stepLength = 0.762; // Average step length in meters
  //const distance = steps * stepLength; // convert steps to distance

  useEffect(() => {
    setSteps(healthData.steps);
    setDistance(healthData.distance);
    console.log(`Steps: ${steps} | Distance: ${distance}m`);
  }, [healthData]);

  const changeDate = (numDays) => {
    const currentDate = new Date(date); // Create copy of current date
    // Update date by adding/subtracting numDays
    currentDate.setDate(currentDate.getDate() + numDays);

    setDate(currentDate); // Update state
  };

  return (
    <View style={styles.container}>
      <RingProgress radius={150} strokeWidth={40} progress={steps / 6000} />
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
});

export default HomeScreen;