import layout from '../layout/index.vue';
const noLogin = true;
export default [{
    path: '/',
    component: resolve => require(['../page/login'], resolve)
  },
  {
    path: '/checkCertify',
    component: resolve => require(['../page/checkCertify/checkCertify.vue'], resolve),
    meta: {
      title: '通测链证书防伪'
    }
  },
  //  二维码
  {
    path: '/open',
    meta: {
      modelId: 0
    },
    component: resolve => require(['../page/app/open'], resolve)
  },
  {
    path: '/login',
    component: resolve => require(['../page/login'], resolve)
  },
  {
    path: '/manage',
    component: layout,
    children: [
      //模板管理
      {
        path: 'templateManagement',
        component: resolve => require(['../page/templateManagement/index'], resolve)
      },
      // { path: 'templateDetail', component: resolve => require(['../page/templateManagement/templateDetail.vue'], resolve) },
      {
        path: 'templateAdd',
        component: resolve => require(['../page/templateManagement/templatAdd.vue'], resolve)
      },
      {
        path: 'templateEdit',
        component: resolve => require(['../page/templateManagement/templateEdit.vue'], resolve)
      },
      {
        path: 'templateHistory',
        component: resolve => require(['../page/templateManagement/templateHistory.vue'], resolve)
      },
      // { path: 'template', component: resolve => require(['../page/template/templateSetting.vue'], resolve) },
      // 证书管理
      {
        path: 'certificateManagement',
        component: resolve => require(['../page/certificateManagement/index'], resolve)
      },
      {
        path: 'demo',
        component: resolve => require(['../page/certificateManagement/demo'], resolve)
      },
      {
        path: 'issueCertificate',
        component: resolve => require(['../page/certificateManagement/issueCertificate'], resolve)
      },
      {
        path: 'cerfityLook',
        component: resolve => require(['../page/certificateManagement/certifyLook'], resolve)
      },
      {
        path: 'batchIssue',
        component: resolve => require(['../page/certificateManagement/batchIssue'], resolve)
      },
      //账号管理
      {
        path: 'accountManagement',
        meta: {
          modelId: 500
        },
        component: resolve => require(['../page/accountManagement/index'], resolve)
      },
      {
        path: 'accountList',
        meta: {
          modelId: 500
        },
        component: resolve => require(['../page/accountManagement/accountList'], resolve)
      },
      // {path: 'permission',meta: { modelId:500 }, component: resolve => require(['../page/accountManagement/saveRoleweb'], resolve) },

      {
        path: 'department',
        meta: {
          modelId: 500
        },
        component: resolve => require(['../page/department/index'], resolve)
      },
      {
        path: 'departmentList',
        meta: {
          modelId: 500
        },
        component: resolve => require(['../page/department/departmentList.vue'], resolve)
      },
      {
        path: 'permission',
        meta: {
          modelId: 500
        },
        component: resolve => require(['../page/accountManagement/saveRoleweb'], resolve)
      },
      //    //账号管理
      //    { path: 'accountManagement', component: resolve => require(['../page/accountManagement/index'], resolve) },
      //    {path: 'permission', component: resolve => require(['../page/accountManagement/saveRoleweb'], resolve) },

    ]
  },
]
