import { StyleSheet, Text, View } from 'react-native';

import Achievements from '../components/Achievements';

function AchievementsScreen() {
  return (
    <View style={styles.container}>
      <Achievements steps={10000} />
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
  text: {
    color: 'white',
    alignSelf: 'center',
  },
});

export default AchievementsScreen;