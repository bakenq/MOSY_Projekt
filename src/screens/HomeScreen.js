import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import Value from '../components/Value';
import RingProgress from '../components/RingProgress';

import useHealthData from '../hooks/useHealthData';


function HomeScreen() {
  const [date, setDate] = useState(new Date()); 
  const { steps, distance, flights } = useHealthData(date);

  console.log(`Steps: ${steps} | Distance: ${distance}m | Flights: ${flights}`);

  const changeDate = (numDays) => {
    const currentDate = new Date(date); // Create copy of current date
    // Update date by adding/subtracting numDays
    currentDate.setDate(currentDate.getDate() + numDays);

    setDate(currentDate); // Update state
  };

    return (
        <View style={styles.container}>
            <RingProgress radius={150} strokeWidth={40} progress={steps / 1000} />
            <View style={styles.values}>
                <Value label="Steps" value={steps.toString()} />
                <Value label="Distance" value={`${(distance / 1000).toFixed(2)} km`} />
                <Value label="Flights Climbed" value={flights.toString()} />
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