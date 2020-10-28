 /*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************/
import request from 'utils/request';
export function apiNoce(params) {
   
   return request.postXForm('/certadmin/base/getNetNonce',params);
}
export function apiVersion(params) {
   return request.postXForm('/certadmin/base/getVersion',params);
}
export function getJwtTokenConsortium() {
   return request.postXForm('/certadmin/base/getJwtTokenConsortium');
}

 