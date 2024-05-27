import { StyleSheet, Text, View } from 'react-native';

function AchievementsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Achievements!</Text>
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
  text: {
    color: 'white',
    alignSelf: 'center',
  },
});

export default AchievementsScreen;