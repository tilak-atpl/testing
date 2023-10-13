import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { UserActions } from '../stores/actions';
import { getFullName } from "../utils/constants";
import { Layout, Menu, Avatar } from 'antd';
import { Footer } from ".";
const { Sider } = Layout;

const AppMenu = ({ activePage, menuList, menuCollapsed }) => {
    const dispatch = useDispatch();
    const { themeColor, avatar, userName, userRole } = useSelector( ({User}) => User );

    return (
        <Sider 
            style={{background: themeColor, borderRight: '1px solid black'}}
            breakpoint="lg"
            collapsedWidth={50}
            trigger={null}
            collapsible collapsed={menuCollapsed}
            width={300}
        >
            <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col">
                { !menuCollapsed &&
                <div className="w-full flex flex-col items-center py-5">
                    { avatar === null ?
                    <Avatar size={150} style={{background: '#16a7ff', fontSize: 60}}> {userName.first.charAt(0).toUpperCase() + userName.last.charAt(0).toUpperCase()} </Avatar>
                    :
                    <Avatar size={150} src={avatar} />
                    }
                    <div className="font-bold" style={{fontSize: 20}}> {getFullName(userName)} </div>
                    <div style={{fontSize: 20}}> {userRole} </div>
                </div> }

                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[ activePage ? activePage.toString() : '0' ]}
                    style={{ color: 'black', background: themeColor }}
                    items={ menuList.map((item, index) => ({
                        key: index,
                        icon: item.icon,
                        style: {paddingLeft: 0},
                        label: 
                            ( item.label !== 'Log Out' ?
                            <Link to={item.link}> {item.label} </Link>
                            :
                            <div onClick={() => dispatch(UserActions.logoutUser()) }>
                                <Link to={item.link}> {item.label} </Link>
                            </div>
                            )
                    }) )}
                />
                </div>

                { !menuCollapsed &&
                <Footer children={'App Version: 1.0.0'} style={{borderTop: 'none'}} /> }
            </div>
        </Sider>
    );
};

export default AppMenu;