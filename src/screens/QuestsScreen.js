import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import { questsData } from '../data/questsData';
import useHealthData from '../hooks/useHealthData';

import Quests from '../components/Quests';

function QuestsScreen() {
  const healthData = useHealthData();

  return (
    <View style={styles.container}>
      <Quests steps={healthData.steps} />
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
  progressBar: {
    flex: 1,
    marginVertical: 8,
  }
});

export default QuestsScreen;