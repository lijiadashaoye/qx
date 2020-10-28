<template>
  <!-- @contextmenu.prevent="rightClick" -->
  <div
    :style="{height:navInfo.height+'px',background:`${navInfo.bgColor} url(${navInfo.bgImg}) no-repeat 50%/100% 100%`,position:'relative'}"
    ref="navRef"
    class="navB navOperate"
    @contextmenu.prevent="rightClick"
  >
    <draggable
      class="list-group"
      tag="div"
      v-model="tabsList"
      v-bind="dragOptions"
      @start="drag = true"
      @end="drag = false"
    >
      <transition-group
        type="transition"
        class="flexBox"
        tag="div"
        :name="!drag ? 'flip-list' : null"
      >
        <!-- v-if="navInfo.icon.length>0" -->
        <div
          @contextmenu.prevent="rightClick"
          class="list-group-item"
          v-for="element in tabs"
          :key="element.order"
          :style="{minWidth:element.width+'px'}"
        >
          <!-- <div v-if="element.order==0" style="position:absolute;top:100px;">  {{element}}</div> -->
          <!-- ,position:'relative' -->
          <!-- 宽高 -->
          <!-- 删除 -->
          <div class="deleteList-group-item el-icon-error" @click="deleteIconBox(element)"></div>
          <div
            contenteditable
            @blur="tabWHblur($event,element.order,element)"
            :style="{top:setPositionTop(element)}"
            :class="{outPositon:!!setPositionTop(element)}"
            class="iconheight"
          >{{element.width}}*{{element.height}}</div>
          <!-- element.icon && element.icon.src.length>0 -->
          <!-- icon -->
          <div
            class="iconImg"
            @click="upIcon(element)"
            :style="{width:element.width+'px',height:element.height+'px',background:element.icon.length<1?`url(${defaultIcon}) no-repeat 100%/100%`:`url(${element.icon}) no-repeat 100%/100%`}"
          ></div>
          <!-- 页面名称 -->
          <div
            contenteditable
            class="iconName"
            :style="{maxHeight:setMaxHeight(element)}"
            @blur="tabonblur($event,element.order,element)"
          >{{ element.name }}</div>
        </div>
      </transition-group>
    </draggable>
    <div
      v-if="showOperateBox"
      class="rightOperateBox"
      ref="operateBox"
      :style="{left:operateBox.left+'px',top:operateBox.top+'px'}"
      :class="'OperateBoxClass'"
    >
      <div class="right-navInfo">
        <h4 class="tile" style="margin-block-end: 10px; margin-block-start: 0px;">导航信息</h4>
        <el-form :model="navInfo" class="navigation_right" label-position="top">
          <el-form-item label="设置导航背景颜色" :label-width="'150px'" :label-position="'left'">
            <el-color-picker
              color-format="rgb"
              :show-alpha="true"
              :predefine="predefineColors"
              :style="{width:'100%',height:'100%'}"
              :popper-append-to-body="false"
              popper-class="noactive"
              style="height:2rem;width:2rem;"
              v-model="navInfo.bgColor"
            ></el-color-picker>
          </el-form-item>
          <el-form-item label="上传导航背景图片" :label-width="'150px'" :label-position="'left'">
            <el-upload
              class="navigation-uploader"
              :action="baseapi"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <el-button size="small" type="primary" :style="{width:'9rem',height:'2rem'}">上传导航背景图</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1M</div>
            </el-upload>
          </el-form-item>
          <el-form-item
            v-if="navInfo.bgImg.length>0"
            label
            :label-width="'150px'"
            :label-position="'left'"
          >
            <div
              class="bgImgBox"
              :style="{height:navInfo.height+'px',width:'9rem',marginBottom:'22px',marginTop:'-10px'}"
            >
              <i
                class="el-icon-error"
                :style="{float:'right',cursor:'pointer',marginRight:'-10px'}"
                @click="navInfo.bgImg=''"
              ></i>
              <img height="100%" width="100%" :src="navInfo.bgImg" alt />
            </div>
          </el-form-item>

          <el-form-item label="导航高度" :label-width="'150px'" :label-position="'left'">
            <el-input type="text" @input="inputchange" v-model="navInfo.height"></el-input>px
          </el-form-item>
        </el-form>
      </div>

      <!-- </br>
    <div class="right-tabsInfo">
      <h4 class="tile">页面信息</h4>
    </div>
      {{tabs}}-->
    </div>
    <input
      type="file"
      style="display:none;"
      @change="addImg"
      ref="inputerFile"
      accept="image/png, image/jpeg, image/gif, image/jpg"
      :key="count"
    />
  </div>
</template>

<script>
import { on, off } from "../../../utils/dom";
import draggable from "vuedraggable";
import { ossUpload } from "../../../api/template";
export default {
  name: "icon",
  // display: "Transitions",
  // order: 7,
  components: {
    draggable
  },
  data() {
    return {
      isshowNavigation: true,
      count: 0,
      defaultIcon: require("../../../assets/img/defaultImg.png"), //
      baseapi: "https://trace.test.cloud.pdx.ltd/admin/oss/upload", //window.g.apiurl+'/admin/oss/upload',
      showOperateBox: false,
      operateBox: {
        left: 0,
        top: 0
      },
      curIcon: {},
      drag: true
    };
  },
  mounted() {
    on(document, "click", this.handleDocumentClick);
  },
  watch: {
    "navInfo.height": {
      deep: true,
      handler: function(newV, oldV) {
        if (!!newV && !!oldV) {
          let value = parseInt(oldV) - parseInt(newV);
          console.log(
            this.$parent.phoneboxOuterHieght,
            parseInt(this.$parent.phoneboxOuterHieght),
            parseInt(value)
          );
          this.$parent.phoneboxOuterHieght =
            parseInt(this.$parent.phoneboxOuterHieght) + parseInt(value);
          console.log(newV, oldV, this.$parent.phoneboxOuterHieght);
        }
      }
      //
    }
    // 'navInfo.used':{
    //   deep:true,
    //     handler:function(newV,oldV){

    //       if(!newV){
    //         debugger
    //         this.$parent.navigationForm.used=newV;
    //         this.$parent.phoneboxOuterHieght=parseInt(this.$parent.phoneboxOuterHieght)+parseInt(this.navInfo.height)
    //       }

    //     }
    //   //
    // }
  },
  destroyed() {
    const reference = this.reference;
    // 卸载事件
    off(document, "click", this.handleDocumentClick);
  },
  methods: {
    hideNavigation(value) {
      this.$emit("hideNav", value);
    },
    inputchange(value) {},

    deleteIconBox(item) {
      this.$emit("deleteTabs", item);
    },
    // 点击图片出发上传icon
    upIcon(item) {
      this.curIcon = item;

      this.$refs.inputerFile.click();
    },
    //上传icon
    addImg(event) {
      let inputDOM = this.$refs.inputerFile;
      // 通过DOM取文件数据
      let fil = inputDOM.files;

      let size = Math.floor(fil[0].size / 1024);
      if (size > 5 * 1024 * 1024) {
        this.$message({ message: "请选择5M以内的图片！", type: "warning" });
        return false;
      }
      ossUpload({ type: 1, file: fil[0] }).then(result => {
        this.curIcon.icon = result;
        console.log(this.curIcon);
        this.count = this.count + 1;

        // this.$emit('resetTabs',this.curIcon,this.curIcon.order);
      });
    },
    setPositionTop(item) {
      // console.log(item);

      let tabBoxHeight = 16 + parseInt(item.height) + 32;
      if (tabBoxHeight > parseInt(this.navInfo.height)) {
        return this.navInfo.height + "px";
      } else {
        return 0;
      }
    },
    setMaxHeight(item) {
      // 16shicss设置的行高

      let maxheight = parseInt(this.navInfo.height) - parseInt(item.height);
      if (maxheight < 16) {
        item.textMaxH = 0;
        return "0px";
      } else {
        item.textMaxH = Math.floor(maxheight / 16) * 16 - 16;
        return Math.floor(maxheight / 16) * 16 - 16 + "px";
      }
      // parseInt(this.navInfo.height)-parseInt(item.height)-10+'px'
    },

    tabWHblur(e, index, item) {
      var patrn = /^\d+(\*\d+)?$/;
      console.log(patrn.exec(e.target.innerText));
      if (!patrn.exec(e.target.innerText)) {
        this.$message({ message: "您输入的格式不对", type: "warning" });
        e.target.innerText = item.width + "*" + item.height;
        return false;
      }
      let WH = e.target.innerText.split("*");
      // let newItem=Object.assign({},item)
      // newItem.width=WH[0]
      // newItem.height=WH[1];
      item.width = WH[0];
      item.height = WH[1];
    },
    // 编辑文字
    tabonblur(e, index, item) {
      //index 第几个icon的文字
      if (e.target.innerText.length > 10) {
        this.$message({ message: "最多只能输入10个字符", type: "warning" });
      }

      e.target.innerText = e.target.innerText.substr(0, 10);
      item.name = e.target.innerText.substr(0, 10);
      // this.tabs[index].name = e.target.innerText.substr(0, 10);
    },

    //点击dom取消右键框
    handleDocumentClick(e) {
      let reference = this.$refs.navRef;
      let popper = this.$refs.operateBox;
      if (
        reference.contains(e.target) ||
        (!!popper && popper.contains(e.target))
      ) {
        return;
      } else {
        this.showOperateBox = false;
      }
    },
    // 右键
    rightClick(e) {
      this.isshowNavigation = this.navInfo.used;
      if (e.currentTarget.className.indexOf("navOperate") >= 0) {
        this.operateBox.left =
          Math.floor(e.currentTarget.offsetWidth / 2) - 150;
        this.operateBox.top = parseInt(this.navInfo.height);
      } else {
        this.operateBox.left =
          e.currentTarget.offsetLeft +
          Math.floor(e.currentTarget.offsetWidth / 2) -
          150 -
          5;
        this.operateBox.top = e.currentTarget.offsetHeight;
      }
      e.stopPropagation();

      e.preventDefault();
      this.showOperateBox = true;
      console.log(e.clientX - this.$refs.navRef.offsetLeft);
    },
    //排序
    sort() {
      this.tabs = this.tabs.sort((a, b) => a.order - b.order);
    },
    handleAvatarSuccess(res, file) {
      this.navInfo.bgImg = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const isJPG =
        testmsg === "jpg" ||
        testmsg === "JPG" ||
        testmsg === "png" ||
        testmsg === "PNG";

      const isLt2M = file.size / 1024 / 1024 <= 1;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 1M!");
      }
      return isLt2M && isJPG;
    }
  },
  props: ["navInfo", "tabs", "predefineColors"],
  computed: {
    tabsList: {
      get() {
        return this.tabs;
      },
      set(val) {
        this.$emit("resetTabs", val);
      }
    },
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  }
};
</script>
<style >
.right-navInfo .el-input {
  width: 9rem !important;
}
.right-navInfo .el-input__inner {
  width: 100%;
}
.right-navInfo .el-form-item {
  margin-bottom: 10px;
}
.right-navInfo .el-form-item__label {
  line-height: 14px;
  font-weight: bold;
}
</style>
<style scoped>
.navOperate {
  /* padding: 10px 0 0; */
  cursor: pointer;
}
.list-group {
  height: 100%;
}
.rightOperateBox {
  padding: 20px;
  position: absolute;
  z-index: 999;
  /* background-color: #ecedf3; */
  width: 300px;
  height: auto;
  min-height: 150px;
  background: #f5f7fa;
  border-radius: 15px;
  border: 1px solid #d7d7d9;
}

.rightOperateBox::after {
  content: "";
  width: 0;
  position: absolute;
  top: -10px;
  left: 145px;
  height: 0;
  display: inline-block;
  border-left: 10px solid transparent;

  border-right: 10px solid transparent;

  border-bottom: 10px solid #f5f7fa;
}
.flexBox {
  display: flex;
  justify-content: space-around;
  flex-wrap: nowrap;
  flex-direction: row;
  height: 100%;
}
.list-group-item {
  display: flex;
  align-content: space-around;
  /* space-around */
  justify-content: center;
  flex-direction: column;
  cursor: e-resize;
  text-align: center;
  word-wrap: break-word;
  word-break: break-all;
  /* border-right: 1px solid #dedede; */
  /* flex:1; */
  height: 100%;
  overflow: hidden;
}
.list-group-item:hover .deleteList-group-item {
  display: block;
  cursor: pointer;
}
.list-group-item:hover {
  background-color: #e2e2e2;
}

.deleteList-group-item {
  position: relative;
  width: 100%;
  text-align: right;
  color: rgba(255, 102, 0, 1);
  font-size: 12px;
  display: none;
}
.defaultIcon {
  background: url(~assets/img/defaultImg.png) no-repeat 100% /90%;
}
.iconImg {
  margin: 0 auto;
  cursor: pointer;
}
.iconheight {
  /* width:100%; */
  font-size: 10px;
  line-height: 14px;
  text-align: center;
  color: rgba(255, 96, 76, 1);
  cursor: pointer;
}
.iconName {
  font-size: 14px;
  line-height: 16px;
  overflow: hidden;
  cursor: pointer;
}
.list-group-item:last-child {
  border-width: 0px;
}

.outPositon {
  position: absolute;
  top: 0px;
}
/* .list-group-item:hover .outPositon{
  position: absolute;
    top: -16px;
    display:block
} */

.buttons {
  margin-top: 35px;
}
</style>