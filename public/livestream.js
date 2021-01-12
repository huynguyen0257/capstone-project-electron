const rtsp = require('rtsp-ffmpeg');
const io = require('socket.io-client');
const socket = io('http://localhost:8888');
const onvif = require('node-onvif')
const cameraService = require('./services/camera.service')
const {
    ipcMain
} = require('electron')
const {
    getListCamera,
    updateCamera,
    scanCamera
} = require('./services/camera.service')
const NodeCache = require("node-cache");
const {
    CONNECTED,
    READY,
    RUNNING,
    DISABLE,
    KEY_FRAME
} = require('./services/type.service')
const myCache = new NodeCache();
var resolution = '620x440'

// const resolution = '1080x720'
var delay_detect = 1
var delay_face_register = 1
var listStreamCamera = []
const streamingProcess = {} // quản lý toàn bộ kết nối ffmpeg
const delayProcess = {} // quản lý toàn bộ kết nối ffmpeg
const intervalProcess = {} // quản lý luồng interval về front-end
const statusProcess = {} // quản lý trạng thái camera về server.
const fps = 12;


socket.on('reUpdateCameraSocketId', async () => {
    await updateCameraSocket()
})

ipcMain.on('sendToken', async (event, data) => {
    cameraService.setToken(data);
    await updateCameraSocket();
})

ipcMain.on('scanCamera', (event) => {
    scanCamera().then( async (list) => {
        // console.log(list)
        const socketId = socket.id
        await getListCamera().then(v => {
            listStreamCamera = v.data.results
        })
        listStreamCamera.map((camera) =>{
            list.map(async cam => {
                if (cam.Code === camera.Code){
                    console.log(`update success camera ${camera.Code}`)
                    //database update
                    await updateCamera({
                        Code: camera.Code,
                        RtspLink: cam.RtspLink
                    });
                    //App desktop update
                    camera.RtspLink = cam.RtspLink;
                    camera.Code =camera.Code;
                }
            })
        })
        
        event.sender.send('receiveCameraList', {
            cameras: list,
            socketId: socketId
        })
    })
})



ipcMain.on('offStream', async (event, camera) => {
    runStreamingProcess(camera.Code, camera.Type, false)
    statusProcess[camera.Code] = DISABLE
    await updateCamera({
        Code: camera.Code,
        IsOn: false
    })
})
ipcMain.on('reloadCameraList', async () => {
    updateCameraSocket();
})

ipcMain.on('openAfterScan', async (event, code) => {
    // await updateCameraSocket()
    console.log('received code: ' + code);
    console.log('current list camera length: ' + listStreamCamera.length);
    // console.log('current list camera: ' + listStreamCamera);
    const camera = listStreamCamera.filter((camera) => camera.Code === code)[0];
    if (camera) {
        console.log('resolution' + resolution)
        initialStreamProcess(camera.RtspLink, camera.Code, camera.Username, camera.Password)
        runStreamingProcess(camera.Code, camera.Type, true)
    }
    await updateCamera({
        Code: code,
        IsOn: true
    })

})

ipcMain.on('getCameraStatus', (event) => {
    // console.log(statusProcess)
    event.sender.send('receiveCameraStatus', statusProcess)
})

ipcMain.on('getResolution', (event, data) => {

    resolution = data
})


ipcMain.on('updateListCamera', (event) => {
    console.log('update success!')

})


//Active send to front-end app
ipcMain.on('startSendFrame', (event, code) => {
    intervalProcess[code] = setInterval(() => {
        var frame = myCache.get(KEY_FRAME + code)

        event.sender.send('receiveFrames', {
            frame: frame,
            cameraCode: code
        })
    }, 1000 / fps)
})

//Deactive send to front-end app
ipcMain.on('endSendFrame', (event, code) => {
    clearInterval(intervalProcess[code])
    // streamingProcess[code].off('data');
})

ipcMain.on('receiveDelayDetectParam', (event, delay) => {
    delay_detect = delay
})
ipcMain.on('receiveDelayEnhanceParam', (event, delay) => {
    delay_face_register = delay
})


// SERVER CALL
socket.on('enable_camera', (cameraCode) => {
    statusProcess[cameraCode] = READY
})

socket.on('disable_camera', (cameraCode) => {
    statusProcess[cameraCode] = DISABLE
})

socket.on('enable_camera_enhance', () => {
    listStreamCamera.filter(e => e.Type === 1).forEach(e => {
        console.log(e.Code)
        statusProcess[e.Code] = READY
    })
})

socket.on('disable_camera_enhance', () => {
    listStreamCamera.filter(e => e.Type == 1).forEach(e => {
        statusProcess[e.Code] = DISABLE
    })
})





const initialStreamProcess = (rtspLink, code, username, password) => {
    var uri = rtspLink.replace('rtsp://', 'rtsp://' + username + ':' + password + '@')
    console.log('uri' + uri)
    if (streamingProcess[code] != null) {
        //close the old stream
        // streamingProcess[code].off('data');
    }
    streamingProcess[code] = new rtsp.FFMpeg({
        input: uri,
        resolution: resolution,
        quality: 3
    });
}
var pipeStream = null;
const runStreamingProcess = (code, type, isOn) => {

    if (streamingProcess[code] == null) return;
    statusProcess[code] = CONNECTED;
    delayProcess[code] = delay_detect

    pipeStream = function (data) {
        var frame = data.toString('base64')
        myCache.set(KEY_FRAME + code, frame)
        if (type === 0) {
            if (delayProcess[code] % delay_detect === 0 && statusProcess[code] === READY) {
                statusProcess[code] = RUNNING;
                socket.emit('app_opening', frame, code, () => {
                    if (statusProcess[code] === RUNNING) {
                        statusProcess[code] = READY
                    }
                });
            }
        } else if (type === 1) {
            if (delayProcess[code] % delay_face_register === 0 && statusProcess[code] === READY) {
                statusProcess[code] = RUNNING;
                socket.emit('app_register_face', frame, code, () => {
                    if (statusProcess[code] === RUNNING) {
                        statusProcess[code] = READY
                    }
                });
            }
        } else {
            console.log('not support type:' + type)
        }
        delayProcess[code] = delayProcess[code] + 1;
    };
    if (isOn) {
        console.log(`start socketId : ${socket.id}`)
        streamingProcess[code].on('data', pipeStream);
    } else {
        console.log(`stop socketId : ${socket.id}`)
        streamingProcess[code].stop();
    }


}


const updateCameraSocket = async () => {
    try {
        var socketId
        await getListCamera().then(v => {
            socketId = socket.id
            listStreamCamera = v.data.results
        })
        console.log('updateCameraSocket: ', socketId)
        listStreamCamera.map((camera) => updateCamera({
            Code: camera.Code,
            SocketId: socket.id
        }))
    } catch (error) {
        console.log(error.message)
    }
}




module.exports = {updateCameraSocket}