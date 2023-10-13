import axios from "axios";
import { setLoading, handleAxiosError } from "./app.action";
import { API_VEHICLE_URL } from "../../utils/constants";
import { LiveMapUtils, notification } from "../../utils";

export const GET_GEOFENCES = '[LIVEMAP / GEOFENCE PAGE] GET_GEOFENCES';
export const getGeofences = (vehicleId) => {
    const request = axios.get(`${API_VEHICLE_URL}/get/geofence/list/?vehicle=${vehicleId}`);

    return dispatch => {
        dispatch(setLoading(true));
        request.then(response => {
            const { results } = response.data;
            let list = [];
            results.forEach( (item, index) => {
                list.push({
                    ...item,
                    key: index,
                });
            });

            list.sort(function(a, b) {
                if (a.geofence < b.geofence) {
                  return -1;
                } else if (a.geofence > b.geofence) {
                  return 1;
                } else {
                  return 0;
                }
            });

            if (results.length > 2) list = list.slice(0, 2);
            if (results.length < 2) {
                for (let i = 0; i < 2 - results.length; i ++)
                    list.push({
                        key: i + results.length,
                        geofence: 'geofence ' + (i + results.length + 1),
                        type: 'inward',
                        center: LiveMapUtils.centerLocation,
                        radius: 0,
                        status: 'Active',
                        isNew: true
                    })
            }

            Promise.all([
                dispatch({
                    type: GET_GEOFENCES,
                    payload: list
                })
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            handleAxiosError(error, dispatch);
            dispatch(setLoading(false));
        })
    };
};

export const SAVE_GEOFENCE = '[LIVEMAP / GEOFENCE PAGE] SAVE_GEOFENCE';
export const saveGeofence = (data) => {
    let request = null;
    if (data.isNew)
        request = axios.post(`${API_VEHICLE_URL}/create-geofence/`, data);
    else request = axios.put(`${API_VEHICLE_URL}/update-geofence/${data.id}/`, data);

    return (dispatch, getState) => {
        dispatch(setLoading(true));
        request.then(response => {
            const {LiveMap} = getState();
            notification('success', 'Success', 'Geofence saved successfully.');

            Promise.all([
                dispatch(getGeofences(LiveMap.activeVehicle.id))
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            handleAxiosError(error, dispatch);
            dispatch(setLoading(false));
        })
    };
};


export const SET_GEOFENCE_STATE = '[LIVEMAP / GEOFENCE PAGE] SET_GEOFENCE_STATE';
export const setGeofenceState = (id, status) => {
    const request = axios.put(`${API_VEHICLE_URL}/change/status/geofence/${id}/`, {status});

    return (dispatch, getState) => {
        dispatch(setLoading(true));
        request.then(response => {
            const {LiveMap} = getState();
            notification('success', 'Success', 'Geofence Status changed successfully.');

            Promise.all([
                dispatch(getGeofences(LiveMap.activeVehicle.id))
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            handleAxiosError(error, dispatch);
            dispatch(setLoading(false));
        })
    };
};

export const SET_GEOFENCE = '[LIVEMAP / GEOFENCE PAGE] SET_GEOFENCE';
export const setGeofence = (geofence) => {
    return {
        type: SET_GEOFENCE,
        payload: geofence
    }
}