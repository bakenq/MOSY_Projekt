import React, { useState, useEffect } from 'react';
import GoogleFit, { Scopes } from 'react-native-google-fit';

const useHealthData = () => {
    const [steps, setSteps] = useState(0);

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
        const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        //console.log('Start Date:', startDate, 'End Date:', now.toISOString());

        const opt = {
            startDate: startDate, // required
            endDate: now.toISOString(), // required
            
        };
    
        GoogleFit.getDailyStepCountSamples(opt)
            .then((res) => {
                console.log('Daily steps:', res[2].steps[0].value);
                setSteps(res[2].steps[0].value);
            })
            .catch((err) => {
                console.warn(err);
            });
    };

    return { steps };
};

export default useHealthData;