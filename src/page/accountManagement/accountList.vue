<!--*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************-->
<template>
  <div id="account">
    <div class="serchCondition">
      <div class="left">
        <div class="out">
          <el-input
            placeholder="请输入姓名、账号或手机号进行搜索"
            prefix-icon="el-icon-search"
            v-model="accountParams.keyword"
          ></el-input>
        </div>
        <div class="servhBtn" @click="search">搜索</div>
      </div>
      <div class="right" v-if="!this.$parent.userinfo.isPlatformAdmin">
        <span class="titleWorld"
          >当前已添加成员数量<span class="fontColor">{{
            this.$parent.userinfo.memberNum | num
          }}</span
          >，剩余可添加成员数量<span class="fontColor">{{
            (this.$parent.userinfo.memberLimit -
              this.$parent.userinfo.memberNum)
              | num
          }}</span></span
        >
        <div
          class="btnInvite "
          @click="adduser"
          v-if="
            this.$parent.userinfo.memberLimit -
              this.$parent.userinfo.memberNum >
              0
          "
        >
          添加成员
        </div>
        <div class="btnInvite btnInvite3 " v-else>添加成员</div>
      </div>
      <div class="right" v-if="this.$parent.userinfo.isPlatformAdmin">
        <span class="titleWorld"
          >当前已添加成员数量<span class="fontColor">{{
            this.$parent.userinfo.memberNum | num
          }}</span
          >，剩余可添加成员数量<span class="fontColor">--</span></span
        >
        <div class="btnInvite" @click="adduser">添加成员</div>
      </div>

      <!-- <div class="adduserClassOne"  @click="topage">权限设置</div> -->
    </div>

    <div class="main">
      <div v-if="listp.type && listp.type == 2" class="deNav">
        <div>组织</div>
        <!-- <div
          class="dLevel"
          v-for="(item, index) in department_levels"
          :key="index"
        >
          <span v-if="index >= 1">>&nbsp;</span>{{ item.name }}&nbsp;
        </div> -->
        <div
          class="dLevel"
          v-for="(item, index) in department_levels"
          :key="index"
        >
          <span v-if="index < 1">:</span>
          <!-- <span v-if="index >= 1" >>&nbsp;</span> -->
          <span :class="{active:index < department_levels.length - 1}" @click="getListChange(item)"> <i v-if="index >= 1" class="el-icon-arrow-right"></i>{{ item.name }}&nbsp;</span>
        </div>
      </div>
      <table cellspacing="0">
        <thead>
          <tr>
            <th style="width:8%">姓名</th>
            <th style="width:8%">账号</th>
            <th style="width:10%">组织设定</th>
            <th style="width:10%">手机号</th>
            <th style="width:8%">创建模板</th>
            <th style="width:8%">颁发证书</th>
            <th style="width:8%">添加成员</th>
            <!-- <th style="width:16%">权限</th> -->
            <th style="width:8%">上链状态</th>
            <th style="width:7%">状态</th>
            <th style="width:16%">操作</th>
          </tr>
        </thead>
        <tbody v-if="accountList && accountList.length > 0">
          <tr v-for="(item, index) in accountList" :key="index">
            <td>{{ item.realName }}</td>
            <td>{{ item.username }}</td>

            <td
            class="td1"
              v-if="item.departments_.length > 0 && $parent.permissionArr.indexOf(100506)>=0"
              :class="{
                canSeting: item.status == 2,
                noSeting: item.status == 1
              }"
              @click="organizationSetting(item)"
              :title="item.departments_"
            >
            {{ item.departments | toString("-") }}
              <!-- <el-tooltip class="item" effect="light" :content="item.departments_" placement="bottom">
                <el-button> {{ item.departments | toString("-") }}</el-button>
              </el-tooltip> -->
              <!-- {{ item.departments_ | nameLeng(item.departments, 20) }} -->
            </td>
            <td
            class="td1"
              v-if="item.departments_.length > 0 && $parent.permissionArr.indexOf(100506) < 0"
              :class="{
                canSeting: item.status == 2,
                noSeting: item.status == 1
              }"
              :title="item.departments_"
            >
            {{ item.departments | toString("-") }}
              <!-- <el-tooltip class="item" effect="light" :content="item.departments_" placement="bottom">
                <el-button> {{ item.departments | toString("-") }}</el-button>
              </el-tooltip> -->
              <!-- {{ item.departments_ | nameLeng(item.departments, 20) }} -->
            </td>
            <td
              v-if="item.departments_.length < 1 && $parent.permissionArr.indexOf(100506)>=0"
              :class="{
                canSeting: item.status == 2,
                noSeting: item.status == 1
              }"
              @click="organizationSetting(item)"
            >
              设置组织
            </td>
            <td
              v-if="item.departments_.length < 1 && $parent.permissionArr.indexOf(100506) < 0"
              :class="{
                canSeting: item.status == 2,
                noSeting: item.status == 1
              }"
            >
              设置组织
            </td>
            <td>{{ item.phone }}</td>
            <td>
              {{ item.templateNum }}/{{ item.templateLimit }}
              <div
                v-if="$parent.permissionArr.indexOf(100508)>=0"
                style="color:#FF6600;cursor:pointer;"
                @click="setProductCreatNum(item, 1, item.templateLimit)"
              >
                配置
              </div>
            </td>
            <td>
              {{ item.certNum }}/{{ item.certLimit }}
              <div
              v-if="$parent.permissionArr.indexOf(100509)>=0"
                style="color:#FF6600;cursor:pointer;"
                @click="setProductCreatNum(item, 2, item.certLimit)"
              >
                配置
              </div>
            </td>

            <td>
              {{ item.memberNum }}/{{ item.memberLimit }}
              <div
                v-if="$parent.permissionArr.indexOf(100510)>=0"
                style="color:#FF6600;cursor:pointer;"
                @click="setProductCreatNum(item, 3, item.memberLimit)"
              >
                配置
              </div>
            </td>
            <td>
              <span
                @click="getTxDetail(item)"
                :class="{ errorColor: item.txStatus == 2, txStatus: true }"
                >{{ item.txStatus | txStatusString }}</span
              >

              <div
                v-if="
                  item.txStatus == 2 &&
                    item.uploadChainOperatorId == $parent.userinfo.id
                "
                style="color:#F76A0D;cursor:pointer;"
                @click="reTxSign(item)"
              >
                重新上链
              </div>
            </td>
            <td :class="{ isActive: item.status == 2 }">
              {{ item.status | roleSate }}
            </td>
            <td class="lastTd">
              <span class="option" v-if="$parent.permissionArr.indexOf(100501)>=0" @click="edit(item)">编辑</span>
              <span class="option" v-if="$parent.permissionArr.indexOf(100503)>=0" @click="openIsrest(item)">重置密码</span>
              <span class="option" v-if="item.status == 1 && $parent.permissionArr.indexOf(100502)>=0">
                <el-popover placement="top" v-model="item.tingyong">
                  <p style="text-align: center;font-size:0.7rem;width:6rem">
                    是否确认停用？
                  </p>
                  <div style="text-align: center; margin: 0">
                    <el-button
                      size="mini"
                      style="font-size:0.7rem;"
                      type="text"
                      @click="item.tingyong = false"
                      >取消</el-button
                    >
                    <el-button
                      type="primary"
                      style="font-size:0.7rem;"
                      size="mini"
                      @click="optionAccount(item, 2)"
                      >确定</el-button
                    >
                  </div>
                  <el-button slot="reference">停用</el-button>
                </el-popover>
              </span>
              <span class="option" v-if="item.status == 2 && $parent.permissionArr.indexOf(100502)>=0">
                <el-popover placement="top" v-model="item.qiyong">
                  <p style="text-align: center;font-size:0.7rem;width:6rem">
                    是否确认启用？
                  </p>
                  <div style="text-align: center; margin: 0">
                    <el-button
                      size="mini"
                      style="font-size:0.7rem;"
                      type="text"
                      @click="item.qiyong = false"
                      >取消</el-button
                    >
                    <el-button
                      type="primary"
                      style="font-size:0.7rem;"
                      size="mini"
                      @click="optionAccount(item, 1)"
                      >确定</el-button
                    >
                  </div>
                  <el-button slot="reference">启用</el-button>
                </el-popover>
              </span>
            </td>
          </tr>
        </tbody>
        <nodata class="nodata" v-if="!accountList || accountList.length == 0">
          <div slot="header" class="title">
            暂无成员数据
          </div>
        </nodata>
      </table>
      <div class="fenye">
        <el-pagination
          v-if="accountList && accountList.length > 0"
          @current-change="handleCurrentChange"
          :page-size="10"
          layout="prev, pager, next"
          :total="total"
        ></el-pagination>
        <div
          class="back"
          @click="jumpRoute"
          v-if="listp.type && listp.type != 2"
        >
          <i class="el-icon-arrow-left"></i>
          返回上一页
        </div>
      </div>
    </div>
    <!-- 修改账户 -->
    <el-dialog
      class="dloag"
      title="修改账号信息"
      :visible.sync="dialogFormUserinfo"
      width="21rem"
      :close-on-click-modal="false"
    >
      <el-form
        :inline="false"
        :inline-message="false"
        :status-icon="true"
        size="mini"
        ref="vimForm"
        class="demo-ruleForm"
        label-position="left"
        label-width="3.5rem"
      >
        <div class="demo-ruleForm">
          <div class="bttitle"></div>
          <el-form-item label="账号" prop="username">
            <el-input :disabled="true" v-model="tempObj.username"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="realName">
            <el-input v-model="tempObj.realName" maxlength="16"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone" maxlength="16">
            <el-input
              v-model.number="tempObj.phone"
              @keyup.native="changeAmount"
              maxlength="11"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="权限" prop="phone">
            <el-select
              v-model="tempObj.roles"
              style="width:100%;"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="权限" prop="phone">
            <el-select v-model="tempObjroleIds" placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in options"
                :key="item.id+'1'"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="
            dialogFormUserinfo = false;
            $refs.vimForm.resetFields();
            $refs.vimForm.clearValidate();
          "
          >取消</el-button
        >
        <el-button type="primary" @click="editData">确认</el-button>
      </div>
    </el-dialog>
    <!-- 添加账户 -->
    <el-dialog
      class="dloag"
      title="添加账户"
      :visible.sync="addIsDloag"
      width="21rem"
      :close-on-click-modal="false"
    >
      <el-form
        :inline="false"
        :inline-message="false"
        :status-icon="true"
        size="mini"
        :model="ruleForm"
        ref="addForm"
        class="demo-ruleForm"
        label-position="left"
        label-width="3.5rem"
      >
        <div class="demo-ruleForm">
          <div class="bttitle"></div>
          <el-form-item label="账号" prop="username">
            <el-input v-model="addParams.username" maxlength="16"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="realName">
            <el-input v-model="addParams.realName" maxlength="16"></el-input>
          </el-form-item>

          <el-form-item label="手机" prop="phone">
            <el-input
              v-model.number="addParams.phone"
              @keyup.native="changeAmountTwo"
              maxlength="11"
            ></el-input>
          </el-form-item>
          <el-form-item label="权限" prop="phone">
            <el-select v-model="addParams.roleIds" placeholder="请选择" style="width:100%">
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addIsDloag = false">取消</el-button>
        <el-button type="primary" @click="addData">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      class="diloag diloagTwo"
      title="组织设置"
      :visible.sync="isSetting"
      width="21rem"
    >
      <!-- <div class="border"></div> -->
      <!-- @node-expand="nodeExpand" -->
      <div class="treebox" >
        <el-tree
          node-key="id"
          :data="departmentList"
          :props="props"
          :default-checked-keys="detailInfo.departments_ids"
          show-checkbox
          @check-change="treeCheckChange"
          :check-strictly="true"
          ref="tree"
        ></el-tree>
      </div>
     
      <div slot="footer" class="dilaogBtn">
        <el-button @click="isSetting = false">取消</el-button>
        <el-button @click="getKey" style="width:auto" type="primary"
          >确认</el-button
        >

        <!-- <div class="sure" @click="getKey">确认</div> -->
      </div>
    </el-dialog>
    <!-- 区块链信息 -->
    <el-dialog
      class="blockDetail dloag"
      title="区块链信息"
      :visible.sync="isBlock"
      width="29rem"
      :close-on-click-modal="false"
    >
      <el-form
        :inline="false"
        :inline-message="false"
        :status-icon="true"
        size="mini"
        ref="blockDetail"
        label-position="left"
        class="demo-ruleForm"
        label-width="4.5rem"
      >
        <div class="demo-ruleForm">
          <div class="bttitle"></div>
          <el-form-item label="区块高度:">
            <!-- blockNumber: "--",
                  blockHash: "--",
                  txHash:'--',
                  from: "--",
                  to: "--" ,
                  timestamp: '--',
                  txStatus:1 -->
            {{ blockDetail.blockNumber }}
          </el-form-item>
          <el-form-item label="区块哈希:">
            {{ blockDetail.blockHash }}
          </el-form-item>
          <el-form-item label="交易哈希:">
            {{ blockDetail.txHash }}
          </el-form-item>
          <el-form-item label="发送方:">
            {{ blockDetail.from }}
          </el-form-item>
          <el-form-item label="接收方:">
            {{ blockDetail.to }}
          </el-form-item>
          <el-form-item label="时间:">
            {{ blockDetail.timestamp | toBlockTime }}
          </el-form-item>
          <el-form-item label="上链状态:">
            {{ blockDetail.txStatus | txStatusString }}
          </el-form-item>
          <el-form-item v-if="blockDetail.txStatus == 3">
             <div class="el-form-item__label" style="margin-left:-4.5rem;color:#F76A0D;cursor: pointer;" @click="openBrowser(blockDetail.txHash)">查看详细信息</div> 
            </el-form-item>
        </div>
      </el-form>
      <div style="height:54px;"></div>
    </el-dialog>
    <!-- //配置 -->
    <el-dialog
      :close-on-click-modal="false"
      class="dloag dialogTitleBorder diloagTwo"
      title="配置"
      :visible.sync="iscProItem"
      width="28rem"
    >
      <!-- <div class="titleBorder"></div> -->
      <div style="width:100%;padding:0 0 1.5rem 0;margin-top:10px;">
        <div class="configrationMessage">
          {{ configrationMessage
          }}<span style="color:#F76A0D">{{ configrationMax }}</span>
        </div>
        <el-input
          v-model="configrationValue"
          class="configrationValue"
          placeholder="请输入数量"
          @keyup.native="valitConfigRation"
          maxlength="9"
        ></el-input>
        <div class="configrationButton" @click="setConfigrationNumber">
          确认
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      class="dloag dialogTitleBorder diloagTwo"
      title="重置密码"
      :visible.sync="isResetpwd"
      width="23rem"
    >
      <div>
        <el-radio v-model="radio" label="1">重置为随机密码并发送至关联手机号</el-radio>
        <el-radio v-model="radio" label="2">重置为初始密码12345678，短信通知关联手机号</el-radio>
      </div>
      <div class="sureBtnOut">
        <div class="canlce" @click="isResetpwd = false">取消</div>
        <div class="sure" @click="resetPws">确定</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// sysrolelist,
import {
  apiAccountList,
  apiDeleteAccount,
  apiOptionAccount,
  apiEditOrAddUser,
  apiResetPaws,
  getBlockInfo,
  sysCert,
  sysTemplate,
  sysrolelist,
  sysUser
} from "api/account.js";
import { apiUserLogout } from "api/login.js";
import nodata from "../../components/nodeData/noData";
import {
  getDepartTreeListHAuth,
  userAddPermissions,
  getSysUserDepartmentList
} from "api/account.js";
import sha256 from "sha256";
import signature from "../../mixins/signatureMixin.js";
export default {
  mixins: [signature],
  components: { nodata },
  data() {
    return {
      department_levels: [],
      configrationType: 1, //1配置产品，2模板那3成员4用户
      configrationMessage: "", //配置产品
      configrationValue: "",
      configrationMax: 0,
      cProItem: {}, //配置产品
      iscProItem: false, //配置产品
      listp: {},

      props: {
        value: "id",
        label: "name",
        children: "child"
      },
      departmentList: [],
      isSetting: false,
      detailInfo: {},
      tempObjroleIds:-1,
      addIsDloag: false,
      role: "",
      dialogFormUserinfo: false,
      rules: {
        phone: [
          { required: true, message: "电话必须填" }
          // { type: 'number', required: true, message: '电话格式不对' }
        ],
        username: [{ required: true, message: "姓名必须填" }],
        realName: [{ required: true, message: "账号必须填" }]
      },
      ruleForm: {
        phone: "",
        username: "",
        realName: "",
        roleIds: [],
        id: ""
      },
      tempObj: {
        phone: "",
        username: "",
        realName: "",
        roles: []
      },
      userinfo: { role: {}, user: {} },
      // old
      input2: "",
      options: [],
      accountParams: {
        pageNum: 1,
        keyword: "",
        pageSize: 10
      },
      accountList: [],
      total: 0,
      addParams: {
        phone: "",
        username: "",
        realName: ""

        // roleIds: []
      },
      blockDetail: {},
      isBlock: false,
      isResetpwd:false,
      radio:'1',
      temp:''
    };
  },
  methods: {
    openBrowser(hash){
//       1-质量溯源 管理员用户
// 2-质量溯源 终端用户
// 3-电子证书 管理员用户
// 4-报告申报 管理员用户
// 5-报告申报 普通用户
      window.open(window.g.historyChain+'?hash='+'0x'+hash);
    },
    openIsrest(item){
      this.isResetpwd = true;
      this.temp = JSON.stringify(item);
    },
    getListChange(item){
      this.listp.dIds = item.id;
      this.getAccountList();
    },
    async reTxSign(item) {
      let departments = await getSysUserDepartmentList({ id: item.id });
      // {“username”:”zhangsan”,”pubKey”:”12322”,”realName”:”张三”,”phone”:”18800989898”,”department”:”[金融-金融1，销售-前端-前端1]”,”desc”:”描述”}
      let valueInfo = {
        username: item.username,
        pubKey: item.pubKey,
        realName: sha256(item.realName),
        phone: sha256(item.phone),
        department: sha256(departments),
        desc: "重新上链成员信息"
      };
      //console.log(valueInfo,'停用启用成员')

      let params = {
        id: item.id,
        status: item.status,
        txSign: await this.txSign(0, valueInfo, item.username)
      };
      let result = await apiOptionAccount(params);
      this.$message({
        message: "重新上链请求已发送！",
        type: "success"
      });
      this.getAccountList();
    },
    jumpRoute() {
      this.$router.push({
        path: "/manage/accountManagement",
        meta: { modelId: 100 }
      });
    },
    //配置产品数量

    async setConfigrationNumber() {
      let arr = [sysTemplate, sysCert, sysUser];
      arr[this.configrationType - 1]({
        id: this.cProItem.id,
        limitNum: this.configrationValue
      }).then(async result => {
        this.$message({ message: "配置成功", type: "success" });
        this.iscProItem = false;
        await this.$parent.getUserInfo();

        await this.getAccountList();
        this.$nextTick(() => {
          setTimeout(() => {
            this.$parent.userinfo = JSON.parse(sessionStorage.getItem("user"));
          }, 500);
        });
      });
    },
    valitConfigRation(e) {
      //验证输入的数量
      let value = e.target.value.replace(/[^0-9]/gi, "");
      this.configrationValue = value;
      // configrationType:1,//1配置产品，2模板那3成员4用户
      let minNumber =
        this.configrationType == 1 ? this.cProItem.isCreateNum : 0;
      let canVNumber =
        this.$parent.userinfo.productLimit -
        this.$parent.userinfo.productNum +
        this.cProItem.canCreateNum;

      if (
        !this.$parent.userinfo.isPlatformAdmin &&
        Number(value) > canVNumber
      ) {
        this.$message({
          message: "您输入的数量大于最大可创建数量",
          type: "error"
        });
        this.configrationValue = "";
      }
      if (!this.$parent.userinfo.isPlatformAdmin && Number(value) < minNumber) {
        this.$message({
          message: "您输入的数量小于已经创建的数量",
          type: "error"
        });
        this.configrationValue = "";
      }
    },
    setProductCreatNum(item, type, value) {
      this.cProItem = item;
      this.configrationValue = value;
      this.iscProItem = true;
      this.configrationType = type;
      let max = 0,
        message = "";
      if (type == 1) {
        message = "当前用户可分配创建模板最大的数量为";
        max = this.$parent.userinfo.isPlatformAdmin
          ? "--"
          : this.$parent.userinfo.templateLimit -
            this.$parent.userinfo.templateNum +
            value;
      }
      if (type == 2) {
        message = "当前用户可分配颁发证书最大的数量为";
        max = this.$parent.userinfo.isPlatformAdmin
          ? "--"
          : this.$parent.userinfo.productLimit -
            this.$parent.userinfo.productNum +
            value;
      }

      if (type == 3) {
        message = "当前用户可分配添加成员最大的数量为";
        max = this.$parent.userinfo.isPlatformAdmin
          ? "--"
          : this.$parent.userinfo.memberLimit -
            this.$parent.userinfo.memberNum +
            value;
      }
      this.configrationMax = max;

      this.configrationMessage = message;
    },
    //
    async getTxDetail(item) {
      if (item.txStatus == 2 || item.txStatus == 1 || !item.txStatus) {
        this.blockDetail = {
          blockNumber: "--",
          blockHash: "--",
          txHash: "--",
          from: "--",
          to: "--",
          timestamp: "--",
          txStatus: item.txStatus
        };
      } else {
        let result = await getBlockInfo({ txHash: item.txHash });
        this.blockDetail = result;
        this.blockDetail.txHash = item.txHash;
        this.blockDetail.txStatus = item.txStatus;
      }
      this.isBlock = true;
    },
    nodeExpand(nodeObj, node, cur) {
      var theChildren = node.childNodes;

      if (theChildren.length < 1) {
        return false;
      }
      let arr = [];
      let setCheckedKey = [];
      theChildren.map(item => {
        item.data.disabled = node.checked || node.disabled;
        this.detailInfo.departments_ids.indexOf(item.data.id) >= 0
          ? setCheckedKey.push(item.data.id)
          : "";
        arr.push(item.data);
        return item;
      });
      console.log(arr);
      theChildren.splice(0, theChildren.length);
      node.doCreateChildren(arr);
      this.$forceUpdate();
    },
    dg(arr, fn, parent) {
      arr.map(item => {
        fn(item, parent);
        if (!!item.child && item.child.length > 0) {
          this.dg(item.child, fn, item);
        }
      });
      return arr;
    },
    getDeparts() {
      let params = { id: this.$parent.userinfo.id };
      getDepartTreeListHAuth(params).then(result => {
        result.map(item => {
          if (this.detailInfo.departments_ids.indexOf(item.id) >= 0) {
            item.checked = true;
          } else {
            item.checked = false;
          }
          return item;
        });
        let that = this;
        let result_ = this.dg(
          result,
          function(value, obj) {
            if (obj) {
              value.disabled = !!obj.checked || !!obj.disabled;
            }
            if (that.detailInfo.departments_ids.indexOf(value.id) >= 0) {
              value.checked = true;
            } else {
              value.checked = false;
            }
          },
          null
        );
        this.departmentList = result_;
      });
    },
    // 组织机构选中
    treeCheckChange(nodeObj, ischeck) {
      if (!nodeObj.child) return;
      let childArr = this.deepReset(
        nodeObj.child,
        (item, index, level) => {
          item.disabled = ischeck;
          return item;
        },
        "child"
      );
      this.$refs.tree.updateKeyChildren(nodeObj.id, [].concat(childArr));
      this.$forceUpdate();
    },
    deepReset(arr, condition, children) {
      // 即将返回的数组
      let main = [];
      // 用try方案方便直接中止所有递归的程序
      try {
        // 开始轮询
        (function poll(arr, level) {
          // 如果传入非数组
          if (!Array.isArray(arr)) return;
          // 遍历数组
          for (let i = 0; i < arr.length; i++) {
            // 获取当前项
            const item = arr[i];
            item.level = level;
            // 先占位预设值
            main[level] = item;
            condition && condition(item, i, level);
            if (!!item.child) {
              poll(item[children], level + 1);
            }
          }
        })(arr, 0);
        // 使用try/catch是为了中止所有轮询中的任务
      } catch (err) {
        console.log(err);
      }
      // 返回最终数组

      return arr;
    },
    deepFind(arr, condition, children) {
      // 即将返回的数组
      let main = [];
      // 用try方案方便直接中止所有递归的程序
      try {
        // 开始轮询
        (function poll(arr, level) {
          // 如果传入非数组
          if (!Array.isArray(arr)) return;
          // 遍历数组
          for (let i = 0; i < arr.length; i++) {
            // 获取当前项
            const item = arr[i];
            item.level = level;
            // 先占位预设值
            main[level] = item;
            // 检验是否已经找到了
            const isFind = (condition && condition(item, i, level)) || false;
            console.log(isFind);
            // 如果已经找到了
            if (isFind) {
              // 直接抛出错误中断所有轮询
              throw Error;
              // 如果存在children，那么深入递归
            } else if (children && item[children] && item[children].length) {
              //    main=[]
              poll(item[children], level + 1);
              // 如果是最后一个且没有找到值，那么通过修改数组长度来删除当前项
            } else if (i === arr.length - 1) {
              // 删除占位预设值
              main = [];
            }
          }
        })(arr, 0);
        // 使用try/catch是为了中止所有轮询中的任务
      } catch (err) {
        console.log(err);
      }
      // 返回最终数组
      return main;
    },
    // 设置组织机构
    async getKey() {
      let parasms = {
        id: this.detailInfo.id,
        departmentIds: this.$refs.tree.getCheckedKeys()
      };

      let result = await userAddPermissions(parasms);
      this.$message({
        message: "设置成功！",
        type: "success"
      });
      this.isSetting = false;
      this.getAccountList();
    },
    // 点击设置组织机构
    organizationSetting(item) {
      if (item.status == 1) {
        this.$message({
          message: "停用后才可设定组织，请先完成“停用”操作！",
          type: "warning"
        });
        return;
      }
      this.getDeparts();
      this.detailInfo = item;
      this.isSetting = true;
      let arr = [];
      if (item.departments && item.departments.length > 0) {
        for (let i = 0; i < item.departments.length; i++) {
          arr.push(item.departments[i].id);
        }
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(arr);
        });
      } else {
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(arr);
        });
      }
    },
    topage() {
      this.$router.push({ path: "permission" });
    },
    search() {
      this.accountParams.pageNum = 1;
      this.getAccountList();
    },
    changeAmountTwo() {
      this.addParams.phone = this.addParams.phone
        .toString()
        .replace(/[^\d]/g, "");
    },
    changeAmount() {
      this.tempObj.phone = this.tempObj.phone.toString().replace(/[^\d]/g, "");
    },
    isChecked(params) {
      if (!params.username || params.username.length < 1) {
        this.$message({
          message: "请输入账号！",
          type: "warning"
        });
        return false;
      }
      if (params.username.length > 16) {
        this.$message({
          message: "账号必须是小于16位的英文或数字",
          type: "error"
        });
        return false;
      }
      var re = /^[a-zA-Z0-9]+$/;
      if (!re.test(params.username)) {
        this.$message({
          message: "账号必须是小于16位的英文或数字",
          type: "error"
        });
        return false;
      }
      if (!params.realName || params.realName.length < 1) {
        this.$message({
          message: "请输入姓名！",
          type: "warning"
        });
        return false;
      }
      if (params.realName.length > 16) {
        this.$message({ message: "姓名必须小于16位", type: "error" });
        return false;
      }
      if (!params.phone || params.phone.length < 1) {
        this.$message({
          message: "请输入手机号！",
          type: "error"
        });
        return false;
      }
      if(!(/^1[3|4|5|6|9|7|8]\d{9}$/.test(params.phone))){ 
             this.$message({
                message: "手机格式有误！",
                type: "error"
            });
            return false; 
      } 
      if (!params.roleIds || params.roleIds.length == 0) {
        this.$message({
          message: "请选择成员角色！",
          type: "error"
        });
        return false;
      }
      return true;
    },
    edit(item) {
      console.log(item);
      this.tempObj = item;
      if (this.tempObj.roles.length > 0) {
        this.tempObjroleIds = this.tempObj.roles[0].id;
      } else {
        this.tempObjroleIds = "";
      }

      this.dialogFormUserinfo = true;
    },
    async editData() {
      let departments = await getSysUserDepartmentList({ id: this.tempObj.id });
      let valueInfo = {
        username: this.tempObj.username,
        pubKey: this.tempObj.pubKey,
        realName: sha256(this.tempObj.realName),
        phone: sha256(this.tempObj.phone),
        department: sha256(departments),
        desc: "编辑成员"
      };
      let txSign = await this.txSign(3, valueInfo, this.tempObj.username);
      this.ruleForm.phone = this.tempObj.phone;
      this.ruleForm.username = this.tempObj.username;
      this.ruleForm.realName = this.tempObj.realName;
      console.log(this.tempObj.roles);
      // this.ruleForm.roleIds.push(this.tempObj.roles[0].id);
      this.ruleForm.roleIds.push(this.tempObjroleIds);
      this.ruleForm.id = this.tempObj.id;
      this.ruleForm.txSign = txSign;
      // this.ruleForm.roleIds = [];
      // this.ruleForm.roleIds.push(this.tempObjroleIds);
      this.ruleForm.id = this.tempObj.id;
      if (!this.isChecked(this.ruleForm)) {
        return;
      }
      let result = await apiEditOrAddUser(this.ruleForm);
      this.$message({
        message: "修改成功！",
        type: "success"
      });
      this.dialogFormUserinfo = false;
      this.getAccountList();
    },
    async resetPws() {
      if (JSON.parse(this.temp).txStatus == 1) {
        this.$message({
          message: "上链中，无法进行此操作，请稍后再试",
          type: "error"
        });
        return;
      }
      let departments = await getSysUserDepartmentList({ id: JSON.parse(this.temp).id });
      // {“username”:”zhangsan”,”pubKey”:”12322”,”realName”:”张三”,”phone”:”18800989898”,”department”:”[金融-金融1，销售-前端-前端1]”,”desc”:”描述”}
      let valueInfo = {
        username: JSON.parse(this.temp).username,
        pubKey: JSON.parse(this.temp).pubKey,
        realName: sha256(JSON.parse(this.temp).realName),
        phone: sha256(JSON.parse(this.temp).phone),
        department: sha256(departments),
        desc: "重置密码"
      };
      let txSign = await this.txSign(3, valueInfo, JSON.parse(this.temp).username);
      let params = {
        id: JSON.parse(this.temp).id,
        txSign: txSign,
        randomPwd:this.radio == '1' ? true : false
      };
      let result = await apiResetPaws(params);
      this.$message({
        message: "重置成功！",
        type: "success"
      });
      this.isResetpwd = false;
      this.getAccountList();
    },
    async getAccountList() {
      let params = Object.assign({}, this.listp, this.accountParams);
      let result = await apiAccountList(params);
      this.accountList = result.sysUsers.rows.map(item => {
        item.departments_ =
          item.departments.length > 0
            ? item.departments.map(item => item.name).join(",")
            : "";
        item.departments_ids =
          item.departments.length > 0
            ? item.departments.map(item => item.id)
            : [];
        return item;
      });
      this.total = result.sysUsers.total;
      if (this.accountList.length > 0) {
        for (let i = 0; i < this.accountList.length; i++) {
          this.$set(this.accountList[i], "isDelete", false);
          this.$set(this.accountList[i], "tingyong", false);
          this.$set(this.accountList[i], "qiyong", false);
        }
      }
      if (!result.departments) {
        this.department_levels = [];
      } else {
        this.department_levels = result.departments;
      }
    },
    async getRoleList() {
      let result = await sysrolelist();

      this.options = result;
    },
    logout() {
      apiUserLogout().then(resposne => {
        sessionStorage.clear();
        this.$router.push({ path: "/" });
      });
    },
    async deleteAccount(item) {
      if (item.txStatus == 1) {
        this.$message({
          message: "上链中，无法进行此操作，请稍后再试",
          type: "error"
        });
        return;
      }
      let departments = await getSysUserDepartmentList({ id: item.id });

      let valueInfo = {
        username: item.username,
        pubKey: item.pubKey,
        realName: sha256(item.realName),
        phone: sha256(item.phone),
        department: sha256(departments),
        desc: "删除成员"
      };
      let txSign = await this.txSign(3, valueInfo, item.username);

      let params = {
        id: item.id,
        txSign: txSign
      };
      let result = await apiDeleteAccount(params);
      this.$message({
        message: "删除成功！",
        type: "success"
      });
      this.getAccountList();
    },
    adduser() {
      this.addParams = {
        phone: "",
        username: "",
        realName: "",
        roleIds: [],
        id: ""
      };
      this.addIsDloag = true;
    },
    async optionAccount(item, num) {
      if (num == 1) {
        if (item.departments.length == 0) {
          this.$message({
            message: "请先设置组织机构才能启用",
            type: "warning"
          });
          return;
        }
      }
      if (item.txStatus == 1) {
        this.$message({
          message: "上链中，无法进行此操作，请稍后再试",
          type: "error"
        });
        return;
      }
      let departments = await getSysUserDepartmentList({ id: item.id });
      // {“username”:”zhangsan”,”pubKey”:”12322”,”realName”:”张三”,”phone”:”18800989898”,”department”:”[金融-金融1，销售-前端-前端1]”,”desc”:”描述”}
      let valueInfo = {
        username: item.username,
        pubKey: item.pubKey,
        realName: sha256(item.realName),
        phone: sha256(item.phone),
        department: sha256(departments),
        desc: num == 2 ? "停用成员" : "启用成员"
      };
      let state = num == 2 ? "停用" : "启用";
      let params = {
        id: item.id,
        status: num,
        txSign: await this.txSign(3, valueInfo, item.username)
      };
      let result = await apiOptionAccount(params);
      this.$message({
        message: state + "成功！",
        type: "success"
      });
      this.getAccountList();
    },
    async addData() {
      if (!this.isChecked(this.addParams)) {
        return;
      }
      let valueInfo = {
        username: this.addParams.username,
        pubKey: "",
        realName: sha256(this.addParams.realName),
        phone: sha256(this.addParams.phone),
        department: [],
        desc: "新增成员"
      };
      let txSign = await this.txSign(3, valueInfo, this.addParams.username);

      this.addParams.txSign = txSign;
      let result = await apiEditOrAddUser(this.addParams);
      this.$parent.getUserInfo();
      this.$message({
        message: "新增成功！",
        type: "success"
      });
      this.addIsDloag = false;
      this.getAccountList();
    },
    handleCurrentChange(val) {
      this.accountParams.pageNum = val;
      this.getAccountList();
    }
  },
  created() {
    let listParams = JSON.parse(sessionStorage.getItem("listParams")); //跳转参数
    this.listp = {
      dIds: listParams.id,
      keyword: listParams.name,
      type: listParams.type,
      id: listParams.userId || ""
    };
    this.accountParams.keyword = listParams.name;
    this.getAccountList();
    this.getRoleList();
  }
};
</script>
<style lang="scss" scoped>
@import "./accountList";
@import "~assets/css/mixin";
</style>
<style>
/* 导航 */
.main .deNav > div {
  font-size: 0.7rem;
  display: inline-block;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #363636;
}

.main .deNav > div:nth-child(1) {
  font-size: 0.9rem !important;
  /* margin-right: 1.4rem; */
}
.main .deNav > div:nth-child(n + 3) {
  font-size: 0.7rem;
}
.main .deNav .dLevel{
  color: #000;
}
.main .deNav .dLevel:last-of-type {
  color: #aaaaaa;
}
/* 配置 */
.configrationMessage {
  height: 1.6rem;
  margin-bottom: 0.2rem;
  font-size: 0.8rem;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #363636;
  /* line-height: 1.6rem; */
}
.configrationButton {
  width: 4rem;
  height: 2rem;
  font-size: 0.8rem;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #ffffff;
  background: #f76a0d;
  border-radius: 4px;
  text-align: center;
  line-height: 2rem;
  cursor: pointer;
  margin-top: 0.6rem;
}
/* .dialogTitleBorder .el-dialog__body{
    padding: 0px 20px !important; 
} */

.dialogTitleBorder .configrationValue {
  width: 100% !important;
}
/*  */
#account .blockDetail .el-form-item__content,
#account .blockDetail .el-form-item__label {
  font-size: 0.8rem !important;
  line-height: 1.4rem !important;
}

#account .blockDetail .el-form-item--mini.el-form-item {
  margin-bottom: 1.1rem !important;
}
#account .blockDetail .el-dialog__body{
  padding: 0.75rem 1.5rem 0rem !important;
}
#account .errorColor {
  color: #ed1c24;
}
#account .txStatus {
  cursor: pointer;
}
#account .el-input {
  width: 16.9rem;
}
#account .canSeting {
  color: #ff6600;
  cursor: pointer;
}
.adduserClassOne {
  padding: 0 1rem;
  height: 2rem;
  background-color: #fff;
  border: 1px solid #f76a0d;
  color: #f76a0d;
  line-height: 2rem;
  font-size: 0.8rem;
  position: absolute;
  right: 6.5rem;
  margin-right: 2.5rem;
  border-radius: 0.2rem;
  text-align: center;
  cursor: pointer;
}
.adduserClass {
  padding: 0 1rem;
  height: 2rem;
  background-color: #f76a0d;
  color: #fff;
  line-height: 2rem;
  font-size: 0.8rem;
  position: absolute;
  right: 1.5rem;
  margin-right: 1.5rem;
  border-radius: 0.2rem;
  text-align: center;
  cursor: pointer;
}
#account .el-date-editor .el-range__icon {
  font-size: 0.7rem;
  margin-left: -0.25rem;
  color: #c8c8c8;
  float: left;
  line-height: 1.6rem;
}

#account .el-input__icon {
  height: 100%;
  width: 1.25rem;
  line-height: 2rem;
}

#account .el-input {
  width: 13.9rem;
}

#account .el-date-editor .el-range-separator {
  padding: 0 0.25rem;
  line-height: 1.6rem;
}

#account .el-select > .el-input {
  height: 2rem;
  width: 100%;
  font-size: 0.7rem;
}

#account .el-select .el-input__inner {
  padding-right: 1.75rem;
}

#account .el-input__inner {
  height: 2rem;
  line-height: 2rem;
  font-size: 0.7rem;
}

#account .el-input .el-input__icon {
  line-height: 2rem;
}

#account .el-input--prefix .el-input__inner {
  padding-left: 1.5rem;
}
#account .el-range-editor .el-range-input {
  font-size: 0.7rem;
}
#account .el-popover__reference {
  font-size: 0.7rem;
  color: #f76a0d;
  border: none;
  padding: 0;
}
#account .el-popover__reference:hover {
  background-color: #fff;
}
.el-button--text {
  color: #606266;
  font-size: 0.7rem;
}
.el-button--text:hover {
  color: #f76a0d;
}
#account .el-form-item__label {
  line-height: 2rem !important;
  font-size: 0.7rem !important;
  padding-right: 1rem;
}
#account .dialog-footer {
  text-align: left;
}
#account table .td1 .el-button{
  border:none;
  font-size: 0.7rem;
}
#account table .td1 .el-button:hover{
  background: #fff;
}
#account  .demo-ruleForm .el-select{
  width:100%;
}
</style>
