<template>
  <div id="checkCertify">
    <div class="changeLange" @click="changeLunageaTwo">{{ $t("locale") }}</div>
    <div id="canvas" style="width: 100%">
      <div style="text-align: center; margin-top: 0.1rem" class="checkCert">
        <img v-if="certiStatus == 1" src="../../assets/img/check.png" alt="" />
        <img
          v-if="certiStatus == 2"
          src="../../assets/img/checkWaring.png"
          alt=""
        />
        <img
          v-if="certiStatus == 4"
          src="../../assets/img/checkError.png"
          alt=""
        />
        <div
          v-if="certiStatus == 1"
          style="color: #67c23a; font-size: 0.17rem; margin-top: 0.15rem"
        >
          {{ $t("h5.checkYes") }} <br />
          {{ $t("h5.checkYes2") }}
        </div>
        <div
          v-if="certiStatus == 2"
          style="color: #fbaf1e; font-size: 0.17rem; margin-top: 0.15rem"
        >
          {{ $t("h5.checkNo") }} <br />{{ $t("h5.checkNo2") }}
        </div>
        <!-- <div v-if="certiStatus==3" style="color:#F56C6C;font-size:0.4rem">证书验签失败，无法获取数据</div> -->
        <div
          v-if="certiStatus == 4"
          style="color: #f56c6c; font-size: 0.17rem; margin-top: 0.15rem"
        >
          {{ $t("h5.checkNo") }}<br />{{ $t("h5.checkNo3") }}
        </div>
      </div>

      <div v-if="certiStatus == 1" class="img">
        <img id="certFileNoQrCode" :src="certificateImage" preview="0" />
      </div>
      <div v-if="certiStatus == 1" class="chainInfoOut">
        <div class="title">{{ $t("h5.blickInfo") }}</div>
        <div class="border"></div>
        <!-- <div class="main">
            <el-row class="row">
              <el-col :span="8"><div class="grid-content bg-purple">区块高度：</div></el-col>
              <el-col :span="16"><div class="grid-content bg-purple-light">{{info.blockNumber | to10}}</div></el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="8"><div class="grid-content bg-purple">交易哈希：</div></el-col>
              <el-col :span="16"><div class="grid-content bg-purple-light">{{info.hash}}</div></el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="8"><div class="grid-content bg-purple">区块哈希：</div></el-col>
              <el-col :span="16"><div class="grid-content bg-purple-light">{{info.blockHash}}</div></el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="8"><div class="grid-content bg-purple">发送方：</div></el-col>
              <el-col :span="16"><div class="grid-content bg-purple-light">{{info.from}}</div></el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="8"><div class="grid-content bg-purple">接收方：</div></el-col>
              <el-col :span="16"><div class="grid-content bg-purple-light">{{info.to}}</div></el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="8"><div class="grid-content bg-purple">时间：</div></el-col>
              <el-col :span="16"><div class="grid-content bg-purple-light">{{info.cTime | toBlockTime}}</div></el-col>
            </el-row>
          </div> -->
        <div class="main">
          <!-- <el-row class="row">
              <el-col :span="8"><div class="grid-content bg-purple">区块高度：</div></el-col>
              <el-col :span="16"><div class="grid-content bg-purple-light">{{info.blockNumber | to10}}</div></el-col>
            </el-row> -->
          <div class="row">
            <div class="left left2">{{ $t("h5.height") }}：</div>
            <div class="right right2">{{ info.blockNumber | to10 }}</div>
          </div>
          <div class="row">
            <div class="left">{{ $t("h5.trHas") }}：</div>
            <div class="right">{{ info.hash }}</div>
          </div>
          <div class="row">
            <div class="left">{{ $t("h5.blcikHash") }}：</div>
            <div class="right">{{ info.blockHash }}</div>
          </div>
          <div class="row">
            <div class="left">{{ $t("h5.certificateHash") }}：</div>
            <div class="right">{{ info.certHash }}</div>
          </div>
          <div class="row">
            <div class="left">{{ $t("h5.from") }}：</div>
            <div class="right">{{ info.from }}</div>
          </div>
          <div class="row">
            <div class="left">{{ $t("h5.to") }}：</div>
            <div class="right">{{ info.to }}</div>
          </div>
          <div class="row">
            <div class="left left2">{{ $t("h5.time") }}：</div>
            <div class="right right2">{{ info.cTime | toBlockTime }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { templateList, templateFindTPageByTId, templateUpdateStatus, templateDeleteById, templateAddOrUpdate, templateAddPermission, templateSavePage, companyList, companyFindByName } from 'src/api/template';
import { checkCertify, chainInfo } from "src/api/checkCertify";
import pinchZoomJs from "pinch-zoom-js";
// import VueDragResize from 'src/components/vue-drag-resize/vue-drag-resize.vue';
import VueDragResize from "src/components/vue-drag-resize/vue-drag-resize.vue";
import html2canvas from "html2canvas";
import temText from "./components/temText";
import presetText from "./components/presetText";

export default {
  components: {
    temText,
    presetText,

    VueDragResize,
  },
  data() {
    return {
      aa: /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent),

      certificateImage: "", //require('src/assets/img/certificate.png'),
      // loading: false,

      certiStatus: "",
      info: {},
      // phoneboxHieght: 670,
      // dynamicValidateForm: {
      //   tmpname: '',
      //   certName: '',
      //   id: ''
      // },
      // loading: false,
      parentH: 1800,
      zhTitle: "通侧链证书防伪",
      enTitle: "TIC Certificate anti-counterfeiting",
    };
  },
  created() {
    if (this.$route.query.token || this.$route.query.t) {
      checkCertify({
        t: !this.$route.query.t ? "" : this.$route.query.t,
        token: !this.$route.query.token ? "" : this.$route.query.token,
      })
        .then((result) => {
          if (!!result.code) {
            this.certiStatus = result.code == 10050 ? 4 : 2;
            return;
          }
          this.certiStatus = result.status;
          this.certificateImage = result.certFileNoQrCode;
          this.getInfo(result.txHash);
          setTimeout(() => {
            this.$previewRefresh();
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },

  computed: {
    rects() {
      //  this.$nextTick(()=>{
      //   this.resetParentHeight();
      //  })
      return this.$store.state.dragLesize.rects;
    },
  },
  mounted() {
    //  document.getElementsByTagName("title")[0].innerHtml = '通测链证书防伪';
    //  console.log(document.getElementsByTagName("title")[0].innerHtml);
  },
  methods: {
    changeLunageaTwo() {
      if (this.$i18n.locale == "en") {
        this.$i18n.locale = "zh";
        document.title = this.zhTitle;
      } else {
        this.$i18n.locale = "en";
        document.title = this.enTitle;
      }
      localStorage.setItem("lunage", this.$i18n.locale);
    },
    async getInfo(hash) {
      let params = {
        txHash: hash,
      };
      let result = await chainInfo(params);
      this.info = result;
    },
    resizeDrag() {
      let el = document.getElementById("canvas");

      this.$nextTick(() => {
        new pinchZoomJs(el, {
          // tapZoomFactor: 1,
          // zoomOutFactor: 0.3,
          // maxZoom: 1.5,
          // minZoom: 1,
          // verticalPadding: -100,
          // horizontalPadding: -100,
          // setOffsetsOnce: true
        });
      });
    },
    getBase64Image(img) {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
      var dataURL = canvas.toDataURL("image/" + ext);
      return dataURL;
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

    resetParentHeight() {
      // console.log('resetParentHeight');

      var arr = this.$store.state.dragLesize.rects;
      var max =
        arr.length > 0
          ? arr.reduce(function (a, b) {
              let amax = a.height + a.top;
              let bmax = b.height + b.top;
              return bmax > amax ? b : a;
            })
          : { height: 667, top: 0 };

      if (max.height + max.top < 667) {
        this.phoneboxHieght = 670;
      } else {
        this.phoneboxHieght =
          max.height + max.top == 1800 ? 1800 : max.height + max.top + 30;
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
  },
};
</script>
<style lang="scss" scoped>
@import "./checkCertify";
@import "~assets/css/mixin";
</style>
<style>
html,
body {
  min-width: 0rem !important;
}

.pinch-zoom-container #canvas {
  /* transform:  translate(0, 0) !important;  */
}
</style>