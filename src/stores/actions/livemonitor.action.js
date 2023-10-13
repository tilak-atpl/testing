import axios from "axios";
import { setLoading, handleAxiosError } from "./app.action";
import { notification } from "../../utils";
import { API_LMONITOR_URL, API_VEHICLE_URL } from "../../utils/constants";

export const GET_LIVE_MONITOR_PARAMS = '[LIVEMAP / LIVE MONITOR PAGE] GET_LIVE_MONITOR_PARAMS';
export const getLMonitorParams = (data, type) => {
    let request = null;
    if (type === 'vreg_id')
        request = axios.get(`${API_VEHICLE_URL}/live-monitor-parameter/?registration_id=${data}`);
    else if (type === 'param_group')
        request = axios.get(`${API_VEHICLE_URL}/live-monitor-parameter/?parameter_group=${data}`);

    return dispatch => {
        dispatch(setLoading(true));

        request.then(response => {
            const { results } = response.data;
            let list = [];
            let i = 0;
            results.forEach( (item) => {
                item[item.parameter_type.toLowerCase() + '_parameter'].forEach( (param) => {
                    list.push({
                        id: item.id + '-' + param.id,
                        _id: param.id,
                        key: i ++,
                        label: item.parameter_type === 'Telematic' ? param.short_name : (item.parameter_type === 'IVN' ? param.pid_description : param.spn),
                        param_type: item.parameter_type,
                        param_id: item.id,
                        param_group_id: item.parameter_group[0]?.id,
                        param_group_name: item.parameter_group[0]?.group_name,
                        param_group_color: item.parameter_group[0]?.color
                    });
                });
            });

            Promise.all([
                dispatch({
                    type: GET_LIVE_MONITOR_PARAMS,
                    payload: list
                })
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            handleAxiosError(error, dispatch);
            dispatch(setLoading(false));
        });
    };
};

export const SAVE_LIVE_MONITOR_PARAM = '[LIVEMAP / LIVE MONITOR PAGE] SAVE_LIVE_MONITOR_PARAM';
export const saveLMonitorParam = (data, isNew, paramId) => {
    let request = null;
    if (isNew)
        request = axios.post(`${API_VEHICLE_URL}/create-live-monitor-parameters/`, data);
    else request = axios.put(`${API_VEHICLE_URL}/update-live-monitor-parameters/${paramId}/`, data);

    return (dispatch, getState) => {
        dispatch(setLoading(true));

        request.then(response => {
            const {LiveMap} = getState();

            notification('success', 'Success', 'Param saved successfully.');
            Promise.all([
                dispatch(getLMonitorParams(LiveMap.activeVehicle.registration_id, 'vreg_id'))
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            handleAxiosError(error, dispatch);
            dispatch(setLoading(false));
        });
    };
};

export const DELETE_LIVE_MONITOR_PARAM = '[LIVEMAP / LIVE MONITOR PAGE] DELETE_LIVE_MONITOR_PARAM';
export const deleteLMonitorParam = (paramId) => {
    const request = axios.delete(`${API_VEHICLE_URL}/update-live-monitor-parameters/${paramId}/`);

    return (dispatch, getState) => {
        dispatch(setLoading(true));

        request.then(response => {
            const {LiveMap} = getState();

            notification('success', 'Success', 'Param deleted successfully.');
            Promise.all([
                dispatch(getLMonitorParams(LiveMap.activeVehicle.registration_id, 'vreg_id'))
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            handleAxiosError(error, dispatch);
            dispatch(setLoading(false));
        });
    };
};


export const GET_LIVE_MONITOR_PARAM_GROUPS = '[LIVEMAP / LIVE MONITOR PAGE] GET_LIVE_MONITOR_PARAM_GROUPS';
export const getLMonitorParamGroups = (userId) => {
    const request = axios.get(`${API_VEHICLE_URL}/parameter-group/list/?user_id=${userId}`);

    return dispatch => {
        dispatch(setLoading(true));

        request.then(response => {
            const { results } = response.data;
            let list = [];
            results.forEach( (item, index) => {
                list.push({
                    ...item,
                    key: index,
                    label: item.group_name
                });
            });

            Promise.all([
                dispatch({
                    type: GET_LIVE_MONITOR_PARAM_GROUPS,
                    payload: list
                })
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            handleAxiosError(error, dispatch);
            dispatch(setLoading(false));
        });
    };
};

export const SAVE_LIVE_MONITOR_PARAM_GROUP = '[LIVEMAP / LIVE MONITOR PAGE] SAVE_LIVE_MONITOR_PARAM_GROUP';
export const saveLMonitorParamGroup = (data, isNew, groupId) => {
    let request = null;
    if (isNew)
        request = axios.post(`${API_VEHICLE_URL}/add/parameter-group/`, data);
    else request = axios.put(`${API_VEHICLE_URL}/parameter-group/update/${groupId}/`, data);

    return (dispatch, getState) => {
        dispatch(setLoading(true));

        request.then(response => {
            const {User} = getState();

            notification('success', 'Success', 'Param Group saved successfully.');
            Promise.all([
                dispatch(getLMonitorParamGroups(User.userId))
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            handleAxiosError(error, dispatch);
            dispatch(setLoading(false));
        });
    };
};

export const DELETE_LIVE_MONITOR_PARAM_GROUP = '[LIVEMAP / LIVE MONITOR PAGE] DELETE_LIVE_MONITOR_PARAM_GROUP';
export const deleteLMonitorParamGroup = (groupId) => {
    const request = axios.delete(`${API_VEHICLE_URL}/parameter-group/list/${groupId}/`);

    return (dispatch, getState) => {
        dispatch(setLoading(true));

        request.then(response => {
            const {User} = getState();

            notification('success', 'Success', 'Param Group saved successfully.');
            Promise.all([
                dispatch(getLMonitorParamGroups(User.userId))
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            handleAxiosError(error, dispatch);
            dispatch(setLoading(false));
        });
    };
};

export const GET_TELEMATIC_PARAMS = '[LIVEMAP / LIVE MONITOR PAGE] GET_TELEMATIC_PARAMS';
export const getTelematicParams = () => {
    const request = axios.get(`${API_LMONITOR_URL}/parameter/`);

    return dispatch => {
        dispatch(setLoading(true));

        request.then(response => {
            const { results } = response.data;
            let list = [];
            results.forEach( (item, index) => {
                list.push({
                    ...item,
                    key: index,
                    label: item.short_name
                });
            });

            Promise.all([
                dispatch({
                    type: GET_TELEMATIC_PARAMS,
                    payload: list
                })
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            handleAxiosError(error, dispatch);
            dispatch(setLoading(false));
        });
    };
};
export const GET_J1939_PARAMS = '[LIVEMAP / LIVE MONITOR PAGE] GET_J1939_PARAMS';
export const getJ1939Params = () => {
    const request = axios.get(`${API_LMONITOR_URL}/j1939/parameter/`);

    return dispatch => {
        dispatch(setLoading(true));

        request.then(response => {
            const { results } = response.data;
            let list = [];
            results.forEach( (item, index) => {
                list.push({
                    ...item,
                    key: index,
                    label: item.spn
                });
            });

            Promise.all([
                dispatch({
                    type: GET_J1939_PARAMS,
                    payload: list
                })
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            handleAxiosError(error, dispatch);
            dispatch(setLoading(false));
        });
    };
};
export const GET_IVN_PARAMS = '[LIVEMAP / LIVE MONITOR PAGE] GET_IVN_PARAMS';
export const getIvnParams = () => {
    const request = axios.get(`${API_LMONITOR_URL}/ivn/parameter/`);

    return dispatch => {
        dispatch(setLoading(true));

        request.then(response => {
            const { results } = response.data;
            let list = [];
            let i = 0;
            results.forEach( item => {
                item.pid_frame[0].frame_ids.forEach( subItem => {
                    list.push({
                        ...subItem,
                        key: i ++,
                        label: subItem.pid_description
                    });    
                })
            });

            Promise.all([
                dispatch({
                    type: GET_IVN_PARAMS,
                    payload: list
                })
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            handleAxiosError(error, dispatch);
            dispatch(setLoading(false));
        });
    };
};
