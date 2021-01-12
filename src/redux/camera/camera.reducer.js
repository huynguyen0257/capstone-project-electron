import { SET_CAMERA } from './camera.type'

const initialState = {
    camera: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CAMERA:
            return {
                ...state,
                camera: action.payload
            }
        default:
            return state
    }
}

export default reducer