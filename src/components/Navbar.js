import React from 'react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { useSelector, useDispatch } from 'react-redux';
import { AppActions, UserActions } from '../stores/actions';
import { LeftCircleOutlined, MenuOutlined, RightCircleOutlined } from '@ant-design/icons';
import { getFullName } from '../utils/constants';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const Navbar = () => {
    const dispatch = useDispatch();
    const { login, themeColor, userName } = useSelector( ({User}) => User );
    const { mainMenuCollapsed, detailMenuCollapsed } = useSelector( ({App}) => App );

    const handleMainMenuCollapse = () => {
        dispatch(AppActions.setMainMenuCollapsed(!mainMenuCollapsed));
    };
    const handleDetailMenuCollapse = () => {
        dispatch(AppActions.setDetailMenuCollapsed(!detailMenuCollapsed));
    };

    return (
        <div className='shadow-md w-full top-0 left-0' style={{borderBottom: '1px solid black'}}>
           <div className={classNames(`md:flex items-center py-4 md:px-2 px-7`, login ? 'justify-between' : 'justify-center')} style={{backgroundColor: themeColor}}>
                <div className='font-bold text-2xl flex justify-between items-center'>
                    { login && (
                        mainMenuCollapsed ?
                            <RightCircleOutlined className='px-2' style={{fontSize: 20}} onClick={ handleMainMenuCollapse } />
                            :
                            <LeftCircleOutlined className='px-2' style={{fontSize: 20}} onClick={ handleMainMenuCollapse } />
                        )
                    }

                    <span className="px-1">FOTAX LITE</span>
                </div>

                { login &&
                <div className='font-bold text-2xl flex items-center pr-10'>
                    <span className="px-1">Welcome {getFullName(userName)}</span>
                </div>
                }
          
                { login &&
                <div className='flex justify-center items-center'>
                    <Menu as="div" className="relative ml-3 mr-5">
                        <div>
                            <Menu.Button className="flex justify-center items-center">
                                <MenuOutlined className="w-6 h-5" style={{fontSize: 20}}/>
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <Menu.Item>
                                    {({ active }) => (
                                    <Link
                                        to="/profile"
                                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                    >
                                        Your Profile
                                    </Link>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                    <Link
                                        to='/#'
                                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                        onClick={ () => dispatch(UserActions.logoutUser()) }
                                    >
                                        Log out
                                    </Link>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Transition>
                    </Menu>

                    { detailMenuCollapsed ?
                    <LeftCircleOutlined className='' style={{fontSize: 20}} onClick={ handleDetailMenuCollapse } />
                    :
                    <RightCircleOutlined className='' style={{fontSize: 20}} onClick={ handleDetailMenuCollapse } />
                    }
                </div>
                }
           </div>
        </div>
    );
};

export default Navbar;