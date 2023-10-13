import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { AppMenu, Navbar, Header, Footer } from '../../components';
import { AppMenuList } from '../../utils/constants';
import { AppActions } from '../../stores/actions';
import { PageContent } from '.';

import { Layout } from "antd";
const { Content  } = Layout;

const FirmwareUpdate = () => {
    const dispatch = useDispatch();
    const { mainMenuCollapsed } = useSelector( ({App}) => App );
    const { activeVehicle } = useSelector( ({LiveMap}) => LiveMap );

    useEffect( () => { 
        dispatch(AppActions.setMainMenuCollapsed(true));
    }, [dispatch]);

    return (
        <Layout className="flex h-screen">
            <Navbar />

            <Layout>
                <AppMenu menuList={AppMenuList} menuCollapsed={mainMenuCollapsed} />

                <Layout style={{ flex: "1 1 auto" }}>
                    <Header title={'Device Firmware Update'} />

                    <Content style={{width: '100%', height: '100%'}}>
                        <PageContent vehicle={activeVehicle} />
                    </Content>
                </Layout>
            </Layout>

            <Footer>
                Powered By &nbsp; <b><i>autopeepal</i></b>
            </Footer>
        </Layout>
    );
}

export default FirmwareUpdate;
