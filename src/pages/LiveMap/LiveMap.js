import React, {useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";

import { AppMenu, Navbar, Header, Footer } from "../../components";
import { AppMenuList } from "../../utils/constants";
import { LiveMapUtils } from "../../utils";
import { LiveMapActions } from "../../stores/actions";
import { DetailMenu, MapSection } from "./";

import { Layout } from "antd";
const { Content  } = Layout;

const LiveMap = () => {
    const dispatch = useDispatch();
    const userId = useSelector( ({User}) => User.userId );
    const { vehicleList } = useSelector( ({LiveMap}) => LiveMap );
    const { mainMenuCollapsed, detailMenuCollapsed } = useSelector( ({App}) => App );

    useEffect( () => {
        dispatch(LiveMapActions.getVehicleList(userId));
        dispatch(LiveMapActions.getOEMList());
        dispatch(LiveMapActions.getVehicleGroupList(userId));
    }, [dispatch, userId]);

    return (
        <Layout className="flex h-screen">
            <Navbar />

            <Layout>
                <AppMenu menuList={AppMenuList} menuCollapsed={mainMenuCollapsed} />

                <Layout style={{ flex: "1 1 auto" }}>
                    <Header title={'Live Map'} />

                    <Content style={{width: '100%', height: '100%'}}>
                        <MapSection location={LiveMapUtils.centerLocation} zoomLevel={15} />
                    </Content>
                </Layout>

                <DetailMenu menuList={vehicleList} menuCollapsed={detailMenuCollapsed} />
            </Layout>

            <Footer>
                Powered By &nbsp; <b><i>autopeepal</i></b>
            </Footer>
        </Layout>
    );
}

export default LiveMap;