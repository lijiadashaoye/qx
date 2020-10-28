import request from 'utils/request';
export function certList(params) {
   return request.postXForm('certadmin/cert/list',params);
}
export function certiSave(params){
   return request.postXForm('certadmin/cert/save/single',params);
}
export function certRevoke(params){
   return request.postXForm('certadmin/cert/revoke',params);
}
export function downloadTemplate(params){
   return request.postXForm('certadmin/cert/save/downloadTemplate',params);
}
export function certUploadTx(params){
   return request.postXForm('certadmin/cert/uploadTxCert',params);
}
export function batchUploadTx(params){
   return request.postXForm('certadmin/cert/save/batchUploadTx',params);
}
export function batchList(params){
   return request.postXForm('certadmin/cert/save/batchList',params);
}
