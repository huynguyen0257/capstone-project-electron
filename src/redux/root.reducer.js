import { combineReducers } from 'redux'

import frameReducer from './frame/frame.reducer'
import buildingReducer from './building/building.reducer'
import cameraReducer from './camera/camera.reducer'

const rootReducer = combineReducers({
    frame: frameReducer,
    building: buildingReducer,
    camera: cameraReducer
})

export default rootReducer