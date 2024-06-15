import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import { questsData } from '../data/questsData';

import Quests from '../components/Quests';

function QuestsScreen() {

  return (
    <View style={styles.container}>
      <Quests steps={10400} />
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
  questName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  questGoal: {
    color: '#AFB3BE',
  },
  questExp: {
    color: '#AFB3BE',
  },
  questItem: {
    borderColor: '#AFB3BE',
    borderWidth: 4,
    borderRadius: 15,
    backgroundColor: 'transparent',
    padding: 12,
    marginVertical: 8,
  },
  progressBar: {
    flex: 1,
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#EE0F55',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#AFB3BE',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default QuestsScreen;