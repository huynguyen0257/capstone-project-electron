import { SET_BUILDING } from './building.type'

const initialState = {
    list: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_BUILDING:
            return {
                ...state,
                list: action.payload
            }

        default:
            return state
    }
}

export default reducer