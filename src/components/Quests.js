import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressBar } from 'react-native-paper';


const quests = require('../data/quests.json');

const Quests = ({ steps }) => {
  const [userXP, setUserXP] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [numberOfCompletedQuests, setNumberOfCompletedQuests] = useState(0);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [claimedQuests, setClaimedQuests] = useState([]);

  const isFocused = useIsFocused();

  // Function to clear all data from AsyncStorage
  // (Unused right now, but useful for debugging)
  const clearAllAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage has been cleared!');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  useEffect(() => {
    // Load user data
    loadData();
    resetClaimedQuestsDaily();
  }, []);

  useEffect(() => {
    if (isFocused) {
      resetClaimedQuestsDaily();
    }
  }, [isFocused]);

  useEffect(() => {
    // Check for quest completion
    checkQuestCompletion();
  }, [steps, completedQuests]);

  useEffect(() => {
    // Debugging Logs
    console.log('Updated User XP:', userXP);
    console.log('Updated User Level:', userLevel);
    console.log('Updated Completed Quests:', completedQuests);
    console.log('Updated Claimed Quests:', claimedQuests);

    saveData();
  }, [userXP, userLevel, completedQuests, claimedQuests]); // userXP would probably be enough?


  const loadData = async () => {
    try {
      const xp = await AsyncStorage.getItem('userXP');
      const level = await AsyncStorage.getItem('userLevel');
      const numberOfCompletedQuests = await AsyncStorage.getItem('numberOfCompletedQuests');
      const completed = await AsyncStorage.getItem('completedQuests');
      const claimed = await AsyncStorage.getItem('claimedQuests');

      if (xp) setUserXP(parseInt(xp));
      if (level) setUserLevel(parseInt(level));
      if (numberOfCompletedQuests) setNumberOfCompletedQuests(parseInt(numberOfCompletedQuests));
      if (completed) setCompletedQuests(JSON.parse(completed));
      if (claimed) setClaimedQuests(JSON.parse(claimed));

      console.log('Quests: Loaded XP:', xp);
      console.log('Quests: Loaded Level:', level);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async () => {
    const reset = []; // For debugging
    try {
      await AsyncStorage.setItem('userXP', userXP.toString());
      await AsyncStorage.setItem('userLevel', userLevel.toString());
      await AsyncStorage.setItem('numberOfCompletedQuests', numberOfCompletedQuests.toString());
      await AsyncStorage.setItem('completedQuests', JSON.stringify(completedQuests));
      await AsyncStorage.setItem('claimedQuests', JSON.stringify(claimedQuests));
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

  const isQuestClaimableToday = async (questId) => {
    const today = new Date().toISOString().split('T')[0];
    const questClaimedToday = claimedQuests.some(claim => claim.questId === questId && claim.dateClaimed === today);
    return !questClaimedToday && completedQuests.includes(questId);
  };

  function resetClaimedQuestsDaily() {
    const today = new Date().toISOString().split('T')[0];
    const questsClaimedToday = claimedQuests.filter(claim => claim.dateClaimed === today);
    setClaimedQuests(questsClaimedToday);
  };


  const claimReward = async (questId) => {
    const quest = quests.find(q => q.id === questId);
    // if (claimedQuests.some(claim => claim.questId === questId)) {
    if (!isQuestClaimableToday(questId)) {
      console.log(`Quest ${questId} already claimed!`);

    } else if (quest && completedQuests.includes(questId)) {


      let newXP = userXP + quest.xpReward;
      let newLevel = userLevel;

      // Simple level up logic
      if (newXP >= 1000) {
        newLevel += 1;
        newXP -= 1000;
      }

      const today = new Date().toISOString().split('T')[0];
      const newClaim = { questId, dateClaimed: today };

      console.log(`Claimed ${quest.xpReward} XP from quest ${questId}`);

      // Ensure state updates are applied before saving
      await new Promise(resolve => setTimeout(resolve, 0)); // Wait for next event loop tick

      // Update state once with the new values
      setUserLevel(newLevel);
      setUserXP(newXP);

      // Increment number of completed quests
      setNumberOfCompletedQuests(numberOfCompletedQuests + 1);
      // Add quest to claimed quests with date
      setClaimedQuests([...claimedQuests, newClaim]);


      // Debugging: Log the updated value from AsyncStorage
      AsyncStorage.getItem('userXP').then(storedXP => {
        console.log(`Stored XP after claiming reward: ${storedXP}`);
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      {quests.map((quest) => {
        const progress = Math.min(steps / quest.targetSteps, 1);
        return (
          <View key={quest.id} style={styles.questItem}>
            <Text style={styles.questDescription}>{quest.description}</Text>
            <Text style={styles.questExp}>Reward: {quest.xpReward} XP</Text>
            <ProgressBar progress={progress} color='#EE0F55' style={styles.progressBar} />
            {completedQuests.includes(quest.id) && !claimedQuests.some(claim => claim.questId === quest.id) ? (
              <TouchableOpacity style={styles.button} onPress={() => claimReward(quest.id)} >
                <Text style={styles.buttonText}>Claim Reward</Text>
              </TouchableOpacity>
            ) : claimedQuests.some(claim => claim.questId === quest.id) ? (
              <TouchableOpacity style={[styles.button, styles.buttonClaimed]} disabled={true} >
                <Text style={styles.buttonText}>Reward Claimed</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.button, styles.buttonDisabled]} disabled={true} >
                <Text style={styles.buttonText}>Quest Incomplete</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </ScrollView>
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
    height: 8,
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
  buttonClaimed: {
    backgroundColor: '#0feea8',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Quests;