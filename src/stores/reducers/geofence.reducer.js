import { LiveMapUtils } from '../../utils';
import { GeofenceActions as Actions } from '../actions';

const initialState = {
    geofences: [],
    geofence: {center: {...LiveMapUtils.centerLocation}},
};

export const geofenceReducer = (state = initialState, action) => {
    switch (action.type) {
        case Actions.GET_GEOFENCES:
            return {
                ...state,
                geofences: [...action.payload]
            }
        case Actions.SET_GEOFENCE:
            return {
                ...state,
                geofence: action.payload
            }
        default:
            return state;
    }
};