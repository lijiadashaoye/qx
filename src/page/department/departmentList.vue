<!--*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************-->
<template>
  <div id="departmentList">
    <div class="serchOut">
      <div class="left">
        <!-- <span class="back" @click="toPage('/manage/department')"> <i class="el-icon-arrow-left"></i> 返回上一页</span> -->
        <div class="levelOut">组织：
            <span class="level" v-for="(item,index) in departmentScortList" :key="index" v-if="departmentScortList.length > 0" @click="getListChange(item)" :class="{active:index < departmentScortList.length - 1}">{{item.name}}
                <i v-if="(index+1) < departmentScortList.length" class="el-icon-arrow-right"></i>
            </span>
        </div>
      </div>
      <div>
        <div class="addDepartmentBtn" v-if="$parent.permissionArr.indexOf(100604)>=0" @click="addDepartmentAct('')">添加组织</div>
      </div>
      <!-- {{JSON.stringify(Breadcrumb)}} -->
    </div>
    <div class="listMain">
      <ul class="thead">
        <li style="width:15%">组织名称</li>
        <li style="width:35%">职能描述</li>
        <li style="width:20%">添加时间</li>
        <li style="width:15%">状态</li>
        <li style="width:15%">操作</li>
      </ul>
      <ul class="tbody" v-for="(item,index) in departmentList" :key="index">
        <li style="width:15%" >
          <div v-if="!getdataParams.parentId">{{item.parentDeps_}}</div>
           <el-tooltip  class="item" :hide-after="1000000000" :popper-class="'tootip_'" effect="light"  placement="bottom">
             <div slot="content" style="width:5rem;">{{item.name}}</div>
          <el-button style="width:auto;" type="text" @click="toChildDepartment(item)" class="opsetElbutton">
             {{item.name  | stringLeng(12)}}
             </el-button>
          
          </el-tooltip>
           
        </li>
        <li style="width:35%;">
           <el-tooltip  class="item" :popper-class="'tootip_'" effect="light"  placement="bottom">
             <div slot="content" style="width:5rem;">{{item.description}}</div>
          <span> {{item.description | stringLeng(35)}}</span>
          
          </el-tooltip>
        </li>
        <li style="width:20%">{{item.createTime  | toBlockTime}}</li>
        <li style="width:15%" class="node" >
          <span v-if="item.enable">已启用</span>
          <span v-else :style="{color:'#C8C8C8'}">已停用</span>
        </li>
        <li style="width:15%" class='lastchild' >
          <el-popover placement="top" v-model="item.isActive">
            <p
              v-if="item.enable == false"
              style="text-align: center;font-size:0.7rem;width:6rem"
            >是否启用此组织？</p>
            <p
              v-if="item.enable == true"
              style="text-align: center;font-size:0.7rem;width:6rem"
            >是否停用此组织？</p>
            <div style="text-align: center; margin: 0">
               
              <el-button
                size="mini"
                style="font-size:0.7rem;"
                type="text"
                @click="item.isActive = false"
              >取消</el-button>
              <el-button
                type="primary"
                style="font-size:0.7rem;"
                size="mini"
                @click="changeState(item)"
              >确定</el-button>
             
            </div>
            <el-button slot="reference"   type="text" v-if="item.enable == false && $parent.permissionArr.indexOf(100605)>=0">启用</el-button>
            <el-button slot="reference"    type="text" v-if="item.enable == true && $parent.permissionArr.indexOf(100605)>=0">停用</el-button>
          </el-popover>
          <el-button slot="reference" v-if="$parent.permissionArr.indexOf(100604)>=0" type="text" @click="addDepartmentAct(item)">编辑</el-button>
          <el-popover placement="top" v-model="item.isDelete" >
            <p style="text-align: center;font-size:0.7rem;width:6rem">删除后无法恢复，是否确认？</p>
            <div style="text-align: center; margin: 0">
               
              <el-button
                size="mini"
                style="font-size:0.7rem;"
                type="text"
                @click="item.isDelete = false"
              >取消</el-button>
             <el-button
                type="primary"
                style="font-size:0.7rem;"
                size="mini"
                @click="deleteDepartmentAct(item)"
              >确定</el-button>
            </div>
            <el-button type="text" v-if="$parent.permissionArr.indexOf(100606)>=0" slot="reference">删除</el-button>
          </el-popover>
        </li>
      </ul>
      <nodata class="nodata" v-if="departmentList.length == 0">
        <div slot="header" class="title">暂无组织架构数据</div>
      </nodata>
      <div class="fenye" >
        <el-pagination
        v-if="departmentList.length > 0"
          @current-change="handleCurrentChange"
          :page-size="7"
          layout="prev, pager, next"
          :total="total"
        ></el-pagination>
        
      </div>
      <div class="backPage" style="text-align:left;margin:-32px  0;line-height:32px;" >
          <span class="back" style="font-size:0.8rem;" @click="toPage('/manage/department')"> <i class="el-icon-arrow-left"></i> 返回上一页</span>
        </div>
    </div>
    <el-dialog
      class="dloag"
      :title="departmentDialogStatus==1?'添加组织':'编辑组织'"
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
      
        <div style="height:0.15rem;width:100%;"></div>
      </el-form>
      <span slot="footer" class="dialog-footer">
         <el-button  style="height: 1.8rem; line-height: 0.6rem; padding: .4rem 1rem; font-size: 0.7rem;" @click="addDepartmentAct('','close')">取消</el-button>
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
// import mixin from "utils/mixin.js";
import nodata from "../../components/nodeData/noData";
export default {
  components: { nodata },
  // mixins: [mixin],
  data() {
    return {
      count:0,
      total: 100,
      getdataParams: { pageNum: 1, pageSize: 10, parentId: null,type:1 },
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
      departmentScortList:[]
    };
  },
  methods: {
    getListChange(item){
      this.getdataParams.parentId = item.id;
      this.List();
    },
    toPage(page){
      if(this.Breadcrumb.length<2){
        this.$router.push({path:page});
      }else{
        
        this.toDepartmentPage({parentId:this.Breadcrumb[this.Breadcrumb.length-2].id})
        this.Breadcrumb.splice(this.Breadcrumb.length-1,this.Breadcrumb.length)
        console.log(this.Breadcrumb);
        
      }
        // this.$router.push({path:page});
    },
   download(){
      window.open( window.g.apiurl+'/admin/department/downloadTemplate');
    //  let data = await downloadTemplate();
    //  this.downloadFile(data,'模板');
    //  //console.log(data);
    },
    List() {
      let params = this.getdataParams;

      params.parentId = !this.getdataParams.parentId? "" : this.getdataParams.parentId;
      let that = this
      departmentList(params).then(result => {
        if (!result.departments.rows) {
          this.total = 0;
          this.departmentList = [];
          this.departmentScortList = result.parentDeps;
          if(!this.$parent.userinfo.isSuperAdmin &&  !this.getdataParams.parentId){
            this.$message({message:'对不起，您没有此访问权限，请联系管理员设置',type:'warning'})
          }
        } else {
           result.departments.rows= result.departments.rows.map((item)=>{
            item.parentDeps_=!!item.parentDeps ? item.parentDeps.map(item=>{return item.name}).join('-'):''
            return item;
           })
          this.departmentList = result.departments.rows;
          this.departmentScortList = result.parentDeps;
          this.total = result.departments.total;
        }
  
        //  this.departmentList = !result.rows?[]:result.rows;
        //   this.total = result.total;
      });
    },
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
                this.List();
              })
            },
    toChildDepartment(item) {
      
        this.Breadcrumb.push(item);
      
      
      this.getdataParams.parentId = item.id;
      this.getdataParams.pageNum = 1;
      this.List();
    },
    //返回上一级
    toPre(){
       this.Breadcrumb = this.Breadcrumb.splice(0,this.Breadcrumb.length - 1);
       this.getdataParams.parentId = this.Breadcrumb[this.Breadcrumb.length - 1].id
       this.List()
    },
    addDepartmentActData() {
     
      let that=this
      this.$refs.DepartmanetForm.validate(a=>{
        if(!a){
          return 
        }
      let message=this.departmentDialogStatus==1?'组织添加成功':'组织编辑成功'
      let params = that.DepartmanetForm;
      departmentAddOrUpdate(params).then(result=>{
        that.$message({message:message,type:'success'})
        that.addDepartmentAct("", "close");
        this.getdataParams.pageNum = 1;
        that.List();
      })
      })
    },
    // 创建编辑
    addDepartmentAct(data, type) {
      if (type == "close") {
        this.$refs.DepartmanetForm.resetFields();
        this.isAddDepartment = false;
      } else {
        this.isAddDepartment = true;
        if (data) {//编辑
          this.departmentDialogStatus = 2;
          this.DepartmanetForm = Object.assign( 
            {},
            {name: data.name,description: data.description,parentId:sessionStorage.getItem('parentId'),id:data.id}
            );
           
        }else{//新建
          let a={parentId: sessionStorage.getItem('parentId')}
          this.DepartmanetForm= Object.assign(
             {name: "",
            description: "",
            parentId: '',
            id: ""},
            a);
         
           this.departmentDialogStatus = 1;
        }
      }
    },
    // 修改状态
    async changeState(item) {
      let params = {
        id: item.id,
        enable: !item.enable
      };
      let data = await departmentUpdateStatus(params);
      let message = item.enable?'组织已停用':'组织已启用'
      this.$message({message:message,type:'success'})
      item.isActive = false;
      this.List();
    },
    // 删除
    deleteDepartmentAct(data) {
      let params={id:data.id}
      departmentDelete(params).then(result=>{
        this.$message({message:'组织删除成功',type:'success'})
        data.isDelete = false
        this.List();
      })
    },
    // 分页
    handleCurrentChange(val) {
      this.getdataParams.pageNum = val;
      this.List();
    },
    toDepartmentPage(item, index,total) {
          this.getdataParams.pageNum=1;
        this.getdataParams.parentId=item.parentId
        this.List();
      // this.Breadcrumb = this.Breadcrumb.splice(0, index + 1);
      // let params = !!item.id
      //   ? (this.getdataParams.parentId = item.id)
      //   : (this.getdataParams.parentId = null);
      //  this.List()
    },
    
  },
  mounted() {
     this.$nextTick(()=>{
      setTimeout(()=>{
        this.List();
      },500)
    })
  },
  created() {
      this.getdataParams.parentId = sessionStorage.getItem('parentId');
  }
};
</script>

<style lang="scss" scoped>
@import "./departmentList";

@import "~assets/css/mixin";
</style>
<style>
.demo-DepartmanetForm_ .el-input{
  width:100% !important;
  /* font-size:0.7rem !important; */
}
.listMain .el-button{
  font-size:.8rem
}
/* #departmentListList .listMain .thead li:last-child,#departmentList .listMain .tbody li:last-child{
  float:right;
  width:7.25rem !important;
} */
#departmentList .listMain .thead li:last-child,#departmentList .listMain .tbody .el-button{
  padding:9px 0px;
}
.listMain .tbody .lastchild>span,.listMain .tbody .lastchild>.el-button{
margin-right: 0.4rem;
}
.opsetElbutton{
  color:#FF6600;
  cursor: pointer;

}

.back:hover{
  color:#FF6600;
}
#departmentList .haveClick {
  cursor: pointer;
  color: #363636;
  font-size: 0.7rem;
}
#departmentList .isLast {
  font-size: 0.7rem;
  color: #aaaaaa;
}
#departmentList .isFirst {
  font-size: 0.9rem;
}
#departmentList .el-textarea__inner{
   min-height: 150px!important;
}
#departmentList .el-textarea .el-input__count{
      bottom: -40px;
}
#departmentList .el-button--text {
  color:#FF6600;
  font-size: 0.7rem;
}
#departmentList .active{
  cursor: pointer;
}
/* #departmentList .el-button {
        border: none;
        font-size: 0.7rem;
        color: #F57723;
        padding: 0 0.5rem !important;
    }

    #departmentList .el-button:hover {
        background-color: transparent;
    } */
</style>