import React, {useState, useEffect, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Triangle } from 'react-loader-spinner';
import { Carousel } from 'react-responsive-carousel';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Layout, Input, ConfigProvider, Button, Image, Form, message } from "antd";
import classNames from 'classnames';

import { Navbar, Footer } from '../../components';
import { UserActions } from '../../stores/actions';
import { PASSWORD_MSG, REGISTER_MSG, loginCarousels } from '../../utils/constants';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Login.css';

const Login = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const loading = useSelector( ({ App }) => App.loading );
    const { login, register, forgotPassword, resetPassword, verifyOTP, resendOTP, msg } = useSelector( ({User}) => User);

    const [formStatus, setFormStatus] = useState('signin');
    const [regBtnClick, setRegBtnClick] = useState(0);
    const [forgotBtnClick, setForgotBtnClick] = useState(0);

    const v_otp0Ref = useRef(null);
    const v_otp1Ref = useRef(null);
    const v_otp2Ref = useRef(null);
    const v_otp3Ref = useRef(null);
    const r_otp0Ref = useRef(null);
    const r_otp1Ref = useRef(null);
    const r_otp2Ref = useRef(null);
    const r_otp3Ref = useRef(null);

    const [formSignIn] = Form.useForm();
    const [formSignUp] = Form.useForm();
    const [formForgot] = Form.useForm();
    const [formReset] = Form.useForm();
    const [formVerify] = Form.useForm();

    useEffect( () => {
        if (login) {
            dispatch(UserActions.clearMsg());
            history.push('/livemap');
        }
        else
            history.push('/login');
    }, [dispatch, login, history]);

    useEffect( () => {
        if (register.success) {
            setFormStatus('verify-otp');
        }
        else {
            if (msg.includes(REGISTER_MSG.EMAIL_EXIST))
                message.warning(REGISTER_MSG.EMAIL_EXIST);
            if (msg.includes(REGISTER_MSG.MOBILE_EXIST))
                message.warning(REGISTER_MSG.MOBILE_EXIST);
        }
    }, [register.success, msg, regBtnClick]);

    useEffect( () => {
        if (resetPassword) {
            setFormStatus('signin');
        }
        else {
            if (msg.includes(PASSWORD_MSG.RESET_NOT_OK))
                message.warning(msg);
        }
    }, [resetPassword, msg]);

    useEffect( () => {
        if (forgotPassword.success) { 
            setFormStatus('reset-pwd');
            formReset.setFieldValue('resetEmail', forgotPassword.email);
            message.success(msg);
        }
        else {
            if (msg !== '' || msg.includes(PASSWORD_MSG.FORGOT_NOT_USER))
                message.warning(msg);
        }
    }, [forgotPassword, msg]);

    useEffect( () => {
        if (verifyOTP)
            setFormStatus('signin');
    }, [verifyOTP]);
    useEffect( () => {
        if (resendOTP)
            message.success(msg);
    }, [resendOTP, msg]);

    const handleFinishForm = (type, values) => {
        if (type === 'sign-in') {
            const { signinUsername: username, signinPassword: password } = values;            
            dispatch(UserActions.loginUser(username, password));
        }
        else if (type === 'sign-up') {
            const { signupFirstname, signupLastname, signupEmail, signupMobile, signupPassword } = values;
            
            const data = {
                first_name: signupFirstname,
                last_name: signupLastname,
                email: signupEmail,
                mobile: signupMobile,
                password: signupPassword,
                device_type: "android",
                mac_id: "1234567890",
                serial_number: "1234"
            };
            dispatch(UserActions.registerUser(data));
        }
        else if (type === 'forgot-pwd') {
            const {forgotUsername: email} = values;
            dispatch(UserActions.forgotPassword({email}));
        }
        else if (type === 'verify-otp') {
            const {otp0, otp1, otp2, otp3} = values;
            const otp = otp0.toString() + otp1 + otp2 + otp3;
            dispatch(UserActions.verifyOTP({email: register.email, otp}));
        }
        else if (type === 'reset-pwd') {
            const {otp0, otp1, otp2, otp3, resetEmail, resetPassword} = values;
            const otp = otp0.toString() + otp1 + otp2 + otp3;
            dispatch(UserActions.resetPassword({email: resetEmail, otp, new_password: resetPassword}));
        }
    };
    const handleResendOTP = () => {
        dispatch(UserActions.resendOTP({email: register.email}));
    };
    const handleOTPKeyUp = (e, ref) => {
        ref && ref.current.focus();
    };

    return (
        <Layout className="main-layout flex h-screen">
            <Navbar />

            <Layout className='content-layout flex flex-row flex-wrap justify-evenly items-center'>

                <Carousel
                    className='login-carousel'
                    showThumbs={false}
                    showStatus={false}
                    showArrows={true}
                    autoPlay={true}
                    infiniteLoop={true}
                    interval={2000}
                    transitionTime={1000}
                    width={900}
                    height={500}
                >
                    { loginCarousels.map( item => (
                        <div key={item.title}>
                            <img src={item.image_url} style={{width: 900, height: 500}} alt={item.title} />
                        </div>
                    )) }
                </Carousel>

                <div className='flex flex-col justify-evenly items-center h-full' style={{width: 550}}>
                <div className='flex justify-center w-full'>
                <Image src='/fotax.png' width={400} height={70} preview={false} />
                </div>

                <div className={classNames('login-menu flex flex-col items-center justify-center w-full h-3/4')}>
                    <Triangle
                        height="200"
                        width="200"
                        color="#fff"
                        ariaLabel="triangle-loading"
                        wrapperStyle={{}}
                        wrapperClassName=""
                        visible={loading}
                    />
                    { !loading && formStatus === 'signin' &&
                    <Form form={formSignIn} className='flex flex-col items-center justify-center w-full h-full' onFinish={values => handleFinishForm('sign-in', values)}>
                        <div className='login-title h-1/3 flex items-center text-white'> Login </div>
                        <div className='h-1/3 w-full flex flex-col items-center justify-evenly'>
                            <Form.Item
                                name="signinUsername"
                                className='w-1/2 mb-10'
                                rules={[ {required: true, message: 'Please input your mobile number'} ]}
                            >
                                <Input className='login-username w-full' type='text' placeholder='Mobile Number' />
                            </Form.Item>
                            <ConfigProvider theme={{ token: { colorText: 'white', colorBgContainer: 'rgba(0, 0, 0, .0)'} }}>
                                <Form.Item
                                    name="signinPassword"
                                    className='w-1/2'
                                    rules={[ {required: true, message: 'Please input your password'} ]}
                                >
                                    <Input.Password className='login-password w-full text-white' placeholder='Password' iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)} />
                                </Form.Item>
                            </ConfigProvider>
                            <div className='w-1/2 flex items-between justify-between pt-2 px-1'>
                                <div className='login-signup' onClick={ () => setFormStatus('signup') }> Sign up </div>
                                <div className='login-forgot' onClick={ () => setFormStatus('forgot-pwd') }> Forgot password? </div>
                            </div>
                        </div>
                        <div className='h-1/3 flex items-center'>
                            <Button className='login-btn px-10' htmlType='submit'> Sign in </Button>
                        </div>
                    </Form>
                    }

                    { !loading && formStatus === 'signup' &&
                    <Form form={formSignUp} className='flex flex-col items-center justify-center w-full h-full' onFinish={values => handleFinishForm('sign-up', values)}>
                        <div className='login-title h-1/4 flex items-center text-white'> Sign Up </div>
                        <div className='h-1/2 w-full flex flex-col items-center justify-evenly'>
                            <div className='w-2/3 flex items-between justify-between'>
                                <Form.Item
                                    name="signupFirstname"
                                    className='w-1/2 mr-1'
                                    rules={[ {required: true, message: 'Please input first name'} ]}
                                >
                                    <Input className='signup-firstname w-full' type='text' placeholder='First name' />
                                </Form.Item>
                                <Form.Item
                                    name="signupLastname"
                                    className='w-1/2'
                                    rules={[ {required: true, message: 'Please input last name'} ]}
                                >
                                    <Input className='signup-lastname w-full' type='text' placeholder='Last name' />
                                </Form.Item>
                            </div>
                            <Form.Item
                                name="signupEmail"
                                className='w-2/3'
                                rules={[
                                    {
                                        type: 'email',
                                        message: 'This is not valid E-mail!',
                                    },
                                    {
                                        required: true,
                                        message: 'Please input your E-mail!',
                                    }
                                ]}
                            >
                                <Input className='signup-email w-full' type='text' placeholder='Email' />
                            </Form.Item>
                            <Form.Item
                                name="signupMobile"
                                className='w-2/3'
                                rules={[ {required: true, message: 'Please input your mobile number'} ]}
                            >
                                <Input className='signup-mobile w-full' type='text' placeholder='Mobile Number' />
                            </Form.Item>
                            <ConfigProvider theme={{ token: {colorText: 'white', colorBgContainer: 'rgba(0, 0, 0, .0)'} }}>
                                <Form.Item
                                    name="signupPassword"
                                    className='w-2/3'
                                    rules={[ {required: true, message: 'Please input your password'} ]}
                                >
                                    <Input.Password className='signup-password w-full' placeholder='Password' iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)} />
                                </Form.Item>
                                <Form.Item
                                    name="signupConfirm"
                                    className='w-2/3'
                                    dependencies={['signupPassword']}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please confirm your password',
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                            if (!value || getFieldValue('signupPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('The new password that you entered do not match!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password className='signup-confirm w-full' placeholder='Confirm' iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)} />
                                </Form.Item>
                            </ConfigProvider>
                        </div>
                        <div className='w-2/3 h-1/4 flex items-center justify-evenly'>
                            <Button className='signup-btn-back px-10' type='button' onClick={ () => {setFormStatus('signin'); formSignUp.resetFields()} }> Back </Button>
                            <Button className='signup-btn px-10' type='button' htmlType='submit' onClick={() => setRegBtnClick(regBtnClick + 1)} > Sign up </Button>
                        </div>
                    </Form>
                    }

                    { !loading && formStatus === 'forgot-pwd' &&
                    <Form form={formForgot} className='flex flex-col items-center justify-center w-full h-full' onFinish={values => handleFinishForm('forgot-pwd', values)}>
                        <div className='login-title h-1/3 flex items-center text-white'> Forgot Password? </div>
                        <div className='h-1/3 w-full flex flex-col items-center justify-evenly'>
                            <div className='w-2/3 text-white pb-5' style={{fontSize: 20}}>Please type your email address to reset your password.</div>
                            <Form.Item
                                name="forgotUsername"
                                className='w-2/3'
                                rules={[
                                    {
                                        type: 'email',
                                        message: 'This is not valid E-mail!',
                                    },
                                    {
                                        required: true,
                                        message: 'Please input your E-mail!',
                                    }
                                ]}
                            >
                                <Input className='forgot-username w-full' type='text' placeholder='Email' />
                            </Form.Item>
                        </div>
                        <div className='w-2/3 h-1/3 flex items-center justify-evenly'>
                            <Button className='forgot-btn-back px-10' type='button' onClick={ () => {setFormStatus('signin'); formForgot.resetFields()} }> Back </Button>
                            <Button className='forgot-btn px-10' type='button' htmlType='submit' onClick={() => setForgotBtnClick(forgotBtnClick + 1)}> Reset </Button>
                        </div>
                    </Form>
                    }

                    { !loading && formStatus === 'signup' &&
                    <Form form={formVerify} className='flex flex-col items-center justify-center w-full h-full' onFinish={values => handleFinishForm('verify-otp', values)}>
                        <div className='login-title h-1/3 flex items-center text-white'> Enter OTP </div>
                        <div className='h-1/3 w-full flex flex-col items-center justify-evenly'>
                            <div className='w-1/2 text-white text-center pb-5' style={{fontSize: 20}}>Please verify your account</div>
                            <div className='w-2/3 flex justify-between'>
                                <Form.Item
                                    name="otp0"
                                    className='w-1/4 mr-2'
                                    rules={[ {required: true, message: '*'} ]}
                                >
                                    <Input className='otp-code w-full' type='text' pattern="[0-9]" maxLength={1} onChange={e => handleOTPKeyUp(e, e.target.value.length === 1?v_otp1Ref:null)} ref={v_otp0Ref} />
                                </Form.Item>
                                <Form.Item
                                    name="otp1"
                                    className='w-1/4 mr-2'
                                    rules={[ {required: true, message: '*'} ]}
                                >
                                    <Input className='otp-code w-full' type='text' pattern="[0-9]" maxLength={1} onChange={e => handleOTPKeyUp(e, e.target.value.length === 1?v_otp2Ref:v_otp0Ref)} ref={v_otp1Ref} />
                                </Form.Item>
                                <Form.Item
                                    name="otp2"
                                    className='w-1/4 mr-2'
                                    rules={[ {required: true, message: '*'} ]}
                                >
                                    <Input className='otp-code w-full' type='text' pattern="[0-9]" maxLength={1} onChange={e => handleOTPKeyUp(e, e.target.value.length === 1?v_otp3Ref:v_otp1Ref)} ref={v_otp2Ref} />
                                </Form.Item>
                                <Form.Item
                                    name="otp3"
                                    className='w-1/4'
                                    rules={[ {required: true, message: '*'} ]}
                                >
                                    <Input className='otp-code w-full' type='text' pattern="[0-9]" maxLength={1} onChange={e => handleOTPKeyUp(e, e.target.value.length === 1?null:v_otp2Ref)} ref={v_otp3Ref} />
                                </Form.Item>
                            </div>
                            <div className='w-1/2 h-1/3 text-white flex justify-center'>
                                <div className='login-signup' onClick={ handleResendOTP }> Resend OTP </div>
                            </div>
                        </div>
                        <div className='w-2/3 h-1/3 flex items-center justify-evenly'>
                            <Button className='forgot-btn-back px-10' type='button' onClick={ () => {setFormStatus('signin'); formVerify.resetFields()} }> Back </Button>
                            <Button className='forgot-btn px-10' type='button' htmlType='submit'> Submit </Button>
                        </div>
                    </Form>
                    }

                    { !loading && formStatus === 'reset-pwd' &&
                    <Form form={formReset} className='flex flex-col items-center justify-center w-full h-full' onFinish={values => handleFinishForm('reset-pwd', values)}>
                        <div className='login-title h-1/3 flex items-center text-white'> Reset Password </div>
                        <div className='h-1/2 w-full flex flex-col items-center justify-evenly'>
                            <Form.Item
                                name="resetEmail"
                                className='w-2/3'
                            >
                                <Input className='signup-email w-full' type='text' placeholder='Email' readOnly />
                            </Form.Item>
                            <div className='w-2/3 flex justify-between'>
                                <Form.Item
                                    name="otp0"
                                    className='w-1/4 mr-2'
                                    rules={[ {required: true, message: '*'} ]}
                                >
                                    <Input className='otp-code w-full' type='text' pattern="[0-9]" maxLength={1} onChange={e => handleOTPKeyUp(e, e.target.value.length === 1?r_otp1Ref:null)} ref={r_otp0Ref} />
                                </Form.Item>
                                <Form.Item
                                    name="otp1"
                                    className='w-1/4 mr-2'
                                    rules={[ {required: true, message: '*'} ]}
                                >
                                    <Input className='otp-code w-full' type='text' pattern="[0-9]" maxLength={1} onChange={e => handleOTPKeyUp(e, e.target.value.length === 1?r_otp2Ref:r_otp0Ref)} ref={r_otp1Ref} />
                                </Form.Item>
                                <Form.Item
                                    name="otp2"
                                    className='w-1/4 mr-2'
                                    rules={[ {required: true, message: '*'} ]}
                                >
                                    <Input className='otp-code w-full' type='text' pattern="[0-9]" maxLength={1} onChange={e => handleOTPKeyUp(e, e.target.value.length === 1?r_otp3Ref:r_otp1Ref)} ref={r_otp2Ref} />
                                </Form.Item>
                                <Form.Item
                                    name="otp3"
                                    className='w-1/4'
                                    rules={[ {required: true, message: '*'} ]}
                                >
                                    <Input className='otp-code w-full' type='text' pattern="[0-9]" maxLength={1} onChange={e => handleOTPKeyUp(e, e.target.value.length === 1?null:r_otp2Ref)} ref={r_otp3Ref} />
                                </Form.Item>
                            </div>
                            <ConfigProvider theme={{ token: {colorText: 'white', colorBgContainer: 'rgba(0, 0, 0, .0)'} }}>
                                <Form.Item
                                    name="resetPassword"
                                    className='w-2/3'
                                    rules={[ {required: true, message: 'Please input your password'} ]}
                                >
                                    <Input.Password className='signup-password w-full' placeholder='New Password' iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)} />
                                </Form.Item>
                            </ConfigProvider>
                        </div>
                        <div className='w-1/2 h-1/3 flex items-center justify-evenly'>
                            <Button className='forgot-btn-back px-10' type='button' onClick={ () => {setFormStatus('signin'); formReset.resetFields()} }> Back </Button>
                            <Button className='forgot-btn px-10' type='button' htmlType='submit'> Submit </Button>
                        </div>
                    </Form>
                    }
                </div>
                </div>
            </Layout>

            <Footer>
                Powered By &nbsp; <b><i>autopeepal</i></b>
            </Footer>
        </Layout>
    );
}

export default Login;
