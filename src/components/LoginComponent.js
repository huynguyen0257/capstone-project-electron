import React, { useState } from "react";

import axios from "axios";
import { Form, Input, Button, Layout, Spin, Breadcrumb, Row, Col, Typography } from "antd";
import { Redirect, Link } from "react-router-dom";
import { isAuth, fetchLogin, authenticate, checkToken } from "../services";
import { useSelector, useDispatch } from "react-redux";

// import SweetAlert from "sweetalert-react";
import SweetAlert from "react-bootstrap-sweetalert";
const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const layout = {
    labelCol: {
        offset: 3,
        span: 4,
    },
    wrapperCol: {
        span: 10,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 7,
        span: 10,
    },
};
export function LoginComponent(props) {
    const [form] = Form.useForm();
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(false);
    const authState = useSelector((state) => state.auth);

    const onFinish = (values) => {
        console.log(values);
        setLoading(true);
        fetchLogin(values)
            .then((res) => {
                authenticate(res, values.Username, () => {
                    setLoading(false);
                    setRole(res.Role)
                });
            })
            .catch((e) => {
                setLoading(false);
                setErr(true);
            });

    };
    React.useEffect(() => {
        form.setFieldsValue({
            Username: "admin@gmail.com",
            Password: "123456"
        });
        if (isAuth()) {
            checkToken()
                .then((res) => {
                    setRole(res.data.RoleName)
                })
        }
        return () => { };
    }, []);

    const onFinishFailed = (errorInfo) => {
        setErr(true);
    };

    return role ? (role === 'Manager' ?
        <Redirect to={`/manager`} /> : role === 'Building Guard' ? <Redirect to={`/building-guard`} /> : <Redirect to={`/invalid-role`} />
    ) : (
            <Layout style={{ minHeight: "100vh", backgroundColor: '#282c34', display: 'flex', justifyContent: 'center' }} className="layout">
                <Content style={{ padding: "0 50px", alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                    <Breadcrumb style={{ margin: "10px 0" }}></Breadcrumb>
                    <div className="site-layout-content" style={{ minHeight: "100%" }}>
                        {/* <Row type="flex" align="middle">
                            <img
                                alt="logo"
                                style={{ verticalAlign: "middle", margin: "auto" }}
                                src="./banner.jpg"
                            />
                        </Row> */}
                        <Row type="flex" justify="center" align="center">
                            <Col>
                                <Form
                                    form={form}
                                    {...layout}
                                    name="basic"
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                    style={{
                                        backgroundColor: 'white', width: '600px', height: '300px', paddingTop: '50px', border: '1px solid',
                                        boxShadow: '5px 8px 14px #888888', type: "flex", justify: "center", align: "middle"
                                    }}
                                >
                                    <Form.Item
                                        label="Username"
                                        name="Username"
                                        style={{ color: 'white !important' }}
                                        rules={[
                                            { required: true, message: "Please input your username!" },
                                        ]}

                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Password"
                                        name="Password"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Password must be more than 6 characters!",
                                                min: 6,
                                            },
                                        ]}
                                    >
                                        <Input.Password />
                                    </Form.Item>

                                    <Form.Item {...tailLayout}>
                                        <Spin spinning={loading}>
                                            <Button type="primary" htmlType="submit">
                                                Login
                </Button>
                                        </Spin>
                                    </Form.Item>
                                    {/* <Row justify='center'>
                                <Text type="secondary">Don't remember your password? &nbsp;</Text>
                                <Typography.Link><Link to='/forgetpassword'>Reset password now</Link></Typography.Link>
                            </Row> */}
                                </Form>
                            </Col>
                        </Row>


                    </div>
                </Content>
                <Footer style={{ textAlign: "center" }}>SDMS Team Developer</Footer>
                <SweetAlert
                    show={err}
                    error
                    title="Invalid username or password"
                    onConfirm={() => setErr(false)}
                />
            </Layout >
        );
}

export default LoginComponent;
