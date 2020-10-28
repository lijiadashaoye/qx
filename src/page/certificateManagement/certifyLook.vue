<template>
  <div id="templateAdd_look" style="textAlign:center">
    <div id="productDetail">
      <div class="detailName">区块链信息</div>
      <el-row class="elrow">
        <el-col :span="2">
          <div class="grid-content bg-purple">
            区块高度
          </div>
        </el-col>
        <el-col :span="20">
          <div class="grid-content bg-purple-light">
            {{ blockDetail.blockNumber }}
          </div>
        </el-col>
      </el-row>
      <el-row class="elrow">
        <el-col :span="2">
          <div class="grid-content bg-purple">
            区块哈希
          </div>
        </el-col>
        <el-col :span="20">
          <div class="grid-content bg-purple-light">
            {{ blockDetail.blockHash }}
          </div>
        </el-col>
      </el-row>
      <el-row class="elrow">
        <el-col :span="2">
          <div class="grid-content bg-purple">
            交易哈希
          </div>
        </el-col>
        <el-col :span="20">
          <div class="grid-content bg-purple-light">
            {{ blockDetail.txHash }}
          </div>
        </el-col>
      </el-row>
      <el-row class="elrow">
        <el-col :span="2">
          <div class="grid-content bg-purple">
            证书哈希
          </div>
        </el-col>
        <el-col :span="20">
          <div class="grid-content bg-purple-light">
            {{ blockDetail.certHash }}
          </div>
        </el-col>
      </el-row>
      <el-row class="elrow">
        <el-col :span="2">
          <div class="grid-content bg-purple">
            发送方
          </div>
        </el-col>
        <el-col :span="20">
          <div class="grid-content bg-purple-light">
            {{ blockDetail.from }}
          </div>
        </el-col>
      </el-row>
      <el-row class="elrow">
        <el-col :span="2">
          <div class="grid-content bg-purple">
            接收方
          </div>
        </el-col>
        <el-col :span="20">
          <div class="grid-content bg-purple-light">
            {{ blockDetail.to }}
          </div>
        </el-col>
      </el-row>
      <el-row class="elrow">
        <el-col :span="2">
          <div class="grid-content bg-purple">
            时间
          </div>
        </el-col>
        <el-col :span="20">
          <div class="grid-content bg-purple-light">
            {{ blockDetail.timestamp | toBlockTime }}
          </div>
        </el-col>
      </el-row>
      <el-row class="elrow">
        <el-col :span="2">
          <div class="grid-content bg-purple">
            上链状态
          </div>
        </el-col>
        <el-col :span="20">
          <div class="grid-content bg-purple-light">
            {{ blockDetail.txStatus | txStatusString }}
          </div>
        </el-col>
      </el-row>
      <div class="border"></div>
    </div>
    <div class="templatebox">
      <!-- :style="{width:width?width+'px':570+'px',height:height?height+'px':804+'px'}" -->
      <div id="phone" :style="{ width: domwidth + 'px' }">
        <!-- <img :src="imgsrc" alt="" :width="width+'px'" :height='height+"px"'> -->
        <el-image
          style="width: 595px; height: 842px"
          :src="imgsrc"
          :fit="'contain'"
          :preview-src-list="[imgsrc]"
        >
        </el-image>
      </div>
    </div>
    <div
      id="submit"
      class="submit"
      style="margin-top:30px;text-align: center;width:100%;"
    >
      <el-button
        v-if="$route.query.user.username == $parent.userinfo.username"
        :disabled="!logoff"
        :style="'width:11rem'"
        data="noactive"
        @click="deleteTemple"
        >注销</el-button
      >
      <el-button
        :style="'width:11rem'"
        type="primary"
        data="noactive"
        @click="exportCertify"
        >保存本地</el-button
      >
    </div>
  </div>
</template>
<script>
import { certList, certRevoke } from "src/api/certificate";
import { getJSON } from "../../api/getjson";
import { getBlockInfo } from "api/account.js";
export default {
  components: {},
  data() {
    return {
      domwidth: 595,
      blockDetail: {},
      width: 0,
      height: 0,
      dynamicValidateForm: {
        id: "",

        certFile: "",
        logoff: false
      },
      imgsrc: ""
    };
  },
  created() {
    let content = this.$route.query;

    if (!content.id || !content.certFile) {
      this.$router.push({ path: "certificateManagement" });
    }
    this.logoff = content.status == 1 ? true : false;
    this.dynamicValidateForm = {
      certFile: content.certFile,
      id: content.id
    };
    let that = this;
    let url = content.templateContent
      .split("/")
      .slice(3)
      .join("/");

    getJSON(url, {}).then(response => {
      let data = response;
      if (data.templateWidth) {
        that.width = data.templateWidth;
      }
      if (data.templateHeight) {
        that.height = data.templateHeight;
      }
    });
    this.imgsrc = content.certFile;
    this.getBlockInfo_();
  },

  mounted() {
    this.domwidth = document.getElementsByClassName(
      "templatebox"
    )[0].offsetWidth;
  },
  methods: {
    async getBlockInfo_() {
      if (
        this.$route.query.txStatus == 2 ||
        this.$route.query.txStatus == 1 ||
        !this.$route.query.txStatus
      ) {
        this.blockDetail = {
          blockNumber: "--",
          blockHash: "--",
          certHash: "--",
          txHash: "--",
          from: "--",
          to: "--",
          timestamp: "--",
          txStatus: this.$route.query.txStatus
        };
      } else {
        let result = await getBlockInfo({ txHash: this.$route.query.txHash });
        this.blockDetail = result;
        this.blockDetail.txHash = this.$route.query.txHash;
        this.blockDetail.txStatus = this.$route.query.txStatus;

        this.blockDetail.certHash = this.$route.query.certHash;
      }
    },
    exportCertify() {
      if (!this.imgsrc) {
        this.$message("没有证书图片");
        return false;
      }
      var filename = !!this.$route.query.name ? this.$route.query.name : "";
      var FileSaver = require("file-saver"); //require('../../utils/filesave');
      var url = "";
      const xhr = new XMLHttpRequest();
      xhr.open("GET", this.$route.query.certFile, true);
      xhr.responseType = "blob";
      xhr.onload = () => {
        if (xhr.status === 200) {
          //将图片文件用浏览器中下载

          FileSaver.saveAs(xhr.response, filename + ".png");
        }
      };

      xhr.send();

      // var img = new Image()
      // var filename = !!this.$route.query.name ? this.$route.query.name : '123';
      //   debugger
      // img.onload = function () {
      //   var canvas = document.createElement('canvas')
      //   canvas.width = img.width
      //   canvas.height = img.height
      //   var ctx = canvas.getContext('2d')

      //   // 将img中的内容画到画布上
      //   ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      //   // 将画布内容转换为Blob
      //   canvas.toBlob((blob) => {
      //     // blob转为同源url
      //     var blobUrl = window.URL.createObjectURL(blob)
      //     // 创建a链接
      //     var a = document.createElement('a')
      //     a.href = blobUrl
      //     a.download = filename
      //     // 触发a链接点击事件，浏览器开始下载文件
      //     a.click()
      //   })
      // }
      // img.src = this.imgsrc.replace('http://oss.trace.pdx.ltd/img', 'certimg')
      // // 必须设置，否则canvas中的内容无法转换为blob
      // img.setAttribute('crossOrigin', 'Anonymous')
      // //  window.open( this.imgsrc);
    },
    deleteTemple() {
      let params = {
        id: this.dynamicValidateForm.id
      };
      let img = require("src/assets/img/errorTip.png");
      this.$confirm(
        '<div style="width:100%;text-align:center;"><img style="width:4.5rem;hieght:4.4rem;" src="' +
          img +
          '"/></div><div style="width:100%;text-align:center;font-size:0.8rem;">是否确认注销证书？</div>',
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true,
          dangerouslyUseHTMLString: true
          // type: 'warning'
        }
      )
        .then(() => {
          certRevoke(params).then(result => {
            console.log(this.logoff);

            // this.logoff=true
            this.$message({
              message: "注销成功！",
              type: "success",
              duration: 1000,
              onClose: () => {
                this.$router.push({ path: "certificateManagement" });
              }
            });
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./issueCertificate";
@import "~assets/css/mixin";
</style>
<style>
#phone::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: #f5f5f5;
}

/*定义滚动条轨道 内阴影+圆角*/
#phone::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 255, 255, 0);
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.5);
}

/*定义滑块 内阴影+圆角*/
#phone::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: rgba(255, 255, 255, 0.1);
}

#phone > img {
  /* width:100%; */
}
#templateAdd_look .detailName {
  text-align: left;
  font-size: 1.1rem;
  color: #363636;
  margin-bottom: 1rem;
}
#templateAdd_look .elrow {
  margin-bottom: 1.15rem;
  font-size: 0.8rem;
  word-break: break-all;
}
#templateAdd_look .elrow .bg-purple {
  text-align: left;
  color: #848484;
}
#templateAdd_look .elrow .bg-purple-light {
  color: #363636;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -ms-flex-direction: row;
  flex-direction: row;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}
#templateAdd_look .color {
  color: #f76a0d;
  margin-left: rempx(15);
  cursor: pointer;
}
#templateAdd_look .border {
  width: 100%;
  height: 1px;
  background-color: #ecf0f1;
  margin-top: 1.5rem;
  margin-bottom: 1.35rem;
}
</style>
