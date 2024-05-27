import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import Value from '../components/Value';
import RingProgress from '../components/RingProgress';

function HomeScreen() {
    return (
        <View style={styles.container}>
            <RingProgress radius={150} strokeWidth={40} progress={0.3} />
            <View style={styles.values}>
                <Value label="Steps" value="1219" />
                <Value label="Distance" value="0,75 km" />
                <Value label="Flights Climbed" value="12" />
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