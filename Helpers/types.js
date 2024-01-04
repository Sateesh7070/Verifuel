/**
 * @format
 * @flow
 */

export const AppState = 'active' | 'background' | 'inactive';

export const Location = {
  // From Geolocation
  accuracy: number,
  altitude: number,
  altitudeAccuracy: number,
  course: number,
  floor: number,
  latitude: number,
  longitude: number,
  speed: number,
  timestamp: number,
};

export const Position = {
  accuracy: number,
  lat: number,
  lng: number,
  timestamp: number,
};

export const TimingState = {
  granted : false,
  position: Position,
  running: boolean,
};

export const TimingActionType = ['Start', 'Stop', 'LocationRequested', 'UpdatePosition'];

export const TimingAction = {
  type: TimingActionType,
  position : false,
  granted : false,
};

