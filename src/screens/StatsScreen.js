import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Value from '../components/Value';
import WeeklyStepsChart from '../components/WeeklyStepsChart';
import useHealthData from '../hooks/useHealthData';

const StatsScreen = () => {
    const healthData = useHealthData();

    const [weeklySteps, setWeeklySteps] = useState(healthData.weeklySteps);
    const [weeklyStepsDays, setWeeklyStepsDays] = useState(healthData.dailySteps);
    const [weeklyDistance, setWeeklyDistance] = useState(healthData.weeklyDistance);

    const [totalSteps, setTotalSteps] = useState(healthData.totalSteps);
    const [totalDistance, setTotalDistance] = useState(healthData.totalDistance);

    const [numberOfCompletedQuests, setNumberOfCompletedQuests] = useState(0);


    // Call once on mount
    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        setWeeklySteps(healthData.weeklySteps);
        setWeeklyStepsDays(healthData.dailySteps);
        setWeeklyDistance(healthData.weeklyDistance);

        setTotalSteps(healthData.totalSteps);
        setTotalDistance(healthData.totalDistance);
    }, [healthData]);

    useEffect(() => {
        loadData();
    }, [numberOfCompletedQuests]);

    const loadData = async () => {
        try {
            const numberOfCompletedQuests = await AsyncStorage.getItem('numberOfCompletedQuests');

            if (numberOfCompletedQuests) setNumberOfCompletedQuests(parseInt(numberOfCompletedQuests));

        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.chart}>
                <WeeklyStepsChart weeklySteps={weeklyStepsDays} />
            </View>
            <View style={styles.values}>
                <Value label="Weekly Steps" value={weeklySteps.toString()} />
                <Value label="Weekly Distance" value={`${(weeklyDistance / 1000).toFixed(2)} km`} />

                <Value label="Total Steps" value={totalSteps.toString()} />
                <Value label="Total Distance" value={`${(totalDistance / 1000).toFixed(2)} km`} />

                <Value label="Quests completed" value={numberOfCompletedQuests.toString()} />
                {/*To be implemented*/}
                <Value label="Achievements completed" value={"0"} />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding: 12,
    },
    chart: {
        flexDirection: 'column',
        rowGap: 5,
        columnGap: 30,
        flexWrap: 'wrap',
        marginTop: 50,
    },
    values: {
        flexDirection: 'row',
        rowGap: 5,
        columnGap: 30,
        flexWrap: 'wrap',
    },
});

export default StatsScreen;