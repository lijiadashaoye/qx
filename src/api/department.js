import request from 'utils/request';

export function departmentList(params) {
   return request.postXForm('certadmin/department/list',params);
}
export function departmentImport(params) {
    return request.postXForm('certadmin/department/import',params);
 }
 export function departmentUpdateStatus(params) {
  return request.postXForm('certadmin/department/updateStatus',params);
}
export function departmentDelete(params) {
  return request.postXForm('certadmin/department/delete',params);
}
export function departmentAddOrUpdate(params){
  return request.postXForm('certadmin/department/addOrUpdate',params);
}
export function downloadTemplate(){
  return request.get('certadmin/department/downloadTemplate');
}
 
 