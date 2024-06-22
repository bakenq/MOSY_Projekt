import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';

import Achievements from '../components/Achievements';
import useHealthData from '../hooks/useHealthData';

function AchievementsScreen() {
  const healthData = useHealthData();

  return (
    <View style={styles.container}>
      <Achievements steps={healthData.totalSteps} distance={healthData.totalDistance} />
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