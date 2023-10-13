import { combineReducers } from "redux";
import { appReducer } from "./app.reducer";
import { userReducer } from './user.reducer';
import { liveMapReducer } from './livemap.reducer';
import { dotaReducer } from './dota.reducer';
import { geofenceReducer } from './geofence.reducer';
import { liveMonitorReducer } from "./livemonitor.reducer";

const reducers = combineReducers({
    App: appReducer,
    User: userReducer,
    LiveMap: liveMapReducer,
    Dota: dotaReducer,
    Geofence: geofenceReducer,
    LiveMonitor: liveMonitorReducer
});

export default reducers;