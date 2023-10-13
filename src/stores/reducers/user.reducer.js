import { UserActions as Actions } from '../actions';

const initialState = {
    login: false,
    userId: -1,
    userName: {first: 'M', last: 'S'},
    userRole: 'Admin',
    avatar: null,
    themeColor: '#F6B89F',

    changePassword: false,
    register: {
        success: false,
        email: null,
        mobile: null
    },
    forgotPassword: {
        success: false,
        email: null
    },
    resetPassword: false,
    resendOTP: false,
    verifyOTP: false,
    msg: ''
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case Actions.LOGIN_USER:
            const {user_id, first_name, last_name, role, avatar, color} = action.payload;

            return {
                ...state,
                login: true,
                userId: user_id,
                userName: {
                    first: first_name,
                    last: last_name,
                },
                userRole: role,
                avatar: avatar,
                themeColor: color
            };
        case Actions.LOGOUT_USER:
            return {
                ...state,
                login: false,
                userId: -1,
                userName: {first: 'M', last: 'S'},
                userRole: 'Admin',
                avatar: null,
                themeColor: '#F6B89F'
            };
        case Actions.REGISTER_USER:
        case Actions.FORGOT_PASSWORD:
        case Actions.RESET_PASSWORD:
        case Actions.VERIFY_OTP:
        case Actions.RESEND_OTP:
        case Actions.CHANGE_PASSWORD:
            return {
                ...state,
                ...action.payload
            }

        case Actions.CLEAR_MSG:
            return {
                ...state,
                changePassword: false,
                register: {
                    success: false,
                    email: null,
                    mobile: null
                },
                forgotPassword: {
                    success: false,
                    email: null
                },
                resetPassword: false,
                resendOTP: false,
                verifyOTP: false,
                msg: ''
            }
        default:
            return state;
    }
};