import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { LeftCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Footer, Header } from "../../components";
import { LiveMapUtils } from "../../utils";
import { LiveMapActions } from "../../stores/actions";

import { Layout, Menu, Input, Button, Checkbox, Popconfirm, Select, ColorPicker, Radio } from 'antd';
import { matchColor } from "../../utils/constants";
const { Sider } = Layout;

const DetailMenu = ({ menuList, menuCollapsed }) => {
    const dispatch = useDispatch();
    const { userId, userName, themeColor } = useSelector( ({User}) => User );
    const { oemList, variantList, modelList, subModelList, vehicleGroupList, segmentList, activeVehicle } = useSelector( ({LiveMap}) => LiveMap );
    const [modelYearList, setModelYearList] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [searchedMenuList, setSearchedMenuList] = useState([...menuList]);
    const [vehicleDetailEditable, setVehicleDetailEditable] = useState(false);
    const [vehicleDetailVisible, setVehicleDetailVisible] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const [selectedGroupList, setSelectedGroupList] = useState([...vehicleGroupList]);
    const [vehicleGroupVisible, setVehicleGroupVisible] = useState(false);
    const [vehicleGroupDetailEditable, setVehicleGroupDetailEditable] = useState(false);
    const [vehicleGroupDetailVisible, setVehicleGroupDetailVisible] = useState(false);
    const [selectedVehicleGroup, setSelectedVehicleGroup] = useState(null);
    const [vehiclesInGroup, setVehiclesInGroup] = useState([]);

    const [newVehicle, setNewVehicle] = useState(false);
    const [newVehicleGroup, setNewVehicleGroup] = useState(false);
    const [variantMode, setVariantMode] = useState('variant');

    useEffect( () => {
        setSearchedMenuList(menuList.filter(item => item.registration_id.toLowerCase().includes(searchText.toLowerCase()) ))
    }, [searchText, menuList]);

    useEffect( () => {
        setSelectedGroupList([...vehicleGroupList]);
    }, [vehicleGroupList])

    useEffect( () => {
        setModelYearList(subModelList.map(subModel => (
            {
                id: subModel.id,
                key: subModel.key,
                label: subModel.model_year,
            }
        ) ));
    }, [subModelList]);

    const handleCheckboxClick = (e, selectType, selectedId) => {
        if (selectType === 'select-all') {
            const list = searchedMenuList.map( item => ({
                ...item,
                checked: e.target.checked
            }));

            setSearchedMenuList(list);
        }
        else if (selectType === 'select-one') {
            const list = searchedMenuList.map( item => (
                selectedId === item.id ? {
                    ...item,
                    checked: e.target.checked
                } : {...item}
            ));
            setSearchedMenuList(list);
        }
        else if (selectType === 'group-select-one') {
            const list = selectedGroupList.map( item => (
                selectedId === item.id ? {
                    ...item,
                    checked: e.target.checked
                } : {...item}
            ));

            const group = selectedGroupList.find( item => selectedId === item.id );

            const vehicleList = searchedMenuList.map( item => (
                item.vehicle_group === group.id ? {
                    ...item,
                    checked: e.target.checked
                } : {...item}
            ));

            setSearchedMenuList(vehicleList);
            setSelectedGroupList(list);
        }
        else if (selectType === 'variant' || selectType === 'model') {
            setVariantMode(selectType);
        }
    };
    const handleVehicleItemClick = (item) => {
        setVehicleDetailVisible(true);
        setNewVehicle(false);

        const oem = item.vehicle_model?.oem,
            model = item.vehicle_model?.id,
            model_year = item.sub_model?.id,
            sub_model = item.sub_model?.id,
            variant = item.variant,
            segment = item.segment,
            vehicle_group = item.vehicle_group;

        const newData = { ...item,
            // imei: item.imei[0]?.mac_id,
            oem, variant, model, sub_model, model_year, segment, vehicle_group
        };

        setSelectedVehicle({ ...newData });
        dispatch(LiveMapActions.setVehicle(item));

        if (oem)
            dispatch(LiveMapActions.getVariantList(oem));
        if (model) {
            dispatch(LiveMapActions.getModelList(oem));
            dispatch(LiveMapActions.getSubModelList(model));
        }
        dispatch(LiveMapActions.getSegmentList());
    };
    const handleVehicleGroupItemClick = (item) => {
        setVehicleGroupDetailVisible(true);
        setSelectedVehicleGroup(item);
        setNewVehicleGroup(false);

        let list = [{
            type: 'vehicles-in-group',
            label: <div style={{fontWeight: 500}}> The vehicles in this group </div>
        }];
        menuList.forEach( vehicle => {
            vehicle.vehicle_group === item.id &&
            list.push({
                type: 'vehicles-in-group',
                label: vehicle.registration_id
            });
        });
        setVehiclesInGroup(list);
    };
    const handleInputChange = (e, type) => {
        setSelectedVehicle({...selectedVehicle, [type]: e.target.value})
    };
    const handleGroupInputChange = (e, type) => {
        setSelectedVehicleGroup({...selectedVehicleGroup, [type]: e.target.value})
    };
    const handleGroupColorChange = (color, type) => {
        setSelectedVehicleGroup({...selectedVehicleGroup, [type]: color.toHexString().slice(1)})
    }
    const handleSelectChange = (value, type) => {
        if (type === 'oem') {
            if (value === activeVehicle.vehicle_model?.oem && !newVehicle)
                setSelectedVehicle({...selectedVehicle,
                    oem: value,
                    variant: activeVehicle.variant,
                    model: activeVehicle.vehicle_model?.model,
                    sub_model: activeVehicle.sub_model?.id,
                    model_year: activeVehicle.sub_model?.id,
                });
            else setSelectedVehicle({...selectedVehicle, oem: value, variant: -1, model: -1, sub_model: -1, model_year: -1});

            dispatch(LiveMapActions.getVariantList(value));
            dispatch(LiveMapActions.getModelList(value));
        }
        else if (type === 'variant') {
            const selected = variantList.find(variant => variant.id === value);
            const model = selected?.model_id,
                sub_model = selected?.s_model_id;

            dispatch(LiveMapActions.getSubModelList(model));
            setSelectedVehicle({...selectedVehicle, variant: value, model, sub_model, model_year: sub_model});
        }
        else if (type === 'model') {
            setSelectedVehicle({...selectedVehicle, model: value});
            dispatch(LiveMapActions.getSubModelList(value));
        }
        else if (type === 'sub_model') {
            setSelectedVehicle({...selectedVehicle, sub_model: value});
        }
        else if (type === 'model_year') {
            setSelectedVehicle({...selectedVehicle, model_year: value});
        }
        else if (type === 'vehicle_group') {
            setSelectedVehicle({...selectedVehicle, vehicle_group: value});
        }
        else if (type === 'segment') {
            setSelectedVehicle({...selectedVehicle, segment: value});
        }
    }
    const handleClick = (type) => {
        if (type === 'add-vehicle') {
            setVehicleDetailVisible(true);
            setVehicleDetailEditable(true);
            setNewVehicle(true);
            setSelectedVehicle({
                picture: null,
            });

            dispatch(LiveMapActions.getSegmentList());
        }
        else if (type === 'vehicle_list') {
            setVehicleGroupVisible(false);
            setVehicleDetailVisible(false);
            setVehicleDetailEditable(false);
        }
        else if (type === 'edit-detail') {
            setVehicleDetailEditable(true);
        }
        else if (type === 'save-detail') {
            setVehicleDetailEditable(false);

            const data = {
                ...selectedVehicle,
                vehicle_model: selectedVehicle.model,
                mobile: null,
                user_type: 1,
                user: userId
            }

            dispatch(LiveMapActions.saveVehicle(newVehicle, data, newVehicle ? '' : selectedVehicle.id));
        }
        else if (type === 'delete-vehicle') {
            dispatch(LiveMapActions.deleteVehicle(selectedVehicle.id));
            setVehicleDetailVisible(false);
        }

        else if (type === 'add-vehicle-group') {
            setVehicleGroupDetailVisible(true);
            setVehicleGroupDetailEditable(true);
            setNewVehicleGroup(true);
            setSelectedVehicleGroup({});
        }
        else if (type === 'vehicle_group') {
            setVehicleGroupVisible(true);
            setVehicleGroupDetailVisible(false);
        }
        else if (type === 'vehicle_group_list') {
            setVehicleGroupDetailVisible(false);
        }
        else if (type === 'edit-group-detail') {
            setVehicleGroupDetailEditable(true);
        }
        else if (type === 'save-group-detail') {
            setVehicleGroupDetailEditable(false);
            const data = {
                ...selectedVehicleGroup,
                user: userId
            }
            dispatch(LiveMapActions.saveVehicleGroup(newVehicleGroup, data, newVehicleGroup ? '' : selectedVehicleGroup.id));            
        }
        else if (type === 'delete-vehicle-group') {
            dispatch(LiveMapActions.deleteVehicleGroup(selectedVehicleGroup.id));
            setVehicleGroupDetailVisible(false);
        }
    };

    const dropdownList = {
        oem: oemList,
        variant: variantList,
        model: modelList,
        sub_model: subModelList,
        model_year: modelYearList,
        vehicle_group: vehicleGroupList,
        segment: segmentList
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
            <div className="detail-menu flex flex-col justify-between h-full">
            { !vehicleGroupVisible ? 
            <>
                { !menuCollapsed && !vehicleDetailVisible && 
                <>
                    <div className="flex justify-between items-center" style={{background: matchColor(themeColor)}}>
                        <Header title={'Vehicle List'} classes='w-full' style={{fontSize: 20}} />
                        <PlusCircleOutlined className='cursor-pointer' style={{fontSize: 18, position: 'absolute', right: 10}} onClick={ () => handleClick('add-vehicle') } />
                    </div>
                    <div className="flex items-center m-1">
                        <Input className='w-5/6' placeholder={'Search'} style={{marginRight: 8}} value={searchText} onChange={e => setSearchText(e.target.value)} />
                        <Checkbox style={{position: 'absolute', right: 20}} onClick={ e => handleCheckboxClick(e, 'select-all') } />
                    </div>

                    <Menu
                        className="overflow-hidden overflow-y-auto"
                        theme="light"
                        mode="inline"
                        style={{ color: 'black', backgroundColor: 'white', flexGrow: 1 }}
                        selectable={false}
                        items={ searchedMenuList.map((item, index) => ({
                            key: index,
                            label: item.type === 'input' ? (
                                <Input placeholder={item.registration_id} />
                            ) : item.type === 'button' ? (
                                <Button className="w-full">{item.registration_id}</Button>
                            ) : (
                                <div className="flex justify-between">
                                    <span className="w-full overflow-hidden" style={{textOverflow: 'ellipsis'}} onClick={ () => handleVehicleItemClick(item) }>{item.registration_id}</span>
                                    <Checkbox checked={item.checked} onClick={ e => handleCheckboxClick(e, 'select-one', item.id) } />
                                </div>
                            )
                        })) }
                    />
                </>
                }
                
                { !menuCollapsed && vehicleDetailVisible &&
                <>
                    <div className="flex justify-between items-center" style={{background: matchColor(themeColor)}}>
                        <LeftCircleOutlined className='px-2' style={{fontSize: 20}} onClick={ () => handleClick('vehicle_list') }/>
                        <Header title={'Vehicle Detail'} style={{fontSize: 19, paddingInline: 0}} />
                        <div className="h-full flex items-center cursor-pointer pr-2" onClick={ () => handleClick(vehicleDetailEditable ? 'save-detail' : 'edit-detail') }>
                            { vehicleDetailEditable ?
                            <Icon icon="akar-icons:save" width="22" height="22" />
                            :
                            <Icon icon="fa:edit" width="22" height="22" /> }
                        </div>
                    </div>

                    <Menu
                        className="overflow-hidden overflow-y-auto"
                        theme="light"
                        mode="inline"
                        style={{ color: 'black', backgroundColor: 'white', flexGrow: 1 }}
                        selectable={false}
                        items={ (newVehicle ? 
                            LiveMapUtils.vehicleDetailMenuItems 
                            : 
                            [...LiveMapUtils.vehicleDetailMenuItems, ...LiveMapUtils.vehicleDetailMenuItems_addin]
                            ).map((item, index) => ({

                            key: index,
                            label: item.type === 'input' ? (
                                item.keyName === 'user' ?
                                <>
                                    <Input 
                                        className="w-1/2"
                                        readOnly={true}
                                        placeholder={'First Name'}
                                        value={userName.first}
                                    />
                                    <Input 
                                        className="w-1/2"
                                        readOnly={true}
                                        placeholder={'Last Name'}
                                        value={userName.last}
                                    />
                                </>
                                :
                                <Input 
                                    readOnly={!vehicleDetailEditable}
                                    placeholder={item.label}
                                    value={selectedVehicle[item.keyName]}
                                    onChange={ e => handleInputChange(e, item.keyName) } 
                                />
                            ) : item.type === 'button' ? (
                                <Button className="w-full">{item.label}</Button>
                            ) : item.type === 'button-delete' ? (
                                <Popconfirm
                                    title="Delete Confirm"
                                    description="Are you sure to delete this vehicle?"
                                    onConfirm={ () => handleClick('delete-vehicle') }
                                    okButtonProps={{ style: {backgroundColor: '#4096ff'} }}
                                    okText="Yes"
                                    cancelText="No"
                                    disabled={newVehicle}
                                >
                                    <Button className='w-full' danger disabled={newVehicle}> {item.label} </Button>
                                </Popconfirm>
                            ) : item.type === 'link' ? (
                                <Button className="w-full">
                                    <Link to={item.link}> {item.label} </Link>
                                </Button>
                            ) : item.type === 'dropdown' ? (
                                <>
                                <Select className={['variant', 'model'].includes(item.keyName) ? 'w-5/6' : 'w-full'}
                                    placeholder={item.label}
                                    value={selectedVehicle[item.keyName] === -1 ? undefined:selectedVehicle[item.keyName]}
                                    onChange={ value => handleSelectChange(value, item.keyName) }
                                    dropdownRender={(menu) =>
                                        vehicleDetailEditable ?
                                        (
                                        ['model', 'sub_model', 'model_year', 'variant'].includes(item.keyName) ? 
                                            (variantMode === 'variant' ? 
                                                (item.keyName === 'variant' ? menu : null)
                                            : (['model', 'sub_model', 'model_year'].includes(item.keyName) ? menu : null)
                                            )
                                        : menu
                                        )
                                        : null
                                    }
                                >
                                    { dropdownList[item.keyName]?.map( optionItem => (
                                        <Select.Option key={optionItem.key} value={optionItem.id}> {optionItem.label} </Select.Option>
                                    )) }
                                </Select>
                                { ['variant', 'model'].includes(item.keyName) && 
                                <Radio className='w-1/6 ml-5' checked={variantMode === item.keyName} onChange={ e => handleCheckboxClick(e, item.keyName)} />
                                }
                                </>
                            ) : (
                                <div className="flex justify-between w-full">
                                    <span className="w-full overflow-hidden" style={{textOverflow: 'ellipsis'}}> {item.label} </span>
                                    <Checkbox checked={item.checked} onClick={ e => handleCheckboxClick(e, 'select-one', item.id) } />
                                </div>
                            )
                        })) }
                    />
                </>
                }
            </>
            :
            <>
                <>
                    <div className="flex justify-between items-center" style={{background: matchColor(themeColor)}}>
                    { !vehicleGroupDetailVisible ?
                    <>
                        <Header title={'Vehicle Group List'} classes={'w-full'} style={{fontSize: 20}} />
                        <PlusCircleOutlined className='cursor-pointer' style={{fontSize: 18, position: 'absolute', right: 10}} onClick={ () => handleClick('add-vehicle-group') } />
                    </>
                    :
                    <>
                        <LeftCircleOutlined className='px-2' style={{fontSize: 20}} onClick={ () => handleClick('vehicle_group_list') }/>
                        <Header title={'Vehicle Group Detail'} style={{fontSize: 19, paddingInline: 0}} />
                        <div className="h-full flex items-center cursor-pointer pr-2" onClick={ () => handleClick(vehicleGroupDetailEditable ? 'save-group-detail' : 'edit-group-detail') }>
                            { vehicleGroupDetailEditable ?
                            <Icon icon="akar-icons:save" width="22" height="22" />
                            :
                            <Icon icon="fa:edit" width="22" height="22" /> }
                        </div>
                    </> }
                    </div>

                    <Menu
                        className="overflow-hidden overflow-y-auto"
                        theme="light"
                        mode="inline"
                        style={{ color: 'black', backgroundColor: 'white', flexGrow: 1 }}
                        selectable={false}
                        items={ (vehicleGroupDetailVisible ? [...LiveMapUtils.groupDetailMenuItems, ...vehiclesInGroup] : selectedGroupList).map((item, index) => ({
                            key: index,
                            label: item.type === 'input' ? (
                                <Input 
                                    readOnly={!vehicleGroupDetailEditable}
                                    placeholder={item.label}
                                    value={selectedVehicleGroup[item.keyName]}
                                    onChange={ e => handleGroupInputChange(e, item.keyName) }
                                />
                            ) : item.type === 'button-delete' ? (
                                <Popconfirm
                                    title="Delete Confirm"
                                    description="Are you sure to delete this vehicle group?"
                                    onConfirm={ () => handleClick('delete-vehicle-group') }
                                    okButtonProps={{ style: {backgroundColor: '#4096ff'} }}
                                    okText="Yes"
                                    cancelText="No"
                                    disabled={newVehicleGroup}
                                >
                                    <Button danger disabled={newVehicleGroup}> {item.label} </Button>
                                </Popconfirm>
                            ) : item.type === 'color' ? (
                                <div className="flex justify-between">
                                    {item.label}
                                    <ColorPicker disabled={!vehicleGroupDetailEditable} value={selectedVehicleGroup[item.keyName]} onChange={ e => handleGroupColorChange(e, item.keyName) } />
                                </div>
                            ) : item.type === 'vehicles-in-group' ?  (
                                item.label
                            ) : (
                                <div className="flex justify-between">
                                    <span className="w-full overflow-hidden" style={{textOverflow: 'ellipsis'}} onClick={ () => handleVehicleGroupItemClick(item) }>{item.group_name}</span>
                                    <Checkbox checked={item.checked} onClick={ e => handleCheckboxClick(e, 'group-select-one', item.id) } />
                                </div>
                            )
                        })) }
                    />
                </>
            </> }

                <Footer style={{background: matchColor(themeColor), height: 40}} classes={'justify-evenly'}>
                    <Button className="w-[40px] flex justify-center items-center" shape='circle' size="large" onClick={ () => handleClick('vehicle_list') } style={!vehicleGroupVisible ? {filter: 'drop-shadow(0 0 1px #ffffff)', borderWidth: 2} : {}}>
                        <Icon icon="ic:round-directions-car" width="25" height="25" />
                    </Button>
                    <Button className="w-[40px] flex justify-center items-center" shape='circle' size="large" onClick={ () => handleClick('vehicle_group') } style={vehicleGroupVisible ? {filter: 'drop-shadow(0 0 1px #ffffff)', borderWidth: 2} : {}}>
                        <Icon icon="mdi:car-multiple" width="25" hegith="25" />
                    </Button>
                </Footer>
            </div>
        </Sider>
    );
};

export default DetailMenu;