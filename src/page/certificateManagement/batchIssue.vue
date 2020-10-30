<template>
  <div id="batchIssue">
    <div>
      <el-row class="row">
        <el-col :span="3"
          ><div class="grid-content bg-purple">图 片 名 称</div></el-col
        >
        <el-col :span="21">
          <ul class="nameList">
            <li
              v-for="(t, ind) in $store.state.dragLesize.muban.data.data"
              :key="t.name"
            >
              {{ `${ind + 1}：` }}{{ t.name }}
            </li>
          </ul>

          <!-- <div class="grid-content bg-purple-light">
            {{ dynamicValidateForm.tmpname }}
          </div> -->
        </el-col>
      </el-row>

      <el-row class="row" :class="{ isRow: companyAuthIds.length > 0 }">
        <el-col :span="3"
          ><div class="grid-content bg-purple">设 置 授 权</div></el-col
        >
        <el-col :span="21">
          <div class="grid-content bg-purple-light">
            <div class="btn" @click="addOprate(1)">设 置 授 权</div>
          </div>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="3"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="21">
          <div class="grid-content bg-purple-light">
            <div v-if="companyAuthIds.length > 0" class="box_">
              <div
                v-for="it in companyAuthIds"
                :key="it.treeId"
                style="width: auto"
              >
                {{ it.name }}
                <div
                  class="box_close el-icon-close"
                  @click="deleteTreeItem(it, 1)"
                ></div>
              </div>
            </div>
            <div v-if="companyIds.length > 0" class="box_">
              <div v-for="it in companyIds" :key="it.treeId">
                {{ it.username }}
                <div
                  class="box_close el-icon-close"
                  @click="deleteTreeItem(it, 2)"
                ></div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="3"
          ><div class="grid-content bg-purple">证书信息</div></el-col
        >
        <el-col :span="21" style="margin-bottom: 30px">
          <el-button size="small" plain @click="selectFirm"
            >编辑上链信息</el-button
          >
        </el-col>

        <el-dialog
          :close-on-click-modal="false"
          class="diloag diloagTwo"
          title="选择上链信息名称"
          :visible.sync="upLine"
          :before-close="closeUpLine"
          width="36rem"
        >
          <p>
            已选择<span style="color: #f76a0d">{{
              ` ${upLineData.length} `
            }}</span
            >个
          </p>
          <ul class="hasSelect">
            <li @click="removeSelect(t)" v-for="t in upLineData" :key="t.id">
              {{ t.name }}
            </li>
          </ul>
          <p>请选择：</p>
          <div class="toCreate">
            <el-input
              v-model="toSearchFirm"
              placeholder="请输入上链信息名称"
            ></el-input>
            <el-button size="small" type="primary" @click="toSearch"
              >搜索</el-button
            >
            <span @click="toCreate(1)" v-if="!isToCreate">创建新名称</span>
            <span @click="toCreate(2)" v-if="isToCreate">关闭创建新名称</span>
          </div>

          <div class="toCreate2" v-if="isToCreate">
            <el-input placeholder="请输入创建名称" v-model="createNew">
              <span class="createNewSpan" slot="suffix" @click="toCreateNew"
                >保存</span
              >
            </el-input>
          </div>

          <ul class="toSelect">
            <li @click="addSelect(t)" v-for="t in firmList" :key="t.id">
              {{ t.name }}
            </li>
          </ul>

          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="closeUpLine">取 消</el-button>
            <el-button size="small" type="primary" @click="makeInfo"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </el-row>

      <el-row class="row isRow">
        <el-col :span="21" :offset="3">
          <el-row class="row isRow">
            <el-col :span="3">上链信息名称</el-col>
            <el-col :span="18">上链信息名称 上链信息名称 上链信息名称</el-col>
          </el-row>
          <el-row class="row isRow">
            <el-col :span="3">证书内容</el-col>
            <el-col :span="18">
              <div class="grid-content bg-purple-light fileBtn">
                <el-upload
                  class="upload-demo"
                  action="#"
                  :limit="2"
                  :auto-upload="false"
                  :on-change="getFile"
                >
                  <!-- :limit="1" -->
                  <!-- <el-button size="small" type="primary" v-if=" uploadStatus==2"
                >修改文件</el-button
              > -->
                  <span style="color: #f76a0d; font-weight: bold">{{
                    title
                  }}</span>
                </el-upload>
                <div class="fileName" v-if="uploadStatus == 2">
                  已上传，{{ fileName }}
                </div>
                <div class="fileName" v-if="uploadStatus == 1">
                  正在上传请稍等
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row class="row isRow">
            <el-col :span="19" :offset="3">
              <div class="tip">
                请上传.zip类型的压缩文件，<span
                  class="tip2"
                  @click="downloadZip"
                  >点击下载</span
                >证书内容文件格式及操作说明
              </div></el-col
            >
          </el-row>
        </el-col>
      </el-row>
      <!-- <el-row class="row2">
        <el-col :span="3"
          ><div class="grid-content bg-purple">证书模板样式</div></el-col
        >
       <el-col :span="21">
          <div class="grid-content bg-purple-light">
            <div class="templatebox">
              <div
                id="phone"
                :style="{
                  height: 842 + 'px',
                  maxWidth: domwidth + 10 + 'px',
                  overflow: 'auto',
                }"
              >
                <div
                  class="phone-set-box"
                  :style="{
                    width: Number(templateForm.width) + 'px',
                    height: templateForm.height + 'px',
                    backgroundImage: 'url(' + certificateImage + ')',
                    backgroundSize: '100% 100%',
                    backgroundPosition: '50% 50%',
                    backgroundColor: templateForm.bgColor,
                    backgroundRepeat: ' no-repeat',
                  }"
                >
                  <div :style="{ height: templateForm.height + 'px' }">
                    <VueDragResize
                      v-for="(rect, index) in rects"
                      :key="index"
                      :w="rect.width"
                      :h="rect.height"
                      :x="rect.left"
                      :y="rect.top"
                      :parentW="Number(templateForm.width)"
                      :parentH="Number(templateForm.height)"
                      :axis="rect.axis"
                      :isActive="false"
                      :minw="rect.minw"
                      :minh="rect.minh"
                      :isDraggable="false"
                      :isResizable="false"
                      :parentLimitation="rect.parentLim"
                      :snapToGrid="rect.snapToGrid"
                      :aspectRatio="rect.aspectRatio"
                      :z="rect.zIndex"
                      v-on:activated="activateEv(index)"
                      v-on:deactivated="deactivateEv(index)"
                      v-on:dragging="changePosition($event, index)"
                      v-on:resizing="changeSize($event, index)"
                    >
                      <temText
                        v-if="rect.type == 'textComponent'"
                        :item_="rect"
                        v-model="rect.text"
                      ></temText>
                      <qrcode v-if="rect.type == 'qrcode'"></qrcode>
                      <presetImg
                        v-if="rect.type == 'imgComponent'"
                        :comontTmp="rect"
                      ></presetImg>
                      <tmpImg
                        v-if="rect.type == 'presetImg'"
                        :item_="rect"
                      ></tmpImg>
                      <presetText
                        v-if="rect.type == 'presetText'"
                        :item_="rect"
                        :presetText="rect.text"
                        :fontColor_="rect.fontColor"
                        :fontSize_="rect.fontSize.toString()"
                      ></presetText>
                    </VueDragResize>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row> -->

      <el-row>
        <button @click="tuYuLan">预览</button>
        <button @click="toMakeZip">打包</button>
        <div>
          <label
            >选择excel文件：
            <input
              type="file"
              style="margin-bottom: 10px"
              @change="readExcel"
            />
          </label>
        </div>

        <!-- 预览显示 -->
        <div id="inCanvas">
          <img v-for="(t, ind) in yulanList" :src="t" :key="ind" />
        </div>
      </el-row>

      <el-row class="row">
        <el-col :span="3"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="21">
          <div class="grid-content bg-purple-light">
            <div class="btnOut">
              <div class="btn3">退出</div>
              <div class="btn4" @click="openImgs">批量预览并颁发</div>
            </div>
          </div>
        </el-col>
      </el-row>
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
        <el-button @click="getKey(1)" style="width: auto" type="primary"
          >确认</el-button
        >
      </div>
    </el-dialog>
    <!-- 证书预览 -->
    <el-dialog
      :close-on-click-modal="false"
      class="diloag diloagTwo"
      title="证书预览"
      :visible.sync="isPreview"
      width="33rem"
    >
      <div v-if="cretList && cretList.length > 0" class="titlePreview">
        证书名称： {{ cretList[index].name }}
      </div>
      <div class="certsOut">
        <div class="imgOut" v-if="cretListImg && cretListImg.length > 0">
          <img
            class="certOut"
            crossorigin="anonymous"
            :src="cretListImg[index]"
            alt=""
          />
          <div class="change">
            <i @click="toleft()" class="el-icon-arrow-left"></i>
            {{ index + 1 }} / {{ cretList.length }}
            <i @click="toright()" class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
      <div class="dilogBtnBox">
        <div class="btn5" @click="isPreview = false">取消</div>
        <div class="btn6" @click="okPost">确认颁发</div>
      </div>
    </el-dialog>
    <!-- 批量颁发 -->
    <el-dialog
      :close-on-click-modal="false"
      class="diloag diloagTwo"
      title="批量证书颁发进度"
      :visible.sync="isIssue"
      :before-close="backList"
      width="33rem"
    >
      <table>
        <thead>
          <td style="width: 60%">证书名称</td>
          <td style="width: 20%">上链状态</td>
          <td style="width: 20%">操作</td>
        </thead>
      </table>
      <div class="table2">
        <el-scrollbar class="inMessage" ref="myScrollbar" style="height: 100%">
          <table>
            <tbody>
              <tr v-for="(item, index) in uploadCretList" :key="index">
                <td style="width: 60%">{{ item.name }}</td>
                <td style="width: 20%">{{ item.txStatus | txStatusString }}</td>
                <td
                  style="width: 20%"
                  v-if="item.txStatus == 1 || item.txStatus == 3"
                >
                  {{ item.txStatus | txStatusString }}
                </td>
                <td
                  style="width: 20%"
                  id="again"
                  v-if="item.txStatus == 2"
                  @click="reTxSign(item)"
                >
                  重新上链
                </td>
              </tr>
            </tbody>
          </table>
        </el-scrollbar>
      </div>

      <div class="marginHegiht"></div>
    </el-dialog>

    <div class="templatebox" style="position: fixed" v-show="isOK">
      <div
        v-for="(item, index) in cretList"
        :key="index"
        :id="'phone' + index"
        data="noactive"
        :style="{
          width: Number(item.content.data.templateWidth) + 10 + 'px',
          height: Number(item.content.data.templateHeight) + 10 + 'px',
          overflow: 'auto',
          display: 'flex',
          position: 'relative',
        }"
      >
        <div
          class="scroll_phone"
          :style="{
            width: Number(item.content.data.templateWidth) + 'px',
            height: Number(item.content.data.templateHeight) + 'px',
          }"
        >
          <div
            class="phone-set-box"
            :style="{
              width: Number(item.content.data.templateWidth) + 'px',
              height: Number(item.content.data.templateHeight) + 'px',
              backgroundImage: 'url(' + item.content.data.backgroundImg + ')',
              backgroundSize: '100% 100%',
              backgroundPosition: '50% 50%',
              backgroundColor: item.content.data.backgroundColor,
              backgroundRepeat: ' no-repeat',
            }"
          >
            <div
              class="box_phone"
              :style="{
                border: '1px solid #dedede',
                height: item.content.data.templateHeight + 'px',
              }"
            >
              <VueDragResize
                v-show="item.content.data.content.length > 0"
                v-for="rect in item.content.data.content"
                :key="rect.key"
                :key_="rect.key"
                :w="rect.width"
                :h="rect.height"
                :x="rect.left"
                :y="rect.top"
                :parentKey_mo="rect.key"
                :parentW="parseInt(item.content.data.templateWidth)"
                :parentH="parseInt(item.content.data.templateHeight)"
                :axis="rect.axis"
                :isActive="false"
                :minw="rect.minw"
                :minh="rect.minh"
                :isDraggable="false"
                :isResizable="false"
                :parentLimitation="rect.parentLim"
                :snapToGrid="rect.snapToGrid"
                :aspectRatio="rect.type == 'qrcode' ? true : false"
                :z="rect.zIndex"
              >
                <div
                  class="filler"
                  :style="{
                    backgroundColor: rect.color,
                    borderColor: rect.active ? '#35c55b' : '#b0afaf',
                    width: 100 + '%',
                    height: 100 + '%',
                  }"
                >
                  <qrcode
                    v-show="rect.type == 'qrcode'"
                    :id="rect.type == 'qrcode' ? 'qrcode' + index : null"
                  ></qrcode>
                  <presetImg
                    v-if="
                      rect.type == 'presetImg' || rect.type == 'imgComponent'
                    "
                    :comontTmp="rect"
                  ></presetImg>
                  <presetText
                    v-if="
                      rect.type == 'presetText' ||
                      rect.type == 'textComponent' ||
                      rect.type == 'title'
                    "
                    :item_="rect"
                  ></presetText>
                </div>
              </VueDragResize>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import html2canvas from "html2canvas";
import {
  useCertTemplateList,
  getSysUserAuthList,
  addOrUpdateUseList,
  screenDepartmentByIds,
  setCertAuth,
  certUseList,
  multiSaveUploadFile,
  batchUploadCertPreview,
  batchStart,
  batchCertIssueSave,
  batchList,
  certUploadTx,
} from "src/api/template";
import { getJwtTokenConsortium } from "api/upChain.js";
import {
  certiSave,
  batchUploadTx,
  downloadTemplate,
} from "src/api/certificate";
import VueDragResize from "src/components/vue-drag-resize/vue-drag-resize.vue";
import qrcode from "./components/qrcode";
import tmpImg from "./components/tmpImg";
import temText from "./components/notemText";
import presetText from "./components/presetText";
import presetImg from "./components/presetImg";
import signature from "../../mixins/signatureMixin.js";
import XLSX from "xlsx";
import { getJSON } from "../../api/getjson";
import sha256 from "sha256";

//  二维码插件  https://www.npmjs.com/package/qrcode
import QRCode from "qrcode";
// 压缩操作插件
import JSZip from "jszip";

export default {
  mixins: [signature],
  components: {
    tmpImg,
    presetImg,
    temText,
    presetText,
    qrcode,
    VueDragResize,
  },
  data() {
    return {
      forYuLan: [], // 用来储存预览的元数据
      yulanList: [], // 真正用来预览的数据
      upLine: false, // 编辑上链信息弹框
      upLineData: [
        // 已经选择的企业
      ],
      firmList: [
        // 待选企业列表
      ],
      toSearchFirm: "", //搜索企业
      createNew: "", // 创建新名称
      isToCreate: false, // 创建新名称输入框的显示
      fangdou: null, // 用来去抖动
      ///////////////////////////////////////////////////////////////////
      isOK: false,
      title: "上传文件",
      // 通过上传读取到的zip文件的内容
      zipFiles: null,

      imgZip: [],
      uploadStatus: 0, //0 未上传，1正在上传 ，2上传成功，3上传失败
      isIssue: false,
      //证书上传
      uploadCretList: [],
      index: 0,
      //预览证书得数据
      certsList: [],
      //证书预览
      isPreview: false,
      preCert: {},
      showPreCert: false,
      token: JSON.parse(sessionStorage.getItem("userInfo")).token,
      domwidth: 595,
      templateForm: {
        width: 595,
        height: 842,
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
      previewCertificate: false,
      bgImg: [],
      pages: { pageindex: {}, page1: {}, page2: {}, page3: {}, page4: {} },
      options_: [],
      value: [],
      list: [],
      certificateImage: require("src/assets/img/certificate.png"),
      loading: false,
      tabs: [
        { name: "页面1", icon: [] },
        { name: "页面2", icon: [] },
        { name: "页面3", icon: [] },
        { name: "页面4", icon: [] },
      ],
      activeModelActiveInfo: null,
      moduleTitle__: [],
      phoneboxHieght: 842,
      labelcolor: "#848484",
      options: [
        {
          value: "14",
          label: "14px",
        },
        {
          value: "15",
          label: "15px",
        },
        {
          value: "16",
          label: "16px",
        },
        {
          value: "17",
          label: "17px",
        },
        {
          value: "18",
          label: "18px",
        },
      ],
      labelFontsize: "18",
      dynamicValidateForm: {
        tmpname: "",
        certName: "",
        id: "",
      },
      isEdit: false,
      input: "",
      active: "pageindex",
      clickTmp: "",
      presetTextSync: false,
      form: {
        name: "",
      },
      loading: false,
      saveActive: null,
      parentH: 1800,
      peopleArr: [],
      fileName: "",
      jsonMain: [],
      //证书列表
      cretList: [],
      txSingInfo: [],
      count: 0,
      //重新上链对象
      setCurDepartment: "",
      cretListImg: [],
    };
  },

  created() {
    // certNum	int	已用证书数量
    // certLimit

    // 拿到选择的文件
    let data = this.$store.state.dragLesize.muban;
    // 通过选择模板
    if (data.type == 1) {
      let content = JSON.parse(data.data.data[0]);

      if (!content.id || !content.name || !content.content) {
        this.$router.push({ path: "certificateManagement" });
      }
      this.dynamicValidateForm = {
        tmpname: content.name,
        id: content.id,
        certName: "",
      };
      this.$store
        .dispatch("dragLesize/get_rects", { url: content.content })
        .then((result) => {
          this.makeMunban(result);
          this.certificateImage = result.backgroundImg;
          if (result.backgroundImg.length > 0) {
            this.bgImg[0] = result.backgroundImg;
          }

          let temArea = {
            width: result.templateWidth,
            height: result.templateHeight,
            bgColor: result.backgroundColor,
          };
          if (result.templateWidth > 595) {
            this.domwidth = 595; //755
          } else {
            this.domwidth = 595;
          }
          this.templateForm = temArea;
        });
      this.$nextTick(() => {
        this.resetParentHeight();

        // this.setActiveModuleStatus()
      });
    } else {
      // 通过选择文件
      let datas = data.data.data;
      datas.forEach((tar) => {
        if (/image/.test(tar.type)) {
          const reader = new FileReader();
          reader.readAsDataURL(tar);
          reader.onload = () => {
            this.forYuLan.push({
              width: this.templateForm.width,
              height: this.templateForm.height,
              backgroundImage: reader.result,
              backgroundColor: "",
              children: [
                {
                  tagName: "qrcode", // 记录实际有内容的元素
                  left: this.templateForm.width - 81, // 坐标x，需要距边界10px
                  top: this.templateForm.height - 81, // 坐标y
                  width: 71,
                  height: 71,
                  content: "占位示例二维码",
                },
              ],
            });
          };
        }
        // 预览
        if (/pdf/.test(tar.type)) {
          let pdfPath = URL.createObjectURL(tar);
          let pdfjsLib = require("../../../static/js/pdf/pdf");
          pdfjsLib.PDFJS.workerSrc = "../../../static/js/pdf/pdf.worker.js";
          let loadingTask = pdfjsLib.getDocument(pdfPath);
          loadingTask.promise.then((pdfDocument) => {
            pdfDocument.getPage(1).then((pdfPage) => {
              // getViewport第一个参数scale，第二个是rotate
              var viewport = pdfPage.getViewport(1, 360);
              var canvas = document.createElement("canvas");
              canvas.width = pdfPage.view[2];
              canvas.height = pdfPage.view[3];
              var ctx = canvas.getContext("2d");
              var renderContext = {
                canvasContext: ctx,
                viewport: viewport,
              };
              pdfPage.render(renderContext).then(() => {
                this.forYuLan.push({
                  width: this.templateForm.width,
                  height: this.templateForm.height,
                  backgroundImage: canvas.toDataURL("image/png", 1), // 获取到pdf的第一页base64码
                  backgroundColor: "",
                  children: [
                    {
                      tagName: "qrcode", // 记录实际有内容的元素
                      left: this.templateForm.width - 81, // 坐标x
                      top: this.templateForm.height - 81, // 坐标y
                      width: 71,
                      height: 71,
                      content: "占位示例二维码",
                    },
                  ],
                });
              });
            });
          });
        }
      });
    }
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
    yuzhitext() {
      return this.form.name;
    },
    activeRect() {
      return this.$store.getters["getActive"];
    },
    pages_modulesRects() {
      return this.$store.state.dragLesize.pages_modulesRects;
    },
    rects() {
      //  this.$nextTick(()=>{
      //   this.resetParentHeight();
      //  })
      this.saveActive = this.$store.getters["getActive"];
      return this.$store.state.dragLesize.rects;
    },
  },
  mounted() {
    //   this.domwidth =
    // document.getElementsByClassName("templatebox")[0].offsetWidth - 550;
  },
  watch: {
    count(cur, old) {
      if (cur == this.txSingInfo.length) {
        this.getList();
      }
    },
  },
  methods: {
    // 编辑上链企业
    selectFirm() {
      // 创造企业名称假数据
      let arr = [];
      for (let i = 0; i < 50; i++) {
        arr.push({
          id: i + 1,
          name: `企业名称最多有十个字`,
        });
      }
      // 根据id做个排序
      this.firmList = arr.sort((a, b) => a.id - b.id);
      this.upLine = true;
    },
    // 编辑上链信息确认按钮
    makeInfo() {
      console.log(this.upLineData);
      //  this.upLine = false;
    },
    // 编辑上链信息弹框的关闭
    closeUpLine() {
      this.upLine = false;
      this.firmList = [];
      this.upLineData = [];
      this.createNew = "";
      this.isToCreate = false;
    },
    // 选择企业
    addSelect(target) {
      this.firmList = this.firmList.filter((t) => t.id != target.id);
      this.upLineData.push(target);
    },
    // 删除已选择的企业
    removeSelect(target) {
      this.upLineData = this.upLineData.filter((t) => t.id != target.id);
      let kk = this.firmList.concat([target]);
      this.firmList = kk.sort((a, b) => a.id - b.id);
    },
    // 搜索企业
    toSearch() {
      console.log(this.toSearchFirm);
    },
    // 保存创建新名称
    toCreateNew() {
      // 上链信息名称不超过10个字
      if (this.createNew.length < 10) {
        console.log(this.createNew);
        this.isToCreate = false;
        this.createNew = "";
      } else {
        this.$message({
          message: "上链信息名称不超过10个字！",
          type: "error",
        });
      }
    },
    // 新建企业
    toCreate(num) {
      if (num == 1) {
        this.isToCreate = true;
      } else {
        this.isToCreate = false;
        this.createNew = "";
      }
    },
    // 生成预览数据
    tuYuLan() {
      this.yulanList = [];
      this.forYuLan.forEach(async (t, ind) => {
        let kk = await this.makeCanvas(t);
        setTimeout(() => {
          this.yulanList.push(kk.toDataURL("image/png", 1));
          console.log(this.yulanList);
        });
      });
    },
    // 生成zip文件
    async toMakeZip() {
      let data = this.$store.state.dragLesize.muban,
        postData = [];
      data.data.data.forEach(async (tar) => {
        if (/image/.test(tar.type)) {
          const reader = new FileReader();
          reader.readAsDataURL(tar);
          reader.onload = async (t) => {
            let obj = {
              width: this.templateForm.width,
              height: this.templateForm.height,
              backgroundImage: t.target.result, // 图片的base64码
              children: [
                {
                  tagName: "qrcode", // 记录实际有内容的元素
                  left: this.templateForm.width - 81, // 坐标x，需要距边界10px
                  top: this.templateForm.height - 81, // 坐标y
                  width: 71,
                  height: 71,
                  content: "占位示例二维码", // 二维码数据，到时候换成实际的二维码数据
                },
              ],
            };
            let kk = await this.makeCanvas(obj);
            postData.push(kk);
          };
        }
        if (/pdf/.test(tar.type)) {
          // 转换pdf每一页
          let pdfPath = URL.createObjectURL(tar);
          let pdfjsLib = require("../../../static/js/pdf/pdf");
          pdfjsLib.PDFJS.workerSrc = "../../../static/js/pdf/pdf.worker.js";
          await pdfjsLib
            .getDocument(pdfPath)
            .promise.then(async (pdfDocument) => {
              let pageNume = pdfDocument.numPages; // 读取pdf一共有几页
              for (let i = 0; i < pageNume; i++) {
                await pdfDocument.getPage(i + 1).then(async (pdfPage) => {
                  // getViewport 第一个参数scale，第二个是rotate
                  var viewport = pdfPage.getViewport(1, 360);
                  var canvas = document.createElement("canvas");
                  canvas.width = pdfPage.view[2]; // 获取pdf页面的宽
                  canvas.height = pdfPage.view[3]; // 获取pdf页面的高
                  var ctx = canvas.getContext("2d");
                  var renderContext = {
                    canvasContext: ctx,
                    viewport: viewport,
                  };
                  await pdfPage.render(renderContext).then(async () => {
                    // 获取到的每一张pdf的base64码
                    let base64 = await canvas.toDataURL("image/png", 1);
                    let obj = {
                      width: pdfPage.view[2],
                      height: pdfPage.view[3],
                      backgroundImage: base64, // 图片的base64码
                      children: [
                        {
                          tagName: "qrcode", // 记录实际有内容的元素
                          left: pdfPage.view[2] - 81, // 坐标x，需要距边界10px
                          top: pdfPage.view[3] - 81, // 坐标y
                          width: 71,
                          height: 71,
                          content: "占位示例二维码", // 二维码数据，到时候换成实际的二维码数据
                        },
                      ],
                    };
                    let kk = await this.makeCanvas(obj);
                    postData.push(kk);
                  });
                });
              }
            });
        }
      });

      setTimeout(() => {
        var zip1 = new JSZip();
        let kk = postData.map((t, ind) => {
          return new Promise((res) => {
            t.toBlob(async (blobObj) => {
              await zip1.file(`${ind}-ffffffffff.png`, blobObj);
              res();
            });
          });
        });

        Promise.all(kk).then(() => {
          // 执行压缩
          zip1.generateAsync({ type: "blob" }).then((zipFile) => {
            // zipFile 为最终传给服务器的压缩包数据

            // // 验证用，到时候删了
            var save_link = document.createElement("a");
            save_link.href = URL.createObjectURL(zipFile);
            save_link.download = "name.zip";
            save_link.click();
          });
        });
      }, 1000);
    },
    // 读取excel并放入数据
    readExcel(e) {
      let file = e.target.files[0],
        workbook = null,
        worksheet = null;
      console.log(file);

      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        workbook = XLSX.read(e.target.result, {
          type: "buffer",
        });
        // 这里我们只读取第一张工作表sheet1
        worksheet = workbook.Sheets[workbook.SheetNames[0]];
        // console.log( this.worksheet)
        // 读取的excel文件的标题
        let title = Object.keys(worksheet).filter((str) => {
            return str.slice(1, 2) === "1";
          }),
          // 读取的excel文件的数据
          readExcelData = XLSX.utils.sheet_to_json(worksheet);

        // 单元地址对象存储为{c:C, r:R}，c:col列,r:row行 可以定位到具体某一个单元格
        // c表示横向x轴索引，从0开始，r表示纵向y轴索引，从0开始
        // 例如，单元格地址B5表示{c:1, r:4}
        // 单元格范围对象存储为范围{s:S, e:E}中S的第一个单元格和 E最后一个单元格。
        // 例如，范围A3:B7由object表示{s:{c:0, r:2}, e:{c:1, r:6}}。
        // 将单元格A3文字添加了 http://sheetjs.com 超链接链接
        // ws['A3'].l = { Target:"http://sheetjs.com", Tooltip:"超链接链接提示文字" };

        // 将新内容添加到excel表格
        // 添加假数据
        // let toAdd = [{ Aa: "新增的表格标题" }].concat(makeAddData());
        let toAdd = makeAddData();
        function makeAddData() {
          let length = readExcelData.length,
            backData = [];

          for (let i = 0; i < length; i++) {
            backData.push({
              Aa: `新增的表格内容_${i + 1}`, // 新增的表格的标题
            });
          }
          return backData;
        }
        // sheet_add_json 将JS对象数组添加到现有工作表中
        XLSX.utils.sheet_add_json(
          worksheet,
          toAdd,
          // origin 设置表格起始位置，header 设置 读取上边数据的key，只要一样就行，随便取名
          {
            origin: { r: 0, c: title.length },
            header: ["新增的表格的标题"], // 新增的表格的标题
          }
        );
        // 将更新的表格转换为json数据
        let datas = XLSX.utils.sheet_to_json(worksheet);
        // 下载文件
        XLSX.writeFile(workbook, "修改过的的.xlsx");

        // 生成excel文件，将这个 放到第 988 行处，形成代码逻辑为：
        // let excel= await  XLSX.write(workbook, {
        //   bookType: "xlsx",
        //   bookSST: false,
        //   type: "array", // 生成 ArrayBuffer
        // })
        // await zip1.file(`${ind}-ffffffffff.png`,excel);  // 压到zip里

        XLSX.write(workbook, {
          bookType: "xlsx",
          bookSST: false,
          type: "array", // 生成 ArrayBuffer
        });
      };
    },

    // 为画图组件进行数据的整理
    makeMunban(data) {
      let muban = {
        width: data.templateWidth,
        height: data.templateHeight,
        backgroundImage: data.backgroundImg,
        backgroundColor: data.backgroundColor,
        children: [],
      };
      data.content.forEach((tar) => {
        let obj = {
          tagName: tar.type, // 记录实际有内容的元素
          left: tar.left, // 坐标x
          top: tar.top + Math.trunc(tar.height / 2), // 坐标y
          width: tar.width, // 内容的宽
          height: tar.height, // 内容的高
        };
        // 文字
        if (obj.tagName === "presetText") {
          obj.content = {
            text: tar.text,
            css: {
              font: `${tar.fontSize ? tar.fontSize + "px " : ""}${
                tar.fontFamily
              } ${tar.fontWeight ? "bold" : ""}`,
              fillStyle: tar.fontColor,
            },
          };
        }
        // 组织二维码数据
        if (obj.tagName === "qrcode") {
          obj.content = "占位示例二维码";
        }
        // 组织图片数据
        if (obj.tagName === "presetImg") {
          obj.content = tar.text;
        }
        muban.children.push(obj);
      });
      this.forYuLan.push(muban);
    },

    // 生成二维码
    makeEr(qrcodeData) {
      // 要生成二维码的数据
      let erWeiMa = qrcodeData.content;
      var opts = {
        errorCorrectionLevel: "Q",
        quality: 1,
        margin: 0.2,
        maskPattern: 7, // 用于遮罩符号的遮罩图案  0--7
        width: 72,
        color: {
          dark: "#000",
          light: "#fff",
        },
      };
      // 生成二维码，是一个base64 字符串
      return QRCode.toDataURL(erWeiMa, opts).then(async (data) => {
        // 生成的是一个base64 字符串
        let img = new Image();
        img.src = data;
        await new Promise((res) => {
          image.onload = () => {
            res({
              data: img,
              width: opts.width,
            });
          };
        });
      });
    },
    // 制作canvas图片
    async makeCanvas(forCanvas) {
      // 构建canvas
      let canvas = document.createElement("canvas"),
        context = canvas.getContext("2d");

      canvas.width = forCanvas.width;
      canvas.height = forCanvas.height;
      // 画背景颜色
      if (forCanvas.backgroundColor) {
        context.save();
        context.fillStyle = forCanvas.backgroundColor;
        context.fillRect(0, 0, forCanvas.width, forCanvas.height);
        context.restore();
      }
      // 画背景图片
      if (forCanvas.backgroundImage) {
        context.save();
        var image = new Image();
        image.src = forCanvas.backgroundImage;
        await new Promise((res) => {
          image.onload = () => {
            context.drawImage(image, 0, 0, forCanvas.width, forCanvas.height);
            res();
          };
        });
        context.restore();
      }

      // 画各个内容
      forCanvas.children.forEach(async (t) => {
        switch (t.tagName) {
          case "presetImg":
            context.save();
            await new Promise((res) => {
              let image = new Image();
              image.src = t.content;
              image.onload = (e) => {
                context.drawImage(e.path[0], t.left, t.top, t.width, t.height);
                res();
              };
            });
            context.restore();
            break;
          case "presetText":
            let spans = document.getElementById("chicun"),
              textArr = t.content.text.split("");
            if (!spans) {
              spans = document.createElement("span");
              spans.id = "chicun";
              spans.style = "position: fixed; opacity: 0";
              document.body.appendChild(spans);
            }
            context.save();
            context.fillStyle = t.content.css.fillStyle; // 文字颜色
            context.font = t.content.css.font; // 文字样式
            context.textBaseline = "top"; // 文字起笔点
            // 还原字体的分行显示
            let arr = [], // 保存最后拆行的文字
              num = 0, // 记录字符宽度累计
              lastType = "", // 记录上一个文字的类型
              str = ""; // 记录目前累计的文字
            // 将文字拆成数组，逐个查看宽度
            textArr.forEach((d, ind) => {
              let tk = d.charCodeAt(),
                nowType = "";
              // 判断文字类型，方便后边的对比
              if (tk >= 48 && tk <= 57) {
                //"数字";
                nowType = 1;
              } else if (tk >= 65 && tk <= 90) {
                // "大写";
                nowType = 2;
              } else if (tk >= 97 && tk <= 122) {
                // "小写";
                nowType = 3;
              } else if (tk > 122) {
                // "中文";
                nowType = 4;
              } else {
                //  "标点";
                nowType = 5;
              }
              let w = spans.offsetWidth; // 获取当前span的宽度
              // 如果文字类型发生变动，需要重新获取span宽度
              if (lastType !== nowType) {
                lastType = nowType;
                spans.innerHTML = d;
                w = spans.offsetWidth;
                setArr();
              } else {
                setArr();
              }
              // 设置分组函数
              function setArr() {
                if (num + w > t.width) {
                  arr.push(str);
                  str = d;
                  num = w;
                } else {
                  str += d;
                  num += w;
                }
              }
              // 收尾
              if (ind === textArr.length - 1) {
                arr.push(str);
              }
            });
            //   绘制字体
            arr.forEach((str, index) => {
              let top = index === 0 ? t.top + 4 : t.top;
              context.fillText(str, t.left, top + index * spans.offsetHeight);
            });
            context.restore();
            break;
          default:
            // 画二维码
            context.save();
            // 要生成二维码的数据
            var opts = {
              errorCorrectionLevel: "Q",
              quality: 1,
              margin: 0.1,
              maskPattern: 7, // 用于遮罩符号的遮罩图案  0--7
              width: 72,
              color: {
                dark: "#000",
                light: "#fff",
              },
            };
            // 生成二维码，是一个base64 字符串
            let ma = await QRCode.toDataURL(t.content, opts);
            await new Promise((res) => {
              // 生成的是一个base64 字符串
              let image = new Image();
              image.src = ma;
              image.onload = (e) => {
                let erWeiMaX = forCanvas.width - opts.width - 10;
                let erWeiMaY = forCanvas.height - opts.width - 10;
                context.drawImage(
                  e.path[0],
                  erWeiMaX,
                  erWeiMaY,
                  opts.width,
                  opts.width
                );
                context.restore();
                res();
              };
            });
        }
      });
      return canvas;
    },

    //////////////////////////////////////////////////////////////
    backList() {
      this.$router.push({ path: "/manage/certificateManagement" });
    },
    //重新上链
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
    async getList() {
      let params = {
        templateId: JSON.parse(this.$route.query.content).id,
        tempStatus: false,
      };
      let result = await batchList(params);
      this.uploadCretList = result;
      this.isIssue = true;
      for (var i = 0; i < this.uploadCretList.length; i++) {
        if (this.uploadCretList[i].txStatus == 1) {
          // console.log(this.uploadCretList[i].txStatus);
          setTimeout(() => {
            this.getList();
          }, 10000);
          break;
        }
      }
      this.cretList = [];
      this.uploadStatus = 0;
      this.fileName = "";
    },
    async txSing(i, noce) {
      let version = await this.getVersion(4, this.txSingInfo[i].txData.key);
      let jwt = await this.messageSign(4, this.txSingInfo[i].txData.key);
      let valueInfo = Object.assign(
        {},
        JSON.parse(this.txSingInfo[i].txData.json)
      );
      let lolJwt = await getJwtTokenConsortium();
      let sginPrams = this.tranSgin(
        4,
        this.txSingInfo[i].txData.key,
        valueInfo,
        version,
        jwt,
        noce,
        lolJwt
      );
      let params = {
        certHash: this.txSingInfo[i].certHash,
        txSign: sginPrams,
      };

      let result = await batchUploadTx(params);
      this.count++;
      // this.$message({
      //    message:'正在签名上链，请等待',
      //    type:'success',
      //    duration:1000
      // });
      // this.txSingInfo
    },
    async okPost() {
      this.isPreview = false;
      let noce = await this.getNoce();
      let listParams = {
        templateId: JSON.parse(this.$route.query.content).id,
        tempStatus: false,
      };
      let lengthNum = this.cretList.length;
      for (let h = 0; h < lengthNum; h += 10) {
        let num =
          this.cretList.length % 10 == 0 ? 10 : this.cretList.length % 10;
        let data__ = this.cretList.splice(0, 10);
        let certs2 = [];
        for (let i = 0; i < data__.length; i++) {
          let obj = {};
          obj = {
            certHash: data__[i].certHash,
            tokenSign:
              data__[i].tokenJson +
              "." +
              this.cordSign(data__[i].tokenJson, this.Decrypt()),
          };
          certs2.push(obj);
        }
        let params = {
          templateId: JSON.parse(this.$route.query.content).id,
          visitUrl: window.g.qrcode,
          certs: certs2,
        };
        batchCertIssueSave(params).then((result) => {
          if (result) {
            this.txSingInfo = this.txSingInfo.concat(result);
            if (this.txSingInfo.length == lengthNum) {
              for (var b = 0; b < this.txSingInfo.length; b++) {
                if (b == 0) {
                  this.txSing(b, noce);
                } else {
                  let noce2 = parseInt(noce, 16) + 1;
                  noce = "0x" + noce2.toString(16);
                  this.txSing(b, noce);
                }
              }
            }
          }
        });
      }
    },
    openImgs() {
      // console.log(new Date().getTime());
      if (!this.fileName) {
        this.$message({ message: "请先上传文件！", type: "error" });
        return;
      }
      if (this.cretList && this.cretList.length == 0) {
        this.$message({
          message: "上传文件与模板不匹配，请核实！",
          type: "error",
        });
        return;
      }
      for (var i = 0; i < this.cretList.length; i++) {
        let params = {
          t: "",
          v: "",
          h: "",
          s: "",
        };
        let width = "";
        let height = "";
        this.cretList[i]["creatHash"] = sha256(
          JSON.stringify(this.cretList[i].content.data.content) +
            (new Date().getTime() + 1)
        );
        // params.i = sha256(
        //   JSON.stringify(this.cretList[i].content.data.content) +
        //     (new Date().getTime() + 1)
        // );
        // params.p = JSON.parse(sessionStorage.getItem("user")).pubKey.slice(2);
        params.v = JSON.parse(this.$route.query.content).version;
        params.t = this.stringLength();
        params.s = new Date().getTime() + 1;

        for (var j = 0; j < this.cretList[i].content.data.content.length; j++) {
          if (
            this.cretList[i].content.data.content[j].type == "textComponent"
          ) {
            params.h += this.cretList[i].content.data.content[j].text;
            params.h = sha256(params.h);
          }
          if (this.cretList[i].content.data.content[j].type == "qrcode") {
            width = this.cretList[i].content.data.content[j].width;
            height = this.cretList[i].content.data.content[j].height;
          }
        }

        // 动态获取域名
        let kk = self.location.origin + "/a/?c=";
        console.log(kk);

        this.cretList[i]["corde"] =
          "https://tic-chain.com/a/?c=" +
          JSON.stringify(params) +
          "." +
          this.cordSign(JSON.stringify(params), this.Decrypt());
        this.cretList[i]["cordeStyleW"] = width;
        this.cretList[i]["cordeStyleH"] = height;
      }
      this.isOK = true;
      // setTimeout(() => {
      //   this.createImgHome();
      // }, 0);

      // key
      // text
      // type
      // id

      ////////////////////////////////////////////////////////////////////////////////////////////
      setTimeout(() => {
        console.log(this.cretList);
        let canvasArr = []; // 用来保存最后生成的canvas图片

        let drawData = this.cretList.map((tar, ind) => {
          return {
            name: tar.name, // 证书名称
            width: tar.content.data.templateWidth, // 证书宽度
            height: tar.content.data.templateHeight, // 证书高度
            backgroundColor: tar.content.data.backgroundColor, // 证书背景色
            backgroundImage: tar.content.data.backgroundImg, // 证书背景图
            qrcode: tar.corde, // 二维码base64码
            children: tar.content.data.content.map((d) => {
              let obj = {
                tagName: d.type.toLowerCase(), // 记录元素类型
                left: d.left, // 坐标x
                top: d.top, // 坐标y
                width: d.width, // 内容的宽
                height: d.height, // 内容的高
                text: d.text,
                fontColor: d.fontColor,
                fontFamily: d.fontFamily,
                fontSize: d.fontSize,
                fontWeight: d.fontWeight,
                type: d.type, // "presetText" "textComponent" "imgComponent" "qrcode"
                surePoit: {
                  // 用来确定写文字时对其参考点
                  duiqi: d.verticalAlign,
                  gao: d.height,
                },
              };
              return obj;
            }),
          };
        });
        console.log(drawData);
        drawData.forEach((tar) => {
          // 构建canvas
          let canvas = document.createElement("canvas"),
            context = canvas.getContext("2d");

          canvas.width = tar.width;
          canvas.height = tar.height;
          // 画背景色
          if (tar.backgroundColor) {
            context.save();
            context.fillStyle = tar.backgroundColor;
            context.fillRect(0, 0, tar.width, tar.height);
            context.restore();
          }
          // 画背景图
          if (tar.backgroundImage) {
            context.save();
            var image = new Image();
            image.src = tar.backgroundImage;
            context.drawImage(image, 0, 0, tar.width, tar.height);
            context.restore();
          }
          // 画各个拖动内容
          tar.children.forEach((item) => {
            if (item.tagName === "qrcode") {
              this.drawQrcodeFn(context, item, tar.qrcode);
            } else if (item.tagName.toLowerCase() === "imgcomponent") {
              this.drawImageFn(context, item);
            } else {
              this.drawTextFn(context, item);
            }
          });
          let zhengshu = {
            name: tar.name,
            data: canvas.toDataURL("image/png", 1),
          };
          //  canvas 最后生成的标签
          console.log(zhengshu);
          // document.getElementById("ff").appendChild(canvas);
        });
      }, 0);
    },
    // 写字体
    drawTextFn(context, data) {
      let spans = document.getElementById("chicun");
      if (!spans) {
        spans = document.createElement("span");
        spans.id = "chicun";
        spans.style = "position: fixed; opacity: 0";
        document.body.appendChild(spans);
      }
      context.save();
      // canvas 字体设置
      let fontFamily = "";
      if (data.fontColor) {
        context.fillStyle = data.fontColor;
      }
      if (data.fontSize) {
        fontFamily += data.fontSize + "px ";
      }
      if (data.fontWeight) {
        fontFamily += data.fontWeight + " ";
      }
      if (data.fontFamily) {
        fontFamily += data.fontFamily + " ";
      }
      context.font = fontFamily;
      let point = 0; // 设置文字的起始坐标
      if (data.surePoit.duiqi === "middle") {
        context.textBaseline = "middle";
        point = data.top;
      } else {
        context.textBaseline = "top";
        point = data.top + data.gao / 2;
      }

      // 还原字体的分行显示
      let arr = [], // 保存最后拆行的文字
        num = 0, // 记录字符宽度累计
        lastType = "", // 记录上一个文字的类型
        str = ""; // 记录目前累计的文字
      // 将文字拆成数组，逐个查看宽度
      data.text.split("").forEach((d, ind) => {
        let tk = d.charCodeAt(),
          nowType = "";
        // 判断文字类型，方便后边的对比
        if (tk >= 48 && tk <= 57) {
          //"数字";
          nowType = 1;
        } else if (tk >= 65 && tk <= 90) {
          // "大写";
          nowType = 2;
        } else if (tk >= 97 && tk <= 122) {
          // "小写";
          nowType = 3;
        } else if (tk > 122) {
          // "中文";
          nowType = 4;
        } else {
          //  "标点";
          nowType = 5;
        }

        let w = spans.offsetWidth; // 获取当前span的宽度
        // 如果文字类型发生变动，需要重新获取span宽度
        if (lastType !== nowType) {
          lastType = nowType;
          spans.innerHTML = d;
          w = spans.offsetWidth;
          setArr();
        } else {
          setArr();
        }
        // 设置分组函数
        function setArr() {
          if (num + w > data.width) {
            arr.push(str);
            str = d;
            num = w;
          } else {
            str += d;
            num += w;
          }
        }
        // 收尾
        if (ind === data.text.length - 1) {
          arr.push(str);
        }
      });
      //   绘制字体
      arr.forEach((str, index) => {
        let top = index === 0 ? point + 4 : point;
        context.fillText(str, data.left, top + index * spans.offsetHeight);
      });
      context.restore();
    },
    // 画二维码
    async drawQrcodeFn(context, data, text) {
      context.save();
      let erWeiMa = await this.makeEr(data, text),
        erWeiMaX = data.left,
        erWeiMaY = data.top;

      context.drawImage(erWeiMa, erWeiMaX, erWeiMaY, data.width, data.height);
      context.restore();
    },
    // 生成二维码base64
    makeEr(data, text) {
      // 要生成二维码的数据
      let erWeiMa = text;
      var opts = {
        errorCorrectionLevel: "Q",
        quality: 1,
        margin: 0.5,
        maskPattern: 7, // 用于遮罩符号的遮罩图案
        width: data.width,
        color: {
          dark: "#000",
          light: "#fff",
        },
      };
      // 生成二维码，是一个base64 字符串
      return QRCode.toDataURL(erWeiMa, opts).then((data) => {
        // 生成的是一个base64 字符串
        let img = new Image();
        img.src = data;
        return img;
      });
    },
    // 画图片
    drawImageFn(context, data) {
      context.save();
      let image = new Image();
      image.src = data.text;
      image.width = data.width;
      image.height = data.height;
      image.onload = (t) => {
        context.drawImage(
          t.path[0],
          data.left,
          data.top,
          data.width,
          data.height
        );
        context.restore();
      };
    },

    ////////////////////////////////////////////////////////////////////////////////////////////
    //生成二维码
    createImgHome() {
      for (let i = 0; i < this.cretList.length; i++) {
        let idName = "qrcode" + i;
        let tempName = "phone" + i;
        var content = document.getElementById(idName);
        var phone = document.getElementById(tempName);
        content.innerHTML = "";
        var qrcode = new QRCode(content, {
          width: this.cretList[i]["cordeStyleW"], //设置宽高
          height: this.cretList[i]["cordeStyleH"],
        });
        var codes = this.cretList[i]["corde"];
        qrcode.makeCode(codes);
        html2canvas(phone, { useCORS: true }).then((canvas) => {
          let dataURL = canvas.toDataURL("image/png");
          this.cretListImg.push(dataURL);
          this.isPreview = true;
          console.log(new Date().getTime());
          // if (this.imgUrl !== "") {
          //   this.dialogTableVisible = true;
          // }
        });
      }
    },
    //字符串补零
    stringLength() {
      let str = "" + JSON.parse(this.$route.query.content).id;
      let str1 = "" + JSON.parse(this.$route.query.content).id;
      // console.log(str);
      // let str1 = '';
      if (str.length < 19) {
        for (var i = 0; i <= 19 - str1.length; i++) {
          str = "0" + str;
        }
        // console.log(str);
        return str;
      }
    },
    downloadZip(e) {
      let params = {
        id: this.dynamicValidateForm.id,
      };
      let userinfo = JSON.parse(sessionStorage.getItem("userInfo")),
        token = "";

      if (userinfo) {
        token = userinfo.token;

        window.open(
          window.g.apiurl +
            "/certadmin/cert/save/downloadTemplate?id=" +
            this.dynamicValidateForm.id +
            "&token=" +
            token
        );
      } else {
        this.$message({ message: "请登录", type: "error" });
      }

      // downloadTemplate(params).then(result => {
      //   debugger
      //   // var filename = '证书内容文件格式及操作说明.zip';
      //   //  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      //   //     window.navigator.msSaveOrOpenBlob(result, filename);
      //   //   }
      //   //   // for Non-IE (chrome, firefox etc.)
      //   //   else {
      //   //       var a = document.createElement('a');
      //   //       document.body.appendChild(a);
      //   //       a.style = 'display: none';
      //   //       debugger
      //   //       var url = window.URL.createObjectURL(result);
      //   //       a.href =  url;
      //   //       a.download = filename;
      //   //       a.click();
      //   //       a.remove();
      //   //       window.URL.revokeObjectURL(url);
      //   //   }

      //   // console.log("res", result);

      //   var filename = '证书内容文件格式及操作说明.zip';
      //   var FileSaver = require("file-saver"); //require('../../utils/filesave');

      //    FileSaver.saveAs(new Blob([result], {type: "application/zip"}), filename );

      // });
    },
    getFile(file, fileList) {
      console.log(file);
      console.log(fileList);

      this.cretList = [];
      fileList = fileList.splice(0, 1);
      this.count = 0;
      let params = {
        tId: JSON.parse(this.$route.query.content).id,
      };
      batchStart(params);
      // if (this.uploadStatus != 0) {
      //   return;
      // }
      if (!this.uploadStatus) {
        this.uploadStatus = 1;
      }
      this.fileName = fileList[0].name;
      let that = this;
      this.unFile(fileList[0].raw, fileList[0].name, (data) => {
        if (data) {
          let params = {
            file: fileList[0].raw,
            tId: this.dynamicValidateForm.id,
          };
          multiSaveUploadFile(params).then((result) => {
            let imgArr = [];
            data.map((item, index) => {
              for (var i in item) {
                let getvalue = this.findItem(result.image, item[i].value);
                if (!!getvalue && item[i].value == getvalue.key) {
                  item[i].value = getvalue.url + "," + getvalue.sha256;
                }
              }
              return item;
            });
            let json = JSON.parse(this.$route.query.content).content;
            let url = json.split("/").slice(3).join("/");

            getJSON(url, {})
              .then((result2) => {
                let tempObj = {};

                let tempArr = [];
                tempObj = result2;
                let jsonMain = result2.content;
                for (let n = 1; n < data.length; n++) {
                  let subObj = {
                    name: "",
                    index: "",
                    content: "",
                  };
                  let temOutObj = {
                    code: 200,
                    msg: "json",
                    data: {},
                    name: "",
                    index: "",
                  };
                  for (var i = 0; i < jsonMain.length; i++) {
                    //遍历组件
                    for (var j = 0; j < result.model.length; j++) {
                      //遍历值

                      if (result.model[j] == jsonMain[i].key) {
                        if (jsonMain[i].type == "imgComponent") {
                          // console.log(data[n][j + 2].value);
                          jsonMain[i].text = data[n][j + 2].value.split(",")[0];
                          jsonMain[i].sha256 = data[n][j + 2].value.split(
                            ","
                          )[1];
                        } else {
                          jsonMain[i].text = data[n][j + 2].value;
                          jsonMain[i].sha256 = sha256(data[n][j + 2].value);
                        }
                        jsonMain[i].author = that.$parent.userinfo.username;
                        jsonMain[i].cTime = new Date().getTime();
                      }
                    }
                  }

                  tempObj.content = jsonMain;
                  temOutObj.data = tempObj;
                  subObj.name = data[n][1].value;
                  subObj.index = n;
                  subObj.content = JSON.stringify(temOutObj);
                  tempArr.push(Object.assign({}, subObj));
                }
                let cont_ = JSON.parse(that.$route.query.content);
                let sObjData = {
                  templateId: cont_.id,
                  visitUrl: window.g.qrcode,
                  sysUserUseIds: that.companyIds.map((item) => {
                    return item.id;
                  }),
                  sysUserUseAuthIds: that.companyAuthIds.map((item) => {
                    return item.id;
                  }),
                  certContents: [],
                };

                let lengthNum = tempArr.length;
                this.cretList = tempArr;
                for (let h = 0; h < lengthNum; h++) {
                  this.cretList[h].content = JSON.parse(tempArr[h].content);
                }
                // console.log(this.cretList);
              })
              .catch((err) => {
                console.log(err);
                that.uploadStatus = 2;
                that.title = "更改文件";
                this.$message({
                  message: "上传文件与模板不匹配，请核实！",
                  type: "error",
                });
              });
          });
        }
      });
    },

    findItem(arr, name) {
      let obj = arr.find((item) => {
        return item.key == name;
      });
      return obj;
    },
    unFile(data, fileName, callback) {
      if (!data) {
        return;
      }
      let files = new window.File([data], fileName, { type: "zip" });
      // 读取zip压缩文件里面的文件内容
      let JSZip = require("jszip");
      var iconv = require("iconv-lite");
      let option = {
        decodeFileName: "",
      };
      if (/macintosh|mac os x/i.test(navigator.userAgent)) {
        option.decodeFileName = function (bytes) {
          // console.log('判断文字',bytes);

          return iconv.decode(bytes, "utf8");
        };
      } else {
        option.decodeFileName = function (bytes) {
          // console.log('判断文字',bytes);

          return iconv.decode(bytes, "gbk");
        };
      }
      JSZip.loadAsync(files, option).then((zip) => {
        // if(/macintosh|mac os x/i.test(navigator.userAgent)){
        // console.log(zip.files);
        // 缓存读取的zip文件
        this.zipFiles = zip;
        for (let key in zip.files) {
          if (key.indexOf("__MACOSX/._") === -1) {
            // console.log(key);
            let keyarr = key.split(".");
            if (
              keyarr[keyarr.length - 1].toLowerCase() == "jpg" ||
              keyarr[keyarr.length - 1].toLowerCase() == "png" ||
              keyarr[keyarr.length - 1].toLowerCase() == "jpeg"
            ) {
              this.imgZip.push(zip.files[key]);
            }
            if (
              keyarr[keyarr.length - 1] == "xlsx".toLowerCase() ||
              keyarr[keyarr.length - 1] == "xls".toLowerCase()
            ) {
              let base = zip.file(zip.files[key].name).async("blob");
              base.then((res) => {
                let fileCrt = new window.File([res], "test.xlsx", {
                  type: "xlsx",
                });
                // console.log(fileCrt);
                this.readExcel1(fileCrt, callback);
              });
              // break;
            } else if (
              keyarr[keyarr.length - 1] == "png".toLowerCase() ||
              keyarr[keyarr.length - 1] == "jpg".toLowerCase() ||
              keyarr[keyarr.length - 1] == "jpeg".toLowerCase() ||
              keyarr[keyarr.length - 1] == "txt" ||
              !keyarr[keyarr.length - 1]
            ) {
            } else {
              this.$message({ message: "zip压缩包内没有找到.xlsx文件" });
            }
          }
        }
      });
    },
    readExcel1(files, callback) {
      //表格导入
      var that = this;
      if (files.name.length <= 0 || files.size < 1) {
        //如果没有文件名
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files.name.toLowerCase())) {
        // this.$Message.error('上传格式不正确，请上传xls或者xlsx格式');
        return false;
      }
      // 读取excel数据
      this.readfileFunc(files, (filedata) => {
        let dataLength = filedata.length;
        // console.log(filedata, "数据excel");
        if (!this.$parent.isPlatformAdmin) {
          if (this.$parent.certLimit - this.$parent.certNum < dataLength) {
            this.$message({ message: "帐号可颁发证书数量不足，请重新导入" });
          }
        }
        //拿到图片文件
        let imgNameArr = this.imgZip.map((item) => {
          let arr = item.name.split("/");
          if (arr.length > 0) {
            return arr[arr.length - 1];
          } else {
            return "";
          }
        });
        let havBreak = false;
        for (let i = 0; i < filedata.length; i++) {
          if (havBreak) {
            break;
          }
          let item_ = filedata[i];
          // console.log(i,havBreak);
          for (let key in item_) {
            if (item_[key].value.length <= 0) {
              //   console.log("有空文字");
              havBreak = true;
              this.$message({
                message: "内容缺失，请核实后重新上传",
                type: "error",
              });
              break;
            } else {
              if (
                item_[key].value.toString().toLowerCase().indexOf("jpg") >= 0 ||
                item_[key].value.toString().toLowerCase().indexOf("png") >= 0 ||
                item_[key].value.toString().toLowerCase().indexOf("jpeg") >= 0
              ) {
                // console.log(imgNameArr.includes(item_[key]), item_[key], imgNameArr);
                let haveImg = imgNameArr.includes(item_[key].value);
                if (!haveImg) {
                  havBreak = true;
                  //   console.log("有空图片");
                  this.$message({
                    message: "缺少图片内容，请核实后重新上传",
                    type: "error",
                  });

                  break;
                }
              }
            }
          }
        }
        callback(filedata);
      });
    },
    async readfileFunc(files, callback) {
      let that = this;

      let Excel = require("exceljs");
      //   console.log(files);
      //   const workbook = new Excel.Workbook();

      //   const fileReader = new FileReader();
      //   fileReader.onload = ev => {
      //     try {
      //       const data = ev.target.result;
      var reader = new FileReader();
      reader.readAsArrayBuffer(files);
      reader.onload = function (e) {
        let buffer = e.target.result; //此时是arraybuffer类型
        const workbook = new Excel.Workbook();
        let arr = workbook.xlsx.load(buffer);
        arr.then((result) => {
          this.jsonMain = result._worksheets[1]._columns;
          let excelArr = [];

          this.jsonMain.map((item, index) => {
            // excelArr[index]=[]

            item.values.map((item_, ind) => {
              if (ind > 1) {
                //    console.log(excelArr[ind-1],'-----');
                //对象
                if (!excelArr[ind - 1]) {
                  excelArr[ind - 1] = {};
                }

                //  excelArr[ind-1][item.values[1]]=item_
                excelArr[ind - 1][index + 1] = {
                  key: item.values[1],
                  value: item_,
                };

                // //数组
                //                               if(!excelArr[ind-1]){
                //                                    excelArr[ind-1]=[]
                //                                }

                //                              excelArr[ind-1][index]=item_
              }
              return item_;
            });
            return item;
          });
          that.peopleArr = excelArr;
          callback(that.peopleArr);
          // let obj = {};
          // this.jsonMain.map(item=>{
          //     console.log(item);
          //     for(let i in obj){
          //         i = item.map(key=>{

          //         })
          //     }
          // })
        });
      };

      //   const workbook = XLSX.read(data, {
      //     type: "binary"
      //   });
      //   const wsname = workbook.SheetNames[0]; //取第一张表
      //   console.log(workbook.Sheets[wsname]['!ref']);

      //   const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname],{defval:''}); //生成json表格内容
      // console.log(ws,'ws')
      //       that.peopleArr = ws; //清空接收数据

      //       callback(that.peopleArr);
      //     } catch (e) {
      //       console.log(e);
      //       return false;
      //     }
      //   };
      //   fileReader.readAsBinaryString(files);
    },
    toleft() {
      if (this.index === 0) {
        return;
      } else {
        this.index--;
      }
    },
    toright() {
      if (this.index === this.cretList.length - 1) {
        return;
      } else {
        this.index++;
      }
    },
    preCertClose(e) {
      this.submitForm(e, "dynamicValidateForm", "cancel");
    },
    //文本组件设置placeholder
    setPlaceHolder(value, item) {
      //  shawn
      // let sha256String = sha256(value);
      //编辑
      let obj = Object.assign({}, item, { text: value });

      this.$store.dispatch("dragLesize/setComAttr", {
        key: item.key, //type 为textComponent,attr为text的时候，设置placeholder
        attr: "multiple",
        value: obj,
      });
    },
    // 获取已经设置的权限
    addOprate() {
      this.isSetting = true;
      //
      // certUseList({id:this.dynamicValidateForm.id}).then(response=>{

      //   // 用户
      //   response.sysUserUseList.map(item=>{
      //       item.treeId='sysu_'+item.id
      //       return item
      //   })
      //   //组织机构
      //   response.authUseList.map(item=>{
      //     item.treeId='de_'+item.id
      //     return item
      //   })
      //   this.companyAuthIds=response.authUseList
      //   this.companyIds=response.sysUserUseList
      //   this.isSetting = true;
      //   this.$nextTick(() => {
      //     this.$refs.tree.setCheckedKeys(this.companyAuthList);
      //   });
      // })
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
          this.companyAuthIds = derp.filter(
            (item) => result.indexOf(item.id) >= 0
          );

          this.isSetting = false;
          //保存权限，新增没有模板id
          // setCertAuth({id:this.setCurDepartment.id,sysUserUseIds:this.companyIds.map(item=>{return item.id}),sysUserUseAuthIds:this.companyAuthIds.map(item=>{
          //   return item.id
          // })}).then(result=>{
          //   this.$message({
          //     message: "设置成功！",
          //     type: "success"
          //   });
          //   this.isSetting = false;
          //   this.isSetting_ = false;
          //   this.companyIds=[]
          //   this.companyAuthIds=[]
          // })
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

      // return [].concat( ...result.companys, ...result.departmentList)
      fn([].concat(...result.sysUsers, ...result.departments));
      //})
    },
    callbackCertificate(e) {
      let attr = "error";
      let img = require("src/assets/img/errorTip.png");
      this.$confirm(
        '<div style="width:100%;text-align:center;"><img style="width:4.5rem;hieght:4.4rem;" src="' +
          img +
          '"/></div><div style="width:100%;text-align:center;font-size:0.8rem;">有未保存内容，退出后无法恢复，是否确认退出？</div>',
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          // type: 'warning'
        }
      )
        .then(() => {
          this.$router.push({ path: "certificateManagement" });
        })
        .catch(() => {});
    },
    precivewCertifi() {
      this.previewCertificate = true;
    },
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {},
    handlePreview(file) {},
    visibleChange(state) {
      if (!state) {
        this.options_ = [];
      }
    },
    setPresetImg(data, img) {
      this.$store.dispatch("dragLesize/setComAttr", {
        key: data.key,
        value: img,
        attr: "text",
      });
    },

    async remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        let that = this;

        let result = await companyFindByName({ name: query });

        if (result) {
          // result.label=resutl.username+'('+result.companyName+')'
          // result.value=result.id

          that.options_ = [
            {
              value: result.id,
              label: result.username + "(" + result.companyName + ")",
            },
          ];
        }
        that.loading = false;
        // setTimeout(() => {
        //   that.loading = false;
        //   // that.options_ = that.list
        //   that.options_ = that.list.filter(item => {
        //     console.log(item.label.toLowerCase(), query.toLowerCase(), item.label.toLowerCase()
        //      ===(query.toLowerCase()));

        //     return item.label.toLowerCase()===(query.toLowerCase()) > -1;
        //   });

        // }, 200);
      } else {
        this.options = [];
      }
    },
    tabonblur(e, index) {
      if (e.target.innerText.length > 10) {
        this.$message("最多只能输入10个字符");
      }

      e.target.innerText = e.target.innerText.substr(0, 10);
      this.tabs[index].name = e.target.innerText.substr(0, 10);
    },
    addModules(e) {
      let attr = "addmodule";
      let key = "";
      this.$store.dispatch("dragLesize/setModuleAttr", {
        key,
        attr,
        value: "",
      });

      // this.$message({
      //   type: 'success',
      //   message: '添加成功'
      // });
    },
    deleteModule(e, key) {
      let attr = "delete";
      let img = require("src/assets/img/deleteTwo.png");
      this.$confirm(
        '<div style="width:100%;text-align:center;"><img style="width:4.5rem;hieght:4.4rem;" src="' +
          img +
          '"/></div><div style="width:100%;text-align:center;font-size:0.8rem;">删除模块后,模块内所有内容都会被删除，是否继续?</div>',
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          // type: 'warning'
        }
      )
        .then(() => {
          this.$store.dispatch("dragLesize/setModuleAttr", {
            key,
            attr,
            value: "",
          });

          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });

      e.preventDefault();
      e.stopPropagation();
    },

    // 设置激活模块的title
    Moduletitlechange(v, key) {
      let attr = "title";
      let value = v;

      this.$store.dispatch("dragLesize/setModuleAttr", { key, attr, value });
    },
    hasnoactive(el, index) {
      if (
        el.getAttribute("data") == "noactive" ||
        el.className.indexOf("noactive") >= 0
      ) {
        return true;
      } else {
        if (index > 7 || !el.parentElement) {
          return false;
        } else {
          return this.hasnoactive(el.parentElement, index + 1);
        }
      }
    },
    // 设置当前模块激活状态
    setActiveModuleStatus(e, key, type) {
      if (this.hasnoactive(e.target, 0)) {
        // if( !!e && ( e.target.getAttribute('data')=='noactive'
        // || (!!e.target.parentElement && e.target.parentElement.getAttribute('data'))
        // || (!!e.target.firstElementChild &&  e.target.firstElementChild.getAttribute('data')=='noactive') )
        // || (!!e.target.parentNode.parentNode.parentElement && e.target.parentNode.parentNode.parentElement.getAttribute('data')=='noactive')
        // || (!!e.target.parentElement.parentElement.parentElement && e.target.parentElement.parentElement.parentElement.className.indexOf('noactive')>=0)
        // || (!!e.target.parentElement.parentElement.parentElement.parentElement && e.target.parentElement.parentElement.parentElement.parentElement.parentElement.className.indexOf('noactive')>=0)
        // ){
        return false;
      }

      if (
        !this.$store.getters.getActiveModule ||
        this.$store.getters.getActiveModule.key != key ||
        this.$store.getters.getActiveModule.activeModel != type
      ) {
        this.$store.dispatch("dragLesize/setActiveModuleStatus", { key, type });
        // .then(data=>{
        //   this.activeModelActiveInfo=key
        // })

        // .then(data=>{

        // })
      }

      // if(!!e){
      //   e.stopPropagation();
      //     e.preventDefault();
      // }
    },

    resetParentHeight() {
      // console.log('resetParentHeight');

      if (this.active == "pageindex") {
        var arr = this.$store.state.dragLesize.rects;
        var max =
          arr.length > 0
            ? arr.reduce(function (a, b) {
                let amax = a.height + a.top;
                let bmax = b.height + b.top;
                return bmax > amax ? b : a;
              })
            : { height: 839, top: 0 };

        if (max.height + max.top < 839) {
          this.phoneboxHieght = 842;
        } else {
          this.phoneboxHieght =
            max.height + max.top == 1800 ? 1800 : max.height + max.top + 30;
        }
      } else {
        if (!this.$store.getters.getActiveModule) {
          //没有激活的模块
          return;
        }
        let attr = "height",
          key = this.$store.getters.getActiveModule.key,
          value = "";
        var arr = this.$store.state.dragLesize.rects;
        var max =
          arr.length > 0
            ? arr.reduce(function (a, b) {
                let amax = a.height + a.top;
                let bmax = b.height + b.top;
                return bmax > amax ? b : a;
              })
            : { hegiht: 667, top: 0 };

        this.$store.dispatch("dragLesize/setModuleAttr", {
          attr,
          key,
          value: max.height + max.top,
        });
      }
    },
    // 设置颜色
    labelcolor_reset(v) {
      if (this.saveActive == null) {
        this.$message.error("请选择组件");
        return false;
      }

      if (
        this.$store.state.dragLesize.rects[this.saveActive].type != "presetText"
      ) {
        this.$message.error("只能对预置文本设置字体颜色");
        return false;
      }

      this.$store.dispatch("dragLesize/resetFontcolor_rect", {
        index: this.saveActive,
        color: v,
      });
    },
    //设置字体
    labelSize_reset(v) {
      if (this.saveActive == null) {
        this.$message.error("请选择组件");
        return false;
      }
      if (
        this.$store.state.dragLesize.rects[this.saveActive].type != "presetText"
      ) {
        this.$message.error("只能对预置文本设置字体大小");
        return false;
      }

      this.$store.dispatch("dragLesize/resetFontsize_rect", {
        index: this.saveActive,
        size: v,
      });
    },
    //删除组件
    deleterct() {
      if (this.saveActive == null) {
        this.$message.error("请选择组件");
        return false;
      }
      let activeIndex = this.saveActive;
      let img = require("src/assets/img/deleteTwo.png");
      this.$confirm(
        '<div style="width:100%;text-align:center;"><img style="width:4.5rem;hieght:4.4rem;" src="' +
          img +
          '"/></div><div style="width:100%;text-align:center;font-size:0.8rem;">删除模块后，模块内所有内容都会被删除，是否确认？</div>',
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          // type: 'warning'
        }
      )
        .then(() => {
          this.$store.dispatch("dragLesize/delete_rect", {
            index: activeIndex,
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    savepages() {},
    //设置预置文本
    setPresetTxt() {
      this.presetTextSync = false;
      if (this.active != "pageindex" && !this.$store.getters.getActiveModule) {
        this.$message("请先选择模块");
        return false;
      }
      this.$store.dispatch("dragLesize/addRects", {
        data: "presetText",
        text: this.form.name,
        page: this.active,
      });
      this.form.name = "";
    },
    // 添加组件
    setTmpItem(e, type) {
      if (type == "presetText") {
        this.presetTextSync = true;
      } else {
        this.$store.dispatch("dragLesize/addRects", {
          data: type,
          page: this.active,
        });
      }
    },
    // 设置组件激活状态
    activateEv(index) {
      this.$store.dispatch("dragLesize/setActive", {
        id: index,
        page: this.active,
      });
    },
    // 设置组件去激活状态
    deactivateEv(index) {
      this.$store.dispatch("dragLesize/unsetActive", { id: index });
    },
    // 拖拽以后设置组件
    changePosition(newRect, index) {
      this.saveActive = this.$store.getters["getActive"];
      this.$store.dispatch("dragLesize/setTop", {
        id: index,
        top: newRect.top,
      });
      this.$store.dispatch("dragLesize/setLeft", {
        id: index,
        left: newRect.left,
      });
      this.$store.dispatch("dragLesize/setWidth", {
        id: index,
        width: newRect.width,
      });
      this.$store.dispatch("dragLesize/setHeight", {
        id: index,
        height: newRect.height,
      });
      this.resetParentHeight();
      // var arr = this.$store.state.dragLesize.rects;

      // var max = arr.reduce(function (a, b) {

      //   let amax = a.height + a.top
      //   let bmax = b.height + b.top
      //   return bmax > amax ? b : a;
      // });
      // if(max.height+max.top<667){
      //   this.phoneboxHieght=842
      // }else{
      //   this.phoneboxHieght =  max.height+max.top==1800?1800:max.height+max.top+30;
      // }
    },
    //改变大小以后设置组件
    changeSize(newRect, index) {
      this.$store.dispatch("dragLesize/setTop", {
        id: index,
        top: newRect.top,
      });
      this.$store.dispatch("dragLesize/setLeft", {
        id: index,
        left: newRect.left,
      });
      this.$store.dispatch("dragLesize/setWidth", {
        id: index,
        width: newRect.width,
      });
      this.$store.dispatch("dragLesize/setHeight", {
        id: index,
        height: newRect.height,
      });
      this.resetParentHeight();
    },

    // 是否未编辑
    toIsEdit() {
      this.isEdit = true;
    },
    // 提交数据
    // submitForm(e, formName, type) {
    //   if (this.dynamicValidateForm.certName.length == 0) {
    //     this.$message({ message: "请添加证书名称", type: "error" });
    //     return false;
    //   }
    //   let hasNoEdit = this.rects.filter(item => {
    //     return (
    //       (item.type == "textComponent" || item.type == "imgComponent") &&
    //       item.text == ""
    //     );
    //   });
    //   if (hasNoEdit.length > 0) {
    //     this.$message({
    //       message: "您有未输入的内容，请完善证书内容再颁发",
    //       type: "error"
    //     });
    //     return false;
    //   }
    //   // if(this.companyAuthList.length<1 && this.companyIds<1){
    //   //   this.$message({ message: '请设置授权', type: 'error' })
    //   //   return false;
    //   // }
    //   let comid = this.companyIds.map(item => {
    //     return item.id;
    //   });
    //   let comauthid = this.companyAuthIds.map(item => {
    //     return item.id;
    //   });
    //   var that = this;
    //   var content = [],
    //     text_ = [],
    //     presetText_ = [];

    //   // 将所有宽高，top ,left ,zindex 转为数字
    //   let rectsArr = this.rects.map(item => {
    //     item.top = Number(item.top);
    //     item.left = Number(item.left);
    //     item.width = Number(item.width);
    //     item.height = Number(item.height);
    //     item.zIndex = Number(item.zIndex);
    //     item.fontSize = Number(item.fontSize);
    //     return item;
    //   });
    //   let params = {
    //     id: "",
    //     certTemplateId: this.dynamicValidateForm.id,
    //     name: this.dynamicValidateForm.certName,
    //     visitUrl: window.g.checkCertify,
    //     sysUserUseIds: comid,
    //     sysUserUseAuthIds: comauthid,
    //     dataContent: JSON.stringify({
    //       data: {
    //         templateWidth: Number(this.templateForm.width),
    //         templateHeight: Number(this.templateForm.height),
    //         content: rectsArr,
    //         backgroundImg: this.bgImg[0],
    //         backgroundColor: this.templateForm.bgColor
    //       },
    //       code: 200,
    //       msg: "json数据"
    //     })
    //   };

    //   if (type == "save") {
    //     params.id = this.preCert.id;
    //     params.saveOrCancel = true;
    //   }
    //   if (type == "cancel") {
    //     params.id = this.preCert.id;
    //     params.saveOrCancel = false;
    //   }
    //   //  返回id
    //   let result;
    //   certiSave(params).then(async response => {
    //     if (type == "isPrelook") {
    //       this.preCert = response;
    //       this.showPreCert = true;
    //       return;
    //     }
    //     let noce = await this.getNoce();

    //     let versionParams = {
    //       userName: response.key,
    //       type: 3 //溯源-管理员上链
    //     };
    //     //获取version
    //     let version = await this.getVersion(4, response.key);
    //     //console.log(version,'version')
    //     let jwt = await this.messageSign(4, response.key);
    //     //console.log('jwt___',jwt);
    //     // let result = 0

    //     let valueInfo = Object.assign({}, JSON.parse(response.json));
    //     let lolJwt = await getJwtTokenConsortium();
    //     let sginPrams = this.tranSgin(
    //       4,
    //       response.key,
    //       valueInfo,
    //       version,
    //       jwt,
    //       noce,
    //       lolJwt
    //     );
    //     let params = {
    //       txSignData: sginPrams
    //     };

    //     let result = await certUploadTx(params);
    //     this.$parent.getUserInfo();
    //     this.$message({
    //       message: "正在签名上链，请等待",
    //       type: "success",
    //       duration: 1000,
    //       onClose: () => {
    //         this.$router.push({ path: "certificateManagement" });
    //       }
    //     });

    //     return;
    //   });
    //   e.preventDefault();
    //   e.stopPropagation();
    // },
    handleSelect(item, field) {
      this.$refs.dynamicValidateForm.validateField(field);
    },
  },
  beforeDestroy: function () {
    this.pages = { pageindex: {}, page1: {}, page2: {}, page3: {}, page4: {} };
    this.tabs = [
      { name: "页面1", icon: [] },
      { name: "页面2", icon: [] },
      { name: "页面3", icon: [] },
      { name: "页面4", icon: [] },
    ];
  },
};
</script>
<style lang="scss" scoped>
@import "./batchIssue";
@import "~assets/css/mixin";
</style>
<style>
.previewCertDialog {
}
.box_ {
  display: flex;
  justify-content: start;
  flex-direction: row;
}
.box_ > div {
  padding: 0px 1rem;
  border: 1px solid #dedede;
  border-radius: 0.2rem;
  min-width: 5rem;
  text-align: center;
  line-height: 2rem;
  margin-right: 0.5rem;
  position: relative;
}
.box_ .box_close {
  position: absolute;
  right: 0px;
  top: 0px;
  color: #f76a0d;
  display: none;
  cursor: pointer;
}

.box_ > div:hover {
  background-color: cornsilk;
}
.box_ > div:hover .box_close {
  display: block;
}
#batchIssue .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
#batchIssue .el-scrollbar__thumb {
  background-color: #000;
}
#batchIssue .el-button--small {
  width: 5rem;
  height: 2rem;
  padding: 0;
  border-radius: 0.2rem;
  text-align: center;
  line-height: 2rem;
  font-size: 0.7rem;
}
#batchIssue .el-upload-list__item-name {
  display: none;
}
</style>
