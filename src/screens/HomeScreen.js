import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';

import Value from '../components/Value';
import RingProgress from '../components/RingProgress';

import GoogleFit, { Scopes } from 'react-native-google-fit';
import googleFit from 'react-native-google-fit';

//import useHealthData from '../hooks/useHealthData';


function HomeScreen() {
  const [date, setDate] = useState(new Date());
  const [steps, setSteps] = useState(0);
  //const { steps, granted, error, getStepCount } = useHealthData();
  const { distance, flights } = { distance: 5, flights: 6 };

  useEffect(() => {
    const options = {
        scopes: [
            Scopes.FITNESS_ACTIVITY_READ,
            Scopes.FITNESS_ACTIVITY_WRITE,
            Scopes.FITNESS_LOCATION_READ,
            Scopes.FITNESS_BODY_READ,
        ],
    };

    GoogleFit.authorize(options)
        .then((authResult) => {
            if (authResult.success) {
                console.log('AUTH SUCCESS');
                fetchStepCount();
            } else {
                console.log('AUTH FAILED', authResult.message);
            }
        })
        .catch(() => {
            console.log('AUTH ERROR');
        });
}, []);

const fetchStepCount = () => {
    const opt = {
        startDate: '2024-01-01T00:00:17.971Z', // required
        endDate: new Date().toISOString(), // required
    };

    GoogleFit.getDailyStepCountSamples(opt)
        .then((res) => {
            console.log('Daily steps:', res[2].steps[0].value);
            setSteps(res[2].steps[0].value);
        })
        .catch((err) => {
            console.warn(err);
        });
};

  console.log(`Steps: ${steps} | Distance: ${distance}m | Flights: ${flights}`);

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