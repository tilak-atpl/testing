import { LiveMapActions as Actions } from '../actions';

const initialState = {
    activeVehicle: {},
    vehicleList: [],
    variantList: [],
    oemList: [],
    modelList: [],
    subModelList: [],
    segmentList: [],
    vehicleGroupList: [
        {
            id: 0,
            name: 'Group1'
        }, {
            id: 1,
            name: 'Group2'
        }, {
            id: 2,
            name: 'Group3'
        }, 
    ],
};

export const liveMapReducer = (state = initialState, action) => {
    switch (action.type) {
        case Actions.SET_VEHICLE:
            return {
                ...state,
                activeVehicle: action.payload
            };
        case Actions.GET_VEHICLE_LIST:
            return {
                ...state,
                vehicleList: action.payload
            };
        case Actions.GET_OEM_LIST:
            return {
                ...state,
                oemList: action.payload
            };
        case Actions.GET_VARIANT_LIST:
            return {
                ...state,
                variantList: action.payload
            };
        case Actions.GET_MODEL_LIST:
            return {
                ...state,
                modelList: action.payload,
            };
        case Actions.GET_SEGMENT_LIST:
            return {
                ...state,
                segmentList: action.payload,
            };
        case Actions.GET_SUBMODEL_LIST:
            return {
                ...state,
                subModelList: action.payload,
            };
        case Actions.GET_VEHICLE_GROUP_LIST:
            return {
                ...state,
                vehicleGroupList: action.payload,
            };
        default:
            return state;
    }
};