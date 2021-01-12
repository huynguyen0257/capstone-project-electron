import { SET_FRAME } from "./frame.type";

export const setFrame = (camera_code, frame) => {
    return {
        type: SET_FRAME,
        payload1: frame,
        payload2: camera_code,
    };
};