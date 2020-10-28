import request from 'utils/request';
export function apiLogin(params) {
   return request.postXForm('/certadmin/login',params);
}
//用户信息
export function apiUserInfo() {
    return request.postXForm('/certadmin/base/info');
}
export function apiUserLogout(){
    return request.get('/certadmin/logout');
}
export function modelList(params) {
    return request.postXForm('/certadmin/base/modelList',params);
 } 