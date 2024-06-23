import React, { useState, useEffect } from 'react';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useHealthData = () => {
    const [steps, setSteps] = useState(0);
    const [weeklySteps, setWeeklySteps] = useState(0);
    const [totalSteps, setTotalSteps] = useState(0);

    const [distance, setDistance] = useState(0);
    const [weeklyDistance, setWeeklyDistance] = useState(0);
    const [totalDistance, setTotalDistance] = useState(0);

    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const authorize = async () => {
            const options = {
                scopes: [
                    Scopes.FITNESS_ACTIVITY_READ,
                    Scopes.FITNESS_ACTIVITY_WRITE,
                    Scopes.FITNESS_LOCATION_READ,
                    Scopes.FITNESS_BODY_READ,
                ],
            };

            try {
                const authResult = await GoogleFit.authorize(options);
                if (authResult.success) {
                    console.log('AUTH SUCCESS');
                    setIsAuthorized(true);
                    await fetchData(); // Initial fetch for both steps and distance
                } else {
                    console.log('AUTH FAILED', authResult.message);
                    setError('Authorization failed');
                }
            } catch (err) {
                console.log('AUTH ERROR', err);
                setError('Authorization error');
            } finally {
                setLoading(false);
            }
        };

        authorize();
    }, []);

    useEffect(() => {
        if (isAuthorized) {
            const intervalId = setInterval(() => {
                fetchData();
                console.log('Steps/Distance refreshed...');
            }, 180000); // Fetch every 180 seconds

            return () => clearInterval(intervalId); // Cleanup interval on unmount
        }
    }, [isAuthorized]);

    const fetchData = async () => {
        setLoading(true);
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const endDate = now.toISOString();

        try {
            await Promise.all([fetchStepCount(startDate, endDate), fetchDistance(startDate, endDate), fetchWeeklySteps(), fetchWeeklyDistance()]);
        } catch (err) {
            console.warn('Error fetching health data:', err);
            setError('Error fetching health data');
        } finally {
            setLoading(false);
        }
    };

    const fetchStepCount = async (startDate, endDate) => {
        const opt = { startDate, endDate };

        try {
            const res = await GoogleFit.getDailyStepCountSamples(opt);
            const dailySteps = res[2]?.steps[0]?.value || 0;

            const storedTotalSteps = await AsyncStorage.getItem('totalSteps');
            const storedLastSteps = await AsyncStorage.getItem('lastSteps');
            const storedLastFetchedDate = await AsyncStorage.getItem('lastFetchedDate');

            const totalSteps = storedTotalSteps ? parseInt(storedTotalSteps) : 0;
            const lastSteps = storedLastSteps ? parseInt(storedLastSteps) : 0;

            console.log(dailySteps, lastSteps, dailySteps > lastSteps);
            if (storedLastFetchedDate !== startDate) {
                const newTotal = totalSteps + dailySteps;
                setTotalSteps(newTotal);
                await AsyncStorage.setItem('totalSteps', newTotal.toString());
                await AsyncStorage.setItem('lastFetchedDate', startDate);
                await AsyncStorage.setItem('lastSteps', dailySteps.toString());
            } else if (dailySteps > lastSteps) {
                const newTotal = totalSteps + (dailySteps - lastSteps);
                setTotalSteps(newTotal);
                await AsyncStorage.setItem('totalSteps', newTotal.toString());
                await AsyncStorage.setItem('lastSteps', dailySteps.toString());
            } else {
                if (dailySteps > 0) {
                    await AsyncStorage.setItem('lastSteps', dailySteps.toString());
                    setTotalSteps(totalSteps);
                }
            }

            setSteps(dailySteps);
        } catch (err) {
            console.warn('Error fetching steps data:', err);
            throw err;
        }
    };

    const fetchDistance = async (startDate, endDate) => {
        const opt = { startDate, endDate };

        try {
            const res = await GoogleFit.getDailyDistanceSamples(opt);
            const dailyDistance = res[0]?.distance || 0;

            const storedTotalDistance = await AsyncStorage.getItem('totalDistance');
            const storedLastDistance = await AsyncStorage.getItem('lastDistance');
            const storedLastFetchedDateDistance = await AsyncStorage.getItem('lastFetchedDateDistance');

            const totalDistance = storedTotalDistance ? parseFloat(storedTotalDistance) : 0;
            const lastDistance = storedLastDistance ? parseFloat(storedLastDistance) : 0;

            console.log(dailyDistance, lastDistance, dailyDistance > lastDistance);
            if (storedLastFetchedDateDistance !== startDate) {
                const newTotalDistance = totalDistance + dailyDistance;
                setTotalDistance(newTotalDistance);
                await AsyncStorage.setItem('totalDistance', newTotalDistance.toString());
                await AsyncStorage.setItem('lastFetchedDateDistance', startDate);
                await AsyncStorage.setItem('lastDistance', dailyDistance.toString());
            } else if (dailyDistance > lastDistance) {
                const newTotalDistance = totalDistance + (dailyDistance - lastDistance);
                setTotalDistance(newTotalDistance);
                await AsyncStorage.setItem('totalDistance', newTotalDistance.toString());
                await AsyncStorage.setItem('lastDistance', dailyDistance.toString());
            } else {
                if (dailyDistance > 0) {
                    await AsyncStorage.setItem('lastDistance', dailyDistance.toString());
                    setTotalDistance(totalDistance);
                }
            }

            setDistance(dailyDistance);
        } catch (err) {
            console.warn('Error fetching distance data:', err);
            throw err;
        }
    };

    const fetchWeeklySteps = async () => {
        const now = new Date();
        const startDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
        const endDate = new Date().toISOString();

        const opt = { startDate, endDate };

        try {
            const res = await GoogleFit.getDailyStepCountSamples(opt);
            const weeklySteps = res[2]?.steps.reduce((total, day) => total + day.value, 0) || 0;
            setWeeklySteps(weeklySteps);
        } catch (err) {
            console.warn('Error fetching weekly steps data:', err);
            throw err;
        }
    };

    const fetchWeeklyDistance = async () => {
        const now = new Date();
        const startDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
        const endDate = new Date().toISOString();

        const opt = { startDate, endDate };

        try {
            const res = await GoogleFit.getDailyDistanceSamples(opt);
            const weeklyDistance = res.reduce((total, day) => total + day.distance, 0) || 0;
            setWeeklyDistance(weeklyDistance);
        } catch (err) {
            console.warn('Error fetching weekly distance data:', err);
            throw err;
        }
    };

    return { steps, weeklySteps, totalSteps, distance, weeklyDistance, totalDistance, loading, error };
};

export default useHealthData;
