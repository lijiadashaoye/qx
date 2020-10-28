<template>
    <div id="template">
        <div class="serchCondition">
            <div class="out">
                <el-date-picker
                    v-model="userParamsTime"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="timestamp"
                    >
                </el-date-picker>
            </div>
            <div class="out">
                <el-input
                    placeholder=" 请输入模版名称进行搜索"
                    prefix-icon="el-icon-search"
                    v-model="userParams.name">
                </el-input>
            </div>
            <div class="servhBtn" @click="serch">
                搜索
            </div>
            <div class="number">
                <span class="fontColor1">当前已创建模板数量</span>
                <span class="fontColor" v-if="!$parent.userinfo.isPlatformAdmin">{{this.$parent.userinfo.templateNum}}</span>
                <span class="fontColor" v-if="$parent.userinfo.isPlatformAdmin">{{this.$parent.userinfo.templateNum}}</span>
                <span class="fontColor1">，剩余可创建模板数量</span>
                <span class="fontColor" v-if="!$parent.userinfo.isPlatformAdmin">{{(this.$parent.userinfo.templateLimit - this.$parent.userinfo.templateNum) | num}}</span>
                <span class="fontColor" v-if="$parent.userinfo.isPlatformAdmin">--</span>
            </div>
       
            <div class="addBtn" v-if="( $parent.permissionArr.indexOf(100203)>=0 && ((this.$parent.userinfo.templateLimit - this.$parent.userinfo.templateNum) > 0) || $parent.userinfo.isPlatformAdmin)"  @click="toPage('templateAdd')">新建</div>
            <div class="addBtn1" v-if="$parent.permissionArr.indexOf(100203)>=0 && ((this.$parent.userinfo.templateLimit - this.$parent.userinfo.templateNum) < 1 && !$parent.userinfo.isPlatformAdmin)"  >新建</div>
        </div>
        <div class="main">
            <table cellspacing="0">
                <thead>
                    <tr>
                        <th style="width:4%">序号</th>
                        <th style="width:5%">模板ID</th>
                        <th style="width:10%">模板名称</th>
                        <th style="width:8%">使用权限</th>
                        <th style="width:8%">编辑权限</th>
                        <th style="width:8%">创建人</th>

                        <th style="width:12%">创建时间</th>
                        <th style="width:13%">最新激活时间</th>
                        <th style="width:17%">版本记录</th>
                        <th style="width:14%">操作</th>
                    </tr>
                </thead>
                <tbody v-if="userList && userList.length > 0">
                    <tr v-for="(item,index) in userList" :key="index">
                        <td>{{index + 1}}</td>
                         <td>{{ item.id }}</td>
                        <td>{{item.name}}</td>
                        <td>
                        <div v-if="item && item.impower.length > 0">
                            {{ item.impower[0].name_ |stringLeng(6)}}
                        </div>
                        <div v-else>
                        --
                        </div>
                        <div
                            class="more"
                            v-if="item && item.impower.length > 1"
                            @click="openNumberDloag(item)"
                        >
                            更多
                        </div>
                        </td>
                        <td>
                        <div v-if="item && item.editImpower.length > 0">
                            {{ item.editImpower[0].name_ |stringLeng(6)}}
                        </div>
                        <div v-else>
                        --
                        </div>
                        <div
                            class="more"
                            v-if="item && item.editImpower.length > 1"
                            @click="openNumberDloag_(item)"
                        >
                            更多
                        </div>
                        </td>
                       <td>{{ item.user.username }}</td>
                        <td>{{ item.createTime | toBlockTime}}</td>
                        <td>{{ item.activateTime | toBlockTime}}</td>
                         <td>
                        <el-select
                            v-model="item.templateSerial"
                            placeholder="请选择版本序列号"
                        >
                            <el-option
                            v-for="it in item.versionHistory"
                            :key="it"
                            :label="it"
                            :value="it"
                            >
                            </el-option>
                        </el-select>
                        </td>
                        <!-- <td>{{item.operator}}</td>
                        <td>{{item.updateTime | toBlockTime}}</td> -->
                        <td class="lastTd">
                            <!-- 停用启用 -->
                            <span class="option"  
                                v-if="item.user.id == $parent.userinfo.id && $parent.permissionArr.indexOf(100201)>=0 && (item.templateSerial.length == 0 ||
                                (item.versionHistory.length > 0 &&
                                item.templateSerial == item.versionHistory[0]))" >
                                <el-popover
                                    placement="top"
                                    v-model="item.isactive">
                                    <p style="text-align: center;font-size:0.7rem;width:6rem">是否确认{{item.status==1?'停用':'启用'}} ？</p>
                                    <div style="text-align: center; margin: 0">
                                        <el-button size="mini" style="font-size:0.7rem;" type="text" @click="item.isactive = false">取消</el-button>
                                        <el-button type="primary" style="font-size:0.7rem;" size="mini" @click="activeTem(item)">确定</el-button>
                                    </div>
                                    <el-button slot="reference">{{item.status==1?'停用':'启用'}}</el-button>
                                </el-popover>
                            </span>
                           
                            <span style="color:#848484;padding-right: 0.5rem;"
                                
                                v-if=" $parent.permissionArr.indexOf(100201)>=0 &&( item.user.id != $parent.userinfo.id ||  
                                    (item.versionHistory.length > 0 &&
                                        item.templateSerial != item.versionHistory[0]))" 
                               
                                >{{item.status==1?'停用':'启用'}}</span
                            >    
                            <span class="option" v-if="$parent.permissionArr.indexOf(100203)>=0 &&(item.templateSerial.length == 0 ||
                      (item.versionHistory.length > 0 &&
                        item.templateSerial == item.versionHistory[0]))" @click="toPage('templateEdit',item)" >编辑 </span>
                          
                          <span  
                            v-if="$parent.permissionArr.indexOf(100203)>=0 && (item.templateSerial.length > 0 &&
                                    (item.versionHistory.length > 0 &&
                                        item.templateSerial != item.versionHistory[0]))"
                          style="color:#848484;padding-right: 0.5rem;"
                          >编辑 </span>


                            <span class="option" 
                                v-if="$parent.permissionArr.indexOf(100202)>=0 &&item.user.id == $parent.userinfo.id && item.status!=1 &&
                                (item.templateSerial.length == 0 ||
                                (item.versionHistory.length > 0 &&
                                item.templateSerial == item.versionHistory[0]))" >

                                <el-popover
                                    placement="top"
                                    v-model="item.isDelete">
                                    <p style="text-align: center;font-size:0.7rem;width:6rem">是否确认删除？</p>
                                    <div style="text-align: center; margin: 0">
                                        <el-button size="mini" style="font-size:0.7rem;" type="text" @click="item.isDelete = false">取消</el-button>
                                        <el-button type="primary" style="font-size:0.7rem;" size="mini" @click="deleteTemple(item)">确定</el-button>
                                    </div>
                                    <el-button slot="reference">删除</el-button>
                                </el-popover>
                            </span>
                            <span  
                                v-if=" $parent.permissionArr.indexOf(100202)>=0  && (item.templateSerial.length > 0 &&
                                    (item.versionHistory.length > 0 &&
                                        item.templateSerial != item.versionHistory[0]) || item.status==1)"
                                style="color:#848484;padding-right: 0.5rem;"
                            >删除 </span>
                            <span
                                class="option"
                                v-if=" $parent.permissionArr.indexOf(100206) &&
                                    (item.templateSerial.length > 0 &&
                                    (item.versionHistory.length > 0 &&
                                        item.templateSerial != item.versionHistory[0]))
                                "
                                @click="seeHistory('templateHistory', item)"
                                >查看</span
                            >
                             <span  
                                v-if=" $parent.permissionArr.indexOf(100206)>=0  && (item.templateSerial.length == 0 ||
                      (item.versionHistory.length > 0 &&
                        item.templateSerial == item.versionHistory[0]))"
                                style="color:#848484;padding-right: 0.5rem;"
                            >查看 </span>
                        </td>
                    </tr>
                </tbody>
                <nodata class="nodata" v-if="!userList || userList.length == 0">
                    <div slot="header" class="title">
                        暂无模板数据
                    </div>
                </nodata>
            </table>
            <div class="fenye" v-if="userList && userList.length > 0">
                <el-pagination
                @current-change="handleCurrentChange"
                :page-size="userParams.pageSize"
                layout="prev, pager, next"
                :total="total">
                </el-pagination>
            </div>
            <el-dialog class="dloag" :title='dialogTit' :visible.sync="numberIsDloag" width="21rem" :close-on-click-modal="false">
                <el-scrollbar style="height:100%" class="templatepermission">
                    <div class="componentsListOut" v-for="(item,index) in componentsList" :key="index">
                        <el-row class="componentsListOutRow">
                            <el-col :span="2">
                                <div class="grid-content bg-purple">
                                    {{index + 1}}
                                </div>
                            </el-col>
                            <el-col :span="22">
                                <div class="grid-content bg-purple-light">
                                    {{item.username+'('+item.companyName+')'}}
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-scrollbar>
            </el-dialog>
            <el-dialog
        class="dloag"
        :title="dialogTit"
        :visible.sync="numberIsDloag"
        width="21rem"
        :close-on-click-modal="false"
      >
        <el-scrollbar style="height:100%" class="templatepermission">
          <div
            class="componentsListOut"
            v-for="(item, index) in componentsList"
            :key="index"
          >
            <el-row class="componentsListOutRow">
              <el-col :span="2">
                <div class="grid-content bg-purple">
                  {{ index + 1 }}
                </div>
              </el-col>
              <el-col :span="22">
                <div class="grid-content bg-purple-light ">
                  <i
                    class="iconfont"
                    style="color:#F76A0D;"
                    :class="{
                      'icon-zuzhiguanli': item.type == 'departments',
                      'icon-yonghu': item.type == 'companys'
                    }"
                  ></i>
                  {{ item.name_ }}
                </div>
              </el-col>
            </el-row>
          </div>
        </el-scrollbar>
      </el-dialog>
        </div>
    </div>
</template>
<script>
import nodata from '../../components/nodeData/noData'
import {templateList,templateUpdateStatus,templateDeleteById,templateAddOrUpdate,templateAddPermission,templateSavePage ,certTemplateUpdateStatus} from 'src/api/template';
export default {
    components: { nodata },
    data () {
        return {
            numberIsDloag: false,
            userParamsTime:[],
            userParams:{
                pageNum:1,
                pageSize:10,
                startTime:'',
                endTime:'',
                name:''
                // phone:'',
                // type:'0'
            },
            userList:[],
            total:100,
            dialogTit:'',
            numberIsDloag:false,
            options:[],
            componentsList:[],
            accountInfo:{}
        }
    },
    methods: {
        async activeTem(item){
            let state=item.status==2?'激活':'注销'
            let params={};
            let result = await certTemplateUpdateStatus({id:item.id,status:item.status==1?2:1});
            this.$message({
                message: '模板已'+state+'！',
                type: 'success'
            });
            this.getList();
        },
        async optionTemplate(item,num){
            let state=num==2?'停用':'启用'
            let params = {
               id:item.id,
               status:num
           }
            let result = await templateUpdateStatus(params);
            this.$message({
                message: state+'成功！',
                type: 'success'
            });
            this.getList();
        },
       async deleteTemple(item){
           
           let params = {
               id:item.id
           }
            let result = await templateDeleteById(params);
            this.$parent.getUserInfo();
            this.$message({
                message: '删除成功！',
                type: 'success'
            });
            this.getList();
        },
        
        seeHistory(type, item_) {
            let item = Object.assign({}, item_);
            if (item) {
                item.companys = JSON.stringify(item.companys);
            }
            this.$router.push({ path: type, query: { ...item } });
        },
        openNumberDloag(item) {
            this.dialogTit = item.name + "-使用权限";
            this.componentsList = item.impower;
            this.numberIsDloag = true;
        },
        openNumberDloag_(item){
            this.dialogTit = item.name + '-使用权限'
            this.componentsList = item.editImpower;
            this.numberIsDloag = true;
        },
        toPage(type,item_){
            let item = Object.assign({},item_)
           
            
            this.$router.push({path:type,query:{...item}})
        },
        serch(){
            this.userParams.pageNum = 1;
            this.getList();
        },
        //获取列表
        async getList() {
            this.userParams.startTime = (this.userParamsTime && this.userParamsTime.length > 0 )? this.userParamsTime[0] : "";
            // console.log(Number(this.userParamsTime[1])+86400000,Number(this.userParamsTime[1]),1000*60*60*24)
            this.userParams.endTime = (this.userParamsTime && this.userParamsTime.length > 1 ) ? Number(this.userParamsTime[1])+86400000 : "";
            let result = await templateList(this.userParams);
            result.rows.map(item => {
                // 版本记录
                item.templateSerial =
                item.versionHistory.length > 0 ? item.versionHistory[0] : "";
                // 使用权限
                    item.impower = item.useList.sysUserUseList
                    .map(it => {
                        console.log(it);
                        
                        it.name_ = `${it.username}`;
                        it.type = "companys";
                        return it;
                    })
                    .concat(
                        ...item.useList.authUseList.map(ite => {
                        ite.name_ = ite.name;
                        ite.type = "departments";
                        return ite;
                        })
                    );
                    // 编辑权限
                    item.editImpower = item.useList.sysUserEditList
                    .map(it => {

                        it.name_ = `${it.username}`;
                        it.type = "companys";
                        return it;
                    })
                    .concat(
                        ...item.useList.authEditList.map(ite => {
                        ite.name_ = ite.name;
                        ite.type = "departments";
                        return ite;
                        })
                    );
                return item;
            });
            this.userList = result.rows;
            this.total = result.total;
            if(this.userList && this.userList.length > 0){
                for(let i = 0;i<this.userList.length;i++){
                    this.$set(this.userList[i],'isDelete',false);
                    this.$set(this.userList[i],'tingyong',false);
                    this.$set(this.userList[i],'qiyong',false);
                }
            }
        },
        //分页
        handleCurrentChange(value){
            this.userParams.pageNum = value;
            this.getList();
        },
    },
    created() {
        this.$parent.getUserInfo_();
        this.accountInfo = JSON.parse(sessionStorage.getItem('user')); 
        this.getList();
    },
}
</script>
<style lang="scss" scoped>
@import "./index";
@import "~assets/css/mixin";
</style>
<style>
#template .el-input {
        width: 14.9rem;
    }
#template .el-date-editor .el-range__icon{
    font-size: 0.7rem;
    margin-left: -0.25rem;
    color: #C8C8C8;
    float: left;
    line-height: 1.6rem;
}
#template .el-input__icon{
    height: 100%;
    width: 1.25rem;
    line-height: 1.6rem;
}
#template .el-date-editor .el-range-separator{
        padding: 0 0.25rem;
        line-height: 1.6rem;
}
#template .el-select>.el-input{
    font-size: 0.7rem;
    height: 2rem;
    width: 100%;
}
#template .el-select .el-input__inner{
    padding-right: 1.75rem;
}
#template .el-input__inner{
    height: 2rem;
    line-height: 2rem;
}
#template .el-input .el-input__icon{
    line-height: 2rem;
}
#template .el-input--prefix .el-input__inner{
    padding-left:1.5rem;
    font-size: 0.7rem;
}

#template .el-button--primary{
    width: 100%;
    height: 100%;
    background-color:#F76A0D;
    font-size: 0.7rem;
}
 #template .el-popover__reference{
    font-size: 0.7rem;
    color:#F76A0D;
    border:none;
    padding: 0;
 }
 #template .el-popover__reference:hover{
    background-color: #fff;
 }
#template .el-range-editor .el-range-input{
        font-size: 0.7rem;
    }
#template  .el-dialog__title{
    font-size: 1.2rem;
    color: #363636;
}
#template  .dloag .el-dialog__body{
    padding-bottom: 1.5rem;
    height: 18rem;
}
#template .componentsListOutRow{
    margin-bottom: 1.1rem;
}
.templatepermission .el-scrollbar__wrap {
   overflow-x: hidden;
}
</style>
