import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const quests = require('../data/quests.json');

const Quests = ({ steps }) => {
  const [userXP, setUserXP] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [completedQuests, setCompletedQuests] = useState([]);

  useEffect(() => {
    // Load user data
    loadData();
    checkQuestCompletion();
  }, []);

  useEffect(() => {
    // Check for quest completion
    checkQuestCompletion();
  }, [steps]);

  useEffect(() => {
    console.log('Updated User XP:', userXP);
    console.log('Updated User Level:', userLevel);
    saveData();
  }, [userXP]);

  const loadData = async () => {
    const xp = await AsyncStorage.getItem('userXP');
    const level = await AsyncStorage.getItem('userLevel');
    const completed = await AsyncStorage.getItem('completedQuests');

    if (xp) setUserXP(parseInt(xp));
    if (level) setUserLevel(parseInt(level));
    if (completed) setCompletedQuests(JSON.parse(completed));
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('userXP', userXP.toString());
      await AsyncStorage.setItem('userLevel', userLevel.toString());
      await AsyncStorage.setItem('completedQuests', JSON.stringify(completedQuests));
      console.log('User Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
    }

  };

  const checkQuestCompletion = () => {
    quests.forEach(quest => {
      if (steps >= quest.targetSteps && !completedQuests.includes(quest.id)) {
        setCompletedQuests([...completedQuests, quest.id]);
        console.log(`Quest ${quest.id} completed!`);
      }
    });
  };

  const claimReward = async (questId) => {
    const quest = quests.find(q => q.id === questId);
    if (quest && completedQuests.includes(questId)) {
      let newXP = userXP + quest.xpReward;
      let newLevel = userLevel;

      // Simple level up logic
      if (newXP >= 1000) {
        newLevel += 1;
        newXP -= 1000;
      }

      console.log(`Claimed ${quest.xpReward} XP from quest ${questId}`);

      // Ensure state updates are applied before saving
      await new Promise(resolve => setTimeout(resolve, 0)); // Wait for next event loop tick

      // Update state once with the new values
      setUserLevel(newLevel);
      setUserXP(newXP);

      // Debugging: Log the updated value from AsyncStorage
      AsyncStorage.getItem('userXP').then(storedXP => {
        console.log(`Stored XP after claiming reward: ${storedXP}`);
      });
    }
  };

  return (
    <View style={styles.container}>
      {quests.map((quest) => (
        <View key={quest.id} style={styles.questItem}>
          <Text style={styles.questDescription}>{quest.description}</Text>
          <Text style={styles.questExp}>Reward: {quest.xpReward} XP</Text>
          {completedQuests.includes(quest.id) ? (
            <TouchableOpacity style={styles.button} onPress={() => claimReward(quest.id)} >
              <Text style={styles.buttonText}>Claim Reward</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.button, styles.buttonDisabled]} disabled={true} >
              <Text style={styles.buttonText}>Quest Incomplete</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  questDescription: {
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
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Quests;