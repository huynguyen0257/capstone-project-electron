import React from 'react';
import '../App.css';

import { useDispatch } from "react-redux";
import { setFrame, setBuilding, setCamera } from "../redux";
import { Button, Spin, Layout, Menu, Typography, Tooltip, Badge, Input, Select, Row, Col, Switch, message, Space } from 'antd';
import {
    LoadingOutlined,
    VideoCameraOutlined,
    VideoCameraAddOutlined,
    SettingOutlined,
    ContactsFilled,
} from '@ant-design/icons';

import { Redirect, Link } from "react-router-dom";
import { getListCamera, getListBuilding, logOut } from '../services/'
import { CameraItemWrapper, FrameComponent, FormComponent, CameraWrapper, GridItem, SettingWrapperComponent } from '../components'
const { Option } = Select;
const { ipcRenderer } = window.require('electron')
const { Content, Sider, Header } = Layout;
const { SubMenu } = Menu;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { Text } = Typography;

function AppComponent() {
    const [listCamera, setListCamera] = React.useState([])
    const [listBuilding, setListBuilding] = React.useState([])
    const [listCameraScanned, setListCameraScanned] = React.useState([])
    const [socketId, setSocketId] = React.useState()
    const [modalVisible, setModalVisible] = React.useState(false)
    const [modalSettingVisible, setModalSettingVisible] = React.useState(false)
    const [isLoading, setLoading] = React.useState(false)
    const [isScanning, setScanning] = React.useState(false)
    const [collapsed, setCollapsed] = React.useState(false)
    const [listCameraDisplay, setListCameraDisplay] = React.useState([])
    const [statusCamera, setStatusCamera] = React.useState({})

    const dispatch = useDispatch();
    React.useEffect(() => {
        turnOnIPC()
        fetchList()
        setInterval(() => {
            ipcRenderer.send('getCameraStatus')
        }, 5000)
    }, [])

    const turnOnIPC = () => {
        console.log('run turn on ipc')
        ipcRenderer.send('getCameraStatus')
        ipcRenderer.on('receiveFrames', receiveFrame)
        ipcRenderer.on('receiveCameraList', receiveCameraList)
        ipcRenderer.on('receiveCameraStatus', receiveCameraStatus)
    }
    var receiveCameraStatus = (event, data) => {
        // console.log(data)
        setStatusCamera(data)

    }

    const handleChange = (value) => {
        console.log(`selected ${value}`);
        ipcRenderer.send('getResolution', value)

    }

    var receiveFrame = (event, data) => {

        var frame = 'data:image/jpeg;charset=utf-8;base64,' + data.frame
        dispatch(setFrame(data.cameraCode, frame));

    }

    const receiveCameraList = (event, data) => {
        setListCameraScanned(data.cameras)
        setSocketId(data.socketId)
        setScanning(false)
    }


    const scanCamera = () => {
        setScanning(true)
        ipcRenderer.send('scanCamera')

    };


    const fetchList = () => {
        setLoading(true)
        getListCamera().then(response => {
            setListCamera(response.data.results)
            // console.log(response.data)
            setLoading(false)
            // response.data.map((v) => ipcRenderer.send('openAfterScan', v.Code))
        })
        getListBuilding().then(response => {
            setListBuilding(response.data)
            dispatch(setBuilding(response.data))
            // setLoading(false)
        })

    }

    const showModal = (code, link) => {
        setModalVisible(true)
        let camera = { Code: code.replace(' ', ''), RtspLink: link, Username: 'admin', Password: '123Password', SocketId: socketId, IsOn: false, Position: '', Type: '', Building: '' }
        console.log('code:' + code)
        dispatch(setCamera(camera))

    };

    const success = () => {
        message.success('Success');
    };

    const error = () => {
        message.error('Error');
    };

    const showModalUpdateCamera = (camera) => {
        setModalSettingVisible(true)
        console.log('camera', camera)
        dispatch(setCamera(camera))
    }
    const handleFormCancel = e => {
        setModalVisible(false)
        setModalSettingVisible(false)
    };

    const handleFormOk = e => {
        setModalVisible(false)
        setModalSettingVisible(false)
        success()
    }
    const handleFormFailed = e => {

        setModalVisible(false)
        setModalSettingVisible(false)
        error()
    }


    const stopCamera = (camera) => {
        ipcRenderer.send('endSendFrame', camera.Code)
        let newArr = listCameraDisplay.filter((camCode) => camCode !== camera.Code)
        setListCameraDisplay(newArr)
        ipcRenderer.send('offStream', camera)
    }
    const showCamera = (check, camera) => {
        if (check) {
            setListCameraDisplay([...listCameraDisplay, camera.Code])
            // ipcRenderer.send('reloadCameraList', camera.Code)
            ipcRenderer.send('openAfterScan', camera.Code)
            ipcRenderer.send('startSendFrame', camera.Code)
        }
        else {
            ipcRenderer.send('endSendFrame', camera.Code)
            let newArr = listCameraDisplay.filter((camCode) => camCode !== camera.Code)
            setListCameraDisplay(newArr)
            ipcRenderer.send('offStream', camera)
        }
    }

    const onCollapse = collapsed => {
        setCollapsed(collapsed)
    };


    return (
        <Layout style={{ minHeight: '100vh' }}>

            <Layout className="site-layout">
                <Header style={{ padding: "15px 10px", backgroundColor: '#282c34' }}>
                    <SettingWrapperComponent >
                        <Button type="danger" onClick={logOut} >
                            <Link to="/login">Logout</Link>
                        </Button>
                        {/* <Input addonBefore="Delay Detect:" type="number" style={{ width: '260px' }} onKeyPress={event => {
                            if (event.key === 'Enter') {
                                ipcRenderer.send('receiveDelayDetectParam', event.target.value)
                            }
                        }} />
                        <Input addonBefore="Delay Enhance:" type="number" style={{ width: '260px' }} onKeyPress={event => {
                            if (event.key === 'Enter') {
                                ipcRenderer.send('receiveDelayEnhanceParam', event.target.value)
                            }
                        }} /> */}
                        <>
                            <Select defaultValue="960x540" style={{ width: 180 }} onChange={handleChange}>
                                <Option value="640x360">360p</Option>
                                <Option value="854x480">480p</Option>
                                <Option value="620x440">620p</Option>
                                <Option value="960x540">720p (Recommended)</Option>
                                <Option value="1920x1080">1080p</Option>
                            </Select>

                        </>
                    </SettingWrapperComponent>
                </Header>
                <Content style={{ margin: '0 0', 'backgroundColor': 'white' }}>
                    <div className="App" >
                        <header className="App-header">
                            <Row justify={'center'}>
                                {listCameraDisplay.length > 0 ?
                                    listCameraDisplay.map((code, index) =>
                                        <Col span={listCameraDisplay.length === 1 ? 16 : 12}>
                                            <FrameComponent camera_code={code} />
                                        </Col>
                                    )
                                    : "No camera to display"
                                }
                            </Row>
                            {listBuilding.length > 0 ? (<>
                                <FormComponent title="Create New Camera" visible={modalVisible} onCancel={handleFormCancel} refresh={fetchList} onFailed={handleFormFailed} onOk={handleFormOk} isSetting={false} />
                                <FormComponent title="Setting Camera" visible={modalSettingVisible} onCancel={handleFormCancel} refresh={fetchList} onFailed={handleFormFailed} onOk={handleFormOk} isSetting={true} />
                            </>


                            ) :
                                (<></>)}

                        </header>
                    </div>
                </Content>
            </Layout>
            <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} reverseArrow={true} width={350} >
                <div className="logo" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <SubMenu key="sub1" icon={<VideoCameraOutlined />} title="List Camera In Database">
                        {isLoading
                            ? <Menu.Item style={{ backgroundColor: 'transparent', alignItems: 'center', display: 'flex', justifyContent: 'center' }}><Spin indicator={antIcon} /></Menu.Item>
                            : <>{listCamera.map((camera) =>
                                <Menu.Item style={{ backgroundColor: 'transparent', cursor: 'default' }}>
                                    <CameraItemWrapper >
                                        <Row>
                                            <Col span={8}>
                                                <span style={{ cursor: 'pointer' }} onClick={() => showModalUpdateCamera(camera)}>{camera.Code}</span>
                                            </Col>
                                            <Col span={5}>
                                                <span > {listBuilding.map(building => building.Id === camera.BuildingId ? building.Code : "")} </span>
                                            </Col>
                                            <Col span={4} push={1}>
                                                {
                                                    statusCamera[camera.Code] === 'CONNECTED'
                                                        ?
                                                        <Tooltip title="CONNECTED" color={'yellow'}>
                                                            <Badge status="warning" />
                                                        </Tooltip> :
                                                        statusCamera[camera.Code] === 'READY'
                                                            ?
                                                            <Tooltip title="READY" color={'green'}>
                                                                <Badge status="success" />
                                                            </Tooltip> :
                                                            statusCamera[camera.Code] === 'RUNNING'
                                                                ?
                                                                <Tooltip title="running" color={'blue'}>
                                                                    <Badge status="processing" />
                                                                </Tooltip> :
                                                                <Tooltip title="DISABLE" color={'red'} >
                                                                    <Badge status="error" />
                                                                </Tooltip>

                                                }
                                            </Col>
                                            <Col span={7} push={2}>
                                                <Switch
                                                    onChange={(check) => showCamera(check, camera)}
                                                    defaultChecked={!listCameraDisplay.includes(camera.Code) ? false : true}
                                                    style={!listCameraDisplay.includes(camera.Code) ? { backgroundColor: 'gray' } : { backgroundColor: '#4bd864' }}
                                                />
                                            </Col>
                                        </Row>





                                    </CameraItemWrapper>
                                </Menu.Item>)
                            }</>}
                        <Menu.Item style={{ backgroundColor: 'transparent', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                            <Button type="primary" onClick={() => fetchList()}>Refresh</Button>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" icon={<VideoCameraAddOutlined />} title="List Camera Scanned">
                        {isScanning
                            ? <Menu.Item style={{ backgroundColor: 'transparent', cursor: 'default', alignItems: 'center', display: 'flex', justifyContent: 'center' }}><Spin indicator={antIcon} /></Menu.Item>
                            : <>
                                {listCameraScanned.map((camera) =>
                                    <Menu.Item style={{ backgroundColor: 'transparent', cursor: 'default' }}>
                                        <CameraItemWrapper>
                                            <Row>
                                                <Col span={19}>
                                                <span>{camera.Code}</span>
                                                </Col>
                                                <Col span={5}>
                                                {listCamera.filter(cam => cam.Code === camera.Code.replace(' ', '')).length > 0 ?
                                                <Text type="success">Added</Text>
                                                : <Button type="primary" onClick={() => showModal(camera.Code, camera.RtspLink)}>Add</Button>
                                            }
                                                </Col>
                                            </Row>
                                            
                                           
                                        </CameraItemWrapper>
                                    </Menu.Item>)}
                            </>}
                        <Menu.Item style={{ backgroundColor: 'transparent', cursor: 'default', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                            <Button type="primary" onClick={() => scanCamera()}>Scan</Button>
                        </Menu.Item>
                    </SubMenu>

                </Menu>
            </Sider>



        </Layout >


    );
}

export { AppComponent };
