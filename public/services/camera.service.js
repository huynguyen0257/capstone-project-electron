const axios = require('axios')
const onvif = require('node-onvif')

const endpoint = 'http://localhost:8888'
const {
    ipcMain
} = require('electron')
let token = null;

const setToken = (input) => {
    token = input;

};

const getListCamera = () => {
    return axios.get(endpoint + '/api/Camera', {
        headers: {
            Authorization: token //the token is a variable which holds the token
        }
    });
};

const updateCamera = (camera) => {
    return axios.put(endpoint + '/api/Camera', camera, {
        headers: {
            Authorization: token //the token is a variable which holds the token
        }
    });
}



// RETURN a list camera 
//Parameters: Code, Url
const scanCamera = async () => {
    try {
        var arr = [];
        const listCam = await onvif.startProbe()
        return Promise.all(
            arr = listCam.map(async (device) => {
                const deviceInit = new onvif.OnvifDevice({
                    xaddr: device.xaddrs[0]
                });
                await deviceInit.init()
                let url = deviceInit.getUdpStreamUrl();
                return {
                    Code: device.name.replace(' ', ''),
                    RtspLink: url
                }
            })
        )
    } catch (error) {
        console.log(error)
    }
}



module.exports = {
    getListCamera,
    updateCamera,
    scanCamera,
    setToken
}