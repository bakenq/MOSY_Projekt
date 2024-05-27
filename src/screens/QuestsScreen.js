import { StyleSheet, Text, View } from 'react-native';

function QuestsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Quests!</Text>
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

export default QuestsScreen;