 /*************************************************************************
  * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
  *************************************************************************/
 import {
   getJSON
 } from '../../api/getjson';
 import types, {
   GET_RECTS,
   ENABLE_ACTIVE,
   DISABLE_ACTIVE,
   ENABLE_ASPECT,
   SETZINDEX, //设置顶层底层
   SETZINDEXRECT, //设置置顶组件顶层底层
   DISABLE_ASPECT,
   ENABLE_DRAGGABLE,
   DISABLE_DRAGGABLE,
   ENABLE_RESIZABLE,
   DISABLE_RESIZABLE,
   ENABLE_PARENT_LIMITATION,
   DISABLE_PARENT_LIMITATION,
   ENABLE_SNAP_TO_GRID,
   DISABLE_SNAP_TO_GRID,
   CHANGE_ZINDEX,
   ENABLE_BOTH_AXIS,
   ENABLE_X_AXIS,
   ENABLE_Y_AXIS,
   ENABLE_NONE_AXIS,
   CHANGE_HEIGHT,
   CHANGE_LEFT,
   CHANGE_MINH,
   CHANGE_MINW,
   CHANGE_TOP,
   CHANGE_WIDTH,
   ADDRECTS,
   RESET_LABELCOLOR,
   RESET_LABELFONT,
   GETPAGE_MODULESRECTS,
   DELETE_RECT,
   SETCOM_ATTR
 } from '../mutation-types';
 const enum_ = {
   qrcode: {
     height: 130,
     width: 130
   },
   title: {
     height: 40
   },
   presetText: {
     height: 40,
     width: 355
   },
   textComponent: {
     height: 40,
     width: 355
   },
   presetImg: {
     height: 135,
     width: 240
   },
   imgComponent: {
     height: 135,
     width: 240
   },
   // presetMedia: { height: 200 },
   // mediaComponent: { height: 200 }
 }
 const state = {
   muban: {},
   'pages_modulesRects': {
     modules: []
   }, //页面数据
   'rects': [
     // {
     //     'width': 200,
     //     'height': 150,
     //     'type':'textComponent',
     //     'top': 100,
     //     'left': 84,
     //     'draggable': true,
     //     'resizable': true,
     //     'minw': 100,
     //     'minh': 50,
     //     'axis': 'both',
     //     'parentLim': true,//是否超出父级元素
     //     'snapToGrid': false,//对齐网格
     //     'aspectRatio': false,//等比缩放
     //     'zIndex': 1,
     //     'color': '#EF9A9A',
     //     'active': true
     // },
     // {
     //     'width': 200,
     //     'height': 150,
     //     'top': 100,
     //     'left': 84,
     //     'type':'imgComponent',
     //     'draggable': true,
     //     'resizable': true,
     //     'minw': 10,
     //     'minh': 10,
     //     'axis': 'both',
     //     'parentLim': true,
     //     'snapToGrid': false,
     //     'aspectRatio': false,
     //     'zIndex': 2,
     //     'color': '#AED581',
     //     'active': false
     // },
     // {
     //     'width': 200,
     //     'height': 150,
     //     'top': 170,
     //     'left': 84,
     //     'type':'imgComponent',
     //     'draggable': true,
     //     'resizable': true,
     //     'minw': 10,
     //     'minh': 10,
     //     'axis': 'both',
     //     'parentLim': true,
     //     'snapToGrid': false,
     //     'aspectRatio': false,
     //     'zIndex': 3,
     //     'color': '#fff',
     //     'active': true
     // }
   ]
 }

 const mutations = {

   [SETCOM_ATTR](state, {
     attr,
     key,
     value
   }) {
     if (attr == "multiple") { //value是个对象

       state.rects = state.rects.map(item => {
         if (key == item.key) {

           item = Object.assign({}, item, value)
         }
         return item;
       })
     }
     if (attr == 'lastStep') {
       if (!!value.module) {
         let rects = value.module.modules.filter(item => item.activeModel)
         rects = rects.length > 0 ? rects[0].components : [];
         state.rects = value.rects;
         state.pages_modulesRects = value.module
       } else {
         state.rects = value.rects;
       }
       return;
     }
     let username = null,
       ctime = null;
     if (attr == 'sha256') {
       let userinfo = sessionStorage.getItem('user');
       username = JSON.parse(userinfo).username;
       ctime = +new Date()
     }
     if (attr == 'text' || attr == 'height' || attr == 'width' || attr == "sha256" || attr == 'textAlign' || attr == 'verticalAlign' || attr == 'fontSize' || attr == 'fontColor' || attr == 'left' || attr == 'top' || attr == 'mediaImg' || attr == 'fontFamily' || attr == 'fontWeight' || attr == 'backgroundColor' || attr == 'resizable') {
       state.rects.map(item => {
         if (key == item.key) {
           if (item.type == "textComponent" && attr == 'text') {
             item['placeholder'] = value
           } else {
             item[attr] = value
             if (attr == 'sha256') { //预置视频，预置文本，预置图片只要修改或新增都要更新sha256
               item['author'] = username;
               item['cTime'] = ctime;
             }
           }

         }
         return item;
       })
     }

   },


   [GET_RECTS](state, data) {
     state.rects = data
   },
   [RESET_LABELCOLOR](state, data) {

     state.rects[data.index].fontColor = data.color
   },
   [RESET_LABELFONT](state, data) {

     state.rects[data.index].fontSize = data.size
   },
   [DELETE_RECT](state, keys) {
     let noActiveArr = state.rects.filter(item => !(keys.includes(item.key)));

     noActiveArr.map((item) => {
       item.active = false
       return item
     })
     state.rects = noActiveArr
     state.rects.length > 0 ? state.rects[state.rects.length - 1].active = true : '';
   },
   [GETPAGE_MODULESRECTS](state, newModulesRects) {
     state.pages_modulesRects = newModulesRects
   },
   [ADDRECTS](state, newRects) {
     state.rects.map(item => {
       item.active = false;
       return item
     })
     state.rects.push(newRects);

   },
   [ENABLE_ACTIVE](state, id) {
     state.rects[id].active = true;
   },
   [DISABLE_ACTIVE](state, id) {

     state.rects[id].active = false;
   },

   [ENABLE_ASPECT](state, id) {
     state.rects[id].aspectRatio = true;
   },
   // 设置置顶组件置顶
   [SETZINDEXRECT](state, data) {
     //如果设置了rectType ,并且是qrcode

     if (data.rectType.length > 0) {
       //要设置的数组
       let activeArr = state.rects.filter(item => data.rectType.includes(item.type)).sort((a, b) => {
         return a.zIndex - b.zIndex
       });
       //不设置的数组
       let noActiveArr = state.rects.filter(item => !(data.rectType.includes(item.type)));
       if (activeArr.length == state.rects.length) {
         return;
       }
       if (data.type == 'top') {
         activeArr.map((item, index) => {
           item.zIndex = noActiveArr.length + index
           return item
         })
         noActiveArr.map((item, index) => {
           item.zIndex = index
           return item
         })
         state.rects = [].concat(noActiveArr, activeArr)

       } else {
         activeArr.map((item, index) => {
           item.zIndex = index
           return item
         })
         noActiveArr.map((item, index) => {
           item.zIndex = activeArr.length + index
           return item
         })
         state.rects = [].concat(activeArr, noActiveArr)
       }
     }

   },
   // 设置激活组件置顶
   [SETZINDEX](state, type) {

     //  从小到大排序
     let activeArr = state.rects.filter(item => !!item.active).sort((a, b) => {
       return a.zIndex - b.zIndex
     });

     let noActiveArr = state.rects.filter(item => !item.active);
     let length = activeArr.length


     //全选
     if (activeArr.length == state.rects.length) {
       return;
     }

     if (type == 'top') {
       activeArr.map((item, index) => {
         item.zIndex = noActiveArr.length + index
         return item
       })
       noActiveArr.map((item, index) => {
         item.zIndex = index
         return item
       })
       state.rects = [].concat(noActiveArr, activeArr)

     } else {
       activeArr.map((item, index) => {
         item.zIndex = index
         return item
       })
       noActiveArr.map((item, index) => {
         item.zIndex = activeArr.length + index
         return item
       })
       state.rects = [].concat(activeArr, noActiveArr)
     }
   },
   [DISABLE_ASPECT](state, id) {
     state.rects[id].aspectRatio = false;
   },

   [ENABLE_DRAGGABLE](state, id) {
     state.rects[id].draggable = true;
   },
   [DISABLE_DRAGGABLE](state, id) {
     state.rects[id].draggable = false;
   },

   [ENABLE_RESIZABLE](state, id) {
     state.rects[id].resizable = true;
   },
   [DISABLE_RESIZABLE](state, id) {
     state.rects[id].resizable = false;
   },

   [ENABLE_SNAP_TO_GRID](state, id) {
     state.rects[id].snapToGrid = true;
   },
   [DISABLE_SNAP_TO_GRID](state, id) {
     state.rects[id].snapToGrid = false;
   },

   [ENABLE_BOTH_AXIS](state, id) {
     state.rects[id].axis = 'both';
   },
   [ENABLE_NONE_AXIS](state, id) {
     state.rects[id].axis = 'none';
   },
   [ENABLE_X_AXIS](state, id) {
     state.rects[id].axis = 'x';
   },
   [ENABLE_Y_AXIS](state, id) {
     state.rects[id].axis = 'y';
   },

   [ENABLE_PARENT_LIMITATION](state, id) {
     state.rects[id].parentLim = true;
   },
   [DISABLE_PARENT_LIMITATION](state, id) {
     state.rects[id].parentLim = false;
   },

   [CHANGE_ZINDEX](state, payload) {
     state.rects[payload.id].zIndex = payload.zIndex;
   },

   [CHANGE_HEIGHT](state, payload) {
     state.rects[payload.id].height = payload.height;
   },

   [CHANGE_WIDTH](state, payload) {
     state.rects[payload.id].width = payload.width;
   },

   [CHANGE_TOP](state, payload) {
     state.rects[payload.id].top = payload.top;
   },

   [CHANGE_LEFT](state, payload) {
     state.rects[payload.id].left = payload.left;
   },
   [CHANGE_MINH](state, payload) {

     state.rects[payload.id].minh = payload.minh;
   },
   [CHANGE_MINW](state, payload) {
     state.rects[payload.id].minw = payload.minw;
   }
 }

 const actions = {
   setComAttr({
     commit,
     state
   }, {
     key,
     attr,
     value
   }) {

     commit(types.SETCOM_ATTR, {
       key,
       attr,
       value
     })
   },
   getpage_modulesRects({
     commit,
     state
   }, {
     url
   }) {
     // [GETPAGE_MODULESRECTS](state,newModulesRects){
     //     state.pages_modulesRects=newModulesRects
     // }

     state.rects = [];
     let data
     // let addModules = {
     //     "title": "",
     //     "type": 'addmodules',
     //     "key": "module_add",
     //     "top": 0,
     //     "marginLeft": 20,
     //     "marginRight": 20,
     //     "marginTop": 20,
     //     "marginBottom": 20,
     //     "height": 186,
     //     "activeModel": false,
     //     "components": []
     // }
     if (url) {

       //  data = require(url);
       url = url.split('/').slice(3).join('/')

       return new Promise((resolve, reject) => {
         getJSON(url, {}).then(response => {
           let data = response;
           data.modules.map((item, index) => {
             item.activeModel = false;
             item.key = "module_" + index;
             item.components.length > 0 && item.components.map(ite => {
               ite.active = false;
               return ite
             })
             var max = item.components.length > 0 ? item.components.reduce(function (a, b) {
               let amax = a.height + a.top
               let bmax = b.height + b.top
               return bmax > amax ? b : a;
             }) : {
               height: 200,
               top: 0
             };
             item.height = max.height + max.top == 15800 ? 15800 : max.height + max.top + 100;
             return item;
           })
           // data.modules.push(addModules)

           commit(types.GETPAGE_MODULESRECTS, data)
           resolve(data)
         })
       })


     } else {

       let data = {
         modules: []
       }
       //  data.modules.push(addModules)
       return new Promise((resolve, reject) => {
         commit(types.GETPAGE_MODULESRECTS, data)
         resolve(data)
       })
     }



   },
   get_rects({
     commit,
     state
   }, {
     url
   }) {
     return new Promise((resolve, reject) => {
       if (url) {

         // let data = require(url);
         url = url.split('/').slice(3).join('/')

         getJSON(url, {}).then(response => {
           // data + '_' + (state.rects.length)+'_'+page+"_"+new Date().getTime(),
           let height_ = []
           let coms = []

           let data = response;
           //    let testdata = {"data":{"templateWidth":1200,"templateHeight":1850,"content":[{"key":"presetImg_19_1599479834288","type":"presetImg","id":19,"fontColor":"#848484","fontSize":"14","text":"https://cert.tongcelian.com/pdxfile/group1/M00/00/1B/J2LIvV9hxpGAPiqqAAAmeK4zMjo438.png","width":117,"height":1425,"top":0,"left":0,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":19,"textAlign":"center","verticalAlign":"middle","author":"","cTime":"","sha256":"","mediaImg":"","active":false,"margin_left":0},{"key":"presetImg_0_1599473371545","type":"presetImg","id":0,"fontColor":"#848484","fontSize":"14","text":"https://cert.tongcelian.com/pdxfile/group1/M00/00/1B/J2LIvV9hxpGAYaIpAAP0fKPp4MQ344.jpg","width":1200,"height":1668,"top":3,"left":0,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":0,"textAlign":"center","verticalAlign":"middle","author":"superadmin","cTime":1599473397633,"sha256":"3758a413841ddb77736963454dc7e6f307727442e5deef1b24256dc652ec05b7","mediaImg":"","active":false,"margin_left":0},{"key":"presetImg_1_1599473390654","type":"presetImg","id":1,"fontColor":"#848484","fontSize":"14","text":"https://cert.tongcelian.com/pdxfile/group1/M00/00/1B/J2LIvV9hxpGAJr4AAACOvRb2pYc055.jpg","width":204,"height":89,"top":90,"left":917,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":1,"textAlign":"center","verticalAlign":"middle","author":"superadmin","cTime":1599473474476,"sha256":"76090407bb453135805a2f2082f8cfe861602f3ad0d196862a1677466b4c8635","mediaImg":"","active":false},{"key":"presetText_6_1599473783758","type":"presetText","id":6,"fontColor":"#848484","fontSize":"14","text":"此为证书CN20/20093 译本","width":204,"height":20,"top":188,"left":589,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":506,"textAlign":"right","verticalAlign":"middle","author":"superadmin","cTime":1600860219564,"sha256":"59053775f8dbe04ed52b393ca99e1274ff993fb42683e214bcb6296af4a2c4ce","mediaImg":"","active":false,"margin_left":151},{"key":"presetText_10_1599474185288","type":"presetText","id":10,"fontColor":"#848484","fontSize":"14","text":"下述组织","width":107,"height":20,"top":230,"left":687,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":510,"textAlign":"right","verticalAlign":"middle","author":"superadmin","cTime":1599474227018,"sha256":"7d7178c6b2d53baf875906c180b5f2113fc2accae709a5c3fc7638c4e0acefe7","mediaImg":"","active":false,"margin_left":98},{"key":"textComponent_20_1600844322347","type":"textComponent","id":20,"fontColor":"rgba(59, 59, 59, 1)","fontSize":"50","text":"","width":624,"height":135,"top":263,"left":170,"fontFamily":"宋体","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":520,"textAlign":"right","verticalAlign":"middle","author":"superadmin","cTime":1600844428024,"sha256":"1493630f795d21973cc1c2608fe67e907e317cdf00ed7fed5f1db234bd11fe3d","mediaImg":"","active":false,"placeholder":"请输入公司名称","margin_left":170},{"key":"presetImg_2_1599473484607","type":"presetImg","id":2,"fontColor":"#848484","fontSize":"14","text":"https://cert.tongcelian.com/pdxfile/group1/M00/00/1B/J2LIvV9hxpGAb5VDAABPvjxsq0840.jpeg","width":202,"height":198,"top":323,"left":919,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":2,"textAlign":"center","verticalAlign":"middle","author":"superadmin","cTime":1599473492757,"sha256":"c0cc2cb614f4677534e7b5c6e6758807a71e52e54ea306a4341383c166e8b014","mediaImg":"","active":false},{"key":"textComponent_20_1600845832787","type":"textComponent","id":20,"fontColor":"#848484","fontSize":"16","text":"","width":623,"height":113,"top":408,"left":171,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":520,"textAlign":"right","verticalAlign":"top","author":"superadmin","cTime":1600846067550,"sha256":"86b1f16becee41bc100112cdd7b227f587eeeaefb10276999182e3dfe59ca26b","mediaImg":"","active":false,"placeholder":"请输入注册地址：\n经营地址：","margin_left":1},{"key":"presetText_22_1600846190264","type":"presetText","id":22,"fontColor":"#848484","fontSize":"16","text":"统一社会信用代码","width":147,"height":22,"top":550,"left":465,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":522,"textAlign":"right","verticalAlign":"middle","author":"superadmin","cTime":1600846229191,"sha256":"54ca84a43468ee95fe148fdca6d0465ea320d8ca13fa89350c63e4acc98471f5","mediaImg":"","active":false,"margin_left":291},{"key":"textComponent_21_1600846360467","type":"textComponent","id":21,"fontColor":"#848484","fontSize":"16","text":"","width":179,"height":22,"top":550,"left":615,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":521,"textAlign":"left","verticalAlign":"middle","author":"superadmin","cTime":1600846680585,"sha256":"877647b1539f25cc91094d3d6f057bb9778d7966fef7846e4a2252ee7178163c","mediaImg":"","active":false,"placeholder":"请输入统一社会信用代码","margin_left":26},{"key":"presetText_8_1599474184905","type":"presetText","id":8,"fontColor":"#848484","fontSize":"14","text":"的管理体系己经过审核，并被证明符合下述要求","width":355,"height":20,"top":585,"left":439,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":508,"textAlign":"right","verticalAlign":"middle","author":"superadmin","cTime":1600860238144,"sha256":"b50ba2c06dead28f760fa3d66ccbafd27c0d87fd2a8aaf7d950918bc318db1f4","mediaImg":"","active":false,"margin_left":1},{"key":"presetText_7_1599474182734","type":"presetText","id":7,"fontColor":"rgba(59, 59, 59, 1)","fontSize":"36","text":"ISO/IEC 27001:2013","width":355,"height":42,"top":665,"left":438,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":507,"textAlign":"right","verticalAlign":"middle","author":"superadmin","cTime":1600860135068,"sha256":"833e777703414db59dbec39badda264bc40fda2b30a7b9713ff0a5882ef49e2b","mediaImg":"","active":false,"margin_left":264},{"key":"presetText_12_1599474841203","type":"presetText","id":12,"fontColor":"#848484","fontSize":"14","text":"所涉及的活动范围覆盖","width":355,"height":16,"top":742,"left":440,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":512,"textAlign":"right","verticalAlign":"middle","author":"superadmin","cTime":1599474848850,"sha256":"964d3cf85016d34ae91a8c63922bf867f3cdf15ecc04ba429ec5e45a9082de7f","mediaImg":"","active":false,"margin_left":264},{"key":"textComponent_26_1600848853883","type":"textComponent","id":26,"fontColor":"rgba(59, 59, 59, 1)","fontSize":"18","text":"","width":621,"height":68,"top":780,"left":172,"fontFamily":"Arial","fontWeight":true,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":526,"textAlign":"right","verticalAlign":"middle","author":"superadmin","cTime":1600848941454,"sha256":"efb06fd88e9c1bf8ebbbfe36a8f49479e41346fd47f0108d39df84f039932a38","mediaImg":"","active":false,"placeholder":"请输入经营范围","margin_left":1},{"key":"presetImg_3_1599473501132","type":"presetImg","id":3,"fontColor":"#848484","fontSize":"14","text":"https://cert.tongcelian.com/pdxfile/group1/M00/00/1B/J2LIvV9hxpGAGUjuAACd5ZCQZvc849.jpg","width":198,"height":242,"top":802,"left":920,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":3,"textAlign":"center","verticalAlign":"middle","author":"superadmin","cTime":1599473535076,"sha256":"931b0f75f7b291f90bea360ce6748ecd801373bb0fabe706b4d368e25e0e4b93","mediaImg":"","active":false,"margin_left":236},{"key":"textComponent_23_1600847742419","type":"textComponent","id":23,"fontColor":"#848484","fontSize":"14","text":"","width":107,"height":21,"top":864,"left":688,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":523,"textAlign":"center","verticalAlign":"middle","author":"superadmin","cTime":1600847956667,"sha256":"84c0458ef7a878c907e5647ec028b1642772c590f67f0dc76e88d28c08f6139d","mediaImg":"","active":false,"placeholder":"有效期截止日","margin_left":73},{"key":"textComponent_22_1600847107801","type":"textComponent","id":22,"fontColor":"#848484","fontSize":"14","text":"","width":109,"height":22,"top":865,"left":564,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":522,"textAlign":"center","verticalAlign":"middle","author":"superadmin","cTime":1600847949270,"sha256":"7283a536e5843c21c85f2f93ef93a46bf47549f242e36c28f190d6dc8309ec6e","mediaImg":"","active":false,"placeholder":"有效期起始日","margin_left":-356},{"key":"presetText_14_1599474907438","type":"presetText","id":14,"fontColor":"#848484","fontSize":"14","text":"该证的有效期自                            至                           \n组织必须定期接受监督审核并经审核合格此证书方维续有效\n持续认证至少在证书失效前60天执符\n版本号1.初始注册日期                           \n","width":619,"height":80,"top":865,"left":174,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":514,"textAlign":"right","verticalAlign":"middle","author":"superadmin","cTime":1600860390320,"sha256":"de98e9176934e6a5502986ecc39cefb5fa705bb47f386822896af73be792d4ad","mediaImg":"","active":false,"margin_left":2},{"key":"textComponent_24_1600847866080","type":"textComponent","id":24,"fontColor":"#848484","fontSize":"14","text":"","width":107,"height":23,"top":923,"left":688,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":524,"textAlign":"center","verticalAlign":"middle","author":"superadmin","cTime":1600847965714,"sha256":"b37657c9a576c3a0a9e93c661c1f919f66cec9a428d70cad42e722c59457472b","mediaImg":"","active":false,"placeholder":"初始注册日期","margin_left":0},{"key":"qrcode_25_1600848247706","type":"qrcode","id":25,"fontColor":"#848484","fontSize":"14","text":"","width":238,"height":238,"top":974,"left":174,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":100,"minh":100,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":25,"textAlign":"center","verticalAlign":"middle","author":"","cTime":"","sha256":"","mediaImg":"","active":false,"margin_left":0},{"key":"presetText_15_1599475226352","type":"presetText","id":15,"fontColor":"#848484","fontSize":"14","text":"签署","width":67,"height":20,"top":1005,"left":726,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":515,"textAlign":"right","verticalAlign":"middle","author":"superadmin","cTime":1599475242387,"sha256":"8bc94c0cb57c1fab91cec300f54181bb6444f042778ca99d258096e0f8c0563e","mediaImg":"","active":false,"margin_left":162},{"key":"presetImg_16_1599475251191","type":"presetImg","id":16,"fontColor":"#848484","fontSize":"14","text":"https://cert.tongcelian.com/pdxfile/group1/M00/00/1B/J2LIvV9hxpGAH3yjAACVBZ2wQFQ427.png","width":240,"height":135,"top":1065,"left":554,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":16,"textAlign":"center","verticalAlign":"middle","author":"superadmin","cTime":1599475273699,"sha256":"8eff795224ba6e2bff04e73c17771547f0566575188f7f5d26c74cdcf0cc80ef","mediaImg":"","active":false,"margin_left":116},{"key":"presetText_25_1600849806168","type":"presetText","id":25,"fontColor":"#848484","fontSize":"14","text":"SGS United Kingdom Ltd \n Rossmore Business Park Ellesmere Port Cheshire CH65 3 EN UK\nt+44(0)151 350-666  f+44(0)151 350 6600 www.sgs.com\n本证书信思可在国家认证认可监督管理委员会官方网站 www.cnca.gov.cn上查询\n\nHC SGS 9001 2015 0118\n\n第1页共1 页","width":621,"height":166,"top":1228,"left":174,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":525,"textAlign":"right","verticalAlign":"middle","author":"superadmin","cTime":1600849840758,"sha256":"e17614e02b7c36b73e03e5831dd8ad46dee32015199ae7abc1ffc7de344a12a9","mediaImg":"","active":false,"margin_left":2},{"key":"presetImg_19_1599477549051","type":"presetImg","id":19,"fontColor":"#848484","fontSize":"14","text":"https://cert.tongcelian.com/pdxfile/group1/M00/00/1B/J2LIvV9hxpGAGlWbAAD4t9tmw6w071.png","width":83,"height":83,"top":1480,"left":29,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":19,"textAlign":"center","verticalAlign":"middle","author":"","cTime":"","sha256":"","mediaImg":"","active":false},{"key":"presetText_18_1599476288714","type":"presetText","id":18,"fontColor":"#848484","fontSize":"14","text":"本文件由本公刊根据公布在其 www. gs. com/terms-and conditions htm          \n中的认证服务通用条款颁发。提请注意其中已确定的责任范围，赔偿          \n和司法管継事项。本文件的真实性可在网站          \nhttps://www.sgs.com/en/certified-clients-and-products/certified-client-directiry中核          \n实，任何未经授权的对此文件的内容或外观的变更、伪造或篡改皆属          \n法，反者将会被依法追诉。          ","width":687,"height":207,"top":1643,"left":0,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(242, 242, 242, 1)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":518,"textAlign":"right","verticalAlign":"middle","author":"superadmin","cTime":1599476815613,"sha256":"c001fc87d675c9d40bc5b918dc98ea4134b9530673b6f763604f51c8858dec6d","mediaImg":"","active":false,"margin_left":0}],"appData":[[{"key":"presetImg_19_1599479834288","type":"presetImg","id":19,"fontColor":"#848484","fontSize":"14","text":"https://cert.tongcelian.com/pdxfile/group1/M00/00/1B/J2LIvV9hxpGAPiqqAAAmeK4zMjo438.png","width":117,"height":1425,"top":0,"left":0,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":19,"textAlign":"center","verticalAlign":"middle","author":"","cTime":"","sha256":"","mediaImg":"","active":false,"margin_left":0},{"key":"presetImg_0_1599473371545","type":"presetImg","id":0,"fontColor":"#848484","fontSize":"14","text":"https://cert.tongcelian.com/pdxfile/group1/M00/00/1B/J2LIvV9hxpGAYaIpAAP0fKPp4MQ344.jpg","width":1200,"height":1668,"top":3,"left":0,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":0,"textAlign":"center","verticalAlign":"middle","author":"superadmin","cTime":1599473397633,"sha256":"3758a413841ddb77736963454dc7e6f307727442e5deef1b24256dc652ec05b7","mediaImg":"","active":false,"margin_left":0},{"key":"textComponent_20_1600844322347","type":"textComponent","id":20,"fontColor":"rgba(59, 59, 59, 1)","fontSize":"50","text":"","width":624,"height":135,"top":263,"left":170,"fontFamily":"宋体","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":520,"textAlign":"right","verticalAlign":"middle","author":"superadmin","cTime":1600844428024,"sha256":"1493630f795d21973cc1c2608fe67e907e317cdf00ed7fed5f1db234bd11fe3d","mediaImg":"","active":false,"placeholder":"请输入公司名称","margin_left":170},{"key":"textComponent_20_1600845832787","type":"textComponent","id":20,"fontColor":"#848484","fontSize":"16","text":"","width":623,"height":113,"top":408,"left":171,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":520,"textAlign":"right","verticalAlign":"top","author":"superadmin","cTime":1600846067550,"sha256":"86b1f16becee41bc100112cdd7b227f587eeeaefb10276999182e3dfe59ca26b","mediaImg":"","active":false,"placeholder":"请输入注册地址：\n经营地址：","margin_left":1},{"key":"textComponent_26_1600848853883","type":"textComponent","id":26,"fontColor":"rgba(59, 59, 59, 1)","fontSize":"18","text":"","width":621,"height":68,"top":780,"left":172,"fontFamily":"Arial","fontWeight":true,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":526,"textAlign":"right","verticalAlign":"middle","author":"superadmin","cTime":1600848941454,"sha256":"efb06fd88e9c1bf8ebbbfe36a8f49479e41346fd47f0108d39df84f039932a38","mediaImg":"","active":false,"placeholder":"请输入经营范围","margin_left":1},{"key":"presetText_14_1599474907438","type":"presetText","id":14,"fontColor":"#848484","fontSize":"14","text":"该证的有效期自                            至                           \n组织必须定期接受监督审核并经审核合格此证书方维续有效\n持续认证至少在证书失效前60天执符\n版本号1.初始注册日期                           \n","width":619,"height":80,"top":865,"left":174,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":514,"textAlign":"right","verticalAlign":"middle","author":"superadmin","cTime":1600860390320,"sha256":"de98e9176934e6a5502986ecc39cefb5fa705bb47f386822896af73be792d4ad","mediaImg":"","active":false,"margin_left":2},{"key":"qrcode_25_1600848247706","type":"qrcode","id":25,"fontColor":"#848484","fontSize":"14","text":"","width":238,"height":238,"top":974,"left":174,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":100,"minh":100,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":25,"textAlign":"center","verticalAlign":"middle","author":"","cTime":"","sha256":"","mediaImg":"","active":false,"margin_left":0},{"key":"presetText_7_1599474182734","type":"presetText","id":7,"fontColor":"rgba(59, 59, 59, 1)","fontSize":"36","text":"ISO/IEC 27001:2013","width":355,"height":42,"top":665,"left":438,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":507,"textAlign":"right","verticalAlign":"middle","author":"superadmin","cTime":1600860135068,"sha256":"833e777703414db59dbec39badda264bc40fda2b30a7b9713ff0a5882ef49e2b","mediaImg":"","active":false,"margin_left":264},{"key":"presetImg_16_1599475251191","type":"presetImg","id":16,"fontColor":"#848484","fontSize":"14","text":"https://cert.tongcelian.com/pdxfile/group1/M00/00/1B/J2LIvV9hxpGAH3yjAACVBZ2wQFQ427.png","width":240,"height":135,"top":1065,"left":554,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":16,"textAlign":"center","verticalAlign":"middle","author":"superadmin","cTime":1599475273699,"sha256":"8eff795224ba6e2bff04e73c17771547f0566575188f7f5d26c74cdcf0cc80ef","mediaImg":"","active":false,"margin_left":116},{"key":"presetText_6_1599473783758","type":"presetText","id":6,"fontColor":"#848484","fontSize":"14","text":"此为证书CN20/20093 译本","width":204,"height":20,"top":188,"left":589,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":506,"textAlign":"right","verticalAlign":"middle","author":"superadmin","cTime":1600860219564,"sha256":"59053775f8dbe04ed52b393ca99e1274ff993fb42683e214bcb6296af4a2c4ce","mediaImg":"","active":false,"margin_left":151},{"key":"textComponent_21_1600846360467","type":"textComponent","id":21,"fontColor":"#848484","fontSize":"16","text":"","width":179,"height":22,"top":550,"left":615,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":521,"textAlign":"left","verticalAlign":"middle","author":"superadmin","cTime":1600846680585,"sha256":"877647b1539f25cc91094d3d6f057bb9778d7966fef7846e4a2252ee7178163c","mediaImg":"","active":false,"placeholder":"请输入统一社会信用代码","margin_left":26},{"key":"textComponent_23_1600847742419","type":"textComponent","id":23,"fontColor":"#848484","fontSize":"14","text":"","width":107,"height":21,"top":864,"left":688,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":523,"textAlign":"center","verticalAlign":"middle","author":"superadmin","cTime":1600847956667,"sha256":"84c0458ef7a878c907e5647ec028b1642772c590f67f0dc76e88d28c08f6139d","mediaImg":"","active":false,"placeholder":"有效期截止日","margin_left":73}],[{"key":"presetImg_1_1599473390654","type":"presetImg","id":1,"fontColor":"#848484","fontSize":"14","text":"https://cert.tongcelian.com/pdxfile/group1/M00/00/1B/J2LIvV9hxpGAJr4AAACOvRb2pYc055.jpg","width":204,"height":89,"top":90,"left":917,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":1,"textAlign":"center","verticalAlign":"middle","author":"superadmin","cTime":1599473474476,"sha256":"76090407bb453135805a2f2082f8cfe861602f3ad0d196862a1677466b4c8635","mediaImg":"","active":false}],[{"key":"presetText_10_1599474185288","type":"presetText","id":10,"fontColor":"#848484","fontSize":"14","text":"下述组织","width":107,"height":20,"top":230,"left":687,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":510,"textAlign":"right","verticalAlign":"middle","author":"superadmin","cTime":1599474227018,"sha256":"7d7178c6b2d53baf875906c180b5f2113fc2accae709a5c3fc7638c4e0acefe7","mediaImg":"","active":false,"margin_left":98}],[{"key":"presetImg_2_1599473484607","type":"presetImg","id":2,"fontColor":"#848484","fontSize":"14","text":"https://cert.tongcelian.com/pdxfile/group1/M00/00/1B/J2LIvV9hxpGAb5VDAABPvjxsq0840.jpeg","width":202,"height":198,"top":323,"left":919,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":2,"textAlign":"center","verticalAlign":"middle","author":"superadmin","cTime":1599473492757,"sha256":"c0cc2cb614f4677534e7b5c6e6758807a71e52e54ea306a4341383c166e8b014","mediaImg":"","active":false}],[{"key":"presetText_22_1600846190264","type":"presetText","id":22,"fontColor":"#848484","fontSize":"16","text":"统一社会信用代码","width":147,"height":22,"top":550,"left":465,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":522,"textAlign":"right","verticalAlign":"middle","author":"superadmin","cTime":1600846229191,"sha256":"54ca84a43468ee95fe148fdca6d0465ea320d8ca13fa89350c63e4acc98471f5","mediaImg":"","active":false,"margin_left":291}],[{"key":"presetText_8_1599474184905","type":"presetText","id":8,"fontColor":"#848484","fontSize":"14","text":"的管理体系己经过审核，并被证明符合下述要求","width":355,"height":20,"top":585,"left":439,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":508,"textAlign":"right","verticalAlign":"middle","author":"superadmin","cTime":1600860238144,"sha256":"b50ba2c06dead28f760fa3d66ccbafd27c0d87fd2a8aaf7d950918bc318db1f4","mediaImg":"","active":false,"margin_left":1}],[{"key":"presetText_12_1599474841203","type":"presetText","id":12,"fontColor":"#848484","fontSize":"14","text":"所涉及的活动范围覆盖","width":355,"height":16,"top":742,"left":440,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":512,"textAlign":"right","verticalAlign":"middle","author":"superadmin","cTime":1599474848850,"sha256":"964d3cf85016d34ae91a8c63922bf867f3cdf15ecc04ba429ec5e45a9082de7f","mediaImg":"","active":false,"margin_left":264}],[{"key":"textComponent_22_1600847107801","type":"textComponent","id":22,"fontColor":"#848484","fontSize":"14","text":"","width":109,"height":22,"top":865,"left":564,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":522,"textAlign":"center","verticalAlign":"middle","author":"superadmin","cTime":1600847949270,"sha256":"7283a536e5843c21c85f2f93ef93a46bf47549f242e36c28f190d6dc8309ec6e","mediaImg":"","active":false,"placeholder":"有效期起始日","margin_left":-356},{"key":"presetText_15_1599475226352","type":"presetText","id":15,"fontColor":"#848484","fontSize":"14","text":"签署","width":67,"height":20,"top":1005,"left":726,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":515,"textAlign":"right","verticalAlign":"middle","author":"superadmin","cTime":1599475242387,"sha256":"8bc94c0cb57c1fab91cec300f54181bb6444f042778ca99d258096e0f8c0563e","mediaImg":"","active":false,"margin_left":162},{"key":"presetImg_3_1599473501132","type":"presetImg","id":3,"fontColor":"#848484","fontSize":"14","text":"https://cert.tongcelian.com/pdxfile/group1/M00/00/1B/J2LIvV9hxpGAGUjuAACd5ZCQZvc849.jpg","width":198,"height":242,"top":802,"left":920,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":3,"textAlign":"center","verticalAlign":"middle","author":"superadmin","cTime":1599473535076,"sha256":"931b0f75f7b291f90bea360ce6748ecd801373bb0fabe706b4d368e25e0e4b93","mediaImg":"","active":false,"margin_left":236}],[{"key":"textComponent_24_1600847866080","type":"textComponent","id":24,"fontColor":"#848484","fontSize":"14","text":"","width":107,"height":23,"top":923,"left":688,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":524,"textAlign":"center","verticalAlign":"middle","author":"superadmin","cTime":1600847965714,"sha256":"b37657c9a576c3a0a9e93c661c1f919f66cec9a428d70cad42e722c59457472b","mediaImg":"","active":false,"placeholder":"初始注册日期","margin_left":0}],[{"key":"presetText_25_1600849806168","type":"presetText","id":25,"fontColor":"#848484","fontSize":"14","text":"SGS United Kingdom Ltd \n Rossmore Business Park Ellesmere Port Cheshire CH65 3 EN UK\nt+44(0)151 350-666  f+44(0)151 350 6600 www.sgs.com\n本证书信思可在国家认证认可监督管理委员会官方网站 www.cnca.gov.cn上查询\n\nHC SGS 9001 2015 0118\n\n第1页共1 页","width":621,"height":166,"top":1228,"left":174,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":525,"textAlign":"right","verticalAlign":"middle","author":"superadmin","cTime":1600849840758,"sha256":"e17614e02b7c36b73e03e5831dd8ad46dee32015199ae7abc1ffc7de344a12a9","mediaImg":"","active":false,"margin_left":2}],[{"key":"presetImg_19_1599477549051","type":"presetImg","id":19,"fontColor":"#848484","fontSize":"14","text":"https://cert.tongcelian.com/pdxfile/group1/M00/00/1B/J2LIvV9hxpGAGlWbAAD4t9tmw6w071.png","width":83,"height":83,"top":1480,"left":29,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(255,255,255,0)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":19,"textAlign":"center","verticalAlign":"middle","author":"","cTime":"","sha256":"","mediaImg":"","active":false}],[{"key":"presetText_18_1599476288714","type":"presetText","id":18,"fontColor":"#848484","fontSize":"14","text":"本文件由本公刊根据公布在其 www. gs. com/terms-and conditions htm          \n中的认证服务通用条款颁发。提请注意其中已确定的责任范围，赔偿          \n和司法管継事项。本文件的真实性可在网站          \nhttps://www.sgs.com/en/certified-clients-and-products/certified-client-directiry中核          \n实，任何未经授权的对此文件的内容或外观的变更、伪造或篡改皆属          \n法，反者将会被依法追诉。          ","width":687,"height":207,"top":1643,"left":0,"fontFamily":"Arial","fontWeight":false,"backgroundColor":"rgba(242, 242, 242, 1)","backgroundImg":"","draggable":true,"resizable":true,"minw":10,"minh":10,"axis":"both","parentLim":true,"snapToGrid":true,"aspectRatio":false,"zIndex":518,"textAlign":"right","verticalAlign":"middle","author":"superadmin","cTime":1599476815613,"sha256":"c001fc87d675c9d40bc5b918dc98ea4134b9530673b6f763604f51c8858dec6d","mediaImg":"","active":false,"margin_left":0}]],"backgroundImg":"","backgroundColor":"rgba(255, 255, 255, 1)"},"code":200,"msg":"json数据"}
           //    data = testdata.data
           commit(types.GET_RECTS, data.content)
           resolve(data)
         })

         // let data= require('../tem.json')

       } else {
         commit(types.GET_RECTS, [])
         resolve([])
       }

     })

   },
   resetFontcolor_rect({
     commit,
     state
   }, {
     index,
     color
   }) {
     commit(types.RESET_LABELCOLOR, {
       index,
       color
     })
   },
   resetFontsize_rect({
     commit,
     state
   }, {
     index,
     size
   }) {

     if (typeof size == 'string') {
       size = parseInt(size)
     }
     commit(types.RESET_LABELFONT, {
       index,
       size
     })
   },
   ctrVRects({
     commit,
     state
   }, data) {
     data.map(item => {
       let newRect = Object.assign({}, item)
       let arrKey = newRect.key.split('_')
       newRect.key = arrKey[0] + '_' + (state.rects.length) + '_' + arrKey[2] + "_" + new Date().getTime()
       newRect.top = newRect.top + 10;
       newRect.left = newRect.left + 10;
       commit(types.ADDRECTS, newRect)
       return item
     })



     setTimeout(() => {
       commit(types.SETZINDEXRECT, {
         type: 'top',
         rectType: ['qrcode']
       })
     }, 200)
   },
   addRects({
     commit,
     state
   }, {
     data,
     text,
     page,
     sha256,
     obj,
     enum_
   }) {


     // //获取当前设置的组件list的最下面一个
     // var max = state.rects.length > 0 ? state.rects.reduce(function (a, b) {
     //     let amax = a.height + a.top
     //     let bmax = b.height + b.top
     //     return bmax > amax ? b : a;
     // }) : { height:0, top:0 };//{ height:0, top:isModuleSet? 50:0 };
     let username = null,
       ctime = null;
     if (data == 'presetText') {
       let userinfo = sessionStorage.getItem('user');
       username = JSON.parse(userinfo).username;
       ctime = +new Date()
     }
     let newRects = {
       'key': data + '_' + (state.rects.length) + "_" + new Date().getTime(),
       'type': data,
       'id': state.rects.length,
       'fontColor': '#848484',
       'fontSize': enum_[data].fontSize,
       'text': data == "presetText" || data == "title" ? text : '',
       'width': enum_[data].width, //data=='qrcode'?200:355,
       'height': enum_[data].height, //180,
       'top': data == 'qrcode' ? obj.height - enum_[data].height : enum_[data].top,
       'left': data == 'qrcode' ? obj.width - enum_[data].width : enum_[data].left,
       'fontFamily': 'Arial',
       'fontWeight': false,
       'backgroundColor': 'rgba(255,255,255,0)',
       'backgroundImg': '',
       'draggable': true,
       'resizable': true,
       'minw': data == 'qrcode' ? 71 : 10,
       'minh': data == 'qrcode' ? 71 : 10,
       'axis': 'both',
       'parentLim': true,
       'snapToGrid': true,
       'aspectRatio': false, //等比缩放
       'zIndex': Number(state.rects.length),
       'textAlign': data == "textComponent" ? 'left' : 'left',
       'verticalAlign': data == "textComponent" ? 'top' : 'middle',
       'author': username ? username : '',
       'cTime': ctime ? ctime : '',
       'sha256': !!sha256 ? sha256 : '',
       'mediaImg': '', //视频地址
       // 'color': '#81D4FA',
       'active': data == 'qrcode' ? false : true
     }
     //如果是文本组件添加placeholder属性
     if (data == 'textComponent') {
       newRects.placeholder = '请输入提示语'
     }

     commit(types.ADDRECTS, newRects)
     if (data != 'qrcode') {
       //设置指定类型的组件指定
       console.log('qrcode 顶层');

       setTimeout(() => {
         commit(types.SETZINDEXRECT, {
           type: 'top',
           rectType: ['qrcode']
         })
       }, 200)
     }




   },
   delete_rect({
     commit,
     state
   }, {
     key,
     page
   }) {
     commit(types.DELETE_RECT, key);

   },
   //  多个激活
   setActiveMultiple({
     commit,
     state
   }, {
     id,
     page
   }) {
     commit(types.ENABLE_ACTIVE, id);
   },
   //单个激活
   setActive({
     commit,
     state
   }, {
     id,
     page
   }) {
     // 
     for (let i = 0, l = state.rects.length; i < l; i++) {
       if (i === id) {
         commit(types.ENABLE_ACTIVE, i);
         continue;
       } else {
         commit(types.DISABLE_ACTIVE, i);
       }



     }




   },
   unsetActive({
     commit
   }, {
     id
   }) {
     if (id || id == 0) {
       commit(types.DISABLE_ACTIVE, id);
     }

   },

   toggleDraggable({
     commit,
     state
   }, {
     id
   }) {
     if (!state.rects[id].draggable) {
       commit(types.ENABLE_DRAGGABLE, id);
     } else {
       commit(types.DISABLE_DRAGGABLE, id);
     }
   },
   setZindex({
     commit,
     state
   }, {
     type
   }) {

     commit(types.SETZINDEX, type)
     setTimeout(() => {
       commit(types.SETZINDEXRECT, {
         type: 'top',
         rectType: ['qrcode']
       })
     }, 200)
   },
   toggleResizable({
     commit,
     state
   }, {
     id
   }) {
     if (!state.rects[id].resizable) {
       commit(types.ENABLE_RESIZABLE, id);
     } else {
       commit(types.DISABLE_RESIZABLE, id);
     }
   },

   toggleParentLimitation({
     commit,
     state
   }, {
     id
   }) {
     if (!state.rects[id].parentLim) {
       commit(types.ENABLE_PARENT_LIMITATION, id);
     } else {
       commit(types.DISABLE_PARENT_LIMITATION, id);
     }
   },

   toggleSnapToGrid({
     commit,
     state
   }, {
     id
   }) {
     if (!state.rects[id].snapToGrid) {
       commit(types.ENABLE_SNAP_TO_GRID, id);
     } else {
       commit(types.DISABLE_SNAP_TO_GRID, id);
     }
   },

   setAspect({
     commit
   }, {
     id
   }) {
     commit(types.ENABLE_ASPECT, id);
   },
   unsetAspect({
     commit
   }, {
     id
   }) {
     commit(types.DISABLE_ASPECT, id);
   },

   setWidth({
     commit
   }, {
     id,
     width
   }) {
     commit(types.CHANGE_WIDTH, {
       id,
       width
     });
   },

   setHeight({
     commit
   }, {
     id,
     height
   }) {
     commit(types.CHANGE_HEIGHT, {
       id,
       height
     });
   },

   setTop({
     commit
   }, {
     id,
     top
   }) {
     commit(types.CHANGE_TOP, {
       id,
       top
     });
   },

   setLeft({
     commit
   }, {
     id,
     left
   }) {
     commit(types.CHANGE_LEFT, {
       id,
       left
     });
   },

   changeXLock({
     commit,
     state
   }, {
     id
   }) {
     switch (state.rects[id].axis) {
       case 'both':
         commit(types.ENABLE_Y_AXIS, id);
         break;
       case 'x':
         commit(types.ENABLE_NONE_AXIS, id);
         break;
       case 'y':
         commit(types.ENABLE_BOTH_AXIS, id);
         break;
       case 'none':
         commit(types.ENABLE_X_AXIS, id);
         break;
     }
   },

   changeYLock({
     commit,
     state
   }, {
     id
   }) {
     switch (state.rects[id].axis) {
       case 'both':
         commit(types.ENABLE_X_AXIS, id);
         break;
       case 'x':
         commit(types.ENABLE_BOTH_AXIS, id);
         break;
       case 'y':
         commit(types.ENABLE_NONE_AXIS, id);
         break;
       case 'none':
         commit(types.ENABLE_Y_AXIS, id);
         break;
     }
   },

   changeZToBottom({
     commit,
     state
   }, {
     id
   }) {
     if (state.rects[id].zIndex === 1) {
       return
     }

     commit(types.CHANGE_ZINDEX, {
       id,
       zIndex: 1
     });

     for (let i = 0, l = state.rects.length; i < l; i++) {
       if (i !== id) {
         if (state.rects[i].zIndex === state.rects.length) {
           continue
         }
         commit(types.CHANGE_ZINDEX, {
           id: i,
           zIndex: state.rects[i].zIndex + 1
         });
       }
     }
   },

   changeZToTop({
     commit,
     state
   }, {
     id
   }) {
     if (state.rects[id].zIndex === state.rects.length) {
       return
     }

     commit(types.CHANGE_ZINDEX, {
       id,
       zIndex: state.rects.length
     });

     for (let i = 0, l = state.rects.length; i < l; i++) {
       if (i !== id) {
         if (state.rects[i].zIndex === 1) {
           continue
         }
         commit(types.CHANGE_ZINDEX, {
           id: i,
           zIndex: state.rects[i].zIndex - 1
         });
       }
     }
   },

   setMinWidth({
     commit
   }, {
     id,
     width
   }) {
     commit(types.CHANGE_MINW, {
       id,
       minw: width
     });
   },

   setMinHeight({
     commit
   }, {
     id,
     height
   }) {
     commit(types.CHANGE_MINH, {
       id,
       minh: height
     });
   }
 }

 export default {
   namespaced: true,
   state,
   mutations,
   actions
 }
