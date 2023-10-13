import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Input, Tabs, Modal, Progress, message, ConfigProvider, Timeline } from 'antd';
import { InfoCircleOutlined, PlayCircleFilled, PauseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

import { DotaActions } from '../../../stores/actions';
import { DotaUtils } from '../../../utils';
import { matchColor } from '../../../utils/constants';
import './Dota.css'
import { Icon } from '@iconify/react';

const DotaContent = ({ activeMenu, vehicle }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { themeColor } = useSelector( ({User}) => User );
    const { terminalAppLogs, dtcDataset, liveParams, writeParams, ecuInfos, actuatorTest, routineTest, writeParamId, actuatorTestId, routineTestId, flashingId } = useSelector( ({Dota}) => Dota );
    const [characterType, setCharacterType] = useState(5);
    const [txFrame, setTxFrame] = useState('');
    const [ecuTab, setEcuTab] = useState({readDtc: 0, writeParam: 0});
    const [actuatorTestBtn, setActuatorTestBtn] = useState('');
    const [flashingBtn, setFlashingBtn] = useState(false);

    const ecuList = vehicle.sub_model?.ecus;
    let fotaFiles = [];
    if (ecuList !== undefined || ecuTab.flashing !== undefined) {
        fotaFiles = ecuList[ecuTab.flashing]?.ecu[0]?.file;
        fotaFiles = fotaFiles?.map( file => ({
            ...file,
            label: file.sw_part_no
        })) || [];
    }

    useEffect( () => {
        if (Object.keys(vehicle).length === 0) {
            history.goBack();
            return;
        }
    }, [history, vehicle]);

    const handleTabChange = (key, type) => {
        setEcuTab({...ecuTab, [type]: key});

        if (type === 'readDtc') {
            const command = DotaUtils.setFrameFormat(characterType, txFrame, '00');
            dispatch(DotaActions.getDtcDataset(ecuList[key].datasets[0]?.id));
            dispatch(DotaActions.sendTransmit(vehicle.id, `{${command}}`))
        }
        else if (type === 'liveParam') {
            dispatch(DotaActions.getLiveParams(ecuList[key].pid_datasets[0]?.id));
            dispatch(DotaActions.getLiveParamGroupList(ecuList[key].pid_datasets[0]?.id));
        }
        else if (type === 'writeParam') {
            dispatch(DotaActions.getWriteParams(ecuList[key].pid_datasets[0]?.id));
        }
        else if (type === 'actuatorTest') {
            dispatch(DotaActions.getActuatorTest(vehicle.sub_model?.id, ecuList[key].id));
        }
        else if (type === 'routineTest') {
            dispatch(DotaActions.getRoutineTest(vehicle.sub_model?.id, ecuList[key].id));
        }
        else if (type === 'ecuInfo') {
            dispatch(DotaActions.getEcuInfos(ecuList[key].pid_datasets[0]?.id));
        }
    };

    useEffect( () => {
        dispatch(DotaActions.setEcuTab(ecuTab));
    }, [dispatch, ecuTab]);

    useEffect( () => {
        handleTabChange(0, DotaUtils.MenuItems[activeMenu].value);
    }, [activeMenu]);

    const handleChange = (e, type) => {
        if (type === 'txFrame') {
            let isInvalid = !e.target.checkValidity();
            e.target.setAttribute('aria-invalid', isInvalid);

            if (!isInvalid)
                setTxFrame(e.target.value);
        }
        else if (type === 'writeParam-value') {

        }
    };
    const handleCharacterType = (type) => {
        setCharacterType(type);
    };
    const handleRoutineTestButton = (type, data) => {
        if (type === 'start') {
            let list = [];
            routineTest.forEach( item => {
                let subList = [], modified = {...item};
                modified.ior_test_routine.forEach( subItem => {
                    subList.push(subItem.id === data.id ? {
                        ...subItem,
                        status: 'stop'
                    } : {...subItem})
                })
                list.push({
                    ...item,
                    ior_test_routine: [...subList]
                });
            });
            handleButtonClick('routineTest', 'start');
            dispatch(DotaActions.setRoutineTest(list));
        }
        else if (type === 'stop') {
            let list = [];
            routineTest.forEach( item => {
                let subList = [], modified = {...item};
                modified.ior_test_routine.forEach( subItem => {
                    subList.push(subItem.id === data.id ? {
                        ...subItem,
                        status: 'start'
                    }: {...subItem})
                })
                list.push({
                    ...item,
                    ior_test_routine: [...subList]
                });
            });
            handleButtonClick('routineTest', 'stop');
            dispatch(DotaActions.setRoutineTest(list));
        }
        else if (type === 'check') {
            message.info('Check ' + data.title);
            handleButtonClick('routineTest', 'check');
        }
        else if (type === 'info') {
            Modal.info({
                title: data.title,
                width: 800,
                okButtonProps: {
                    style: { background: '#4096ff' }
                },
                content: (
                  <div>
                    <p> {data.description} </p>
                  </div>
                ),
                onOk() {},
            });
        }
    };
    const handleButtonClick = (type, subType) => {
        setTxFrame("") //changed: after make submission ,The input box will be empty.
        
        if (type === 'terminalApp') {
            if (subType === 'send-txFrame') {
                if (txFrame === '') {
                    message.error('Please type value.');
                    return;
                }
                if (txFrame.length % 2 !== 0) {
                    message.error('The Tx Frame format is not right. Must be even length.');
                    return;
                }
        
                const command = DotaUtils.setFrameFormat(characterType, txFrame, '00');

                dispatch(DotaActions.setTerminalAppLog({
                    log: `Transmit: ${command}`,
                    timestamp: moment().format('YYYY-MM-DD HH:mm:ss')}));
                dispatch(DotaActions.sendTransmit(vehicle.id, `{${command}}`))
            }
            else if (subType === 'clear') {
                dispatch(DotaActions.clearTerminalAppLog());
            }
            else if (subType === 'copy2clipboard') {
                message.success('Copied to clipboard!');
                let data = [];
                data = terminalAppLogs.map( item => item.label + ' ' + item.text)

                const textarea = document.createElement('textarea');
                textarea.value = data.length === 0 ? ' ' : data.join('\n');

                document.body.appendChild(textarea);
                textarea.select();

                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
        }
        else if (type === 'readDtc') {
            const index = ecuList[ecuTab[type]].read_dtc_fn_index.value;
            if (subType === 'read') {
                if (index.search('GENERICOBD')) {
                    const command1 = DotaUtils.setFrameFormat('4', '03', '00');
                    const command2 = DotaUtils.setFrameFormat('4', '07', '00');
                    message.success(command1);
                    message.success(command2);
            
                    dispatch(DotaActions.sendTransmit(vehicle.id, `{${command1}, ${command2}}`))
                }
                else if (index.search('UDS')) {
                    const command = DotaUtils.setFrameFormat('4', '1902AF', '00');
                    message.success(command);
            
                    dispatch(DotaActions.sendTransmit(vehicle.id, `{${command}}`))
                }
                else if (index.search('KWP')) {
                    const command = DotaUtils.setFrameFormat('4', '1800AF', '00');
                    message.success(command);
            
                    dispatch(DotaActions.sendTransmit(vehicle.id, `{${command}}`))
                }
            }
            else if (subType === 'clear') {
                if (index.search('GENERICOBD')) {
                    const command = DotaUtils.setFrameFormat('4', '04', '00');
                    message.success(command);
            
                    dispatch(DotaActions.sendTransmit(vehicle.id, `{${command}}`))
                }
                else {
                    const command = DotaUtils.setFrameFormat('4', '14FFFFFF', '00');
                    message.success(command);
            
                    dispatch(DotaActions.sendTransmit(vehicle.id, `{${command}}`))
                }
            }
        }
        else if (type === 'liveParam') {
            let commands = [];
            liveParams.filter(param => param.checked).forEach( param => {
                const command = DotaUtils.setFrameFormat('4', param.code, '00');
                commands.push(command);
            });
            message.success(commands.join(','));
            dispatch(DotaActions.sendTransmit(vehicle.id, `{${commands.join(',')}}`));
        }
        else if (type === 'writeParam') {
            // Submit Button Event
        }
        else if (type === 'actuatorTest') {
            if (subType === 'start') {
                const command1 = DotaUtils.setFrameFormat('4', `1003`, '00');
                const command2 = DotaUtils.setFrameFormat('4', actuatorTest[actuatorTestId].start_test, '00');
                message.success(command1);
                message.success(command2);
       
                setActuatorTestBtn('On');
                dispatch(DotaActions.sendTransmit(vehicle.id, `{${command1}, ${command2}}`))
            }
            else if (subType === 'stop') {
                const command1 = DotaUtils.setFrameFormat('4', `1003`, '00');
                const command2 = DotaUtils.setFrameFormat('4', actuatorTest[actuatorTestId].stop_test, '00');
                message.success(command1);
                message.success(command2);
        
                setActuatorTestBtn('Off');
                dispatch(DotaActions.sendTransmit(vehicle.id, `{${command1}, ${command2}}`))
            }
            else if (subType === 'return_control') {
                const command1 = DotaUtils.setFrameFormat('4', `1003`, '00');
                const command2 = DotaUtils.setFrameFormat('4', actuatorTest[actuatorTestId].return_control, '00');
                message.success(command1);
                message.success(command2);
        
                setActuatorTestBtn('Return Control');
                dispatch(DotaActions.sendTransmit(vehicle.id, `{${command1}, ${command2}}`))
            }
        }
        else if (type === 'routineTest') {
            if (subType === 'start') {
                const command1 = DotaUtils.setFrameFormat('4', `1003`, '00');
                const command2 = '' //DotaUtils.setFrameFormat('4', routineTest[routineTestId].start_test, '00');
                message.success(command1);
                message.success(command2);
        
                dispatch(DotaActions.sendTransmit(vehicle.id, `{${command1}, ${command2}}`))
            }
            else if (subType === 'stop') {
                const command1 = DotaUtils.setFrameFormat('4', `1003`, '00');
                const command2 = '' //DotaUtils.setFrameFormat('4', routineTest[routineTestId].stop_test, '00');
                message.success(command1);
                message.success(command2);
        
                dispatch(DotaActions.sendTransmit(vehicle.id, `{${command1}, ${command2}}`))
            }
            else if (subType === 'check') {
                const command1 = DotaUtils.setFrameFormat('4', `1003`, '00');
                const command2 = '' //DotaUtils.setFrameFormat('4', routineTest[routineTestId].return_control, '00');
                message.success(command1);
                message.success(command2);
        
                dispatch(DotaActions.sendTransmit(vehicle.id, `{${command1}, ${command2}}`))
            }
        }
        else if (type === 'flashing') {
            setFlashingBtn(!subType);
        }
    };

    const renderTerminalApp = () => {
        const types = [5, 2, 4];

        return (
            <div className='flex flex-col h-full'>
                <div className="w-full flex flex-col items-center p-7 text-2xl">
                    <div className='w-full flex justify-between p-2 pl-5 pr-5' style={{height: 70}}>
                    { types.map( type => (
                        <Button key={type}
                            style={{
                                width: 150,
                                height: 50,
                                borderColor: matchColor(themeColor),
                                background: type === characterType ? matchColor(themeColor) : 'rgb(166 231 231)',
                                color: type === characterType ? 'white' : 'black'}}
                            onClick={ () => handleCharacterType(type) }
                        >
                            { type + '0' }
                        </Button>
                    )) }
                    </div>
                    
                    <div className='w-full flex justify-center'>
                         {/* changed input's box background as transparent */}
                         <Input name="txFrame" type="text"
                            value={txFrame}
                            className='mr-3 pl-4'
                            style={{width: '90%', background:'transparent', border: '1px solid red' + matchColor(themeColor), borderRadius: 10}}
                            pattern='[A-Fa-f0-9]+'
                            placeholder='Enter the Diagnostic command. . .'
                            onChange={ e => handleChange(e, 'txFrame') }
                        />
                        <Button shape='circle'
                            className='text-white text-2xl'
                            style={{background: matchColor(themeColor), width: 50, height: 50}}
                            onClick={() => handleButtonClick('terminalApp', 'send-txFrame')}
                        >
                            {'>'}
                        </Button>
                    </div>
                </div>

                <div className = "bg-black overflow-y-auto w-full h-full">
                    <div className='flex justify-end'>
                        <Icon className='cursor-pointer m-1' icon="ic:sharp-refresh" width={30} height={30} color='white' onClick={() => handleButtonClick('terminalApp', 'clear')} />
                        <Icon className='cursor-pointer m-1' icon="fluent:clipboard-paste-16-regular" width={30} height={30} color='white' onClick={() => handleButtonClick('terminalApp', 'copy2clipboard')} />
                    </div>
                    <Timeline
                        className='text-white'
                        mode='left'
                        items={terminalAppLogs}
                    />
                </div>
            </div>
        );
    };

    const renderReadDTC = () => {
        return (
            <div className='overflow-hidden overflow-y-auto p-2'>
            <Tabs
                className='ecu-tab flex flex-col p-3'
                style={{height: '90%'}}
                // onChange={ key => handleTabChange(key, 'readDtc') }
                onTabClick={ key => handleTabChange(key, 'readDtc') }
                activeKey={ecuTab.readDtc}
                type="card"
                items={ecuList.map( (ecu, i) => {
                    return {
                        key: i,
                        label: ecu.name,
                        style: {height: '100%', border: '1px solid ' + matchColor(themeColor), borderTop: 'none', borderRadius: 5},
                        children: 
                            <div className='w-full h-full flex flex-col items-center py-5 px-7 overflow-x-hidden overflow-y-auto'>
                            { dtcDataset?.map( (item, index) => (
                                <div key={index} className='w-full flex justify-between m-1' style={{height: 65, border: '3px solid ' + matchColor(themeColor), borderRadius: 10}}>
                                    <div className='h-full flex flex-col items-left justify-center ml-5' style={{width: '75%', height: 60}}>
                                        <div>{item.code}</div>
                                        <div>{item.description}</div>
                                    </div>
                                    <div className='h-full flex flex-col items-end justify-center mr-5' style={{width: '25%'}}>
                                        <div> Status </div>
                                        <div className='flex flex-row items-center'>
                                            <Button className='text-white px-2 mr-3' style={{background: matchColor(themeColor)}}> Troubleshoot </Button>
                                            <Button className='text-white px-4' style={{background: matchColor(themeColor)}}> FF </Button>
                                        </div>
                                    </div>
                                </div>
                            )) }
                            </div>
                    };
                })}
            />

            <div className="w-full flex justify-evenly items-center text-2xl" style={{height: 60}}>
                <Button style={{background: matchColor(themeColor), color: 'white', width: 200, height: 50}} onClick={() => handleButtonClick('readDtc', 'read')}>
                    Refresh
                </Button>
                <Button style={{background: matchColor(themeColor), color: 'white', width: 200, height: 50}} onClick={() => handleButtonClick('readDtc', 'clear')}>
                    Clear
                </Button>
            </div>
            </div>
        );
    };
    
    const renderLiveParameters = () => {
        return (
            <div className='overflow-hidden overflow-y-auto p-2'>
            <Tabs
                className='ecu-tab flex flex-col p-3'
                style={{height: '90%'}}
                onChange={ key => handleTabChange(key, 'liveParam') }
                activeKey={ecuTab.liveParam}
                type="card"
                items={ecuList.map( (ecu, i) => {
                    return {
                        key: i,
                        label: ecu.name,
                        style: {height: '100%', border: '1px solid ' + matchColor(themeColor), borderTop: 'none', borderRadius: 5},
                        children: 
                            <div className='w-full h-full flex flex-col items-center py-5 px-7 overflow-x-hidden overflow-y-auto'>
                            { liveParams.filter(param => param.checked ).map( (item, index) => (
                                <div key={index} className='w-full flex justify-between m-1' style={{border: '3px solid ' + matchColor(themeColor), borderRadius: 10}}>
                                    <div className='flex flex-col items-left justify-center ml-5' style={{width: '90%', height: 60}}>
                                        {item.label}
                                    </div>
                                    <div className='flex flex-col items-center justify-center ml-5' style={{width: '10%'}}>
                                        {item.pi_code_variable[0].unit}
                                    </div>
                                </div>
                            ) )}
                            </div>
                    };
                })}
            />

            <div className="w-full flex justify-evenly items-center text-2xl" style={{height: 60}}>
                <Button style={{background: matchColor(themeColor), color: 'white', width: 200, height: 50}} onClick={() => handleButtonClick('liveParam', '')}>
                    Refresh
                </Button>
            </div>
            </div>
        );
    };

    const renderWriteParameters = () => {
        return (
            <Tabs
                className='ecu-tab flex flex-col p-3'
                style={{height: '100%'}}
                onChange={ key => handleTabChange(key, 'writeParam') }
                activeKey={ecuTab.writeParam}
                type="card"
                items={ecuList.map( (ecu, i) => {
                    return {
                        key: i,
                        label: ecu.name,
                        style: {height: '100%', border: '1px solid ' + matchColor(themeColor), borderTop: 'none', borderRadius: 5},
                        children: 
                        ( writeParams[writeParamId] === undefined ? null :
                            <div className='w-full h-full flex flex-col items-center py-5 px-7 overflow-x-hidden overflow-y-auto'>
                                <div className="w-full h-1/3 flex flex-col items-center justify-center py-5 px-7">
                                    <div className='text-2xl'> { writeParams[writeParamId]?.label } </div>
                                    <div> Enter the value to write </div>
                                </div>
                                <div className="w-full h-[300px] flex items-center justify-between py-5 px-7 text-2xl">
                                    <div className='flex flex-col items-center justify-center' style={{width: '40%'}}>
                                        <div className='mb-5'> Current Value </div>
                                        <Input readOnly value={''} className={`w-full text-center`} style={{background: themeColor, border: '1px solid ' + matchColor(themeColor)}} />
                                    </div>
                                    <div className='flex flex-col items-center justify-center'>
                                        <div className='mb-5' style={{paddingTop: '2rem'}}> </div>
                                        <div> UTS </div>
                                    </div>
                                    <div className='flex flex-col items-center justify-center' style={{width: '40%'}}>
                                        <div className='mb-5'> Write Value </div>
                                        <Input className='w-full text-center' style={{border: '1px solid ' + matchColor(themeColor)}} onChange={ e => handleChange(e, 'writeParam-value') } />
                                    </div>
                                </div>
                                <div className="w-full h-[200px] flex justify-center items-center text-2xl">
                                    <Button style={{background: matchColor(themeColor), color: 'white', width: 200, height: 50}} onClick={() => handleButtonClick('writeParam', '')}>
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        )
                    };
                })}
            />
        );
    };

    const renderActuatorTest = () => {
        return (
            <Tabs
                className='ecu-tab flex flex-col p-3'
                style={{height: '100%'}}
                onChange={ key => handleTabChange(key, 'actuatorTest') }
                activeKey={ecuTab.actuatorTest}
                type="card"
                items={ecuList.map( (ecu, i) => {
                    return {
                        key: i,
                        label: ecu.name,
                        style: {height: '100%', border: '1px solid ' + matchColor(themeColor), borderTop: 'none', borderRadius: 5},
                        children: 
                        ( actuatorTest[actuatorTestId] === undefined ? null :
                            <div className='w-full h-full flex flex-col items-center py-5 px-7 overflow-x-hidden overflow-y-auto'>
                                <div className="w-full h-1/3 flex flex-col items-center justify-center py-5 px-7">
                                    <div className='text-2xl'> { actuatorTest[actuatorTestId]?.label } </div>
                                    <div> {actuatorTestBtn} </div>
                                    <div> Press the buttons to initiate Actuator Test </div>
                                </div>
                                <div className="w-full h-[300px] flex items-center justify-between py-5 px-7 text-2xl">
                                    <div className='flex flex-col items-center justify-center' style={{width: '30%', height: 60}}>
                                        <Button 
                                            className={`w-full h-full text-center`}
                                            style={{background: themeColor, border: '1px solid ' + matchColor(themeColor), color: actuatorTestBtn === 'On' && 'white'}}
                                            onClick={() => handleButtonClick('actuatorTest', 'start')}> ON </Button>
                                    </div>
                                    <div className='flex flex-col items-center justify-center' style={{width: '30%', height: 60}}>
                                        <Button
                                            className={`w-full h-full text-center`}
                                            style={{background: themeColor, border: '1px solid ' + matchColor(themeColor), color: actuatorTestBtn === 'Off' && 'white'}}
                                            onClick={() => handleButtonClick('actuatorTest', 'stop')}> OFF </Button>
                                    </div>
                                </div>
                                <div className="w-full h-[200px] flex justify-center items-center text-2xl">
                                    <Button
                                        className={`w-full h-full text-center`}
                                        style={{background: themeColor, border: '1px solid ' + matchColor(themeColor), width: 200, height: 60, color: actuatorTestBtn === 'Return Control' && 'white'}}
                                        onClick={() => handleButtonClick('actuatorTest', 'return_control')}>
                                        Return Control
                                    </Button>
                                </div>
                            </div>
                        )
                    };
                })}
            />
        );
    };

    const renderRoutineTest = () => {
        return (
            <Tabs
                className='ecu-tab flex flex-col p-3'
                style={{height: '100%'}}
                onChange={ key => handleTabChange(key, 'routineTest') }
                activeKey={ecuTab.routineTest}
                type="card"
                items={ecuList.map( (ecu, i) => {
                    return {
                        key: i,
                        label: ecu.name,
                        style: {height: '100%', border: '1px solid ' + matchColor(themeColor), borderTop: 'none', borderRadius: 5},
                        children: 
                            <div className='w-full h-full flex flex-col items-center py-5 px-7 overflow-x-hidden overflow-y-auto'>
                            { routineTest[routineTestId]?.ior_test_routine.map( (item, index) => (
                                <div key={index} className='w-full flex justify-between m-1'>
                                    <div className='w-2/3 flex justify-between m-1' style={{border: '3px solid ' + matchColor(themeColor), borderRadius: 10}}>
                                        <div className='flex flex-col items-left justify-center ml-5' style={{width: '90%', height: 60}}>
                                            {item.description}
                                        </div>
                                        <div className='flex flex-col items-center justify-center ml-5' style={{width: '10%'}}>
                                            <InfoCircleOutlined style={{fontSize: 30, opacity: .7}} onClick={() => handleRoutineTestButton('info', {title: item.description, description: item.test_instruction})} />
                                        </div>
                                    </div>
                                    <div className='w-1/3 flex items-center justify-start pl-5'>
                                        { item.status === 'start' &&
                                        <>
                                        <PlayCircleFilled className={'pr-3'} style={{fontSize: 30, opacity: .7}} onClick={() => handleRoutineTestButton('start', {id: item.id})} />
                                        {'Not Started'}
                                        </>
                                        }
                                        { item.status === 'stop' &&
                                        <>
                                        <PauseCircleOutlined style={{fontSize: 30, opacity: .7}} onClick={() => handleRoutineTestButton('stop', {id: item.id})} />
                                        <CheckCircleOutlined className='pl-3 pr-3' style={{fontSize: 30, opacity: .7}} onClick={() => handleRoutineTestButton('check', {title: item.description})} />
                                        {'Status'}
                                        </>
                                        }
                                    </div>
                                </div>
                            ) )}
                            </div>
                    };
                })}
            />
        );
    };

    const renderECUInformation = () => {
        return (
            <Tabs
                className='ecu-tab flex flex-col p-3'
                style={{height: '100%'}}
                onChange={ key => handleTabChange(key, 'ecuInfo') }
                activeKey={ecuTab.ecuInfo}
                type="card"
                items={ecuList.map( (ecu, i) => {
                    return {
                        key: i,
                        label: ecu.name,
                        style: {height: '100%', border: '1px solid ' + matchColor(themeColor), borderTop: 'none', borderRadius: 5},
                        children: 
                            <div className='w-full h-full flex flex-col items-center py-5 px-7 overflow-x-hidden overflow-y-auto'>
                            { ecuInfos.map( (item, index) => (
                                <div key={index} className='w-full flex justify-between m-1' style={{border: '3px solid ' + matchColor(themeColor), borderRadius: 10}}>
                                    <div className='flex flex-col items-left justify-center ml-5' style={{width: '90%', height: 60}}>
                                        {item.label}
                                    </div>
                                    <div className='flex flex-col items-center justify-center ml-5' style={{width: '10%'}}>
                                        {item.pi_code_variable[0].unit}
                                    </div>
                                </div>
                            )) }
                            </div>
                    };
                })}
            />
        );
    };

    const renderFlashing = () => {
        return (
            <Tabs
                className='ecu-tab flex flex-col p-3'
                style={{height: '100%'}}
                onChange={ key => handleTabChange(key, 'flashing') }
                activeKey={ecuTab.flashing}
                type="card"
                items={ecuList.map( (ecu, i) => {
                    return {
                        key: i,
                        label: ecu.name,
                        style: {height: '100%', border: '1px solid ' + matchColor(themeColor), borderTop: 'none', borderRadius: 5},
                        children: 
                        ( fotaFiles[flashingId] === undefined ? null :
                            <div className='w-full h-full flex flex-col items-center py-5 px-7 overflow-x-hidden overflow-y-auto'>
                                <div className="w-full h-1/6 flex items-center justify-center py-5 px-7 text-2xl">
                                { flashingBtn && 'Status: Downloading' }
                                </div>
                                <div className="w-full h-[300px] flex items-center justify-evenly py-5 px-7 text-2xl">
                                    <Progress type="circle" percent={75} size={180} /> {/**  format={(percent) => `${percent} Days`} */}
                                    <Progress type="circle" percent={90} size={180} />
                                </div>
                                <div className="w-full h-[200px] flex justify-center items-center text-2xl">
                                    <Button
                                        className={`w-full h-full text-center`}
                                        style={{background: themeColor, border: '1px solid ' + matchColor(themeColor), width: 200, height: 60, color: actuatorTestBtn === 'Return Control' && 'white'}}
                                        onClick={() => handleButtonClick('flashing', flashingBtn)}>
                                        { !flashingBtn ? 'Start' : 'Stop' }
                                    </Button>
                                </div>
                            </div>
                        )
                    };
                })}
            />
        );
    };

    return (
        <ConfigProvider theme={{ 
                token: {
                    colorBgContainer: themeColor,
                    colorBorderSecondary: themeColor,
                    margin: 0,
                },
                components: {
                    Tabs: {
                        itemSelectedColor: 'white',
                        inkBarColor: 'red',
                    }
                }
            }}>
            { activeMenu === 0 && renderTerminalApp() }
            { activeMenu === 1 && renderReadDTC() }
            { activeMenu === 2 && renderLiveParameters() }
            { activeMenu === 3 && renderWriteParameters() }
            { activeMenu === 4 && renderActuatorTest() }
            { activeMenu === 5 && renderRoutineTest() }
            { activeMenu === 6 && renderECUInformation() }
            { activeMenu === 7 && renderFlashing() }
        </ConfigProvider>
    );
};

export default DotaContent;
