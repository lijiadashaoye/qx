 /*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************/
import request from 'utils/request';
export function apiAccountList(params) {
   return request.postXForm('certadmin/base/sysuser/list',params);
}
export function getDepartTreeListHAuth(params) {
   return request.postXForm('certadmin/base/getDepartTreeListHAuth',params);
}

export function getBlockInfo(params) {
   return request.postXForm('certadmin/base/getBlockInfo',params);
}
export function apiOptionAccount(params) {
    return request.postXForm('certadmin/sysuser/updateStatus',params);
 }
 export function apiDeleteAccount(params){
    return request.postXForm('certadmin/sysuser/deleteById',params);
 }
 export function apiRoleList(params) {
    return request.postXForm('certadmin/sysuser/sysrole/list',params);
 }

 export function  apiBaseEditOrAddUser(params) {
   return request.postXForm('certadmin/sysuser/editInfo',params);
}
export function  getSysUserDepartmentList(params) {
   return request.postXForm('certadmin/base/getSysUserDepartmentList',params);
}
 export function apiEditOrAddUser(params) {
    return request.postXForm('certadmin/sysuser/addOrUpdate',params);
 }
//  编辑登录人信息
 export function apiAddUser(params) {
    return request.postXForm('certadmin/base/update',params);
 }
 export function apiResetPaws(params) {
    return request.postXForm('certadmin/sysuser/resetpwd',params);
 }
 export function uploadTX(params){
   return request.postXForm('/certadmin/base/uploadTX',params);
 }

export function apiupdatePassword(params){
   return request.postXForm('certadmin/base/resetPwdByPwd',params);
}
export function sysroleAddOrUpdate(params){
   return request.postJson('certadmin/sysuser/sysrole/edit/addOrUpdate',params);
}
export function sysrolelist(params){
   return request.postXForm('certadmin/sysuser/sysrole/list',params);
}
export function sysroledeleteById(params){
   return request.postXForm('certadmin/sysuser/sysrole/edit/deleteById',params);
}


 

//查询所有权限
export function allPermission(){
    return request.postJson('certadmin/base/allPermission');
}
export function modelList(){
   return request.postJson('certadmin/base/modelList');
}
//查询所有角色列表\
export function allRoleList(){
   return request.postJson('certadmin/sysuser/sysrole/list');
}

export function userAddPermissions(params){
   return request.postJson('certadmin/sysuser/addPermissions',params);
}
//更新添加角色
export function postRole(params){
    return request.postJson('certadmin/sysuser/sysrole/edit/addOrUpdate',params);
}
//删除角色
export function deleteRole(params){
    return request.postXForm('certadmin/sysuser/sysrole/edit/deleteById',params);
}
export function organizationList(params){
    return request.postXForm('certadmin/sysuser/list/getSysUserAuthList',params);
}
export function departmentScort(params){
    return request.postXForm('certadmin/base/getReverseDepartmentList',params);
}
export function totalNum(params){
    return request.postXForm('certadmin/base/getDepartmentAllTotal',params);
}

export function sysUser(params){
   return request.postXForm('certadmin/sysuser/sys/user',params);
}

export function sysTemplate(params){
   return request.postXForm('certadmin/sysuser/sys/template',params);
}

export function sysCert(params){
   return request.postXForm('certadmin/sysuser/sys/cert',params);
}
export function inviteAccountNum(){
    return request.postXForm('certadmin/base/getSysUserCreateUserCount',);
 }
 export function baseAgreement(){
   return request.get('/certadmin/base/agreement');//new per
}
