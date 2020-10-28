 <!--*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************-->
 <template>
  <div id="account">
    <!-- <div class="serchCondition">
      <div class="out">
        <el-input
          placeholder="请输入姓名或帐号进行搜索"
          prefix-icon="el-icon-search"
          v-model="accountParams.keyword"
        ></el-input>
      </div>
      <div class="servhBtn" @click="serch">搜索</div>
      <div class="adduserClass" @click="adduser">添加成员</div>
    </div> -->
    <div class="serchCondition">
      <div class="left">
        <div class="out">
          <el-input
            placeholder="请输入姓名、账号或手机号进行搜索"
            prefix-icon="el-icon-search"
            v-model="accountParams.keyword"
            v-on:keyup.native.13="toPage('serch')"
          >
          </el-input>
        </div>
        <div class="servhBtn" @click="toPage('serch')">搜索</div>
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
          class="btnInvite"
          @click="adduser"
          v-if="
            $parent.permissionArr.indexOf(100501) >= 0 &&
            this.$parent.userinfo.memberLimit -
              this.$parent.userinfo.memberNum >
              0
          "
        >
          添加成员
        </div>
        <div
          class="btnInvite btnInvite3"
          v-if="
            $parent.permissionArr.indexOf(100501) >= 0 &&
            this.$parent.userinfo.memberLimit -
              this.$parent.userinfo.memberNum <=
              0
          "
        >
          添加成员
        </div>
        <div class="btnInvite" @click="toPage('invite')">
          我添加的成员
          <!-- <span class="badge" v-if="inviteNum > 0">{{inviteNum}}</span> -->
        </div>
      </div>
      <div class="right" v-if="this.$parent.userinfo.isPlatformAdmin">
        <span class="titleWorld"
          >当前已添加成员数量<span class="fontColor">{{
            this.$parent.userinfo.memberNum | num
          }}</span
          >，剩余可添加成员数量<span class="fontColor">--</span></span
        >
        <div class="btnInvite" @click="adduser">添加成员</div>
        <div class="btnInvite" @click="toPage('invite')">
          我添加的成员
          <!-- <span class="badge" v-if="inviteNum > 0">{{inviteNum}}</span> -->
        </div>
        <div
          class="btnInvite"
          v-if="$parent.permissionArr.indexOf(100550) >= 0"
          @click="topage1"
        >
          角色管理
        </div>
      </div>
    </div>
    <div class="tip">
      当前{{ totalInfo.name }}组织架构下 组织总数：<span class="fontColor">{{
        totalInfo.allDepTotal
      }}</span>
      &nbsp;&nbsp; 账户总数：<span class="fontColor">{{
        totalInfo.allUserTotal
      }}</span>
    </div>
    <div class="order"></div>
    <div class="levelOut">
      组织：
      <span
        class="level"
        v-for="(item, index) in departmentScortList"
        :key="index"
        :class="{ isColor: index == departmentScortList.length - 1 }"
      >
        {{ item.name }}
        <i
          v-if="index + 1 < departmentScortList.length"
          class="el-icon-arrow-right"
        ></i>
      </span>
    </div>
    <div class="main">
      <div class="list" v-for="(item, index) in listArr" :key="index">
        <div class="topInfo">
          <div class="number number1">
            组织数量：<span class="fontColor">{{
              item.departments.length
            }}</span>
          </div>
          <div class="number">
            账户数量：<span class="fontColor">{{
              item.pageCommon.length
            }}</span>
          </div>
        </div>
        <el-scrollbar class="inMessage" ref="myScrollbar" style="height: 88%">
          <div class="organizationTit" v-if="item.departments.length > 0">
            组织
          </div>
          <div
            v-for="(organizationInfo, index1) in item.departments"
            :key="index1"
            class="organizationName organizationName1"
            @click="addList(item, index, organizationInfo, index1)"
            :class="{ isorganizationName: organizationInfo.show == true }"
          >
            <div class="organizationNick">
              <span>{{ organizationInfo.name }}</span>
              <i class="el-icon-arrow-right"></i>
            </div>
            <div class="organizationInfo">
              <span class="departName"
                >组织：{{ organizationInfo.currentDepTotal | num }}</span
              >
              <span
                >账户：{{ organizationInfo.currentSysUserTotal | num }}</span
              >
            </div>
          </div>
          <div
            class="accountTit"
            v-if="item.pageCommon && item.pageCommon.length > 0"
            @click="toPage('account', index)"
          >
            账户
          </div>
          <div
            class="accountName"
            v-for="(accountInfo, index2) in item.pageCommon"
            :key="'nofo' + index2"
            @click="toPage('accountInfo', index, item.id)"
          >
            <span>{{ accountInfo.username }}</span>
          </div>
          <div
            class="click"
            v-if="item.pageCommon && item.pageCommon.length < item.userTotal"
          >
            <i v-if="loadIcon" class="el-icon-loading"></i>
            <span v-if="isLook" @click="lookMore(index)">查看更多</span>
          </div>
        </el-scrollbar>
      </div>
    </div>
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
            <el-select
              v-model="addParams.roleIds"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addIsDloag = false">取消</el-button>
        <el-button type="primary" @click="addData">确认</el-button>
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
  sysrolelist,
  getBlockInfo,
} from "api/account.js";
import { apiUserLogout } from "api/login.js";
import nodata from "../../components/nodeData/noData";
import {
  inviteAccountNum,
  getDepartTreeListHAuth,
  userAddPermissions,
  getSysUserDepartmentList,
  organizationList,
  departmentScort,
  totalNum,
} from "api/account.js";
import sha256 from "sha256";
import signature from "../../mixins/signatureMixin.js";
export default {
  mixins: [signature],
  components: { nodata },
  data() {
    return {
      props: {
        value: "id",
        label: "name",
        children: "child",
      },
      departmentList: [],
      isSetting: false,
      detailInfo: {},
      tempObjroleIds: 4,
      addIsDloag: false,
      role: "",
      dialogFormUserinfo: false,
      rules: {
        phone: [
          { required: true, message: "电话必须填" },
          // { type: 'number', required: true, message: '电话格式不对' }
        ],
        username: [{ required: true, message: "姓名必须填" }],
        realName: [{ required: true, message: "账号必须填" }],
      },
      ruleForm: {
        phone: "",
        username: "",
        realName: "",
        // roleIds: [],
        id: "",
      },
      tempObj: {
        phone: "",
        username: "",
        realName: "",
        //  roleIds: ""
      },
      userinfo: { role: {}, user: {} },
      // old
      input2: "",
      options: [],
      accountParams: {
        pageNum: 1,
        keyword: "",
        pageSize: 10,
      },
      accountList: [],
      total: 0,
      addParams: {
        phone: "",
        username: "",
        realName: "",
        roleIds: [],
      },
      blockDetail: {},
      isBlock: false,
      listArr: [],
      organizationParasms: {
        parentId: "",
        pageNum: 1,
        pageSize: 20,
      },
      loadIcon: false,
      isLook: true,
      idArr: [],
      departmentScortList: [],
      totalInfo: {},
      inviteNum: "",
    };
  },
  methods: {
    //角色管理
    topage1() {
      this.$router.push({ path: "permission" });
    },
    async getInviteNum() {
      let result = await inviteAccountNum();
      this.inviteNum = result;
      // console.log(result);
    },
    getTotal(id) {
      let params = {
        type: 2,
        id: id,
      };
      totalNum(params)
        .then((result) => {
          console.log(result);
          if (result) {
            this.totalInfo = {
              name: this.departmentScortList[0].name,
              allDepTotal: result.allDepTotal,
              allUserTotal: result.allUserTotal,
            };
          }
        })
        .catch((error) => {});
    },
    toPage(type, index, userId) {
      let params = {
        id: "",
        name: "",
        type: "",
      };
      if (type == "serch") {
        let idArr = [];
        if (this.listArr.length > 0) {
          for (let i = 0; i < this.listArr[0].departments.length; i++) {
            idArr.push(this.listArr[0].departments[i].id);
          }
          params.id = idArr;
          params.name = this.accountParams.keyword;
          params.type = 1;
          sessionStorage.setItem("listParams", JSON.stringify(params));
        } else {
          return;
        }
      } else if (type == "invite") {
        params.id = "";
        params.name = "";
        params.type = 3;
        sessionStorage.setItem("listParams", JSON.stringify(params));
      } else if (type == "account") {
        let arrId = [];
        for (let i = 0; i < this.listArr[index - 1].departments.length; i++) {
          if (this.listArr[index - 1].departments[i].show == true) {
            arrId.push(this.listArr[index - 1].departments[i].id);
          }
        }
        params.id = arrId;
        params.name = "";
        params.type = 2;
        sessionStorage.setItem("listParams", JSON.stringify(params));
      } else {
        let arrId = [];
        for (let i = 0; i < this.listArr[index - 1].departments.length; i++) {
          if (this.listArr[index - 1].departments[i].show == true) {
            arrId.push(this.listArr[index - 1].departments[i].id);
          }
        }
        params.id = arrId;
        params.userId = userId;
        params.name = "";
        params.type = 2;
        sessionStorage.setItem("listParams", JSON.stringify(params));
      }
      this.$router.push({ path: "/manage/accountList" });
    },
    //获取架构表
    getDepartmentScort(id, init) {
      let params = {
        id: id,
      };
      departmentScort(params)
        .then((result) => {
          console.log(result);
          if (result && result.length > 0) {
            this.departmentScortList = result;
            this.getTotal(this.departmentScortList[0].id);
          }
        })
        .catch((error) => {});
    },
    lookMore(index) {
      this.loadIcon = true;
      this.isLook = false;
      this.organizationParasms.pageNum = this.organizationParasms.pageNum + 1;
      organizationList(this.organizationParasms)
        .then((result) => {
          if (result) {
            this.listArr[index].userTotal = result.pageCommon.total;
            let pageCommon =
              result.pageCommon.rows.length > 0 ? result.pageCommon.rows : [];
            console.log(this.listArr[index].pageCommon, pageCommon);
            this.listArr[index].pageCommon = this.listArr[
              index
            ].pageCommon.concat(pageCommon);
            this.loadIcon = false;
            this.isLook = true;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //获取架构列表
    getOrganizationList(num, id, init) {
      this.organizationParasms.parentId = id ? id : "";
      organizationList(this.organizationParasms)
        .then((result) => {
          if (result) {
            let obj = {
              listNum: num,
              departments:
                result.departments.length > 0 ? result.departments : [],
              pageCommon:
                result.pageCommon.rows.length > 0 ? result.pageCommon.rows : [],
              userTotal: result.pageCommon.total,
              // show : null
            };
            if (obj.departments.length != 0 || obj.pageCommon.length != 0) {
              this.listArr.push(obj);
            }
            if (obj.departments.length != 0 && init && num == 1) {
              for (let i = 0; i < obj.departments.length; i++) {
                if (i === 0) {
                  this.$set(obj.departments[i], "show", true);
                } else {
                  this.$set(obj.departments[i], "show", false);
                }
              }
            }
            if (num == 1 && init) {
              this.curId = obj.departments[0].id;
              this.getOrganizationList(2, obj.departments[0].id);
              this.getInviteNum();
            }
            if (init) {
              this.getDepartmentScort(obj.departments[0].id, init);
            } else {
              this.getDepartmentScort(id);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //添加一个列表
    addList(item, index, organizationInfo, index1) {
      this.organizationParasms.parentId = organizationInfo.id;
      let tempNum = item.listNum + 1;
      if (organizationInfo.show == true) {
        organizationInfo.show = !organizationInfo.show;
        this.listArr.splice(index + 1, this.listArr.length - (index + 1));
        if (this.departmentScortList[index + 1]) {
          for (let i = 0; i < this.departmentScortList.length; i++) {
            if (this.departmentScortList[i].name == organizationInfo.name) {
              console.log(
                this.departmentScortList[i].name,
                i,
                this.departmentScortList
              );
              this.departmentScortList.splice(
                i,
                this.departmentScortList.length - i
              );
            }
          }
        } else {
          this.departmentScortList.splice(index, 1);
        }
      } else {
        for (let i = 0; i < this.listArr[index].departments.length; i++) {
          if (i == index1) {
            this.listArr[index].departments[i].show = true;
          } else {
            this.listArr[index].departments[i].show = false;
          }
        }
        if (this.listArr[index + 1]) {
          this.listArr.splice(index + 1, this.listArr.length - (index + 1));
          this.departmentScortList.splice(
            index,
            this.departmentScortList.length - (index + 1)
          );
          this.getOrganizationList(tempNum, this.organizationParasms.parentId);
        } else {
          this.getOrganizationList(tempNum, this.organizationParasms.parentId);
        }
      }
    },
    async getTxDetail(item) {
      if (item.txStatus == 2 || item.txStatus == 1 || !item.txStatus) {
        this.blockDetail = {
          blockNumber: "--",
          blockHash: "--",
          txHash: "--",
          from: "--",
          to: "--",
          timestamp: "--",
          txStatus: item.txStatus,
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
      theChildren.map((item) => {
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
      arr.map((item) => {
        fn(item, parent);
        if (!!item.child && item.child.length > 0) {
          this.dg(item.child, fn, item);
        }
      });
      return arr;
    },
    getDeparts() {
      let params = { id: this.$parent.userinfo.id };
      getDepartTreeListHAuth(params).then((result) => {
        result.map((item) => {
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
          function (value, obj) {
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
        departmentIds: this.$refs.tree.getCheckedKeys(),
      };

      let result = await userAddPermissions(parasms);
      this.$message({
        message: "设置成功！",
        type: "success",
      });
      this.isSetting = false;
      this.getAccountList();
    },
    // 点击设置组织机构
    organizationSetting(item) {
      if (item.status == 1) {
        this.$message({
          message: "停用后才可设定组织，请先完成“停用”操作！",
          type: "warning",
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
    serch() {
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
          type: "error",
        });
        return false;
      }
      if (params.username.length > 16) {
        this.$message({
          message: "账号必须是小于16位的英文或数字",
          type: "error",
        });
        return false;
      }
      var re = /^[a-zA-Z0-9]+$/;
      if (!re.test(params.username)) {
        this.$message({
          message: "账号必须是小于16位的英文或数字",
          type: "error",
        });
        return false;
      }
      if (params.username.length > 16) {
        this.$message({
          message: "账号必须是小于16位的英文或数字",
          type: "error",
        });
        return false;
      }
      var re = /^[a-zA-Z0-9]+$/;
      if (!re.test(params.username)) {
        this.$message({
          message: "账号必须是小于16位的英文或数字",
          type: "error",
        });
        return false;
      }
      if (!params.realName || params.realName.length < 1) {
        this.$message({
          message: "请输入姓名！",
          type: "error",
        });
        return false;
      }
      if (params.realName.length > 16) {
        this.$message({ message: "姓名必须小于16位", type: "error" });
        return false;
      }
      if (params.realName.length > 16) {
        this.$message({ message: "姓名必须小于16位", type: "error" });
        return false;
      }
      if (!params.phone || params.phone.length < 1) {
        this.$message({
          message: "请输入手机号！",
          type: "error",
        });
        return false;
      }
      if (!/^1[3|4|5|6|9|7|8]\d{9}$/.test(params.phone)) {
        this.$message({
          message: "手机格式有误！",
          type: "error",
        });
        return false;
      }

      if (!params.roleIds || params.roleIds.length == 0) {
        this.$message({
          message: "请选择用户角色！",
          type: "error",
        });
        return false;
      }
      return true;
    },
    edit(item) {
      this.tempObj = item;
      // if (this.tempObj.roles.length > 0) {
      //   this.tempObjroleIds = this.tempObj.roles[0].id;
      // } else {
      //   this.tempObjroleIds = "";
      // }

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
        desc: "编辑成员",
      };
      let txSign = await this.txSign(3, valueInfo, this.tempObj.username);
      this.ruleForm.phone = this.tempObj.phone;
      this.ruleForm.username = this.tempObj.username;
      this.ruleForm.realName = this.tempObj.realName;
      this.ruleForm.roleIds = [];
      // this.ruleForm.roleIds.push(this.tempObjroleIds);
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
        type: "success",
      });
      this.dialogFormUserinfo = false;
      this.getAccountList();
    },
    async resetPws(item) {
      if (item.txStatus == 1) {
        this.$message({
          message: "上链中，无法进行此操作，请稍后再试",
          type: "error",
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
        desc: "重置密码",
      };
      let txSign = await this.txSign(3, valueInfo, item.username);
      let params = {
        id: item.id,
        txSign: txSign,
      };
      let result = await apiResetPaws(params);
      this.$message({
        message: "重置成功！",
        type: "success",
      });
      this.getAccountList();
    },
    async getAccountList() {
      let result = await apiAccountList(this.accountParams);
      this.accountList = result.rows.map((item) => {
        item.departments_ =
          item.departments.length > 0
            ? item.departments.map((item) => item.name).join(",")
            : "";
        item.departments_ids =
          item.departments.length > 0
            ? item.departments.map((item) => item.id)
            : [];
        return item;
      });
      this.total = result.total;
      if (this.accountList.length > 0) {
        for (let i = 0; i < this.accountList.length; i++) {
          this.$set(this.accountList[i], "isDelete", false);
          this.$set(this.accountList[i], "tingyong", false);
          this.$set(this.accountList[i], "qiyong", false);
        }
      }
    },
    async getRoleList() {
      let result = await sysrolelist();

      this.options = result;
    },
    logout() {
      apiUserLogout().then((resposne) => {
        sessionStorage.clear();
        this.$router.push({ path: "/" });
      });
    },
    async deleteAccount(item) {
      if (item.txStatus == 1) {
        this.$message({
          message: "上链中，无法进行此操作，请稍后再试",
          type: "error",
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
        desc: "删除成员",
      };
      let txSign = await this.txSign(3, valueInfo, item.username);

      let params = {
        id: item.id,
        txSign: txSign,
      };
      let result = await apiDeleteAccount(params);
      this.$message({
        message: "删除成功！",
        type: "success",
      });
      this.getAccountList();
    },
    adduser() {
      this.addParams = {
        phone: "",
        username: "",
        realName: "",
        roleIds: [],
        id: "",
      };
      this.addIsDloag = true;
    },
    async optionAccount(item, num) {
      if (num == 1) {
        if (item.departments.length == 0) {
          this.$message({
            message: "请先设置组织机构才能启用",
            type: "warning",
          });
          return;
        }
      }
      if (item.txStatus == 1) {
        this.$message({
          message: "上链中，无法进行此操作，请稍后再试",
          type: "error",
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
        desc: num == 2 ? "停用成员" : "启用成员",
      };
      let state = num == 2 ? "停用" : "启用";
      let params = {
        id: item.id,
        status: num,
        txSign: await this.txSign(3, valueInfo, item.username),
      };
      let result = await apiOptionAccount(params);
      this.$message({
        message: state + "成功！",
        type: "success",
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
        desc: "新增成员",
      };
      let txSign = await this.txSign(3, valueInfo, this.addParams.username);

      this.addParams.txSign = txSign;
      let result = await apiEditOrAddUser(this.addParams);
      this.$parent.getUserInfo();
      this.$message({
        message: "新增成功！",
        type: "success",
      });
      this.addIsDloag = false;
      this.listArr = [];
      this.getOrganizationList(1, "", true);
    },
    handleCurrentChange(val) {
      this.accountParams.pageNum = val;
      this.getAccountList();
    },
  },
  created() {
    this.$parent.getUserInfo_();
    this.userInfo = JSON.parse(sessionStorage.getItem("user"));
    this.getOrganizationList(1, "", true);
    // this.getAccountList();
    this.getRoleList();
  },
};
</script>
<style lang="scss" scoped>
@import "./index";
@import "~assets/css/mixin";
</style>
<style>
#account .blockDetail .el-form-item__content,
#account .blockDetail .el-form-item__label {
  font-size: 0.8rem !important;
  line-height: 1.4rem !important;
}

#account .blockDetail .el-form-item--mini.el-form-item {
  margin-bottom: 0rem !important;
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
  font-size: 0.8rem;
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
#account .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
</style>