import request from 'utils/request';
export function checkCertify(params) {
   return request.postXForm('/certapp/cert/verify',params);
}
export function chainInfo(params) {
    return request.postXForm('/certapp/cert/findTxByHash',params);
 }
