import React, {useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';

import { AppMenu, Navbar, Header, Footer } from "../../../components";
import { AppMenuList } from "../../../utils/constants";
import { AppActions, LiveMonitorActions } from "../../../stores/actions";
import { DetailMenu } from ".";
import './LiveMonitor.css';

import { Layout } from "antd";
const { Content  } = Layout;

const LiveMonitor = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const userId = useSelector( ({User}) => User.userId );
    const { lMonitorParams } = useSelector( ({LiveMonitor}) => LiveMonitor );
    const { activeVehicle: vehicle } = useSelector( ({LiveMap}) => LiveMap );
    const { mainMenuCollapsed, detailMenuCollapsed } = useSelector( ({App}) => App );

    useEffect( () => {
        if (Object.keys(vehicle).length === 0) {
            history.goBack();
            return;
        }
    }, [history, vehicle]);

    useEffect( () => {
        dispatch(AppActions.setMainMenuCollapsed(true));
        dispatch(LiveMonitorActions.getLMonitorParams(vehicle.registration_id, 'vreg_id'));
        dispatch(LiveMonitorActions.getLMonitorParamGroups(userId));
    }, [dispatch, userId, vehicle]);

    return (
        <Layout className="flex h-screen">
            <Navbar />

            <Layout>
                <AppMenu menuList={AppMenuList} menuCollapsed={mainMenuCollapsed} />

                <Layout style={{ flex: "1 1 auto" }}>
                    <Header title={'Live Monitor'} />

                    <Content style={{width: '100%', height: '100%'}}>

                    </Content>
                </Layout>

                <DetailMenu menuList={lMonitorParams} menuCollapsed={detailMenuCollapsed} />
            </Layout>

            <Footer>
                Powered By &nbsp; <b><i>autopeepal</i></b>
            </Footer>
        </Layout>
    );
}

export default LiveMonitor;