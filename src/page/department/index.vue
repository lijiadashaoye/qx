<!--*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************-->
<template>
  <div id="department">
    <div class="serchOut">
      <div style="width:50%;">
        <span class="fontColor1">当前{{totalInfo.name}}组织架构下 组织总数: </span>
        <span class="fontColor">{{totalInfo.allDepTotal}}</span>
      </div>
      <div class="btnOut">
        <div v-if="$parent.permissionArr.indexOf(100602)>=0">
          <div class="importDepartment" @click="importDepartmentAct">导入数据</div>
            <input id="thing" style="display:none" @change='uploadFile'  :key="count" type="file" />
        </div>
        <div>
          <div class="addDepartmentBtn" v-if="$parent.permissionArr.indexOf(100603)>=0" @click="download()">下载模板</div>
        </div>
      </div>
    </div>
    <div class="border"></div>
    <div class="levelOut">组织：
        <span class="level" v-for="(item,index) in departmentScortList" :key="index" v-if="departmentScortList.length > 0" :class="{isColor:index == departmentScortList.length-1}">{{item.name}}
            <i v-if="(index+1) < departmentScortList.length" class="el-icon-arrow-right"></i>
        </span>
    </div>
    <div class="listMain">
      <div class="list" v-for="(item,index) in listArr" :key="index">
          <div class="topInfo">
              <div class="number number1">组织数量：<span class="fontColor">{{item.departments.length}}</span></div>
              <div class="number" v-if="index == 0 && userInfo.isSuperAdmin">
                  <span class="fontColor3" @click="toPage(index)">查看列表</span>
                  <span class="fontColor3" @click="addDepartmentAct('open',index)">添加组织</span>
              </div>
              <div class="number"  v-else-if="index > 0">
                  <span class="fontColor3" @click="toPage(index)">查看列表</span>
                  <span class="fontColor3" @click="addDepartmentAct('open',index)">添加组织</span>
              </div>
              <div class="number" v-else >
                  <span class="fontColor4" >查看列表</span>
                  <span class="fontColor4" >添加组织</span>
              </div>
          </div>
          <el-scrollbar class="inMessage"  ref="myScrollbar" style="height:88%">
          <div v-for="(organizationInfo,index1) in item.departments" :key="index1" class="organizationName organizationName1" @click="addList(item,index,organizationInfo,index1)" :class="{isorganizationName:organizationInfo.show == true}"> 
              <div class="organizationNick">
                  <span>{{organizationInfo.name}}</span>
                  <i class="el-icon-arrow-right"></i>
              </div>
              <div class="organizationInfo">
                  <span>组织：{{organizationInfo.currentDepTotal}}</span>
              </div>
          </div>
          <div class="click" v-if="item.departments && item.departments.length < item.userTotal">
              <i v-if="loadIcon" class="el-icon-loading"></i>
              <span v-if="isLook" @click="lookMore(index)">查看更多</span>
          </div>
          </el-scrollbar>
      </div>
    </div>
    <el-dialog
      class="diloag"
      title="添加组织"
      :close-on-click-modal="false"
      :visible.sync="isAddDepartment"
      width="600px"
    >
      <el-form
        :model="DepartmanetForm"
        :rules="departmentRules"
        ref="DepartmanetForm"
        label-width="4rem"
        class="demo-DepartmanetForm_"
      >
        <el-form-item label="组织名称" prop="name">
          <el-input v-model="DepartmanetForm.name" maxlength="20" show-word-limit></el-input>
        </el-form-item>

        <el-form-item label="职能描述" prop="description">
          <el-input type="textarea" maxlength="200" show-word-limit v-model="DepartmanetForm.description"></el-input>
        </el-form-item>
       
       
      </el-form>
      <span slot="footer" class="dialog-footer">
         <el-button  style="height: 1.8rem; line-height: 0.6rem; padding: .4rem 1rem; font-size: 0.7rem;" @click="addDepartmentAct('close')">取消</el-button>
         <el-button  style="height: 1.8rem; line-height: 0.6rem; padding: .4rem 1rem; font-size: 0.7rem;" type="primary" @click="addDepartmentActData('DepartmanetForm')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  departmentList,
  departmentImport,
  departmentUpdateStatus,
  departmentDelete,
  departmentAddOrUpdate,
  downloadTemplate
} from "api/department";
import {
  totalNum
} from "api/account";
// import mixin from "utils/mixin.js";
import nodata from "../../components/nodeData/noData";
export default {
  components: { nodata },
  // mixins: [mixin],
  data() {
    return {
      count:0,
      total: 100,
      getdataParams: { pageNum: 1, pageSize: 10, parentId: null },
      departmentDialogStatus: 1,
      isAddDepartment: false,
      DepartmanetForm: {
        name: "",
        description: "",
        parentId: "",
        id: ""
      },
      departmentRules: {
        name: [{ required: true, message: "请输入组织名称", trigger: "blur" }],

        description: [
          { required: true, message: "请输入职能描述", trigger: "change" }
        ]
      },
      Breadcrumb: [{ name: "组织", id: null, pId: null }],
      departmentList: [],

      detail: {},
      postPubKeyParams: {
        id: "",
        pubKey: ""
      },
      postPasParams: {
        id: "",
        username: ""
      },
      listArr:[],
      onloadIndex:'',
        organizationParasms:{
            parentId:'',
            pageNum:1,
            pageSize:20,
            type:0
        },
        loadIcon:false,
        isLook:true,
        idArr:[],
        departmentScortList:[],
        totalInfo:{},
        userInfo:{}
    };
  },
  methods: {
     getTotal(id){
      let params = {
          type:2,
          id:id
      }
      totalNum(params).then(result=>{
          console.log(result);
          if(result){
              
              this.totalInfo = {
                  name : this.departmentScortList[0].name,
                  allDepTotal : result.allDepTotal,
                  allUserTotal : result.allUserTotal
              };
          }
      }).catch(error=>{

      })
  },
  toPage(index){
      if(index > 0){
          for(let i = 0;i<this.listArr[index - 1].departments.length;i++){
              if(this.listArr[index - 1].departments[i].show == true){
                  let parentId = this.listArr[index - 1].departments[i].id;
                  sessionStorage.setItem('parentId',parentId);
              }
            }
          }else{
            sessionStorage.setItem('parentId','');
        }
      this.$router.push({path:'/manage/departmentList'});
  },
  topage1() {
      this.$router.push({ path: "permission" });
  },
  //获取架构表
  
  // getDepartmentScort(id,init){
  //     let params = {
  //         id : id
  //     }
  //     departmentScort(params).then(result=>{
  //         console.log(result);
  //         if(result && result.length > 0){
  //             this.departmentScortList = result;
  //                 this.getTotal(this.departmentScortList[0].id);
  //         }
  //     }).catch(error=>{

  //     })
  // },
  lookMore(index){
      this.loadIcon = true;
      this.isLook = false;
      this.organizationParasms.pageNum = this.organizationParasms.pageNum + 1;
        departmentList(this.organizationParasms).then(result=>{
              if(result){
                  this.listArr[index].userTotal = result.departments.total;
                  let departmentsArr = result.departments.rowslength > 0 ? result.departments.rows : [];
                  console.log(this.listArr[index].pageCommon,pageCommon);
                  this.listArr[index].departments = this.listArr[index].departments.concat(departmentsArr);  
                  this.loadIcon = false;
                  this.isLook = true;
              }
      }).catch(error=>{
          console.log(error);
      })

  },
  //获取架构列表
  getOrganizationList(num,id,init){
      this.organizationParasms.parentId = id ? id : '';
      departmentList(this.organizationParasms).then(result=>{
              if(result){
                  
                  let obj = {
                      listNum:num,
                      departments:(result.departments.rows && result.departments.rows.length > 0) ? result.departments.rows : [],
                      userTotal:result.departments.total ? result.departments.total : 0,
                      // show : null
                  }
                  
                  this.departmentScortList = result.parentDeps;
                  console.log(this.departmentScortList);

                  num==1?this.listArr=[obj]:this.listArr.push(obj);
                  if(obj.departments.length != 0 && init && num == 1){
                          for(let i = 0;i<obj.departments.length;i++){
                              if(i === 0){
                                  this.$set(obj.departments[i],'show',true);
                              }else{
                                  this.$set(obj.departments[i],'show',false);
                              }
                              
                          }
                  }
                  if(num == 1 && init){
                      this.getOrganizationList(2,obj.departments[0].id);
                  }
                  
                  if(!init){
                    
                    console.log(this.departmentScortList);
                    
                      this.getTotal(this.departmentScortList[0].id);
                  }
                  
                  // else{
                  //     let params = {
                  //       parentId:id,
                  //       pageNum:1,
                  //       pageSize:20
                  //     }
                  //     departmentList(params).then(result=>{
                  //             if(result){
                  //                 this.departmentScortList = result.parentDeps;
                  //             }
                  //     }).catch(error=>{
                  //         console.log(error);
                  //     })
                  // }
              }
      }).catch(error=>{
          console.log(error);
      })
  },
  //添加一个列表
  addList(item,index,organizationInfo,index1){
          this.organizationParasms.parentId = organizationInfo.id;
          let tempNum = item.listNum + 1;
          if(organizationInfo.show == true){
              organizationInfo.show = !organizationInfo.show;
              if(index > 0){
                for(let n = 0;n<this.listArr[index-1].departments.length;n++){
                  if(this.listArr[index-1].departments[n].show == true){
                     this.organizationParasms.parentId =this.listArr[index-1].departments[n].id;
                  }
                }
              }
              this.listArr.splice((index + 1), (this.listArr.length - (index + 1)));
              if(this.departmentScortList[index + 1]){
                  for(let i = 0;i<this.departmentScortList.length;i++){
                      if(this.departmentScortList[i].name == organizationInfo.name){
                          this.departmentScortList.splice(i,(this.departmentScortList.length - i));
                      }
                  }
              }else{
                  this.departmentScortList.splice(index,1);
              }
              
          }else{
              for(let i = 0;i<this.listArr[index].departments.length;i++){
                  
                  if(i == index1){
                      this.listArr[index].departments[i].show = true;
                  }else{
                      this.listArr[index].departments[i].show = false;
                  }
              }
              if(this.listArr[index + 1]){
                  this.listArr.splice((index + 1), (this.listArr.length - (index + 1)));
                  this.departmentScortList.splice(index,(this.departmentScortList.length - (index + 1)));
                  this.getOrganizationList(tempNum,this.organizationParasms.parentId);
              }else{
                  this.getOrganizationList(tempNum,this.organizationParasms.parentId);
              } 
          }
  },
   download(){
      window.open( window.g.apiurl+'/admin/department/downloadTemplate');
      
    //  let data = await downloadTemplate();
    //  this.downloadFile(data,'模板');
    //  //console.log(data);
    },
    // List() {
    //   let params = this.getdataParams;

    //   params.parentId = !this.getdataParams.parentId? "" : this.getdataParams.parentId;
    //   let that = this
    //   departmentList(params).then(result => {
    //     if (!result.departments.rows) {
    //       this.total = 0;
    //       this.departmentList = [];
          
    //       if(!this.$parent.userinfo.isSuperAdmin &&  !this.getdataParams.parentId){
    //         this.$message({message:'对不起，您没有此访问权限，请联系管理员设置',type:'warning'})
    //       }
    //     } else {
    //        result.departments.rows= result.departments.rows.map((item)=>{
    //         item.parentDeps_=!!item.parentDeps ? item.parentDeps.map(item=>{return item.name}).join('-'):''
    //         return item;
    //        })
    //       this.departmentList = result.departments.rows;
    //       this.total = result.departments.total;
    //     }
  
    //     //  this.departmentList = !result.rows?[]:result.rows;
    //     //   this.total = result.total;
    //   });
    // },
    importDepartmentAct() {
      
                thing.click();
    },
    uploadFile() {
               
                let files = thing.files;
                let params={file:files[0]};
                thing.value='';
                this.count++;
              departmentImport(params).then(result=>{
                
                this.$message({message:'组织数据导入成功',type:'success'})
                this.getOrganizationList(1,'',true);
              })
            },
    addDepartmentActData() {
     
      let that=this
      this.$refs.DepartmanetForm.validate(a=>{
          if(!a){
            return 
          }
        let message ='组织添加成功'
        let params = that.DepartmanetForm;
        departmentAddOrUpdate(params).then(result=>{
          that.$message({message:message,type:'success'})
          that.isAddDepartment = false;
          this.listArr = [];
          that.getOrganizationList(1,'',true);
        })
      })
    },
    // 创建编辑
    addDepartmentAct(type,index) {
      if (type == "close") {
        this.$refs.DepartmanetForm.resetFields();
        this.isAddDepartment = false;
      } else {
        this.isAddDepartment = true;
         this.onloadIndex = index;
          let parentId = '';
          if(index > 0){
            for(let i = 0;i<this.listArr[index - 1].departments.length;i++){
              if(this.listArr[index - 1].departments[i].show == true){
                  parentId = this.listArr[index - 1].departments[i].id;
              }
            }
          }else{
            parentId = '';
          }
          this.DepartmanetForm= {
            name: "",
            description: "",
            parentId: parentId,
            id: ""}
      }
    },
    // 分页
    handleCurrentChange(val) {
      this.getdataParams.pageNum = val;
      this.List();
    },
    toDepartmentPage(item, index) {
      this.Breadcrumb = this.Breadcrumb.splice(0, index + 1);
      let params = !!item.id
        ? (this.getdataParams.parentId = item.id)
        : (this.getdataParams.parentId = null);
       this.List()
    },
    
  },
  mounted() {
  },
  created() {
      this.userInfo = JSON.parse(sessionStorage.getItem('user'));
      this.getOrganizationList(1,'',true);
  }
};
</script>

<style lang="scss" scoped>
@import "./index";

@import "~assets/css/mixin";
</style>
<style>
.demo-DepartmanetForm_ .el-input{
  width:100%;
}
.listMain .el-button{
  font-size:.7rem
}
/* #department .listMain .thead li:last-child,#department .listMain .tbody li:last-child{
  float:right;
  width:7.25rem !important;
} */
#department .listMain .thead li:last-child,#department .listMain .tbody .el-button{
  padding:9px 0px;
}
.listMain .tbody .lastchild>span,.listMain .tbody .lastchild>.el-button{
margin-right: 0.4rem;
}
.opsetElbutton{
  color:#FF6600;
}
/* #department #noData {
  margin-top: 0rem;
} */

#department .haveClick {
  cursor: pointer;
  color: #363636;
  font-size: 0.7rem;
}
#department .noClick {
}
#department .isLast {
  font-size: 0.7rem;
  color: #aaaaaa;
}
#department .isFirst {
  font-size: 0.9rem;
}
#department .el-textarea__inner{
   min-height: 150px!important;
}
#department .el-textarea .el-input__count{
      bottom: -40px;
}
/* #department .el-button {
        border: none;
        font-size: 0.7rem;
        color: #F57723;
        padding: 0 0.5rem !important;
    }

    #department .el-button:hover {
        background-color: transparent;
    } */
  #department .el-scrollbar__wrap{
    overflow-x:hidden!important;
  }
</style>