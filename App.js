import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AntDesign } from '@expo/vector-icons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import QuestsScreen from './src/screens/QuestsScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import { act } from 'react';

/*
import Value from './src/components/Value';
import RingProgress from './src/components/RingProgress';
*/

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Quests') {
              iconName = 'bars';
            } else if (route.name === 'Achievements') {
              iconName = 'star';
            }

            return <AntDesign name={iconName} size={size} color={color} />;
          },
          headerShown: false,
          tabBarActiveTintColor: '#EE0F55',
          tabBarInactiveTintColor: '#AFB3BE',
          tabBarStyle: {
            backgroundColor: 'black',
            borderTopWidth: 0,
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Quests" component={QuestsScreen} />
        <Tab.Screen name="Achievements" component={AchievementsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


