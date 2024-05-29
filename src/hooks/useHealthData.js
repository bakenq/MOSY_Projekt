import React, { useEffect } from 'react';
import GoogleFit, { Scopes } from 'react-native-google-fit';

const useHealthData = () => {
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
        const opt = {
            startDate: '2024-01-01T00:00:17.971Z', // required
            endDate: new Date().toISOString(), // required
        };

        GoogleFit.getDailyStepCountSamples(opt)
            .then((res) => {
                console.log('Daily steps:', res);
            })
            .catch((err) => {
                console.warn(err);
            });
    };
};

export default useHealthData;