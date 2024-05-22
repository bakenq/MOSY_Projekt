import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';


const Value = ({ label, value }) => (
  <View>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello!</Text>

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
  },
  label: {
    color: 'white',
    fontSize: 20,
  },
  value: {
    fontSize: 40,
    color: '#AFB3BE',
    fontWeight: '500',
  },
});
