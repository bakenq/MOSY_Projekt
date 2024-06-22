import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useHealthData = () => {
    const [steps, setSteps] = useState(0);
    const [totalSteps, setTotalSteps] = useState(0);
    const [distance, setDistance] = useState(0);
    const [totalDistance, setTotalDistance] = useState(0);
    const [isAuthorized, setIsAuthorized] = useState(false);

    // Authorize once when the component mounts
    useEffect(() => {
        const options = {
            scopes: [
                Scopes.FITNESS_ACTIVITY_READ,
                Scopes.FITNESS_ACTIVITY_WRITE,
                Scopes.FITNESS_LOCATION_READ,
                Scopes.FITNESS_BODY_READ,
            ],
        };

        GoogleFit.authorize(options)
            .then((authResult) => {
                if (authResult.success) {
                    console.log('AUTH SUCCESS');
                    setIsAuthorized(true);
                    fetchStepCount(); // Initial fetch
                    fetchDistance(); // Initial fetch
                } else {
                    console.log('AUTH FAILED', authResult.message);
                }
            })
            .catch(() => {
                console.log('AUTH ERROR');
            });
    }, []);

    // Fetch data periodically
    useEffect(() => {
        if (isAuthorized) {
            const intervalId = setInterval(() => {
                fetchStepCount();
                fetchDistance();
            }, 60000); // Fetch every 60 seconds

            return () => clearInterval(intervalId); // Cleanup interval on unmount
        }
    }, [isAuthorized]);

    /*
    // Fetching is triggered when screen is focused
    useFocusEffect(
        useCallback(() => {
            const options = {
                scopes: [
                    Scopes.FITNESS_ACTIVITY_READ,
                    Scopes.FITNESS_ACTIVITY_WRITE,
                    Scopes.FITNESS_LOCATION_READ,
                    Scopes.FITNESS_BODY_READ,
                ],
            };

            GoogleFit.authorize(options)
                .then((authResult) => {
                    if (authResult.success) {
                        console.log('AUTH SUCCESS');
                        fetchStepCount();
                        fetchDistance();
                    } else {
                        console.log('AUTH FAILED', authResult.message);
                    }
                })
                .catch(() => {
                    console.log('AUTH ERROR');
                });
        }, [])
    );
    */

    const fetchStepCount = async () => {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const endDate = now.toISOString();
        //console.log('Start Date:', startDate, 'End Date:', now.toISOString());

        const opt = {
            startDate: startDate,
            endDate: endDate,
        };

        try {
            const res = await GoogleFit.getDailyStepCountSamples(opt);
            const dailySteps = res[2]?.steps[0]?.value || 0;

            const storedTotalSteps = await AsyncStorage.getItem('totalSteps');
            const storedLastSteps = await AsyncStorage.getItem('lastSteps');
            const storedLastFetchedDate = await AsyncStorage.getItem('lastFetchedDate');

            const totalSteps = storedTotalSteps ? parseInt(storedTotalSteps) : 0;
            const lastSteps = storedLastSteps ? parseInt(storedLastSteps) : 0;

            if (storedLastFetchedDate !== startDate) {
                // Debug
                console.log('New Day Steps');
                // New day, reset daily steps in storage and add today's steps to total
                const newTotal = totalSteps + dailySteps;
                console.log('New Total Steps:', newTotal);
                setTotalSteps(newTotal);
                await AsyncStorage.setItem('totalSteps', newTotal.toString());
                await AsyncStorage.setItem('lastFetchedDate', startDate);
                await AsyncStorage.setItem('lastSteps', dailySteps.toString());
            } else {
                
                // Same day, update total only if steps increased
                if (dailySteps >= lastSteps) {
                    //console.log(dailySteps, lastSteps);
                    const newTotal = totalSteps + (dailySteps - lastSteps);
                    console.log('New Total Steps:', newTotal);
                    setTotalSteps(newTotal);
                    await AsyncStorage.setItem('totalSteps', newTotal.toString());
                }
                await AsyncStorage.setItem('lastSteps', dailySteps.toString());
            }

            console.log('Daily Steps:', dailySteps);
            setSteps(dailySteps);
        } catch (err) {
            console.warn('Error fetching steps data:', err);
        }

    };

    const fetchDistance = async () => {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const endDate = now.toISOString();

        const opt = {
            startDate: startDate,
            endDate: endDate,
        };

        /*
        GoogleFit.getDailyDistanceSamples(opt)
            .then((res) => {
                console.log('Daily Distance:', res[0].distance, 'meters');
                setDistance(res[0].distance); // set the distance state to fetched data
            })
            .catch((err) => {
                console.warn('Error fetching distance data. No distance data available for today or no data could be fetched.', err);
            });
            */

        try {
            const res = await GoogleFit.getDailyDistanceSamples(opt);
            const dailyDistance = res[0]?.distance || 0;

            const storedTotalDistance = await AsyncStorage.getItem('totalDistance');
            const storedLastDistance = await AsyncStorage.getItem('lastDistance');
            const storedLastFetchedDateDistance = await AsyncStorage.getItem('lastFetchedDateDistance');

            const totalDistance = storedTotalDistance ? parseFloat(storedTotalDistance) : 0;
            const lastDistance = storedLastDistance ? parseFloat(storedLastDistance) : 0;

            if (storedLastFetchedDateDistance !== startDate) {
                // New day, reset daily distance in storage and add today's distance to total
                const newTotalDistance = totalDistance + dailyDistance;
                console.log('New Total Distance:', newTotalDistance);
                setTotalDistance(newTotalDistance);
                await AsyncStorage.setItem('totalDistance', newTotalDistance.toString());
                await AsyncStorage.setItem('lastFetchedDateDistance', startDate);
                await AsyncStorage.setItem('lastDistance', dailyDistance.toString());
            } else {
                // Same day, update total only if distance increased
                if (dailyDistance >= lastDistance) {
                    const newTotalDistance = totalDistance + (dailyDistance - lastDistance);
                    console.log('New Total Distance:', newTotalDistance);
                    setTotalDistance(newTotalDistance);
                    await AsyncStorage.setItem('totalDistance', newTotalDistance.toString());
                }
                await AsyncStorage.setItem('lastDistance', dailyDistance.toString());
            }

            console.log('Daily Distance:', dailyDistance, 'meters');
            setDistance(dailyDistance);
        } catch (err) {
            console.warn('Error fetching distance data:', err);
        }
    };

    return { steps, totalSteps, distance, totalDistance };
};

export default useHealthData;