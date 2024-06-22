import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';

import Value from '../components/Value';
import useHealthData from '../hooks/useHealthData';

const StatsScreen = () => {
    const healthData = useHealthData();

    const [totalSteps, setTotalSteps] = useState(healthData.totalSteps);
    const [totalDistance, setTotalDistance] = useState(healthData.totalDistance);


    useEffect(() => {
        setTotalSteps(healthData.totalSteps);
        setTotalDistance(healthData.totalDistance);
    }, [healthData]);

    return (
        <View style={styles.container}>
            <View style={styles.values}>
                <Value label="Total Steps" value={totalSteps.toString()} />
                <Value label="Total Distance" value={`${(totalDistance / 1000).toFixed(2)} km`} />
                {/*To be implemented*/}
                <Value label="Quests completed" value={"0"} />
                <Value label="Achievements completed" value={"0"} />
            </View>
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
    values: {
        flexDirection: 'row',
        rowGap: 5,
        columnGap: 30,
        flexWrap: 'wrap',
        marginTop: 50,
    },
});

export default StatsScreen;