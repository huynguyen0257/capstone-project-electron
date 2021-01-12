import React from 'react';
import { useSelector } from 'react-redux';
import { Modal, Form, Input, Select, Row, Col, Button } from 'antd';
import { createNewCamera, updateCamera } from '../services/camera.service';
const { Option } = Select;
const { ipcRenderer } = window.require('electron');

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

function FormComponent(props) {
  const [form] = Form.useForm();
  const [listBuilding, setListBuilding] = React.useState([]);
  const [isEnhance, setIsEnhance] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const buildingState = useSelector((state) => state.building);
  const cameraState = useSelector((state) => state.camera);

  const onFinish = async (values) => {
    setIsLoading(true);
    console.log('go here: form');
    props.isSetting
      ? await updateCamera(values).then(props.refresh)
      : await createNewCamera(values).then(props.refresh);
    ipcRenderer.send('reloadCameraList');
    // ipcRenderer.send('openAfterScan', values.Code)
    // form.resetFields();
    setIsLoading(false);
    props.onOk();
  };

  const onFinishFailed = (errorInfo) => {
    form.resetFields();
    props.onFailed();
  };
  const handleBuildingChange = (value) => {
    form.setFieldsValue({ BuildingId: value });
  };

  const setFormValue = (type, code, link, socketId, position, buildingId) => {
    console.log('socket', socketId);
    form.setFieldsValue({
      Type: type.toString(),
      Position: position,
      Code: code.replace(' ', ''),
      RtspLink: link,
      Username: 'admin',
      Password: '123Password',
      SocketId: socketId,
      BuildingId: buildingId,
    });
  };

  const onChangeEnhance = (value) => {
    setIsEnhance(value === '0' ? false : true);
    value === '1'
      ? form.setFieldsValue({
          BuildingId:
            listBuilding.filter((v) => v.Code === 'B00').length > 0
              ? listBuilding.filter((v) => v.Code === 'B00')[0].Id
              : '',
        })
      : form.setFieldsValue();
  };
  React.useEffect(() => {
    setListBuilding(buildingState.list);
    if (cameraState.camera) {
      // console.log('type' + cameraState.camera.Type)
      setFormValue(
        cameraState.camera.Type,
        cameraState.camera.Code,
        cameraState.camera.RtspLink,
        cameraState.camera.SocketId,
        cameraState.camera.Position,
        cameraState.camera.BuildingId
      );
    }
    if (cameraState.camera) {
      cameraState.camera.Type === 0 ? setIsEnhance(false) : setIsEnhance(true);
    }
  }, [buildingState.list, cameraState.camera]);
  return (
    <Modal
      width={700}
      title={props.title}
      visible={props.visible}
      onCancel={props.onCancel}
      // okText={props.isSetting ? 'Save Change' : 'Create'}
      footer={[
        <Button key="back" onClick={props.onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={isLoading} onClick={() => {
          form
            .validateFields()
            .then((values) => {
              onFinish(values);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}>
          {props.isSetting? 'Save Change' : 'Create'}
        </Button>,
      ]}
      // onOk={() => {
      //   form
      //     .validateFields()
      //     .then((values) => {
      //       onFinish(values);
      //     })
      //     .catch((info) => {
      //       console.log('Validate Failed:', info);
      //     });
      // }}
    >
      <Form
        form={form}
        {...layout}
        name="basic"
        layout="vertical"
        initialValues={
          cameraState.camera && listBuilding && listBuilding.length > 0
            ? props.isSetting
              ? {
                  ...cameraState.camera,
                  Type: props.isSetting
                    ? cameraState.camera.Type.toString()
                    : '',
                  BuildingId: isEnhance
                    ? listBuilding.filter((v) => v.Code === 'B00').length > 0
                      ? listBuilding.filter((v) => v.Code === 'B00')[0].Id
                      : ''
                    : cameraState.camera.BuildingId
                    ? cameraState.camera.BuildingId.toString()
                    : '',
                }
              : { ...cameraState.camera }
            : {}
        }
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row>
          <Col span={12}>
            <Form.Item
              label="Camera Code"
              name="Code"
              rules={[
                {
                  required: true,
                  message: 'Please input Camera Code',
                },
              ]}
              style={{ minWidth: '130%' }}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="Position"
              name="Position"
              rules={[
                {
                  required: true,
                  message: 'Please input position of camera',
                },
              ]}
              style={{ minWidth: '130%' }}
            >
              <Input />
            </Form.Item>
            <Form.Item name="SocketId" style={{ display: 'none' }}>
              <Input type="text" />
            </Form.Item>
            <Form.Item
              label="Building"
              name="BuildingId"
              de
              rules={[
                {
                  required: true,
                  message: 'Please select building',
                },
              ]}
            >
              {listBuilding.length > 0 ? (
                <Select
                  // defaultValue={listBuilding[0].Id}
                  style={{ minWidth: '130%' }}
                  onChange={handleBuildingChange}
                  disabled={isEnhance ? true : false}
                >
                  {listBuilding.map((building) => (
                    <Option key={building.Id} value={building.Id}>{building.Code}</Option>
                  ))}
                </Select>
              ) : (
                ''
              )}
            </Form.Item>
            <Form.Item
              label="RTSP Link"
              name="RtspLink"
              rules={[
                {
                  required: true,
                  message: 'Please input your rtsp link!',
                },
              ]}
              style={{ minWidth: '90vh' }}
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Type"
              name="Type"
              rules={[
                {
                  required: true,
                  message: 'Please select type of camera',
                },
              ]}
            >
              <Select style={{ minWidth: '130%' }} onChange={onChangeEnhance}>
                <Option key={0}>Detect Camera</Option>
                <Option key={1}>Enhance Camera</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Username"
              name="Username"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]}
              style={{ minWidth: '130%' }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="Password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
              style={{ minWidth: '130%' }}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export { FormComponent };
