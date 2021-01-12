import axios from "axios";
const endpoint = 'http://localhost:8888'

export const getListCamera = () => {
    return axios.get(endpoint + '/api/Camera')
};

export const createNewCamera = (camera) => {
    return axios.post(endpoint + '/api/Camera', camera)
}
export const updateCamera = (camera) => {

    return axios.put(endpoint + '/api/Camera', camera)
}
export const getListBuilding = () => {
    return axios.get(endpoint + '/api/building')
}


