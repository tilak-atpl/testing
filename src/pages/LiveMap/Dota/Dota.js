import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { AppMenu, Navbar, Header, Footer, SideMenu } from '../../../components';
import { DotaUtils } from '../../../utils';
import { AppMenuList } from '../../../utils/constants';
import { AppActions, DotaActions } from '../../../stores/actions';
import { DotaContent, SubMenu } from './';

import { Layout } from "antd";
const { Content  } = Layout;

const Dota = () => {
    const dispatch = useDispatch();
    const { mainMenuCollapsed, detailMenuCollapsed } = useSelector( ({App}) => App );
    const { liveParams, writeParams, actuatorTest, routineTest, ecuInfos, ecuTab } = useSelector( ({Dota}) => Dota );
    const { activeVehicle } = useSelector( ({LiveMap}) => LiveMap );
    const sub_model_id = activeVehicle?.sub_model?.id;

    const [activeMenu, setActiveMenu] = useState(0);
    const [subMenuVisible, setSubMenuVisible] = useState(false);

    let fotaFiles = activeVehicle.sub_model?.ecus[ecuTab.flashing]?.ecu[0]?.file;
    fotaFiles = fotaFiles?.map( file => ({
        ...file,
        label: file.sw_part_no
    })) || [];
    const subMenuItems = [[], [], liveParams, writeParams, actuatorTest, routineTest, ecuInfos, fotaFiles];

    useEffect( () => {
        if (sub_model_id !== undefined) {
            dispatch(AppActions.setMainMenuCollapsed(true));
            dispatch(DotaActions.getActuatorTest(sub_model_id));
        }
    }, [dispatch, sub_model_id]);

    const handleMenuSelect = ({key}) =>{
        const menu = parseInt(key);
        setActiveMenu(menu);
        if ((menu >= 2 && menu <= 5) || menu === 7)
            setSubMenuVisible(true);
        else setSubMenuVisible(false);
    };

    return (
        <Layout className="flex h-screen">
            <Navbar />

            <Layout>
                <AppMenu menuList={AppMenuList} menuCollapsed={mainMenuCollapsed} />

                <Layout style={{ flex: "1 1 auto" }}>
                    <Header title={DotaUtils.MenuItems[activeMenu].label} />

                    <Content style={{width: '100%', height: '100%'}}>
                        <DotaContent
                            activeMenu={activeMenu}
                            vehicle={activeVehicle}
                        />
                    </Content>
                </Layout>

                { !subMenuVisible &&
                <SideMenu
                    title={'Select Function'}
                    items={DotaUtils.MenuItems}
                    activeMenu={activeMenu}
                    menuCollapsed={detailMenuCollapsed}
                    handleItemSelect={handleMenuSelect}
                /> }

                { subMenuVisible &&
                <SubMenu
                    title={'Select ' + DotaUtils.MenuItems[activeMenu].label}
                    headerStyle={{fontSize: 18}}
                    activeMenu={activeMenu}
                    items={subMenuItems[activeMenu]}
                    menuCollapsed={detailMenuCollapsed}
                    mainMenu={!subMenuVisible}
                    handleBack={() => setSubMenuVisible(false)}
                    // handleItemSelect={handleMenuSelect}
                /> }
            </Layout>

            <Footer>
                Powered By &nbsp; <b><i>autopeepal</i></b>
            </Footer>
        </Layout>
    );
}

export default Dota;
