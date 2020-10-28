import request from 'utils/request';
export function useCertTemplateList(params) {
   return request.postXForm('certadmin/base/useCertTemplateList',params);
}
export function templateList(params) {
  return request.postXForm('certadmin/certTemplate/list',params);
}
export function templateUpdateStatus(params) {
    return request.postXForm('/certadmin/template/updateStatus',params);
}
export function getSysUserAuthList(params) {
  return request.postXForm('/certadmin/base/getSysUserAuthList',params);
}

export function setCertAuth(params) {
  return request.postXForm('/certadmin/cert/setCertAuth',params);
}
export function certTemplateUpdateStatus(params){
  
  return request.postXForm('/certadmin/certTemplate/updateStatus',params);
}
export function certUseList(params) {
  return request.postXForm('/certadmin/cert/addOrUpdate/useList',params);
}
export function screenDepartmentByIds(params) {
  return request.postXForm('/certadmin/department/screenDepartmentByIds',params);
}
export function addOrUpdateUseList(params) {
  return request.postXForm('/certadmin/certTemplate/addOrUpdate/useList',params);
}
export function certTemplateDetail(params) {
  return request.postXForm('/certadmin/certTemplate/detail',params);
}

export function templateDeleteById(params) {
  return request.postXForm('/certadmin/certTemplate/delete',params);
}
export function templateAddOrUpdate(params) {
  return request.postXForm('/certadmin/certTemplate/save',params);
}
export function ossUpload(params){
  return request.postFormData('/certadmin/oss/upload',params)

}
export function multiSaveUploadFile(params){
  return request.postFormData('/certadmin/cert/save/uploadFile',params)

}
export function batchUploadCertPreview(params){
  return request.postJson('/certadmin/cert/save/batchUploadCertPreview',params)

}
export function batchStart(params){
  return request.postFormData('/certadmin/cert/save/batchStart',params)

}
export function batchCertIssueSave(params){
  return request.postJson('/certadmin/cert/save/batchCertIssueSave',params)
}
export function batchList(params){
  return request.postFormData('/certadmin/cert/save/batchList',params)
}
export function certUploadTx(params){
  return request.postXForm('certadmin/cert/uploadTxCert',params);
}