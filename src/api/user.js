import request from 'utils/request';
export function apiUserList(params) {
   return request.postXForm('/admin/company/list',params);
}
export function apiUpdata(params) {
    return request.postXForm('/admin/company/updateStatus',params);
 }
 
 export function updateCanCreateNum(params) {
    return request.postXForm('/admin/company/updateCanCreateNum',params);
 }