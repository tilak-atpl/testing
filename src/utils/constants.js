import { Icon } from '@iconify/react';

export const GMAP_API_KEY = process.env.REACT_APP_GMAP_API_KEY;
export const API_USER_URL = process.env.REACT_APP_API1_URL + '/api/v1/accounts';
export const API_VEHICLE_URL = process.env.REACT_APP_API1_URL + '/api/v1/vehicles';
export const API_OEM_URL = process.env.REACT_APP_API1_URL + '/api/v1/oem/oem/';
export const API_VARIANT_URL = process.env.REACT_APP_API1_URL + '/api/v1/variant/list';
export const API_MODEL_URL = process.env.REACT_APP_API1_URL + '/api/v1/models';
export const API_DATASET_URL = process.env.REACT_APP_API1_URL + '/api/v1/datasets';
export const API_TEST_URL = process.env.REACT_APP_API1_URL + '/api/v1/ior-test';
export const API_LMONITOR_URL = process.env.REACT_APP_API1_URL + '/api/v1/fotax';

export const API_TES_URL = process.env.REACT_APP_API2_URL + '/api';

export const loginCarousels = [
    {
        image_url: '/assets/image/login/1.png',
        title: 'Title 1',
        description: 'Description 1',
    }, {
        image_url: '/assets/image/login/2.png',
        title: 'Title 2',
        description: 'Description 2',
    }, {
        image_url: '/assets/image/login/3.png',
        title: 'Title 3',
        description: 'Description 3',
    }
];

export const AppMenuList = [
    {
        key: 0,
        label: 'Live Map',
        icon: <Icon icon="fa6-solid:map-location-dot" width={40} height={40} color='#fff' />,
        link: '/livemap'
    }, {
        key: 1,
        label: 'Reports',
        icon: <Icon icon="mdi:report-line-shimmer" width={40} height={40} color='#fff' />,
        link: '/reports'
    }, {
        key: 2,
        label: 'FOTA Campaign',
        icon: <Icon icon="ic:baseline-wifi-tethering" width={40} height={40} color='#fff' />,
        link: '/fota_campaign'
    }, {
        key: 3,
        label: 'Profile',
        icon: <Icon icon="basil:user-solid" width={40} height={40} color='#fff' />,
        link: '/profile'
    }, {
        key: 4,
        label: 'Log Out',
        icon: <Icon icon="ant-design:logout-outlined" width={40} height={40} color='#fff' />,
        link: '/logout'
    }
];

export const matchColor = (color) => {
    // const theme = parseInt(color.slice(1), 16);
    // const delta = parseInt('153026', 16);
    // console.log((theme - delta).toString(16))
    //return '#' + (theme - delta).toString(16);
    return color;
}

export const getFullName = (name) => name.first + ' ' + name.last

export const PASSWORD_MSG = {
    NOT_MATCH: 'The two password fields didn’t match.',
    TOO_SHORT: 'This password is too short. It must contain at least 8 characters.',
    TOO_COMMON: 'This password is too common.',

    FORGOT_OTP: 'OTP sent successfully',
    FORGOT_NOT_USER: 'User not found',
    RESET_NOT_OK: 'Invalid OTP or email'
};
export const REGISTER_MSG = {
    EMAIL_EXIST: 'email already registered',
    MOBILE_EXIST: 'mobile already registered'
}