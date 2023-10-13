import { DotaActions as Actions } from '../actions';

const initialState = {
    ecuTab: {},
    terminalAppLogs: [],
    dtcDataset: [],
    pidDataset: [],
    liveParamGroups: [],
    liveParams: [],
    writeParams: [],
    ecuInfos: [],
    actuatorTest: [],
    routineTest: [],
    writeParamId: 0,
    actuatorTestId: 0,
    routineTestId: 0,
    flashingId: 0
};

export const dotaReducer = (state = initialState, action) => {
    switch (action.type) {
        case Actions.SET_TERMINAL_APP_LOG:
            const { terminalAppLogs } = state;
            return {
                ...state,
                terminalAppLogs: [...terminalAppLogs, action.payload]
            }
        case Actions.CLEAR_TERMINAL_APP_LOG:
            return {
                ...state,
                terminalAppLogs: []
            }
        case Actions.SET_ECU_TAB:
            return {
                ...state,
                ecuTab: action.payload
            }
        case Actions.GET_PID_DATASET:
            return {
                ...state,
                pidDataset: action.payload
            }
        case Actions.GET_DTC_DATASET:
            return {
                ...state,
                dtcDataset: action.payload
            }
        case Actions.GET_LIVEPARAM_GROUP_LIST:
            return {
                ...state,
                liveParamGroups: action.payload
            }
        case Actions.GET_LIVE_PARAMS:
            return {
                ...state,
                liveParams: action.payload
            }
        case Actions.GET_WRITE_PARAMS:
            return {
                ...state,
                writeParams: action.payload
            }
        case Actions.GET_ECU_INFOS:
            return {
                ...state,
                ecuInfos: action.payload
            }
        case Actions.GET_ACTUATOR_TEST:
            return {
                ...state,
                actuatorTest: action.payload
            }
        case Actions.GET_ROUTINE_TEST:
            return {
                ...state,
                routineTest: action.payload
            }
        case Actions.SET_ROUTINE_TEST:
            return {
                ...state,
                routineTest: action.payload
            }
        case Actions.SET_LIVE_PARAMS:
            return {
                ...state,
                liveParams: action.payload
            }
        case Actions.SET_WRITE_PARAM_ID:
            return {
                ...state,
                writeParamId: action.payload
            }
        case Actions.SET_ACTUATOR_TEST_ID:
            return {
                ...state,
                actuatorTestId: action.payload
            }
        case Actions.SET_ROUTINE_TEST_ID:
            return {
                ...state,
                routineTestId: action.payload
            }
        case Actions.SET_FLASHING_ID:
            return {
                ...state,
                flashingId: action.payload
            }
        default:
            return state;
    }
};