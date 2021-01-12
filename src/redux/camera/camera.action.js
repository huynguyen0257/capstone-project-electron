import { SET_CAMERA } from './camera.type'

export const setCamera = (camera) => {
    return {
        type: SET_CAMERA,
        payload: camera,

    }
}