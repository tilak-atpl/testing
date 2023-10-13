import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, Button, Input, Popconfirm, message } from 'antd';
import { EyeTwoTone, EyeInvisibleOutlined, LockOutlined } from '@ant-design/icons';
import VehicleItem from './VehicleItem';
import { LiveMapActions, UserActions } from '../../stores/actions';
import { PASSWORD_MSG, getFullName } from '../../utils/constants';
import './Profile.css';

const PageContent = () => {
    const dispatch = useDispatch();
    const { themeColor, avatar, userId, userName, userRole, changePassword, msg } = useSelector( ({User}) => User );
    const { vehicleList } = useSelector( ({LiveMap}) => LiveMap );
    const vehicleCount = vehicleList.length;

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [confirmVisible, setConfirmVisible] = useState(false);

    useEffect( () => {
        dispatch(LiveMapActions.getVehicleList(userId));
    }, [dispatch, userId]);

    useEffect( () => {
        if (msg.includes(PASSWORD_MSG.NOT_MATCH))
            message.error(PASSWORD_MSG.NOT_MATCH);
        if (msg.includes(PASSWORD_MSG.TOO_SHORT))
            message.warning(PASSWORD_MSG.TOO_SHORT);
        if (msg.includes(PASSWORD_MSG.TOO_COMMON))
            message.warning(PASSWORD_MSG.TOO_COMMON);
    }, [msg]);

    useEffect( () => {
        setConfirmVisible(changePassword);
        if (changePassword)
            dispatch(UserActions.clearMsg());
    }, [dispatch, changePassword]);

    const handleInputChange = (e, type) => {
        if (type === 'new') {
            setPassword(e.target.value);
        }
        else if (type === 'confirm') {
            setConfirm(e.target.value);
        }
    };
    const handleChangePassword = () => {
        setConfirmVisible(true);
        if (password === '' || confirm === '') {
            message.warning('Password field may not be blank.');
            return;
        }
        if (password !== confirm) {
            message.warning('Password is not right. Please try again.');
            return;
        }

        dispatch(UserActions.changePassword({new_password1: password, new_password2: confirm}));
    };

    return (
        <div className='w-full h-full flex flex-col items-center'>
            <div className="user-info w-full h-[200px] flex items-center justify-center p-2">
                <div className='w-1/2 flex justify-center items-center'>
                    { avatar === null ?
                    <Avatar size={150} style={{background: '#fda3df', fontSize: 50}}> {userName.first.charAt(0).toUpperCase() + userName.last.charAt(0).toUpperCase()} </Avatar>
                    :
                    <Avatar size={150} src={avatar} />
                    }
                    <div className='w-1/2 h-full flex flex-col justify-center m-10 ml-5' style={{fontSize: 18}}>
                        <div> Name: { getFullName(userName) } </div>
                        <div> Role: { userRole } </div>
                        <div> Vehicle Count: { vehicleCount } </div>
                    </div>
                </div>
                <div className='w-1/2 pl-3'>
                    <Popconfirm
                        placement="right"
                        open={confirmVisible}
                        icon={<LockOutlined style={{ color: '#4096ff' }} />}
                        title={'Please type password to change.'}
                        description={
                            <div className='py-3' style={{width: 220}}>
                                <Input.Password
                                    className='mb-2'
                                    value={password}
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    onChange={e => handleInputChange(e, 'new')}
                                    placeholder='New Password' />
                                <Input.Password
                                    value={confirm}
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    onChange={e => handleInputChange(e, 'confirm')}
                                    placeholder='Confirm Password' />
                            </div>
                        }
                        onConfirm={handleChangePassword}
                        onCancel={() => setConfirmVisible(false)}
                        okButtonProps={{ style: {backgroundColor: '#4096ff'} }}
                        okText="Change"
                        cancelText="Cancel"
                    >
                        <Button className='text-white' style={{background: themeColor, width: 220, height: 50}} onClick={() => setConfirmVisible(!confirmVisible)}> Change Password </Button>
                    </Popconfirm>
                </div>
            </div>
            <div className="w-full h-3/4 flex flex-wrap items-center justify-evenly overflow-hidden overflow-y-auto p-5 pt-0">
                { vehicleList.map( (vehicle, index) =>
                    <div key={index} className="vehicle-item m-3">
                        <VehicleItem vehicle={vehicle} />
                    </div>
                )}
                { vehicleCount % 2 !== 0 &&
                <div className="m-3" style={{width: '47%'}}></div> }
            </div>
        </div>
    );
};

export default PageContent;
