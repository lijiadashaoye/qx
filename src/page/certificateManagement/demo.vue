<template>
  <div id="templateAdd">
    <div class="templatebox">
      <div
        id="phone"
        data="noactive"
        :style="{
          width: Number(jsonData.data.templateWidth) + 10 + 'px',
          height: '842px',
          overflow: 'auto',
          display: 'flex',
          position: 'relative'
        }"
      >
        <!-- width: '100%', -->
        <!-- 首页 -->
        <div
          class="scroll_phone"
          :style="{
            width: Number(jsonData.data.templateWidth) + 'px',
            height: Number(jsonData.data.templateHeight) + 'px'
          }"
        >
          <div
            class="phone-set-box"
            :style="{
              width: Number(jsonData.data.templateWidth) + 'px',
              height: Number(jsonData.data.templateHeight) + 'px',
              backgroundImage: 'url(' + jsonData.data.backgroundImg + ')',
              backgroundSize: '100% 100%',
              backgroundPosition: '50% 50%',
              backgroundColor: jsonData.data.backgroundColor,
              backgroundRepeat: ' no-repeat'
            }"
          >
            <div
              class="box_phone"
              :style="{
                border: '1px solid #dedede',
                height: jsonData.data.templateHeight + 'px'
              }"
            >
              <!-- 多选组件虚拟框 -->

              <VueDragResize
                v-if="jsonData.data.content.length > 0"
                v-for="(rect, index) in jsonData.data.content"
                :key="rect.key"
                :key_="rect.key"
                :w="rect.width"
                :h="rect.height"
                :x="rect.left"
                :y="rect.top"
                :parentKey_mo="rect.key"
                :parentW="parseInt(jsonData.data.templateWidth)"
                :parentH="parseInt(jsonData.data.templateHeight)"
                :axis="rect.axis"
                :isActive="rect.active"
                :minw="rect.minw"
                :minh="rect.minh"
                :isDraggable="true"
                :isResizable="rect.resizable"
                :parentLimitation="rect.parentLim"
                :snapToGrid="rect.snapToGrid"
                :aspectRatio="rect.type == 'qrcode' ? true : false"
                :z="rect.zIndex"
              >
                <div
                  class="filler"
                  :style="{
                    backgroundColor: rect.color,
                    borderColor: rect.active ? '#35c55b' : '#b0afaf'
                  }"
                >
                  <qrcode v-if="rect.type == 'qrcode'"></qrcode>
                  <presetImg
                    v-if="rect.type == 'presetImg'"
                    :comontTmp="rect"
                  ></presetImg>

                  <!-- <temText v-if="rect.type=='textComponent'"></temText> -->
                  <tmpImg v-if="rect.type == 'imgComponent'"></tmpImg>
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
import { algorithm, throttle } from "utils/comFunc";
import {
  templateList,
  templateFindTPageByTId,
  templateUpdateStatus,
  templateDeleteById,
  templateAddOrUpdate,
  templateAddPermission,
  templateSavePage,
  companyList,
  companyFindByName,
  getSysUserAuthList,
  addOrUpdateUseList,
  screenDepartmentByIds
} from "src/api/template";

import VueDragResize from "src/components/vue-drag-resize/vue-drag-resize.vue";
import temText from "./components/temText";
import presetText from "./components/presetText";
import presetImg from "./components/presetImg";
import { isSettingDisabled, preStep } from "utils/templateControler";
import sha256 from "sha256";
import qrcode from "./components/qrcode";
import tmpImg from "./components/tmpImg";

export default {
  components: {
    presetImg,
    temText,
    presetText,
    VueDragResize,
    qrcode,
    tmpImg
  },
  data() {
    return {
      jsonData: {
        data: {
          templateWidth: 595,
          templateHeight: 842,
          content: [
            {
              key: "presetText_1_1602382203576",
              type: "presetText",
              id: 1,
              fontColor: "#848484",
              fontSize: 18,
              text: "demo",
              width: 135,
              height: 24,
              top: 24,
              left: 43,
              fontFamily: "Arial",
              fontWeight: false,
              backgroundColor: "rgba(255,255,255,0)",
              backgroundImg: "",
              draggable: true,
              resizable: true,
              minw: 10,
              minh: 10,
              axis: "both",
              parentLim: true,
              snapToGrid: true,
              aspectRatio: false,
              zIndex: 0,
              textAlign: "left",
              verticalAlign: "middle",
              author: "superadmin",
              cTime: 1602382221826,
              sha256:
                "2a97516c354b68848cdbd8f54a226a0a55b21ed138e207ad6c5cbb9c00aa5aea",
              mediaImg: "",
              active: false
            },
            {
              key: "textComponent_2_1602382209125",
              type: "textComponent",
              id: 2,
              fontColor: "#848484",
              fontSize: 18,
              text: "",
              width: 112,
              height: 24,
              top: 61,
              left: 39,
              fontFamily: "Arial",
              fontWeight: false,
              backgroundColor: "rgba(255,255,255,0)",
              backgroundImg: "",
              draggable: true,
              resizable: true,
              minw: 10,
              minh: 10,
              axis: "both",
              parentLim: true,
              snapToGrid: true,
              aspectRatio: false,
              zIndex: 1,
              textAlign: "left",
              verticalAlign: "top",
              author: "superadmin",
              cTime: 1602382224244,
              sha256:
                "2a97516c354b68848cdbd8f54a226a0a55b21ed138e207ad6c5cbb9c00aa5aea",
              mediaImg: "",
              active: false,
              placeholder: "demo"
            },
            {
              key: "imgComponent_4_1602382212907",
              type: "imgComponent",
              id: 4,
              fontColor: "#848484",
              fontSize: 14,
              text: "",
              width: 355,
              height: 200,
              top: 94,
              left: 38,
              fontFamily: "Arial",
              fontWeight: false,
              backgroundColor: "rgba(255,255,255,0)",
              backgroundImg: "",
              draggable: true,
              resizable: true,
              minw: 10,
              minh: 10,
              axis: "both",
              parentLim: true,
              snapToGrid: true,
              aspectRatio: false,
              zIndex: 3,
              textAlign: "left",
              verticalAlign: "middle",
              author: "",
              cTime: "",
              sha256: "",
              mediaImg: "",
              active: false
            },
            {
              key: "presetImg_3_1602382212043",
              type: "presetImg",
              id: 3,
              fontColor: "#848484",
              fontSize: 14,
              text:
                "http://local.cert.pdx.ltd/pdxfile/group1/M00/00/00/CgAAyF-CacyACNthAAJf3Rs9Mb8820.jpg",
              width: 355,
              height: 200,
              top: 325,
              left: 44,
              fontFamily: "Arial",
              fontWeight: false,
              backgroundColor: "rgba(255,255,255,0)",
              backgroundImg: "",
              draggable: true,
              resizable: true,
              minw: 10,
              minh: 10,
              axis: "both",
              parentLim: true,
              snapToGrid: true,
              aspectRatio: false,
              zIndex: 2,
              textAlign: "left",
              verticalAlign: "middle",
              author: "superadmin",
              cTime: 1602382284275,
              sha256:
                "5e7165dec54aac15801a81a76cb784a352cbf493e464f049d4f35bd47f8dbb06",
              mediaImg: "",
              active: true
            },
            {
              key: "qrcode_0_1602382201450",
              type: "qrcode",
              id: 0,
              fontColor: "#848484",
              fontSize: 14,
              text: "",
              width: 71,
              height: 71,
              top: 771,
              left: 524,
              fontFamily: "Arial",
              fontWeight: false,
              backgroundColor: "rgba(255,255,255,0)",
              backgroundImg: "",
              draggable: true,
              resizable: true,
              minw: 71,
              minh: 71,
              axis: "both",
              parentLim: true,
              snapToGrid: true,
              aspectRatio: false,
              zIndex: 4,
              textAlign: "left",
              verticalAlign: "middle",
              author: "",
              cTime: "",
              sha256: "",
              mediaImg: "",
              active: false
            }
          ],
          backgroundColor: "rgba(246,246,246,1)",
          backgroundImg: ""
        },
        code: 200,
        msg: "json数据"
      },
      rects: []
      //红色参照线
    };
  },
  created() {},

  watch: {},
  computed: {},

  methods: {},
  beforeDestroy: function() {}
};
</script>
<style lang="scss" scoped>
@import "../templateManagement/templatAdd";
@import "~assets/css/mixin";
</style>
<style>
.itemCom .el-input--suffix .el-input__inner {
  padding-right: 15px;
  padding-left: 10px;
}
.filler_ {
  background: rgba(11, 204, 43, 0.1);
  border: 1px solid black;
}
/* 组件设置 */
/* x y w h */
.setAfter {
  display: inline-block;
  text-align: center;
  width: 0.8rem;
  line-height: 2rem;
  font-size: 0.7rem;
}
.preView .el-dialog__header,
.preView .el-dialog__body {
  padding-left: 20px !important;
  padding-right: 20px !important;
}
.preView .el-dialog__body {
  padding-bottom: 30px !important;
}
.preView .phone-set::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: rgba(0, 255, 255, 0);
}

.preView .phone-set:hover::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: rgba(255, 255, 255, 0);
}

/*定义滚动条轨道 内阴影+圆角*/
.preView .phone-set::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 255, 255, 0);
  border-radius: 10%;
  background-color: rgba(255, 255, 255, 0);
}

/*定义滚动条轨道 内阴影+圆角*/
.preView .phone-set::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 255, 255, 0);
  border-radius: 10%;
  background-color: rgba(255, 255, 255, 0);
}

/*定义滑块 内阴影+圆角*/
.preView .phone-set::-webkit-scrollbar-thumb {
  border-radius: 10%;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4);
  background-color: rgba(0, 0, 0, 0.4);
}
/* .phone-set-box:hover {
  padding: 0px 15px 0px 0px !important;
} */
/* 设置组件的颜色组件 */
.setColorM .el-color-picker__trigger {
  width: 100%;
  background-color: #fff;
  /* height: 2rem; */
  height: 40px;
}

.setColorM .el-color-picker__trigger .el-color-picker__color {
  width: 50%;
}

.setColorM .el-color-picker__trigger .el-color-picker__icon {
  width: 50%;
  color: #363636;
  left: 75%;
}

.setColorM .m-colorPicker .colorBtn {
  width: 100% !important;
  height: 100% !important;
}
#rose-layout .input_ .is-without-controls .el-input {
  width: 100%;
}
.navDialog .navDialog .el-button {
  padding: 0.6rem 1rem;
  font-size: 0.7rem;
}
#templateAdd .navDialog .el-input {
  width: 280px;
}
#templateAdd .itemCom .el-select,
#templateAdd .itemCom .el-input__inner {
  height: 40px !important;
  line-height: 40px !important;
}
#templateAdd .itemCom .el-input .el-input__icon {
  line-height: 40px;
}
#templateAdd #setComItem .el-select > .el-input {
  height: 40px !important;
}
#templateAdd #setComItem .fontOther .fontFamily_ .el-select {
  width: 150px;
}

#templateAdd .fontOther .fontWeight {
  height: 40px !important;
  width: 40px !important;
}
#templateAdd #setComItem .fontWeight .fontWeight_img {
  cursor: pointer;
  height: 40px;
  width: 40px;
  background: url("../../assets/img/fontweight_.png") no-repeat 100%/100%;
}
#templateAdd #setComItem .fontWeight .activeFW,
#templateAdd #setComItem .fontWeight .fontWeight_img:hover {
  background: url("../../assets/img/fontweight.png") no-repeat 100%/100%;
}
.setColorM .el-color-picker__mask {
  width: 96%;
  /* height: 2rem; */
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
  margin: 10px 10px 10px 0px;
  position: relative;
}
.box_ .box_close {
  position: absolute;
  right: 0px;
  top: 0px;
  color: red;
  display: none;
  cursor: pointer;
}

.box_ > div:hover {
  background-color: cornsilk;
}
.box_ > div:hover .box_close {
  display: block;
}
#dragDiv {
  width: 100%;
  height: 3px;
  border-top: 1px dashed rgba(255, 0, 0, 0);
  cursor: n-resize;
}
.nva_box_ #closeed {
  /* display:none; */
}

.nva_box_:hover #closeed > i {
  /* display:block; */
  color: red !important;
}
.nva_box_:hover #dragDiv {
  border-top: 1px dashed #999;
}
/*  */
.nva_box_:hover #dragDiv::after {
  content: "";
  height: 10px;
  width: 10px;
  left: 182px;
  top: -13px;
  z-index: 999999999;
  background: #fff;
  display: inline-block;
  position: relative;
  border: 1px solid #999;
}
.navigation .bgImgBox i {
  position: relative;
  visibility: hidden;
  z-index: 999;
}
.navigation .bgImgBox:hover i {
  visibility: visible;
}
.navigation .el-color-picker__trigger {
  height: 2rem;
  width: 14rem;
}
.navigation .el-form-item__label {
  text-align: left;
}

.el-message-box__btns {
  text-align: center;
}
.uploadtab .el-upload--picture-card {
  width: 24px !important;
  height: 24px !important;
  background: url(~assets/img/defaultImg.png);
  background-size: 100%;
}

.uploadtab .el-upload--picture-card i {
  font-size: 0px;
}

.filler {
  width: 100%;
  height: 100%;
  display: inline-block;
  border: 1px dashed #35c55b;
  position: relative;
  /* background-color: #fff; */
}

.moduletitle .el-input__inner {
  border-radius: 0px;
  border: 0px;
  border-bottom: 1px solid #dcdfe6;
}

.setphoneItem > div {
  margin-right: 0.5rem;
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

.uploadClass .el-upload-list--picture-card .el-upload-list__item {
  width: 24px;
  height: 24px;
}

.uploadClass
  .el-upload-list__item.is-success
  .el-upload-list__item-status-label,
.uploadClass .el-upload-list--picture-card .el-upload-list__item-actions span {
  display: none !important;
}

.uploadClass .el-upload-list--picture-card .el-progress {
  display: none;
}

.deleteCom {
  cursor: pointer;
  background: url("~assets/img/deleteOne.png") no-repeat;
  height: 2rem;
  width: 1.95rem;
  background-size: 100%;
}
.laststepCom {
  cursor: pointer;
  background: url("~assets/img/chexiao.png") no-repeat;
  height: 1.6rem;
  width: 1.6rem;
  background-size: 100% 100%;
}
#ruler {
  position: absolute;
  visibility: hidden;
  white-space: pre-wrap;
  top: 150px;
  /* z-index: -100; */
  font-size: 18px;
  font-family: "inherit";
  line-height: 18px;
  word-break: break-all;

  /* border: 1px dashed #dedede; */
  min-height: 40px;
  box-sizing: border-box;
}

.el-edit-cen .el-form-item__content {
  width: 100%;
  float: right;
}

.labelcolor_ {
  width: 60px;
}

.fontColorIcon {
  vertical-align: middle;
  display: inline-block;
  width: 43px;
  height: 40px;

  background: url("~assets/img/zifu.png") no-repeat;
  background-size: 100% 100%;
}

#rose-layout #templateAdd .temname .el-input {
  width: 27rem;
}
#rose-layout #templateAdd .temname_ .el-input {
  width: 5rem;
}
/* <!-- 红色提示线样式 --> */
.ref-line {
  position: absolute;
  background-color: rgba(240, 132, 132, 0.9);
  z-index: 9999;
}

.v-line {
  width: 1px;
  height: 200px;
}

.h-line {
  height: 1px;
  width: 200px;
}
</style>
