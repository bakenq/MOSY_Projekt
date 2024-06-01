import React, { useState, useEffect } from 'react';
import GoogleFit, { Scopes } from 'react-native-google-fit';

const useHealthData = () => {
    const [steps, setSteps] = useState(0);
    const [distance, setDistance] = useState(0);

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
                    fetchStepCount();
                    fetchDistance();
                } else {
                    console.log('AUTH FAILED', authResult.message);
                }
            })
            .catch(() => {
                console.log('AUTH ERROR');
            });
    }, []);

    const fetchStepCount = () => {
        const now = new Date();
        //const oneWeekAgo = new Date();
        //oneWeekAgo.setDate(now.getDate() - 7); // set the date to 7 days ago
        //const startDate = oneWeekAgo.toISOString();
        const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        //console.log('Start Date:', startDate, 'End Date:', now.toISOString());

        const opt = {
            startDate: startDate, // required
            endDate: now.toISOString(), // required         
        };

        GoogleFit.getDailyStepCountSamples(opt)
            .then((res) => {
                console.log('Daily Steps:', res[2].steps[0].value);
                setSteps(res[2].steps[0].value); // set the steps state to fetched data
            })
            .catch((err) => {
                console.warn('Error fetching steps data. No Steps taken today or no data could be fetched.', err);
            });
    };

    const fetchDistance = () => {
        const now = new Date();
        //const oneWeekAgo = new Date();
        //oneWeekAgo.setDate(now.getDate() - 7); // set the date to 7 days ago
        //const startDate = oneWeekAgo.toISOString();
        const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

        const opt = {
            startDate: startDate, // required
            endDate: now.toISOString(), // required       
        };

        GoogleFit.getDailyDistanceSamples(opt)
            .then((res) => {
                console.log('Daily Distance:', res[0].distance, 'meters');
                setDistance(res[0].distance); // set the distance state to fetched data
            })
            .catch((err) => {
                console.warn('Error fetching distance data. No distance data available for today or no data could be fetched.', err);
            });
    };

    return { steps, distance };
};

export default useHealthData;