import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { AppMenu, Navbar, Header, Footer } from '../../components';
import { AppMenuList } from '../../utils/constants';
import { AppActions } from '../../stores/actions';
import { PageContent } from '.';

import { Layout } from "antd";
const { Content  } = Layout;

const Profile = () => {
    const dispatch = useDispatch();
    const { mainMenuCollapsed } = useSelector( ({App}) => App );

    useEffect( () => { 
        dispatch(AppActions.setMainMenuCollapsed(true));
    }, [dispatch]);

    return (
        <Layout className="flex h-screen">
            <Navbar />

            <Layout>
                <AppMenu activePage={3} menuList={AppMenuList} menuCollapsed={mainMenuCollapsed} />

                <Layout style={{ flex: "1 1 auto" }}>
                    <Header title={'User Profile'} />

                    <Content style={{width: '100%', height: '100%'}}>
                        <PageContent />
                    </Content>
                </Layout>
            </Layout>

            <Footer>
                Powered By &nbsp; <b><i>autopeepal</i></b>
            </Footer>
        </Layout>
    );
}

export default Profile;
