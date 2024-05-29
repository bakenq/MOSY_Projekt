import * as GoogleFit from 'react-native-google-fit';
//import { GoogleSignin } from '@react-native-google-signin/google-signin';

const config = {
    clientID: '111944855602161599787', // From downloaded JSON file
    scopes: [GoogleFit.Scopes.STEP_COUNT_READ], // Request step count access
};

//GoogleSignin.configure(config);
