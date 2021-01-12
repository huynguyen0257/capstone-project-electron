import { SET_BUILDING } from './building.type'

export const setBuilding = (listBuilding) => {
    return {
        type: SET_BUILDING,
        payload: listBuilding
    }

}