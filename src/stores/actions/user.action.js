import axios from "axios";
import { handleAxiosError, setLoading } from "./app.action";
import { notification } from "../../utils";
import { API_USER_URL } from "../../utils/constants";

export const LOGIN_USER = '[APP] LOG IN';
export const loginUser = (username, password) => {
    const request = axios.post(`${API_USER_URL}/login/fotax/web`, {mobile: username, password}, {headers: {'Authorization': ''}});

    return dispatch => {
        dispatch(setLoading(true));

        request.then(response => response.data)
        .then(data => {
            const { token, user_id, first_name, last_name, role, profile_pic: avatar, oem }  =  data;
            const color = `#${oem.color}`;
            localStorage.setItem("token", JSON.stringify({user_id, first_name, last_name, role, access: token.access, avatar, color}));
            // setAuthToken(token.access);
    
            notification('success', 'Login Success', `Welcome ${first_name} ${last_name}`);
            Promise.all([
                dispatch({
                    type: LOGIN_USER,
                    payload: { user_id, first_name, last_name, role, avatar, color }
                })
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            notification('warning', 'Info', 'Phone Number or Password is not correct.');
            dispatch(setLoading(false));
        })
    };
}

export const loginUserByToken = (token) => {
    return {
        type: LOGIN_USER,
        payload: token
    }
};

export const LOGOUT_USER = '[APP] LOG OUT';
export const logoutUser = () => {
    localStorage.removeItem('token');
    
    return {
        type: LOGOUT_USER
    }
}

export const REGISTER_USER = '[APP] REGISTER_USER';
export const registerUser = (data) => {
    const request = axios.post(`${API_USER_URL}/fotax-register/`, data);

    return dispatch => {
        dispatch(setLoading(true));

        request.then(response => response.data)
        .then(data => {
            Promise.all([
                dispatch({
                    type: REGISTER_USER,
                    payload: { register: {success: true, email: data.email, mobile: data.mobile}, msg: '' }
                })
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            if (error.code === "ERR_NETWORK") {
                handleAxiosError(error, dispatch);
            }
            else {
                const { data } = error.response;
                dispatch({
                    type: REGISTER_USER,
                    payload: { register: {success: false}, msg: JSON.stringify(data) }
                });
            }
            dispatch(setLoading(false));
        })
    };
}

export const CHANGE_PASSWORD = '[APP] CHANGE_PASSWORD';
export const changePassword = (data) => {
    const request = axios.post(`${API_USER_URL}/password/change/`, data);

    return dispatch => {
        dispatch(setLoading(true));

        request.then(response => {
            const { success } = response.data;
            if (success) {
                notification('success', 'Update Success', 'Password changed successfully.');
            }

            Promise.all([
                dispatch({
                    type: CHANGE_PASSWORD,
                    payload: {changePassword: true}
                })
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            if (error.code === "ERR_NETWORK") {
                handleAxiosError(error, dispatch);
            }
            else {
                const { data } = error.response;
                dispatch({
                    type: CHANGE_PASSWORD,
                    payload: {changePassword: false, msg: data.new_password2}
                });
            }
            dispatch(setLoading(false));
        })
    };
}

export const RESET_PASSWORD = '[APP] RESET_PASSWORD';
export const resetPassword = (data) => {
    const request = axios.post(`${API_USER_URL}/reset/password/`, data);

    return dispatch => {
        dispatch(setLoading(true));

        request.then(response => {
            const { detail } = response.data;
            notification('success', 'Reset Success', 'Password updated successfully.');

            Promise.all([
                dispatch({
                    type: RESET_PASSWORD,
                    payload: {resetPassword: true, msg: detail}
                })
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            if (error.code === "ERR_NETWORK") {
                handleAxiosError(error, dispatch);
            }
            else {
                const { data } = error.response;
                dispatch({
                    type: RESET_PASSWORD,
                    payload: {resetPassword: false, msg: data.detail}
                });
            }
            dispatch(setLoading(false));
        })
    };
}
export const FORGOT_PASSWORD = '[APP] FORGOT_PASSWORD';
export const forgotPassword = (data) => {
    const request = axios.post(`${API_USER_URL}/forgot/password/`, data);

    return dispatch => {
        dispatch(setLoading(true));

        request.then(response => {
            const { detail } = response.data;
            Promise.all([
                dispatch({
                    type: FORGOT_PASSWORD,
                    payload: {forgotPassword: {success: true, email: data.email}, msg: detail}
                })
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            if (error.code === "ERR_NETWORK") {
                handleAxiosError(error, dispatch);
            }
            else {
                const { data } = error.response;
                dispatch({
                    type: FORGOT_PASSWORD,
                    payload: {forgotPassword: {success: false}, msg: data.detail}
                });
            }
            dispatch(setLoading(false));
        })
    };
}
export const VERIFY_OTP = '[APP] VERIFY_OTP';
export const verifyOTP = (data) => {
    const request = axios.post(`${API_USER_URL}/confirm-registration-otp/`, data);

    return dispatch => {
        dispatch(setLoading(true));

        request.then(response => {
            const { success } = response.data;
            if (success) {
                notification('success', 'Register Success', 'Account registered successfully');
            }

            Promise.all([
                dispatch({
                    type: VERIFY_OTP,
                    payload: {verifyOTP: success}
                })
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            if (error.code === "ERR_NETWORK") {
                handleAxiosError(error, dispatch);
            }
            else {
                const { data } = error.response;
                dispatch({
                    type: VERIFY_OTP,
                    payload: {verifyOTP: data.success}
                });
            }
            dispatch(setLoading(false));
        })
    };
}
export const RESEND_OTP = '[APP] RESEND_OTP';
export const resendOTP = (data) => {
    const request = axios.post(`${API_USER_URL}/resend-otp/`, data);

    return dispatch => {
        dispatch(setLoading(true));

        request.then(response => {
            const { status, success } = response.data;

            Promise.all([
                dispatch({
                    type: RESEND_OTP,
                    payload: {resendOTP: success, msg: status}
                })
            ]).then( () => dispatch(setLoading(false)) );
        }).catch(error => {
            if (error.code === "ERR_NETWORK") {
                handleAxiosError(error, dispatch);
            }
            else {
                // const { data } = error.response;
                dispatch({
                    type: RESEND_OTP,
                    payload: {resendOTP: false, msg: 'No User found with the E-mail'}
                });
            }
            dispatch(setLoading(false));
        })
    };
}

export const CLEAR_MSG = '[APP] CLEAR MSG';
export const clearMsg = () => ({
    type: CLEAR_MSG
})