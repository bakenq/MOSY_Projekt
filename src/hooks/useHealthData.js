// General Import
import { useEffect, useState } from "react";
import { Platform } from "react-native";

// Android Imports
import { initialize, requestPermission, readRecords } from 'react-native-health-connect';
//import { TimeRangeFilter } from 'react-native-health-connect/lib/typescript/types/base.types';

// iOS Imports
/*
import AppleHealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
} from 'react-native-health';
*/

// iOS Permissions
/*
const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.FlightsClimbed,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
    ],
    write: [],
  },
};
*/

const useHealthData = (date) => {
    //const [hasPermission, setHasPermission] = useState(false);
    const [steps, setSteps] = useState(0);
    const [flights, setFlights] = useState(0);
    const [distance, setDistance] = useState(0);

    // Android - Health Connect
    const readSampleData = async () => {
        // initialize the client
        const isInitialized = await initialize();

        // request permissions
        const grantedPermissions = await requestPermission([
            { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
        ]);

        // check if granted

        const result = await readRecords('ActiveCaloriesBurned', {
            timeRangeFilter: {
                operator: 'between',
                startTime: '2023-01-09T12:00:00.405Z',
                endTime: '2023-01-09T23:53:15.405Z',
            },
        });
        console.log(result);
    };

    useEffect(() => {
        if (Platform.OS != 'android') {
            return;
        }
        readSampleData();
    })

    return { steps, distance, flights };


    // iOS - Heatlh Kit (to be implemented?)
};

export default useHealthData;