// import { apiGetUserInfo } from "api/user";

function getUserInfo() {
    const userInfo = sessionStorage.getItem("userInfo");
    if (userInfo && JSON.parse(userInfo).ucId) {
        return JSON.parse(userInfo);
    }
    else {
        return updateUserInfo();
    }
}

function isLogin() {
    const userInfo = sessionStorage.getItem("userInfo");
    if (userInfo && JSON.parse(userInfo).ucId) {
        return true;
    }
    else {
        return false;
    }
}

async function updateUserInfo() {
    try {
        const data = await apiGetUserInfo();
        if (data && data.ucId) {
            sessionStorage.setItem("userInfo", JSON.stringify(data));
            return data;
        }
        else {
            return null;
        }
    }
    catch (e) {
        return null;
    }

}

export default {
    getUserInfo,
    isLogin,
    updateUserInfo,
}

