import { Platform } from "react-native";
import { Double } from "react-native/Libraries/Types/CodegenTypes";

interface GPSData {
  latitude: Double;
  longitude: Double;
  userID: any;
  deviceId: any;
  fullAddress: string | null;
  showNearbyOrders: boolean;
  bundleName: string;
  platformTypeId: string;
  gpsAccuracyType: number;
  gpsPingInterval: number;
  deviceParameters: string;
}

export const postUsingGPSMask = (
  latitude: any,
  longitude: any,
  authUserId: string,
  deviceId: string,
  DeviceParams: any
): GPSData => {
  return {
    latitude,
    longitude,
    userID: authUserId,
    deviceId,
    fullAddress: null,
    showNearbyOrders: true,
    bundleName: 'com.verifuel.pod',
    platformTypeId: Platform.OS == 'android' ? '2' : '1',
    gpsAccuracyType: 0,
    gpsPingInterval: 10800,
    deviceParameters: JSON.stringify(DeviceParams),
  };
};

export const postUsingGPS = (
  latitude: number,
  longitude: number,
  authUserId: string,
  deviceId: string,
  DeviceParams: any
): GPSData => {
  return {
    latitude,
    longitude,
    userID: authUserId,
    deviceId,
    fullAddress: null,
    showNearbyOrders: true,
    bundleName: 'com.verifuel.pods',
    platformTypeId: Platform.OS == 'android' ? '2' : '1',
    gpsAccuracyType: 0,
    gpsPingInterval: 10800,
    deviceParameters: JSON.stringify(DeviceParams),
  };
};
