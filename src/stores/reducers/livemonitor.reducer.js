import { LiveMonitorActions as Actions } from '../actions';

const initialState = {
    lMonitorParams: [],
    lMonitorParamGroups: [],
    telematicParams: [],
    ivnParams: [],
    j1939Params: []
};

export const liveMonitorReducer = (state = initialState, action) => {
    switch (action.type) {
        case Actions.GET_LIVE_MONITOR_PARAMS:
            return {
                ...state,
                lMonitorParams: action.payload
            };
        case Actions.GET_LIVE_MONITOR_PARAM_GROUPS:
            return {
                ...state,
                lMonitorParamGroups: action.payload
            };
        case Actions.GET_TELEMATIC_PARAMS:
            return {
                ...state,
                telematicParams: action.payload
            };
        case Actions.GET_IVN_PARAMS:
            return {
                ...state,
                ivnParams: action.payload
            };
        case Actions.GET_J1939_PARAMS:
            return {
                ...state,
                j1939Params: action.payload
            };
        default:
            return state;
    }
};