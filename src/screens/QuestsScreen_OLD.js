import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import { questsData } from '../data/questsData';

function QuestsScreen() {
  const buttonIsDisabled = true; // Replace with actual condition

  const renderQuestItem = ({ item }) => (
    <View style={styles.questItem}>
      <Text style={styles.questName}>{item.name}</Text>
      <Text style={styles.questGoal}>{item.goal}</Text>
      <Text style={styles.questExp}>{`EXP: ${item.expReward}`}</Text>
      <Progress.Bar
        style={styles.progressBar}
        progress={0.6}
        color="#EE0F55"
        width={null}
        height={15}
        borderWidth={2}
        animated={true}
        animationType='timing'
      />
      <TouchableOpacity style={buttonIsDisabled ? styles.buttonDisabled : styles.button} disabled={buttonIsDisabled}>
        <Text style={styles.buttonText}>Claim</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={questsData}
        renderItem={renderQuestItem}
        keyExtractor={(item) => item.name}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
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
    backgroundColor: 'white',
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