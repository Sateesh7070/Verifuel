import BackgroundFetch from 'react-native-background-fetch';
import BackgroundGeolocation from 'react-native-background-geolocation';
import { Alert } from "react-native";

export const initBackgroundFetch = async (locationCallback) => {
    const [location, setLocation] = useState(defaultLocation);


    BackgroundGeolocation.onLocation(location => {
        //Alert.alert(location.toString());
        console.log("[location] ", location);
        if (locationCallback) {
            locationCallback(location);
        }
    }, error => {
        console.log("[location] ERROR: ", error);
    });

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.onMotionChange(location => {
        //Alert.alert(location.toString());
        console.log("[motionchange] ", location);
    });

    // This handler fires on HTTP responses
    BackgroundGeolocation.onHttp((response) => {
        let status = response.status;
        let success = response.success;
        let responseText = response.responseText;
        console.log("[onHttp] ", response);
    });

    // This event fires when a change in motion activity is detected
    BackgroundGeolocation.onActivityChange(activityEvent => {
        console.log("[activitychange] ", activityEvent);
    });

    BackgroundGeolocation.onProviderChange((event) => {
        console.log("[onProviderChange: ", event);

        switch (event.status) {
            case BackgroundGeolocation.AUTHORIZATION_STATUS_DENIED:
                // Android & iOS
                console.log("- Location authorization denied");
                break;
            case BackgroundGeolocation.AUTHORIZATION_STATUS_ALWAYS:
                // Android & iOS
                console.log("- Location always granted");
                break;
            case BackgroundGeolocation.AUTHORIZATION_STATUS_WHEN_IN_USE:
                // iOS only
                console.log("- Location WhenInUse granted");
                break;
        }
    });

    BackgroundGeolocation.onHeartbeat((event) => {
        console.log("[onHeartbeat] ", event);

        // You could request a new location if you wish.
        BackgroundGeolocation.getCurrentPosition({
            samples: 1,
            persist: true
        }).then((location) => {
            console.log("[getCurrentPosition] ", location);
        });
    })

    BackgroundGeolocation.onGeofence((event) => {
        console.log("[onGeofence] ", event);
    });

    BackgroundGeolocation.onGeofencesChange((event) => {
        let on = event.on;     //<-- new geofences activated.
        let off = event.off; //<-- geofences that were just de-activated.

        // // Create map circles
        on.forEach((geofence) => {
            createGeofenceMarker(geofence)
        });

        // // Remove map circles
        off.forEach((identifier) => {
            removeGeofenceMarker(identifier);
        })
    });

    BackgroundGeolocation.onSchedule((state) => {
        if (state.enabled) {
            console.log("[onSchedule] scheduled start tracking");
        } else {
            console.log("[onSchedule] scheduled stop tracking");
        }
    });



    BackgroundGeolocation.onConnectivityChange((event) => {
        console.log("[onConnectivityChange] ", event);
    });
    BackgroundGeolocation.onPowerSaveChange((isPowerSaveMode) => {
        console.log("[onPowerSaveChange: ", isPowerSaveMode);
    });

    BackgroundGeolocation.onEnabledChange(isEnabled => {
        console.log("[onEnabledChanged] isEnabled? ", isEnabled);
    });
    BackgroundGeolocation.onAuthorization((event) => {
        if (event.success) {
            console.log("[authorization] ERROR: ", event.error);
        } else {
            console.log("[authorization] SUCCESS: ", event.response);
        }
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
        heartbeatInterval: 60,
        preventSuspend: true,
        // Application config
        //debug: true,              // <-- enable this hear debug sounds.
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
