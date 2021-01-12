import { SET_FRAME } from "./frame.type";

const initialState = {
    frame: 'https://images.drivereasy.com/wp-content/uploads/2017/04/1-14.jpg'
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_FRAME:
            state[action.payload2] = action.payload1
            return {
                ...state,
            };
        default:
            return state;
    }
};

export default reducer;
