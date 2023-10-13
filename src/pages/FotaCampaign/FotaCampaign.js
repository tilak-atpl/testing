import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { AppMenu, Navbar, Header, Footer, SideMenu } from '../../components';
import { AppMenuList } from '../../utils/constants';
import { AppActions, LiveMapActions } from '../../stores/actions';
import { PageContent, SubMenu } from '.';

import { Layout } from "antd";
const { Content  } = Layout;

const FotaCampaign = () => {
    const dispatch = useDispatch();
    const userId = useSelector( ({User}) => User.userId );
    const { mainMenuCollapsed, detailMenuCollapsed } = useSelector( ({App}) => App );
    const { vehicleList } = useSelector( ({LiveMap}) => LiveMap );

    const [activeMenu, setActiveMenu] = useState(0);
    const [subMenuVisible, setSubMenuVisible] = useState(false);
    const menuItems = [
        {
            key: 0,
            label: 'Campaign1',
            vehicles: ['f14cf775-8813-4a0f-9974-5b617aec8820', '57827384-e4ad-4853-ac3b-0eedcb5afbef', 'e1c5a282-dc32-4cdd-98e2-689f6e6f5826']
        },
        {
            key: 1,
            label: 'Campaign2',
            vehicles: ['57827384-e4ad-4853-ac3b-0eedcb5afbef', 'e1c5a282-dc32-4cdd-98e2-689f6e6f5826']
        },
        {
            key: 2,
            label: 'Campaign3',
            vehicles: []
        }
    ];

    useEffect( () => {
        dispatch(AppActions.setMainMenuCollapsed(true));
        dispatch(LiveMapActions.getVehicleList(userId));
        dispatch(LiveMapActions.getVehicleGroupList(userId));
    }, [dispatch, userId]);

    const handleMenuSelect = ({key}) =>{
        const menu = parseInt(key);
        setActiveMenu(menu);
        setSubMenuVisible(true);
    };

    
    return (
        <Layout className="flex h-screen">
            <Navbar />

            <Layout>
                <AppMenu activePage={2} menuList={AppMenuList} menuCollapsed={mainMenuCollapsed} />

                <Layout style={{ flex: "1 1 auto" }}>
                    <Header title={'FOTA Campaign'} />

                    <Content style={{width: '100%', height: '100%'}}>
                        <PageContent
                            activeMenu={activeMenu}
                            vehicleList={vehicleList}
                            campaign={menuItems[activeMenu]}
                        />
                    </Content>
                </Layout>

                { !subMenuVisible &&
                <SideMenu
                    title={'Select FOTA Campaign'}
                    headerStyle={{fontSize: 18}}
                    items={menuItems}
                    activeMenu={activeMenu}
                    menuCollapsed={detailMenuCollapsed}
                    handleItemSelect={handleMenuSelect}
                /> }

                { subMenuVisible &&
                <SubMenu
                    title={'Vehicle List'}
                    headerStyle={{fontSize: 18}}
                    items={vehicleList}
                    campaign={menuItems[activeMenu]}
                    menuCollapsed={detailMenuCollapsed}
                    mainMenu={!subMenuVisible}
                    handleBack={() => setSubMenuVisible(false)}
                /> }
            </Layout>

            <Footer>
                Powered By &nbsp; <b><i>autopeepal</i></b>
            </Footer>
        </Layout>
    );
}

export default FotaCampaign;
