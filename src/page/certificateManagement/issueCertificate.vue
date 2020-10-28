<template>
  <div id="templateAdd">
    <div>
      <el-form
        :model="dynamicValidateForm"
        label-position="left"
        ref="dynamicValidateForm"
        label-width="100px"
        class="demo-dynamic"
      >
        <el-form-item label="图片名称">
          {{ dynamicValidateForm.tmpname }}
        </el-form-item>
        <el-form-item label="证书名称">
          <el-input
            v-model="dynamicValidateForm.certName"
            placeholder="请输入证书名称，最多30字"
            maxlength="30"
          ></el-input>
        </el-form-item>
        <el-form-item label="证书信息">
          <el-button plain @click="makeInfo">编辑上链信息</el-button>
        </el-form-item>

        <el-form-item :label="'设置授权'">
          <el-button plain @click="addOprate(1)">设置授权</el-button>
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
        </el-form-item>
      </el-form>
    </div>

    <!-- 预览显示 -->
    <makeCanvas :muban="muban" ref="can" />

    <!-- <div class="templatebox">
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
                @keyup="setPlaceHolder"
                :item_="rect"
                v-model="rect.text"
              ></temText>
              <qrcode v-if="rect.type == 'qrcode'"></qrcode>
              <presetImg
                v-if="rect.type == 'imgComponent'"
                :comontTmp="rect"
                @setPresetImg="setPresetImg"
              ></presetImg>

              <tmpImg v-if="rect.type == 'presetImg'" :item_="rect"></tmpImg>
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
     -->
    <div
      id="submit"
      class="submit"
      style="
        margin-top: 30px;
        text-align: center;
        width: 100%;
        margin-bottom: 30px;
      "
    >
      <el-button
        :style="'width:11rem'"
        data="noactive"
        @click="callbackCertificate($event)"
        >退出</el-button
      >
      <el-button
        :style="'width:11rem'"
        type="primary"
        data="noactive"
        @click="submitForm($event, 'dynamicValidateForm', 'isPrelook')"
        >预览并颁发</el-button
      >
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
    <el-dialog
      :close-on-click-modal="false"
      @close="preCertClose"
      class="diloag diloagTwo previewCertDialog"
      :title="'证书预览'"
      :visible.sync="showPreCert"
      width="32.75rem"
    >
      <div
        style="
          width: 29.75rem;
          height: 850px;
          text-align: center;
          height: 42.1rem;
        "
      >
        <el-image
          style="width: 29.75rem; height: 42.1rem"
          :src="preCert.certFile"
          :fit="'contain'"
          :preview-src-list="[preCert.certFile]"
        >
        </el-image>
        <!-- <img :src="preCert.certFile" alt="" :style="{width:templateForm.width+'px',height:templateForm.height+'px'}"> -->
      </div>

      <div
        slot="footer"
        class="dilaogBtn"
        style="text-align: center; margin-bottom: 20px"
      >
        <el-button @click="showPreCert = false">取消</el-button>
        <el-button
          @click="submitForm($event, 'dynamicValidateForm', 'save')"
          style="width: auto"
          type="primary"
          >颁发</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  useCertTemplateList,
  getSysUserAuthList,
  addOrUpdateUseList,
  screenDepartmentByIds,
  setCertAuth,
  certUseList,
} from "src/api/template";
import { getJwtTokenConsortium } from "api/upChain.js";
import { certiSave, certUploadTx } from "src/api/certificate";
import VueDragResize from "src/components/vue-drag-resize/vue-drag-resize.vue";
import qrcode from "./components/qrcode";
import tmpImg from "./components/tmpImg";
import temText from "./components/temText";
import presetText from "./components/presetText";
import presetImg from "./components/presetImg";
import signature from "../../mixins/signatureMixin.js";
import makeCanvas from "./makeCanvas.vue";
import { image } from "html2canvas/dist/types/css/types/image";

export default {
  mixins: [signature],
  components: {
    tmpImg,
    presetImg,
    temText,
    presetText,
    qrcode,
    VueDragResize,
    makeCanvas,
  },
  data() {
    return {
      qrcodeSign: "",
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
      muban: {}, // 用来显示canvas
    };
  },
  created() {
    // 通过选择模板
    if (this.$route.query.type == 1) {
      // 获取路由传递的参数
      let content = JSON.parse(this.$route.query.data[0]);

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
          // 获取预览证书的数据
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
      });
    } else {
      // 通过选择图片
      let content = this.$route.query.data[0];
      console.log(content);
      if (/image/.test(content.type)) {
        // let img = new Image();
        // img.src = new Blob(content.data);
        // img.onload = (e) => {
        //   console.log(e);
        // };
      }

      // 预览
      if (/pdf/.test(content.type)) {
        let pdfPath = URL.createObjectURL(content);
        let pdfjsLib = require("../../../static/js/pdf/pdf");
        pdfjsLib.PDFJS.workerSrc = "../../../static/js/pdf/pdf.worker.js";
        let loadingTask = pdfjsLib.getDocument(pdfPath);

        loadingTask.promise.then(function (pdfDocument) {
          let pageNume = pdfDocument.numPages,
            promiseArr = []; // 记录pdf一共有几页
          for (let i = 0; i < pageNume; i++) {
            let pro = pdfDocument.getPage(i + 1);
            promiseArr.push(pro);
          }

          Promise.all(promiseArr).then((cavs) => {
            cavs.forEach((pdfPage) => {
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
                let kk = canvas.toDataURL("image/png", 1);
                console.log(kk); // 获取到的每一张pdf的base64码
              });
            });
          });
        });
      }
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
      this.saveActive = this.$store.getters["getActive"];
      return this.$store.state.dragLesize.rects;
    },
  },

  mounted() {
    //   this.domwidth =
    // document.getElementsByClassName("templatebox")[0].offsetWidth - 550;
  },
  methods: {
    // 编辑上链信息
    makeInfo() {},
    // 生成最后要传到服务器的数据
    async makePostData() {
      let qrcodeData = this.muban.children.filter(
        (t) => t.tagName === "qrcode"
      );
      let end = await this.$refs.can.returnData("99999999999999999999");
      // end 为最后的base64码
      console.log(end);
    },
    // 为画图组件进行数据的整理
    makeMunban(data) {
      this.muban = {
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
        this.muban.children.push(obj);
      });
    },

    //////////////////////////////////////////////////////////////
    preCertClose(e) {
      this.submitForm(e, "dynamicValidateForm", "cancel");
    },
    //文本组件设置placeholder
    setPlaceHolder(value, item) {
      //  shawn
      // let sha256String = sha256(value);
      //编辑
      let obj = Object.assign({}, item, { text: value });
      console.log("--------------", obj);

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
          console.log(
            derp,
            derp.filter((item) => result.indexOf(item.id) >= 0)
          );
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
    // 设置授权获取组织信息
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
      let result = await getSysUserAuthList(params);
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
      fn([].concat(...result.sysUsers, ...result.departments));
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
    handleRemove(file, fileList) {
      console.log(file, fileList, "handleRemove");
    },
    handlePreview(file) {
      console.log(file, "handlePreview");
    },
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
      console.log("dragLesize/setActiveModuleStatus");
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
    submitForm(e, formName, type) {
      // type :isPrelook 预览并颁发， save :颁发 cance ：取消
      if (this.dynamicValidateForm.certName.length == 0) {
        this.$message({ message: "请添加证书名称", type: "error" });
        return false;
      }
      let hasNoEdit = this.rects.filter((item) => {
        return (
          (item.type == "textComponent" || item.type == "imgComponent") &&
          item.text == ""
        );
      });
      if (hasNoEdit.length > 0) {
        this.$message({
          message: "您有未输入的内容，请完善证书内容再颁发",
          type: "error",
        });
        return false;
      }
      // if(this.companyAuthList.length<1 && this.companyIds<1){
      //   this.$message({ message: '请设置授权', type: 'error' })
      //   return false;
      // }
      let comid = this.companyIds.map((item) => {
        return item.id;
      });
      let comauthid = this.companyAuthIds.map((item) => {
        return item.id;
      });
      var that = this;
      var content = [],
        text_ = [],
        presetText_ = [];

      // 将所有宽高，top ,left ,zindex 转为数字
      let rectsArr = this.rects.map((item) => {
        item.top = Number(item.top);
        item.left = Number(item.left);
        item.width = Number(item.width);
        item.height = Number(item.height);
        item.zIndex = Number(item.zIndex);
        item.fontSize = Number(item.fontSize);
        return item;
      });
      let params = {
        id: "",
        certTemplateId: this.dynamicValidateForm.id,
        name: this.dynamicValidateForm.certName,
        visitUrl: window.g.checkCertify,
        sysUserUseIds: comid,
        sysUserUseAuthIds: comauthid,
        dataContent: JSON.stringify({
          data: {
            templateWidth: Number(this.templateForm.width),
            templateHeight: Number(this.templateForm.height),
            content: rectsArr,
            backgroundImg: this.bgImg[0],
            backgroundColor: this.templateForm.bgColor,
          },
          code: 200,
          msg: "json数据",
        }),
      };

      if (type == "save") {
        params.id = this.preCert.id;
        params.saveOrCancel = true;
      }
      if (type == "cancel") {
        params.id = this.preCert.id;
        params.saveOrCancel = false;
      }
      if (type == "save") {
        params.qrCodeContent = this.qrcodeSign;
      }
      //  返回id
      let result;
      certiSave(params).then(async (response) => {
        if (type == "isPrelook") {
          //预览并颁发
          let cordSign = response.tokenJson;
          let privateKey = this.Decrypt();
          this.qrcodeSign =
            response.tokenJson + "." + this.cordSign(cordSign, privateKey);
        } else {
          //颁发
          this.qrcodeSign = "";
        }

        if (type == "isPrelook") {
          this.preCert = response;
          this.showPreCert = true;
          return;
        }

        let noce = await this.getNoce();

        // let versionParams={
        //   userName:response.key,
        //   type:3//溯源-管理员上链
        // };
        //获取version
        let version = await this.getVersion(4, response.key);
        //console.log(version,'version')
        let jwt = await this.messageSign(4, response.key);
        //console.log('jwt___',jwt);
        // let result = 0

        let valueInfo = Object.assign({}, JSON.parse(response.json));
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
        this.$parent.getUserInfo();
        this.$message({
          message: "正在签名上链，请等待",
          type: "success",
          duration: 1000,
          onClose: () => {
            this.$router.push({ path: "certificateManagement" });
          },
        });

        return;
      });
      e.preventDefault();
      e.stopPropagation();
    },
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
@import "./issueCertificate";
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
  padding: 0px 20px;
  border: 1px solid #dedede;
  border-radius: 10%;
  margin: 10px;
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
.uploadtab .el-upload--picture-card {
  width: 24px !important;
  height: 24px !important;
  background: url(~assets/img/defaultImg.png);
  background-size: 100%;
}

.uploadtab .el-upload--picture-card i {
  font-size: 10px;
}

.filler {
  width: 100%;
  height: 100%;
  display: inline-block;
  border: 1px dashed #dedede;
  position: relative;
  /* background-color: #fff; */
}

.moduletitle .el-input__inner {
  border-radius: 0px;
  border: 0px;
  border-bottom: 1px solid #dcdfe6;
}

.labelcolor_,
.labelcolor_ .el-color-picker__trigger {
  height: 2rem;
  width: 2rem;
}

.el-select {
  height: 2rem;
  line-height: 2rem;
}

.uploadClass {
  height: 24px;
}

.uploadClass .el-upload-list--picture-card .el-upload-list__item {
  width: 24px;
  height: 24px;
  margin: 0 !important;
}

.uploadClass .el-upload-list--picture-card .el-progress {
  display: none;
}

.uploadClass
  .el-upload-list__item.is-success
  .el-upload-list__item-status-label,
.uploadClass .el-upload-list--picture-card .el-upload-list__item-actions span {
  display: none !important;
}

.deleteCom {
  cursor: pointer;
  background: url("~assets/img/deleteOne.png") no-repeat;
  height: 2rem;
  width: 1.95rem;
  background-size: 100%;
}
</style>