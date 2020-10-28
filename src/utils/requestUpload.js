 /*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************/
import axios from 'axios'
// const axios = require('axios')
import { Message,Loading  } from 'element-ui'
const service = axios.create();
let timers=false;
if (process.env.NODE_ENV == "production"){
  service.defaults.baseURL =window.g.apiurl//process.env.API_ROOT;
}
  // service.defaults.baseURL = process.env.API_ROOT;
service.defaults.timeout = 1200000;
let tokenAlert=null
service.interceptors.request.use(
  config => {
    if(config.url != '/admin/data/dayActive' && config.url != '/admin/data/newIncrease' && config.url != '/admin/users/currentWeb'){
      Loading.service();
    }
    setConfig(config);
    return config
  },
  error => {
    if(error.url != '/admin/data/dayActive' && error.url != '/admin/data/newIncrease' && error.url != '/admin/users/currentWeb'){
      Loading.service();
    }
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  async (response) => {
    const res = response.data;
    
    if(response.config.url != '/admin/data/dayActive' && response.config.url != '/admin/data/newIncrease' && response.config.url != '/admin/users/currentWeb'){
      Loading.service().close();
    }

    // console.log(response);

    if (res.code == 200) {
        return res.data;
    } 

    else if (res.code == 403 || res.code == 10017 || res.code == 100003 || res.code == 10016 || res.code == 10017 || res.code == 10018) {
       window.location.href = "/#/login";
    } else {
        Message({
          message: res.msg ? res.msg : '',
          type: 'error',
        })
      return Promise.reject("服务器异常");
    }
  },
  (error) => {

    if(error && error.response){
      if(error.response.config.url != '/admin/data/dayActive' && error.response.config.url != '/admin/data/newIncrease' && error.response.config.url != '/admin/users/currentWeb'){
        Loading.service().close();
      }
      if(error.response.status==401 || error.response.data.code==401){
        if(!tokenAlert){
         tokenAlert=true;
         Message({
           message:error.response.data.msg ,
           type: 'error',
           onClose:function (params) {
             tokenAlert=null
             window.location.href = "/#/login";
            //  window.location.hash='#/'
           }
         })
        }
       }else if(error.response.status==403){
         if(!timers){
        timers=true

        Message({
          message:error.response.data.msg ,
          type: 'error',
        })
        setTimeout(() => {
          timers=false
        }, 2000);
      }
       }
       else{
        Message({
          message: '网络超时,发生错误！',
          type: 'error',
        })
      }
    }
    else{
      Loading.service().close();
      Message({
        message: '网络超时,发生错误！',
        type: 'error',
      })
    }
    return Promise.reject(error)
  }
)

function setConfig(config) {
  
  const user = sessionStorage.getItem("userInfo") ? JSON.parse(sessionStorage.getItem("userInfo")) : "";
  if (user && user.token) {
    config.headers.token = user.token;
  }
}
function get(url, params = {}) {
  // url = initUrlParams(url, params);
  try {
    return service.get(setGetData(url, params));
  }
  catch (e) {
  }
}
function getOne(url) {
  // url = initUrlParams(url, params);
  try {
    return service.get(url);
  }
  catch (e) {
  }
}

function postJson(url, params) {
  const config = {
    headers: {
      'Content-Type': "application/json",
    }
  }
  // url = initUrlParams(url, params);
  return service.post(url, params, config);
}
function postXForm(url, params) {
  const config = {
    headers: {
      'Content-Type': "application/x-www-form-urlencoded",
    }
  }
  return service.post(url, setFormData(params), config);
}

function postFormData(url, params) {
  const config = {
    headers: { 'Content-Type': "multipart/form-data" }
  }
  return service.post(url, setFormData(params), config);
}

function postUrl(url, params) {
  const config = {
    url: "",
    headers: { 'Content-Type': "application/json" }
  }
  return service.post(url, setFormData(params), config);
}

function setGetData(apiUrl, data) {
  var reUrl = apiUrl;
  if (data) {
    for (var name in data) {
      var item = name + "=" + data[name]
      reUrl = reUrl + "&" + item;
    }
  }
  return reUrl
}
function setFormData(data) {
  var params = new FormData();
  if (data) {
    for (var name in data) {
      params.append(name, data[name]);
    }
  }
  return params;
}

function initUrlParams(url, params) {
  return url;
}

export default {
  get,
  postJson,
  postFormData,
  postXForm,
  postUrl,
  getOne
}
