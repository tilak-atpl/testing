import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header, Footer } from "../../../components";
import { Layout, Menu, Checkbox, Input, Button, message } from 'antd';
import { DotaActions } from "../../../stores/actions";
import { DotaUtils } from "../../../utils";
import { matchColor } from "../../../utils/constants";
import { LeftCircleOutlined } from "@ant-design/icons";
const { Sider } = Layout;

const SubMenu = ({ title, items, menuCollapsed, activeMenu, headerStyle, handleBack }) => {
    const dispatch = useDispatch();
    const { themeColor } = useSelector( ({User}) => User);
    const { activeVehicle: vehicle } = useSelector( ({LiveMap}) => LiveMap );
    const { ecuTab, liveParams, ecuInfos, liveParamGroups, writeParamId, actuatorTestId, routineTestId, flashingId } = useSelector( ({Dota}) => Dota );

    const [searchText, setSearchText] = useState('');
    const [searchedMenuList, setSearchedMenuList] = useState([...items]);
    const [lParamGroupVisible, setLParamGroupVisible] = useState(false);
    const [selectedLParamGroups, setSelectedLParamGroups] = useState([...liveParamGroups]);
    
    const ecuList = vehicle.sub_model?.ecus;
    const defaultSelectedKeys = ['', '', '', writeParamId.toString(), actuatorTestId.toString(), routineTestId.toString(), '', flashingId.toString()];

    useEffect( () => {
        setSearchedMenuList(items?.filter(item => item.label.toLowerCase().includes(searchText.toLowerCase()) ))
    }, [searchText, items]);

    useEffect( () => {
        setSelectedLParamGroups([...liveParamGroups]);
    }, [liveParamGroups])

    const handleMenuItemSelect = ({key}) => {
        const index = parseInt(key);
        if (activeMenu === 3)
            dispatch(DotaActions.setWriteParamId(index));
        if (activeMenu === 4)
            dispatch(DotaActions.setActuatorTestId(index));
        if (activeMenu === 5)
            dispatch(DotaActions.setRoutineTestId(index));
        if (activeMenu === 7)
            dispatch(DotaActions.setFlashingId(index));
    }
    const handleButtonClick = (type) => {
        if (type === 'select_group') {
            setLParamGroupVisible(true);
        }
        else if (type === 'submit') {
            if (activeMenu === 2) {
                let commands = [];
                liveParams.filter(param => param.checked).forEach( param => {
                    const command = DotaUtils.setFrameFormat('4', param.code, '00');
                    commands.push(command);
                });
                message.success(commands.join(','));
                dispatch(DotaActions.sendTransmit(vehicle.id, `{${commands.join(',')}}`));
            }
            else if (activeMenu === 3) {
                const index = ecuList[ecuTab.writeParam].write_data_fn_index.value;
                if (index.search('UDS')) {
                    const command = DotaUtils.setFrameFormat('4', ecuList[ecuTab[type]].pid_datasets[0].code, '00');
                    message.success(command);
            
                    dispatch(DotaActions.sendTransmit(vehicle.id, `{${command}}`))
                }
                else if (index.search('KWP')) {
                    const command = DotaUtils.setFrameFormat('4', ecuList[ecuTab[type]].pid_datasets[0].code, '00');
                    message.success(command);
            
                    dispatch(DotaActions.sendTransmit(vehicle.id, `{${command}}`))
                }
            }
            else if (activeMenu === 6) {
                let commands = [];
                ecuInfos.forEach( ecu => {
                    const command = DotaUtils.setFrameFormat('4', ecu.code, '00');
                    commands.push(command);
                });
                message.success(commands.join(','));
                dispatch(DotaActions.sendTransmit(vehicle.id, `{${commands.join(',')}}`));
            }
        }
    };
    const handleCheckboxClick = (e, selectType, selectedId) => {
        if (selectType === 'select-all') {
            const list = searchedMenuList.map( item => ({
                ...item,
                checked: e.target.checked
            }));

            setSearchedMenuList(list);
            dispatch(DotaActions.setLiveParams(list));
        }
        else if (selectType === 'select-one') {
            const list = searchedMenuList.map( item => (
                selectedId === item.id ? {
                    ...item,
                    checked: e.target.checked
                } : {...item}
            ));
            setSearchedMenuList(list);
            dispatch(DotaActions.setLiveParams(list));
        }
        else if (selectType === 'group-select-one') {
            const list = selectedLParamGroups.map( item => (
                selectedId === item.id ? {
                    ...item,
                    checked: e.target.checked
                } : {...item}
            ));

            const group = selectedLParamGroups.find( item => selectedId === item.id );

            const paramList = searchedMenuList.map( item => (
                item.pi_code_variable[0].group.filter( grp => grp.id === group.id).length ? {
                    ...item,
                    checked: e.target.checked
                } : {...item}
            ));
            setSearchedMenuList(paramList);
            setSelectedLParamGroups(list);
            dispatch(DotaActions.setLiveParams(paramList));
        }
    };

    return (
        <Sider 
            style={{background: 'white', borderLeft: '1px solid black'}}
            breakpoint="lg"
            collapsedWidth={0}
            trigger={null}
            collapsible collapsed={menuCollapsed}
            width={300}
        >
            <div className="flex flex-col justify-between h-full">
                <div className="flex items-center justify-between" style={{background: matchColor(themeColor)}}>
                    <LeftCircleOutlined className='absolute px-2' style={{fontSize: 20}} onClick={ () => lParamGroupVisible ? setLParamGroupVisible(false) : handleBack() }/>
                    <Header title={title} classes={'w-full justify-center'} style={{...headerStyle}} />
                </div>

                { !lParamGroupVisible &&
                <div className="flex items-center m-1">
                    <Input className={activeMenu === 2?'w-5/6':'w-full'} placeholder={'Search'} style={{marginRight: 8}} value={searchText} onChange={e => setSearchText(e.target.value)} />
                    { activeMenu === 2 && <Checkbox style={{position: 'absolute', right: 20}} onClick={ e => handleCheckboxClick(e, 'select-all') } /> }
                </div> }

                <Menu
                    className="overflow-hidden overflow-y-auto"
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={ defaultSelectedKeys[activeMenu] }
                    style={{ color: 'black', backgroundColor: 'white', flexGrow: 1 }}
                    onSelect={ handleMenuItemSelect }
                    selectable={activeMenu !== 2}
                    items={ (lParamGroupVisible ? selectedLParamGroups:searchedMenuList).map((item, index) => ({
                        key: index,
                        label: (
                            <div className="flex justify-between">
                                <span className="w-full overflow-hidden" style={{textOverflow: 'ellipsis'}} onClick={ () => {} }>{item.label}</span>
                                { activeMenu === 2 && <Checkbox checked={item.checked} onClick={ e => handleCheckboxClick(e, (lParamGroupVisible?'group-':'') + 'select-one', item.id) } /> }
                            </div>
                        )
                    })) }
                />

                { activeMenu !== 7 &&
                <div className="flex justify-center my-1">
                    <Button className="w-1/3 text-white" size="large" style={{background: matchColor(themeColor), border: 'none'}} onClick={ () => handleButtonClick('submit') }>
                        Submit
                    </Button>
                </div> }
                { activeMenu === 2 &&
                <Footer style={{background: matchColor(themeColor), height: 40}} classes={'flex-col justify-evenly'}>
                    <Button className="flex justify-center text-white" size="large" style={{border: 'none'}} onClick={ () => handleButtonClick('select_group') }>
                        Select Group
                    </Button>
                </Footer> }
            </div>
        </Sider>
    );
};

export default SubMenu;