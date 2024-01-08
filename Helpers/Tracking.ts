import BackgroundFetch from 'react-native-background-fetch';
import BackgroundGeolocation from 'react-native-background-geolocation';

export const initBackgroundFetch = async () => {

    BackgroundGeolocation.onLocation(location => {
        console.log("[location] ", location);
    }, error => {
        console.log("[location] ERROR: ", error);
    });

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.onMotionChange(location => {
        console.log("[motionchange] ", location);
    });

    // This handler fires on HTTP responses
    BackgroundGeolocation.onHttp(response => {
        console.log("[http] ", response);
    });

    // This event fires when a change in motion activity is detected
    BackgroundGeolocation.onActivityChange(activityEvent => {
        console.log("[activitychange] ", activityEvent);
    });

    // This event fires when the user toggles location-services authorization
    BackgroundGeolocation.onProviderChange(providerEvent => {
        console.log("[providerchange] ", providerEvent);
    });

    ////
    // 2.  Execute #ready method (required)
    //
    BackgroundGeolocation.ready({
        // Geolocation Config
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 10,
        // Activity Recognition
        stopTimeout: 1,
        // Application config
        debug: true,              // <-- enable this hear debug sounds.
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when app terminated.
        startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
        // HTTP / SQLite config
        url: "http://yourserver.com/locations",
        batchSync: false,       // <-- Set true to sync locations to server in a single HTTP request.
        autoSync: true,         // <-- Set true to sync each location to server as it arrives.
        headers: {              // <-- Optional HTTP headers
            "X-FOO": "bar"
        },
        params: {               // <-- Optional HTTP params
            "auth_token": "maybe_your_server_authenticates_via_token_YES?"
        }
    }, (state) => {
        console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);

        if (!state.enabled) {
            ////
            // 3. Start tracking!
            //
            BackgroundGeolocation.start(function () {
                console.log("- Start success");
            });
        }
    });
};

// You can export other utility functions related to background fetch if needed.
