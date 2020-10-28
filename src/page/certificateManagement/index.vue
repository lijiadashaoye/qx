<template>
  <div id="certificate">
    <div class="serchCondition">
      <div class="top_left">
        <div class="out">
          <el-date-picker
            v-model="userParamsTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
          ></el-date-picker>
        </div>
        <div class="out">
          <el-input
            placeholder=" 请输入证书名称进行搜索"
            prefix-icon="el-icon-search"
            v-model="userParams.name"
            v-on:keyup.native.13="serch"
          ></el-input>
        </div>
        <div class="servhBtn" @click="serch">搜索</div>
      </div>
      <div class="top_right">
        <div class="number">
          <span class="fontColor1">当前已颁发证书数量</span>
          <span class="fontColor" v-if="!$parent.userinfo.isPlatformAdmin">{{
            this.$parent.userinfo.certNum
          }}</span>
          <span class="fontColor" v-if="$parent.userinfo.isPlatformAdmin">{{
            this.$parent.userinfo.certNum
          }}</span>
          <span class="fontColor1">，剩余可颁发证书数量</span>
          <span class="fontColor" v-if="!$parent.userinfo.isPlatformAdmin">{{
            (this.$parent.userinfo.certLimit - this.$parent.userinfo.certNum)
              | num
          }}</span>
          <span class="fontColor" v-if="$parent.userinfo.isPlatformAdmin"
            >--</span
          >
        </div>
        <div
          class="addBtn3"
          v-if="
            (this.$parent.userinfo.certLimit > 0 &&
              this.$parent.userinfo.certLimit - this.$parent.userinfo.certNum >
                0) ||
            $parent.userinfo.isPlatformAdmin
          "
          @click="toPage('templateAdd', 'issueCertificates')"
        >
          批量颁发证书
        </div>
        <div
          class="addBtn2"
          v-if="
            this.$parent.userinfo.certLimit - this.$parent.userinfo.certNum <
              1 &&
            !$parent.userinfo.isPlatformAdmin &&
            $parent.permissionArr.indexOf(100302) >= 0
          "
        >
          批量颁发证书
        </div>
        <div
          class="addBtn"
          v-if="
            ($parent.permissionArr.indexOf(100302) >= 0 &&
              this.$parent.userinfo.certLimit > 0 &&
              this.$parent.userinfo.certLimit - this.$parent.userinfo.certNum >
                0) ||
            $parent.userinfo.isPlatformAdmin
          "
          @click="toPage('templateAdd', 'issueCertificate')"
        >
          颁发证书
        </div>
        <div
          class="addBtn1"
          v-if="
            this.$parent.userinfo.certLimit - this.$parent.userinfo.certNum <
              1 &&
            !$parent.userinfo.isPlatformAdmin &&
            $parent.permissionArr.indexOf(100302) >= 0
          "
        >
          颁发证书
        </div>

        <div class="addBtn3" @click="infoManage">信息管理</div>
      </div>
    </div>
    <div class="main">
      <table cellspacing="0">
        <thead>
          <tr>
            <th style="width: 6%">编号</th>
            <th style="width: 12%">证书名称</th>
            <th style="width: 12%">使用模板</th>
            <th style="width: 10%">模板版本号</th>
            <th style="width: 8%">操作人</th>
            <th style="width: 14%">创建时间</th>
            <th style="width: 8%">上链状态</th>
            <th style="width: 8%">设置授权</th>
            <th style="width: 15%">操作</th>
          </tr>
        </thead>
        <tbody v-if="userList && userList.length > 0">
          <tr v-for="(item, index) in userList" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>
              {{ item.templateName }}
              <!-- <div v-if="item && item.companys.length > 0">
                                {{item.companys[0].username+'('+item.companys[0].companyName+')'}}
                            </div>
                            <div class="more" v-if="item && item.companys.length > 1" @click="openNumberDloag(item)">更多
              </div>-->
            </td>
            <td>{{ item.version }}</td>
            <td>{{ item.operator }}</td>
            <td>{{ item.createTime | formatTime }}</td>

            <td>
              <span
                @click="getTxDetail(item)"
                :class="{ errorColor: item.txStatus == 2, txStatus: true }"
                >{{ item.txStatus | txStatusString }}</span
              >
              <div
                v-if="item.txStatus == 2 && item.user.id == $parent.userinfo.id"
                style="color: #f76a0d; cursor: pointer"
                @click="reTxSign(item)"
              >
                重新上链
              </div>
            </td>
            <td
              v-if="
                $parent.userinfo.username == item.user.username &&
                $parent.permissionArr.indexOf(100304) >= 0
              "
              style="color: #ff6600; cursor: pointer"
              @click="addOprate(item)"
            >
              设置授权
            </td>
            <td v-if="$parent.userinfo.username != item.user.username">
              设置授权
            </td>

            <td v-if="item.status == 1" class="lastTd">
              <span
                class="option"
                v-if="$parent.permissionArr.indexOf(100303) >= 0"
                @click="toPage('cerfityLook', item)"
                >查看</span
              >
              <span
                class="option"
                v-if="$parent.permissionArr.indexOf(100305) >= 0"
                @click="exportCertify(item)"
                >保存本地</span
              >
              <span
                class="option"
                v-if="
                  $parent.permissionArr.indexOf(100306) >= 0 &&
                  $parent.userinfo.username == item.user.username
                "
              >
                <el-popover placement="top" v-model="item.isDelete">
                  <p style="text-align: center; font-size: 0.7rem; width: 6rem">
                    是否确认注销？
                  </p>
                  <div style="text-align: center; margin: 0">
                    <el-button
                      size="mini"
                      style="font-size: 0.7rem"
                      type="text"
                      @click="item.isDelete = false"
                      >取消</el-button
                    >
                    <el-button
                      type="primary"
                      style="font-size: 0.7rem"
                      size="mini"
                      @click="deleteTemple(item)"
                      >确定</el-button
                    >
                  </div>
                  <span slot="reference">注销</span>
                </el-popover>
              </span>
            </td>
            <td v-else>
              <span
                v-if="$parent.permissionArr.indexOf(100303) >= 0"
                class="optionOne"
                >查看</span
              >
              <span
                v-if="$parent.permissionArr.indexOf(100305) >= 0"
                class="optionOne"
                >保存本地</span
              >
              <span
                v-if="
                  $parent.permissionArr.indexOf(100306) >= 0 &&
                  $parent.userinfo.username == item.user.username
                "
                class="optionOne"
                >已注销</span
              >
            </td>
          </tr>
        </tbody>
        <nodata
          class="nodata"
          v-if="!userList || userList.length == 0"
        ></nodata>
      </table>
      <div class="fenye" v-if="userList && userList.length > 0">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="userParams.pageSize"
          layout="prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
      <!-- <el-dialog class="dloag" :title='dialogTit' :visible.sync="numberIsDloag" width="21rem" :close-on-click-modal="false">
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
      </el-dialog>-->

      <!-- 单独颁发 -->
      <el-dialog
        data="noactive"
        class="issueCertify"
        title="颁发证书"
        :visible.sync="issueCertify"
        :close-on-click-modal="false"
        :before-close="resetData"
        width="30rem"
      >
        <el-form>
          <div class="toFlex">
            <el-radio @change="resetData(1)" v-model="singleUp.type" label="1"
              >选择模板</el-radio
            >
            <el-select
              @change="singleChage"
              :disabled="singleUp.type != 1"
              v-model="tempSelect"
              placeholder="请选择"
            >
              <el-option
                v-for="item in tempOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="toFlex" style="margin-top: 30px">
            <el-radio
              text-color="#363636"
              @change="resetData(1)"
              v-model="singleUp.type"
              label="2"
              style="margin-right: 10px"
              >已有证书上传</el-radio
            >

            <span
              class="upFileBtn1"
              @click="singleUpFn"
              v-if="singleUp.data.length == 0 && singleUp.type == 2"
              >上传证书</span
            >
            <span
              class="upFileText"
              v-if="singleUp.data.length > 0 && singleUp.type == 2"
              >{{ "已上传：" + singleUp.data[0].name }}</span
            >&nbsp;&nbsp;&nbsp;
            <span
              class="upFileBtn2"
              @click="singleUpFn"
              v-if="singleUp.data.length > 0 && singleUp.type == 2"
              >重新上传</span
            >
          </div>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="singleOff">取 消</el-button>
          <el-button type="primary" data="noactive" @click="nextStep"
            >下一步</el-button
          >
        </div>
      </el-dialog>

      <!-- 批量颁发 -->
      <el-dialog
        data="noactive"
        class="issueCertify"
        title="批量颁发证书"
        :visible.sync="issueCertifys"
        :before-close="resetData"
        :close-on-click-modal="false"
        width="30rem"
      >
        <el-form>
          <div class="toFlex">
            <el-radio @change="resetData(1)" v-model="moreUp.type" label="1"
              >选择模板</el-radio
            >
            <el-select
              @change="moreChage"
              :disabled="moreUp.type != 1"
              v-model="tempSelect"
              placeholder="请选择"
            >
              <el-option
                v-for="item in tempOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="toFlex" style="margin-top: 30px">
            <el-radio
              @change="resetData(1)"
              v-model="moreUp.type"
              label="2"
              style="margin-right: 10px"
              >已有证书上传</el-radio
            >
            <span
              class="upFileBtn1"
              @click="moreUpFn"
              v-if="
                moreUp.data.data.length == 0 &&
                moreUp.data.badType.length == 0 &&
                moreUp.type == 2
              "
              >上传证书</span
            >
            <span
              class="upFileBtn2"
              @click="moreUpFn"
              v-if="moreUp.data.data.length > 0 && moreUp.type == 2"
              >继续上传</span
            >
          </div>

          <ul
            class="hasUpList"
            v-if="moreUp.data.data.length && moreUp.type == 2"
          >
            <li class="rightFiles">
              {{
                `格式正确的文件（图片、PDF）数量为：${moreUp.data.data.length}个`
              }}
              <span class="toDeleteAll" @click="toDelete(3, 'good')"
                >删除全部</span
              >
            </li>
            <li
              v-for="tar in moreUp.data.data"
              :key="tar.name"
              @mouseover="watchMouse = tar.name"
              @mouseleave="watchMouse = ''"
              :class="{
                chageBg: watchMouse == tar.name,
              }"
            >
              <span> {{ tar.name }}</span>
              <span
                v-if="watchMouse == tar.name"
                class="toDelete"
                @click="toDelete(1, tar)"
                title="点击删除文件"
              ></span>
            </li>
          </ul>
          <ul
            class="hasUpList"
            v-if="moreUp.data.badType.length && moreUp.type == 2"
          >
            <li class="errorFiles">
              {{
                `格式不正确的文件数量为：${moreUp.data.badType.length}个，请更换`
              }}

              <span class="toDeleteAll" @click="toDelete(3, 'bad')"
                >删除全部</span
              >
            </li>
            <li
              v-for="tar in moreUp.data.badType"
              :key="tar.name"
              @mouseover="watchMouse = tar.name"
              @mouseleave="watchMouse = ''"
              :class="{
                chageBg: watchMouse == tar.name,
              }"
            >
              <span> {{ tar.name }}</span>
              <span
                v-if="watchMouse == tar.name"
                class="toDelete"
                @click="toDelete(2, tar)"
                title="点击删除文件"
              ></span>
            </li>
          </ul>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="singleOff">取 消</el-button>
          <el-button type="primary" data="noactive" @click="moreNextStep"
            >下一步</el-button
          >
        </div>
      </el-dialog>
    </div>

    <el-dialog
      :close-on-click-modal="false"
      class="diloag diloagTwo"
      :title="'证书授权'"
      :visible.sync="isSetting"
      width="21rem"
    >
      <div style="max-height: 300px; overflow-y: auto">
        <!-- @check-change="treeCheckChange"  :default-checked-keys="companyAuthList"-->

        <el-tree
          :default-checked-keys="companyAuthList"
          node-key="treeId"
          :props="props"
          :default-expand-all="false"
          show-checkbox
          :check-strictly="true"
          ref="tree"
          :load="loadNode_"
          lazy
          :check-on-click-node="true"
          @check-change="(a, b) => treeCheckChange(a, b, 1)"
        >
          <span class="custom-tree-node" slot-scope="{ node }">
            <i
              class="iconfont"
              style="color: #f76a0d"
              :class="{
                'icon-zuzhiguanli': node.data.treeId.indexOf('de_') >= 0,
                'icon-yonghu': node.data.treeId.indexOf('com_') >= 0,
              }"
            ></i>
            {{ node.label }}
          </span>
        </el-tree>
      </div>
      <div slot="footer" class="dilaogBtn">
        <el-button @click="isSetting = false">取消</el-button>
        <el-button @click="getKey(1)" type="primary">确认</el-button>
      </div>
    </el-dialog>
    <!-- 区块链信息 -->
    <el-dialog
      class="blockDetail"
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
            <div
              class="el-form-item__label"
              style="margin-left: -4.5rem; color: #f76a0d; cursor: pointer"
              @click="openBrowser(blockDetail.txHash)"
            >
              查看详细信息
            </div>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import nodata from "../../components/nodeData/noData";
import {
  useCertTemplateList,
  getSysUserAuthList,
  addOrUpdateUseList,
  screenDepartmentByIds,
  setCertAuth,
  certUseList,
} from "src/api/template";
import {
  certList,
  certRevoke,
  certiSave,
  certUploadTx,
} from "src/api/certificate";
import { getBlockInfo } from "api/account.js";
import { getJwtTokenConsortium } from "api/upChain.js";
import signature from "../../mixins/signatureMixin.js";

export default {
  mixins: [signature],
  data() {
    return {
      setCurDepartment: {},
      tempOption: [],

      issueCertify: false,
      userParamsTime: [],
      userParams: {
        pageNum: 1,
        pageSize: 10,
        startTime: "",
        endTime: "",
        name: "",
        // phone:'',
        // type:'0'
      },
      props: {
        value: "treeId",
        label: "treeName",
        children: "child",
        isLeaf: "isLeaf",
        disabled: "disabled",
      },
      isSetting: false,
      companyIds: [], //	是	Long数组	企业Id列表
      companyAuthIds: [], //	是	Long 数组	企业组织id（使用权限）
      userList: [],
      total: 100,
      dialogTit: "",
      numberIsDloag: false,
      options: [],
      componentsList: [],
      blockDetail: {},
      isBlock: false,
      issueCertifys: false,

      tempSelect: "",
      watchMouse: "", // 监听鼠标一变更背景
      // 单独上传
      singleUp: {
        type: "1", //  1使用模板 2 使用图片
        data: [], // 已经上传的证书数据
      },
      // 批量上传
      moreUp: {
        type: "1", //  1使用模板 2 使用图片
        data: {
          badType: [], // 用来保存错误格式的文件
          data: [], // 保存已上传的正确格式的文件
        },
      },
    };
  },
  computed: {
    companyAuthList() {
      let depart = this.companyAuthIds.map((item) => {
        return item.treeId;
      });
      let coms = this.companyIds.map((item) => {
        return item.treeId;
      });
      return [].concat(...depart, ...coms);
    },
  },
  methods: {
    /////////////////////////////////////////////////////////////////////////////////////////////
    // 信息管理按钮点击
    infoManage() {
      console.log(99);
    },
    // 单独上传的上传按钮点击
    singleUpFn() {
      if (this.singleUp.type == 2) {
        // 选择文件
        let input = document.createElement("input");
        input.type = "file";
        input.click();
        input.onchange = (e) => {
          let file = e.path[0].files[0];
          if (/image/.test(file.type) || /pdf/.test(file.type)) {
            this.$set(this.singleUp, "data", [file]);
          } else {
            this.$message({
              message: "请选择正缺的文件（图片、PDF）！",
              type: "error",
            });
          }
        };
      }
    },
    // 批量上传的上传按钮点击
    moreUpFn() {
      if (this.moreUp.type == 2) {
        // 选择文件
        let input = document.createElement("input");
        input.type = "file";
        input.multiple = "multiple";
        input.click();
        input.onchange = (e) => {
          this.moreUp.data = {
            badType: [],
            data: [],
          };
          // 将全部上传过的文件整合
          let arr = []
            .concat(this.moreUp.data.data)
            .concat(this.moreUp.data.badType);
          // 首次上传
          if (!arr.length) {
            Array.from(e.path[0].files).forEach((tar, ind) => {
              // 判断文件类型
              if (/image/.test(tar.type) || /pdf/.test(tar.type)) {
                this.moreUp.data.data.push(tar); // 正确格式的
              } else {
                this.moreUp.data.badType.push(tar); // 错误格式的
              }
            });

            if (this.moreUp.data.badType.length) {
              this.$message({
                message: "请选择正确的文件（图片、PDF）！",
                type: "error",
              });
            }
          } else {
            // 去重
            let names = arr.map((t) => t.name), // 获取已经上传过的文件的名字
              num = 0; // 记录出现重复的文件数量
            Array.from(e.path[0].files).forEach((tar) => {
              if (!names.includes(tar.name)) {
                // 如果重新上传的文件名字没有出现过则为新文件
                if (/image/.test(tar.type) || /pdf/.test(tar.type)) {
                  this.moreUp.data.data.push(tar);
                } else {
                  this.moreUp.data.badType.push(tar);
                }
              } else {
                num++;
              }
            });
            if (num > 0) {
              if (this.moreUp.data.badType.length) {
                this.$message({
                  message: `请选择正确的文件（图片、PDF），其中有${num}个重复的！`,
                  type: "error",
                });
              }
            } else {
              if (this.moreUp.data.badType.length) {
                this.$message({
                  message: `请选择正确的文件（图片、PDF）！`,
                  type: "error",
                });
              }
            }
          }
        };
      }
    },
    // 模板下拉框数据变动监听
    singleChage() {
      this.$set(this.singleUp, "data", [this.tempSelect]);
    },
    // 模板下拉框数据变动监听
    moreChage() {
      this.$set(this.moreUp.data, "data", [this.tempSelect]);
    },
    // 重置选择
    resetData(num) {
      // 关闭弹框、radio切换时都调用，当num=1时为radio切换
      if (num !== 1) {
        this.issueCertify = false;
        this.issueCertifys = false;
      }
      this.$set(this.singleUp, "data", []);
      this.$set(this.moreUp, "data", {
        badType: [],
        data: [],
      });
      this.tempSelect = "";
    },
    // 单独上传点击下一步
    nextStep() {
      if (!this.singleUp.data.length) {
        this.$message({ message: "请选择好数据！", type: "warning" });
      } else {
        // 使用vuex可以保存完整的数据格式类型
        this.$store.state.dragLesize.muban = this.singleUp;
        //单独颁发跳转
        this.$router.push({
          path: "issueCertificate",
        });
      }
    },
    // 批量上传点击下一步
    moreNextStep() {
      if (this.moreUp.data.badType.length) {
        this.$message({ message: "请正确选择好数据！", type: "warning" });
      } else {
        this.$store.state.dragLesize.muban = this.moreUp;
        //批量颁发跳转
        this.$router.push({
          path: "batchIssue",
        });
      }
    },
    // 批量上传中的删除
    toDelete(num, file) {
      switch (num) {
        case 1:
          // 正确格式文件的删除
          this.moreUp.data.data = this.moreUp.data.data.filter(
            (t) => t.name != file.name
          );
          break;
        case 2:
          // 错误格式文件的删除
          this.moreUp.data.badType = this.moreUp.data.badType.filter(
            (t) => t.name != file.name
          );
          break;
        case 3:
          // 删除全部
          if (file === "good") {
            this.$set(this.moreUp.data, "data", []);
          } else {
            this.$set(this.moreUp.data, "badType", []);
          }
          break;
      }
    },
    // 点击取消，重置数据，关闭弹框
    singleOff() {
      this.issueCertify = false;
      this.issueCertifys = false;
      this.tempSelect = "";
      this.singleUp = {
        type: "1", //  1模板 2图片
        name: "", // 已经上传的证书名称
        data: [], // 已经上传的证书数据
      };
      this.moreUp = {
        type: "1", //  1使用模板 2 使用图片
        data: {
          badType: [], // 用来保存错误格式的文件
          data: [], // 保存已上传的正确格式的文件
        },
      };
    },

    /////////////////////////////////////////////////////////////////////////////////////////////
    openBrowser(hash) {
      //       1-质量溯源 管理员用户
      // 2-质量溯源 终端用户
      // 3-电子证书 管理员用户
      // 4-报告申报 管理员用户
      // 5-报告申报 普通用户
      window.open(window.g.historyChain + "?hash=" + "0x" + hash);
    },
    async reTxSign(item) {
      this.setCurDepartment = item;
      // screenDepartmentByIds,setCertAuth,certUseList } from "src/api/template";
      let CertPermission = await certUseList({ id: item.id });
      // 用户
      CertPermission.sysUserUseList.map((item) => {
        item.treeId = "sysu_" + item.id;
        return item;
      });
      //组织机构
      CertPermission.authUseList.map((item) => {
        item.treeId = "de_" + item.id;
        return item;
      });

      let comauthid = CertPermission.authUseList.map((item) => {
        return item.id;
      });
      let comid = CertPermission.sysUserUseList.map((item) => {
        return item.id;
      });

      // let comid = this.companyIds.map(item=>{return item.id})
      // let comauthid = this.companyAuthIds.map(item=>{ return item.id })
      var that = this;
      var content = [],
        text_ = [],
        presetText_ = [];
      let params = {
        id: item.id,
        certTemplateId: item.templateId,
        name: item.name,
        visitUrl: window.g.checkCertify,
        sysUserUseIds: comid,
        sysUserUseAuthIds: comauthid,
        dataContent: "",
      };
      //  返回id
      let result;
      certiSave(params).then(async (response) => {
        let noce = await this.getNoce();

        let versionParams = {
          userName: response.key,
          type: 3, //溯源-管理员上链
        };
        //获取version
        let version = await this.getVersion(4, response.key);
        //console.log(version,'version')
        let jwt = await this.messageSign(4, response.key);
        //console.log('jwt___',jwt);
        // let result = 0

        let valueInfo = Object.assign({}, JSON.parse(response.json), {
          desc: "重新上链证书：" + item.name,
        });
        let lolJwt = await getJwtTokenConsortium();
        let sginPrams = this.tranSgin(
          4,
          response.key,
          valueInfo,
          version,
          jwt,
          noce,
          lolJwt
        );

        let params = {
          txSignData: sginPrams,
        };

        let result = await certUploadTx(params);
        this.$message({ message: "重新上链请求已发送", type: "success" });

        this.getList();
      });
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
    // 添加授权/编辑人操作
    addOprate(item) {
      this.setCurDepartment = item;
      // screenDepartmentByIds,setCertAuth,certUseList } from "src/api/template";
      certUseList({ id: item.id }).then((response) => {
        // 用户
        response.sysUserUseList.map((item) => {
          item.treeId = "sysu_" + item.id;
          return item;
        });
        //组织机构
        response.authUseList.map((item) => {
          item.treeId = "de_" + item.id;
          return item;
        });
        this.companyAuthIds = response.authUseList;
        this.companyIds = response.sysUserUseList;
        this.departDiaTitle == 1;
        this.isSetting = true;
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(this.companyAuthList);
        });
      });
    },
    treeCheckChange(nodeObj, ischeck, type) {
      if (!ischeck) {
        //取消的时候去掉页面的值

        if (nodeObj.treeId.indexOf("de_") >= 0) {
          //去掉了组织
          if (type == 1) {
            //授权
            this.companyAuthIds = this.companyAuthIds.filter(
              (item) => item.id != nodeObj.id
            );
          } else {
            //编辑人
            this.sysUserAuthIds = this.sysUserAuthIds.filter(
              (item) => item.id != nodeObj.id
            );
          }
        } else {
          //去掉成员
          if (type == 1) {
            //授权
            this.companyIds = this.companyIds.filter(
              (item) => item.id != nodeObj.id
            );
          } else {
            //编辑人
            this.sysUserIds = this.sysUserIds.filter(
              (item) => item.id != nodeObj.id
            );
          }
        }
      }
      // 设置组件是否禁选
      let node = this.$refs.tree.getNode(nodeObj);
      var theChildren = node.childNodes;
      if (theChildren.length < 1) {
        return false;
      }
      let arr = [];
      theChildren.map((item) => {
        item.data.disabled = ischeck;
        arr.push(item.data);
        return item;
      });
      theChildren.splice(0, theChildren.length);
      node.doCreateChildren(arr);

      this.$forceUpdate();
    },
    async getuseList() {
      let result = await addOrUpdateUseList({ id: this.$route.query.id });

      // this.companyIds = result.sysUserUseList.map(item => {
      //   item.treeId = "sysu_" + item.id;
      //   return item;
      // }); //授权用户
      // this.sysUserIds = result.sysUserEditList.map(item => {
      //   item.treeId = "sysu_" + item.id;
      //   return item;
      // }); //编辑成员
      // this.sysUserAuthIds = result.authEditList.map(item => {
      //   item.treeId = "de_" + item.id;
      //   return item;
      // }); //编辑组织机构
      // this.companyAuthIds = result.authUseList.map(item => {
      //   item.treeId = "de_" + item.id;
      //   return item;
      // }); //授权组织机构
    },
    // 树
    deleteTreeItem(item, type) {
      if (type == 1) {
        this.companyAuthIds = this.companyAuthIds.filter((ite) => {
          return ite.id != item.id;
        });
      } else if (type == 2) {
        this.companyIds = this.companyIds.filter((ite) => {
          return ite.id != item.id;
        });
      } else if (type == 3) {
        this.sysUserAuthIds = this.sysUserAuthIds.filter((ite) => {
          return ite.id != item.id;
        });
      } else {
        this.sysUserIds = this.sysUserIds.filter((ite) => {
          return ite.id != item.id;
        });
      }
    },
    //  授权编辑人去重
    repeatData(arr) {
      var hash = {};
      let data = arr.reduce(function (item, next) {
        hash[next.treeId] ? "" : (hash[next.treeId] = true && item.push(next));
        return item;
      }, []);
      return data;
    },
    // 授权编辑人设置组织机构
    async getKey(type) {
      if (type == 1) {
        let keys = this.$refs.tree.getCheckedNodes();
        let companyAuthIds = [],
          companyIds = [];
        keys.map((item) => {
          if (item.treeId.indexOf("de_") >= 0) {
            companyAuthIds.push(item);
          }
          if (item.treeId.indexOf("sysu_") >= 0) {
            companyIds.push(item);
          }
        });

        let derp = this.repeatData(companyAuthIds.concat(this.companyAuthIds));

        let derpids = derp.map((item) => {
          return item.id;
        });
        let com = this.repeatData(companyIds.concat(this.companyIds));

        this.companyIds = com;
        screenDepartmentByIds({ departmentIds: derpids }).then((result) => {
          console.log(
            derp,
            derp.filter((item) => result.indexOf(item.id) >= 0)
          );
          this.companyAuthIds = derp.filter(
            (item) => result.indexOf(item.id) >= 0
          );

          setCertAuth({
            id: this.setCurDepartment.id,
            sysUserUseIds: this.companyIds.map((item) => {
              return item.id;
            }),
            sysUserUseAuthIds: this.companyAuthIds.map((item) => {
              return item.id;
            }),
          }).then((result) => {
            this.$message({
              message: "设置成功！",
              type: "success",
            });
            this.isSetting = false;
            this.isSetting_ = false;
            this.companyIds = [];
            this.companyAuthIds = [];
          });
          this.getList();
        });
      }
    },
    loadNode_(node, resolve) {
      let id = null;
      if (node.level >= 1) {
        id = node.data.id;
      }

      this.getSysUserAuthList_(id, resolve, node.checked || node.disabled);
    },
    async getSysUserAuthList_(id, fn, hasChecked) {
      let params = {
        parentId: id ? id : "",
      };
      let result = await getSysUserAuthList(params); //.then(result=>{

      result.departments.map((item) => {
        item.treeId = "de_" + item.id;
        item.treeName = item.name;
        item.isLeaf = false;
        item.disabled = hasChecked;
        item.child = [];
      });
      result.sysUsers.map((item) => {
        item.treeId = "sysu_" + item.id;
        item.treeName = item.username;
        item.isLeaf = true;
        item.disabled = hasChecked;
        item.child = null;
      });
      console.log([].concat(...result.sysUsers, ...result.departments));

      // return [].concat( ...result.companys, ...result.departmentList)
      fn([].concat(...result.sysUsers, ...result.departments));
      //})
    },
    exportCertify(item) {
      if (!item.certFile) {
        this.$message("没有证书图片");
        return false;
      }
      let suffix = !item.suffix ? ".png" : item.suffix;
      var FileSaver = require("file-saver"); //require('../../utils/filesave');
      var url = "";
      const xhr = new XMLHttpRequest();

      xhr.open("GET", item.certFile, true);
      xhr.responseType = "blob";
      // xhr.setRequestHeader("Authorization","Basic a2VybWl0Omtlcm1pdA==")
      xhr.onload = () => {
        if (xhr.status === 200) {
          //将图片文件用浏览器中下载
          FileSaver.saveAs(xhr.response, item.name + suffix);
        }
      };
      xhr.send();
    },

    async getTempList() {
      let params = {
        startTime: "",
        endTime: "",
        name: "",
        pageNum: 1,
        pageSize: 99999,
      };
      let result = await useCertTemplateList(params);
      if (result.rows && result.rows.length > 0) {
        this.tempOption = result.rows.map((item) => {
          item.value = JSON.stringify(item);
          item.label = item.name;
          return item;
        });
      } else {
        this.tempOption = [];
      }
    },
    async optionTemplate(item, num) {
      let state = num == 2 ? "停用" : "启用";
      let params = {
        id: item.id,
        status: num,
      };
      let result = await templateUpdateStatus(params);
      this.$message({
        message: state + "成功！",
        type: "success",
      });
      this.getList();
    },
    async deleteTemple(item) {
      let params = {
        id: item.id,
      };
      let result = await certRevoke(params);
      this.$message({
        message: "注销成功！",
        type: "success",
      });
      this.getList();
    },
    openNumberDloag(item) {
      this.dialogTit = item.name + "-使用权限";
      this.componentsList = item.companys;
      this.numberIsDloag = true;
    },
    toPage(type, item_) {
      // 单次颁发证书
      if (item_ == "issueCertificate") {
        this.issueCertify = true;
        return false;
      }
      // 批量颁发证书
      if (item_ == "issueCertificates") {
        this.issueCertifys = true;
        return false;
      }
      let item = Object.assign({}, item_);

      if (item) {
        item.companys = JSON.stringify(item.companys);
      }

      this.$router.push({ path: type, query: { ...item } });
    },
    serch() {
      this.userParams.pageNum = 1;
      this.getList();
    },
    //获取列表
    async getList() {
      this.userParams.startTime =
        this.userParamsTime && this.userParamsTime.length > 0
          ? this.userParamsTime[0]
          : "";
      this.userParams.endTime =
        this.userParamsTime && this.userParamsTime.length > 1
          ? Number(this.userParamsTime[1]) + 86400000
          : "";
      let result = await certList(this.userParams);

      this.userList = result.rows;
      this.total = result.total;

      // if (this.userList && this.userList.length > 0) {
      //     for (let i = 0; i < this.userList.length; i++) {
      //         this.$set(this.userList[i], 'isDelete', false);
      //         this.$set(this.userList[i], 'tingyong', false);
      //         this.$set(this.userList[i], 'qiyong', false);
      //     }
      // }
    },
    //分页
    handleCurrentChange(value) {
      this.userParams.pageNum = value;
      this.getList();
    },
  },
  created() {
    // 重置muban状态数据
    this.$store.state.dragLesize.muban = {};
    this.$parent.getUserInfo_();
    this.getList();
    this.getTempList();
  },
};
</script>
<style lang="scss" scoped>
@import "./index";
@import "~assets/css/mixin";
</style>
<style>
#certificate .issueCertify .el-select {
  width: calc(100% - 60px);
}
#certificate .blockDetail .el-form-item__content,
#certificate .blockDetail .el-form-item__label {
  font-size: 0.8rem !important;
  line-height: 1.4rem !important;
}
#certificate .blockDetail .el-form-item--mini.el-form-item {
  margin-bottom: 1.1rem !important;
}
#certificate .blockDetail .el-dialog__body {
  padding: 0.75rem 1.5rem 1rem !important;
}
#certificate .errorColor {
  color: #ed1c24;
}
#certificate .txStatus {
  cursor: pointer;
}
.issueCertify .el-dialog__body {
  padding: 0 1rem;
  text-align: center;
}

#certificate .el-date-editor .el-range__icon {
  font-size: 0.7rem;
  margin-left: -0.25rem;
  color: #c8c8c8;
  float: left;
  line-height: 1.6rem;
}
#certificate .el-button {
  font-size: 0.7rem;
  /* width: 5rem; */
}
#certificate .issueCertify .el-button--primary {
  width: 5rem !important;
  height: 100%;
  background-color: #f76a0d;
  font-size: 0.7rem;
}

#certificate .issueCertify .el-dialog__footer {
  padding-top: 0px;
}

#certificate .el-input__icon {
  height: 100%;
  width: 1.25rem;
  line-height: 1.6rem;
}

#certificate .el-date-editor .el-range-separator {
  padding: 0 0.25rem;
  line-height: 1.6rem;
}

#certificate .el-select > .el-input {
  font-size: 0.7rem;
  height: 2rem;
  width: 100%;
}

#certificate .el-select .el-input__inner {
  padding-right: 1.75rem;
}

#certificate .el-input__inner {
  height: 2rem;
  line-height: 2rem;
}

#certificate .el-input .el-input__icon {
  line-height: 2rem;
}

#certificate .el-input--prefix .el-input__inner {
  padding-left: 1.5rem;
  font-size: 0.7rem;
}

#certificate .el-button--primary {
  height: 100%;
  background-color: #f76a0d;
  font-size: 0.7rem;
}

#certificate .el-popover__reference {
  font-size: 0.7rem;
  color: #f76a0d;
  border: none;
  padding: 0;
}

#certificate .el-popover__reference:hover {
  background-color: #fff;
}

#certificate .el-range-editor .el-range-input {
  font-size: 0.7rem;
}

#certificate .el-dialog__title {
  font-size: 1.2rem;
  color: #363636;
}

#certificate .dloag .el-dialog__body {
  padding-bottom: 1.5rem;
}

#certificate .componentsListOutRow {
  margin-bottom: 1.1rem;
}

.templatepermission .el-scrollbar__wrap {
  overflow-x: hidden;
}
#certificate .el-form-item__content {
  font-size: 0.7rem;
  line-height: 2rem;
}
#certificate .el-form-item__label {
  font-size: 0.7rem;
  line-height: 2rem;
  padding: 0 0.6rem 0 0;
}
</style>