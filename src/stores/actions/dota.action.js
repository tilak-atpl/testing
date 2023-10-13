import axios from "axios";
import moment from "moment";
import { setLoading, handleAxiosError } from "./app.action";
import { API_DATASET_URL, API_TES_URL, API_TEST_URL } from "../../utils/constants";

export const SET_ECU_TAB = '[LIVEMAP / DOTA PAGE] SET_ECU_TAB';
export const setEcuTab = (ecuTab) => {
    return {
        type: SET_ECU_TAB,
        payload: ecuTab
    }
};

export const SEND_TRANSMIT = '[LIVEMAP / DOTA PAGE] SEND_TRANSMIT';
export const sendTransmit = (imei, commands) => {
    const trp = JSON.parse(localStorage.getItem("trp")) || ""

    // const data = [trp.tx_header, trp.rx_header, trp.protocol];
    const data = `{${trp.tx_header},${trp.rx_header},${trp.protocol}}`;

    const request = axios.post(`${API_TES_URL}/commands/diagnostics`, { imei: '862493050335194', commands:data});

    return dispatch => {
        dispatch(setLoading(true));

        request.then(response => {
            const {success, commands, error} = response.data;

            Promise.all([
                dispatch(setTerminalAppLog({
                    color: success ? 'green' : 'red',
                    log: `Receive: ${success ? commands.slice(1, commands.length - 1) : error}`,
                    timestamp: moment().format('YYYY-MM-DD HH:mm:ss')}))
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            dispatch(setTerminalAppLog({
                color: 'red',
                log: `Receive: ${error.response.data.error}`,
                timestamp: moment().format('YYYY-MM-DD HH:mm:ss')}));
            handleAxiosError(error, dispatch);
            dispatch(setLoading(false));
        })
    };
};

export const GET_DTC_DATASET = '[LIVEMAP / DOTA PAGE] GET_DTC_DATASET';
export const getDtcDataset = (datasetId) => {
    const request = axios.get(`${API_DATASET_URL}/get-dtc-datasets/?id=${datasetId}`);

    return dispatch => {
        dispatch(setLoading(true));

        request.then(response => {
            const { dtc_code } = response.data.results[0];

            Promise.all([
                dispatch({
                    type: GET_DTC_DATASET,
                    payload: dtc_code
                })
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            handleAxiosError(error, dispatch);
            dispatch(setLoading(false));
        })
    };
};

export const fetchDatasetOptions = (pid) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const request = await axios.get(`${API_DATASET_URL}/get-pid-datasets/?id=${pid}`);
        const res = request.data.results[0]
        dispatch(setLoading(false));
        return res ? res.codes : [];
    } catch (error) {
        handleAxiosError(error, dispatch);
        dispatch(setLoading(false));
    }
};
export const GET_PID_DATASET = '[LIVEMAP / DOTA PAGE] GET_PID_DATASET';
export const getPidDataset = (pid) => {
    const request = axios.get(`${API_DATASET_URL}/get-pid-datasets/?id=${pid}`);

    return dispatch => {
        dispatch(setLoading(true));
        request.then(response => {
            const { codes } = response.data.results[0];
            let list = codes;
            list = list.map( (item, index) => (
                {
                    ...item,
                    key: index,
                    label: item.pi_code_variable[0].short_name
                }
            ))

            Promise.all([
                dispatch({
                    type: GET_PID_DATASET,
                    payload: list
                })
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            handleAxiosError(error, dispatch);
            dispatch(setLoading(false));
        })
    };
};


export const GET_LIVE_PARAMS = '[LIVEMAP / DOTA PAGE] GET_LIVE_PARAMS';
export const getLiveParams = (pid) => {
    const request = axios.get(`${API_DATASET_URL}/get-pid-datasets/?id=${pid}`);

    return dispatch => {
        dispatch(setLoading(true));
        request.then(response => {
            const { codes } = response.data.results[0];
            let list = codes.filter( code => code.read );
            list = list.map( (item, index) => (
                {
                    ...item,
                    key: index,
                    label: item.pi_code_variable[0].short_name
                }
            ))

            Promise.all([
                dispatch({
                    type: GET_LIVE_PARAMS,
                    payload: list
                })
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            handleAxiosError(error, dispatch);
            dispatch(setLoading(false));
        })
    };
};

export const GET_WRITE_PARAMS = '[LIVEMAP / DOTA PAGE] GET_WRITE_PARAMS';
export const getWriteParams = (pid) => {
    const request = axios.get(`${API_DATASET_URL}/get-pid-datasets/?id=${pid}`);

    return dispatch => {
        dispatch(setLoading(true));
        request.then(response => {
            const { codes } = response.data.results[0];
            let list = codes.filter( code => code.write );
            list = list.map( (item, index) => (
                {
                    ...item,
                    key: index,
                    label: item.pi_code_variable[0].short_name
                }
            ))
            Promise.all([
                dispatch({
                    type: GET_WRITE_PARAMS,
                    payload: list
                })
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            handleAxiosError(error, dispatch);
            dispatch(setLoading(false));
        })
    };
};
export const GET_ECU_INFOS = '[LIVEMAP / DOTA PAGE] GET_ECU_INFOS';
export const getEcuInfos = (pid) => {
    const request = axios.get(`${API_DATASET_URL}/get-pid-datasets/?id=${pid}`);

    return dispatch => {
        dispatch(setLoading(true));
        request.then(response => {
            const { codes } = response.data.results[0];
            let list = codes.filter( code => code.ecu_info );
            list = list.map( (item, index) => (
                {
                    ...item,
                    key: index,
                    label: item.pi_code_variable[0].short_name
                }
            ))
            Promise.all([
                dispatch({
                    type: GET_ECU_INFOS,
                    payload: list
                })
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            handleAxiosError(error, dispatch);
            dispatch(setLoading(false));
        })
    };
};


export const GET_LIVEPARAM_GROUP_LIST = '[LIVEMAP / DOTA PAGE] GET_LIVEPARAM_GROUP_LIST';
export const getLiveParamGroupList = (pid) => {
    const request = axios.get(`${API_DATASET_URL}/get-pid-datasets/?id=${pid}`);

    return dispatch => {
        dispatch(setLoading(true));
        request.then(response => {
            const { codes } = response.data.results[0];

            let list = [];
            codes.forEach(code => {
                code.pi_code_variable[0].group.forEach(group => {
                    let i;
                    for (i = 0; i < list.length; i ++)
                        if (list[i].id === group.id)
                            break;
                    if (i === list.length)
                        list.push(group);
                });
            });

            list = list.map( (item, index) => (
                {
                    ...item,
                    key: index,
                    label: item.value
                }
            ));

            Promise.all([
                dispatch({
                    type: GET_LIVEPARAM_GROUP_LIST,
                    payload: list
                })
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            handleAxiosError(error, dispatch);
            dispatch(setLoading(false));
        })
    };
};

export const GET_ACTUATOR_TEST = '[LIVEMAP / DOTA PAGE] GET_ACTUATOR_TEST';
export const getActuatorTest = (id, ecuId) => {
    const request = axios.get(`${API_TEST_URL}/actuator-test-list/?sub_model=${id}`);

    return dispatch => {
        dispatch(setLoading(true));
        request.then(response => {
            const { results } = response.data;
            let list = [];
            results.forEach( (item, index) => {
                if (item.ecu === ecuId)
                    list.push({
                        ...item,
                        key: index,
                        label: item.actuator_name
                    });
            });
            Promise.all([
                dispatch({
                    type: GET_ACTUATOR_TEST,
                    payload: list
                })
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            handleAxiosError(error, dispatch);
            dispatch(setLoading(false));
        })
    };
}

export const GET_ROUTINE_TEST = '[LIVEMAP / DOTA PAGE] GET_ROUTINE_TEST';
export const getRoutineTest = (id, ecuId) => {
    const request = axios.get(`${API_TEST_URL}/ior-test-list/?sub_model=${id}`);

    return dispatch => {
        dispatch(setLoading(true));
        request.then(response => {
            const { results } = response.data;
            let list = [];
            results.forEach( (item, index) => {
                if (item.ecu.id === ecuId) {
                    let subList = [], modified = {...item, key: index};
                    modified.ior_test_routine.forEach( subItem => {
                        subList.push({
                            ...subItem,
                            status: 'start'
                        })
                    })
                    list.push({
                        ...item,
                        key: index,
                        label: item.routine_name,
                        ior_test_routine: [...subList]
                    });
                }
            });
            Promise.all([
                dispatch({
                    type: GET_ROUTINE_TEST,
                    payload: list
                })
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            handleAxiosError(error, dispatch);
            dispatch(setLoading(false));
        })
    };
}

export const SET_LIVE_PARAMS = '[LIVEMAP / DOTA PAGE] SET_LIVE_PARAMS';
export const setLiveParams = (list) => {
    return {
        type: SET_LIVE_PARAMS,
        payload: list
    }
}
export const SET_WRITE_PARAM_ID = '[LIVEMAP / DOTA PAGE] SET_WRITE_PARAM_ID';
export const setWriteParamId = (id) => {
    return {
        type: SET_WRITE_PARAM_ID,
        payload: id
    }
}
export const SET_ACTUATOR_TEST_ID = '[LIVEMAP / DOTA PAGE] SET_ACTUATOR_TEST_ID';
export const setActuatorTestId = (id) => {
    return {
        type: SET_ACTUATOR_TEST_ID,
        payload: id
    }
}
export const SET_ROUTINE_TEST_ID = '[LIVEMAP / DOTA PAGE] SET_ROUTINE_TEST_ID';
export const setRoutineTestId = (id) => {
    return {
        type: SET_ROUTINE_TEST_ID,
        payload: id
    }
}
export const SET_FLASHING_ID = '[LIVEMAP / DOTA PAGE] SET_FLASHING_ID';
export const setFlashingId = (id) => {
    return {
        type: SET_FLASHING_ID,
        payload: id
    }
}
export const SET_ROUTINE_TEST = '[LIVEMAP / DOTA PAGE] SET_ROUTINE_TEST';
export const setRoutineTest = (list) => {
    return {
        type: SET_ROUTINE_TEST,
        payload: list
    }
}

export const SET_TERMINAL_APP_LOG = '[LIVEMAP / DOTA PAGE] SET_TERMINAL_APP_LOG';
export const setTerminalAppLog = ({color, log, timestamp}) => {
    return {
        type: SET_TERMINAL_APP_LOG,
        payload: {color, label: timestamp, children: <div className='pl-3'> {log} </div>, text: log}
    }
}
export const CLEAR_TERMINAL_APP_LOG = '[LIVEMAP / DOTA PAGE] CLEAR_TERMINAL_APP_LOG';
export const clearTerminalAppLog = () => {
    return {
        type: CLEAR_TERMINAL_APP_LOG
    }
}