import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const quests = require('../data/quests.json');

const Quests = ({ steps }) => {
  const [userXP, setUserXP] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [completedQuests, setCompletedQuests] = useState([]);

  useEffect(() => {
    // Load user data
    loadData();
  }, []);

  useEffect(() => {
    // Check for quest completion
    checkQuestCompletion();
  }, [steps]);

  useEffect(() => {
    console.log('Updated User XP:', userXP);
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
      setUserXP(newXP);
      setUserLevel(newLevel);

      saveData();

      // Debugging: Log the updated value from AsyncStorage
      AsyncStorage.getItem('userXP').then(storedXP => {
        console.log(`Stored XP after claiming reward: ${storedXP}`);
      });
    }
  };

  return (
    <View>
      {quests.map((quest) => (
        <View key={quest.id}>
          <Text>{quest.description}</Text>
          {completedQuests.includes(quest.id) && (
            <Button title="Claim Reward" onPress={() => claimReward(quest.id)} />
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
    justifyContent: 'center',
    alignItems: 'center',
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

export default Quests;