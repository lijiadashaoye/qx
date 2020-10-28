<template>
  <!-- <div class="presettext"  >
    
    <div class="label" :style="{'color':fontColor_,'fontSize':fontSize_+'px',whiteSpace:' pre-wrap','wordBreak':'break-all'}" v-html="presetText"></div>
   
  </div> -->
  <div
    class="textbox"
    :style="{
      backgroundColor: item_.backgroundColor,
      alignItems:
        item_.verticalAlign == 'middle'
          ? 'center'
          : item_.verticalAlign == 'top'
          ? 'flex-start'
          : 'flex-end',
      color: item_.fontColor_
    }"
  >
    <p 
   
      style="width:100%;text-align:justify;margin: 0;"
      :style="{
        color: item_.fontColor,
        fontWeight: item_.fontWeight ? 'bold' : '100',
        fontFamily: item_.fontFamily,
        textAlign: item_.textAlign,
        textAlignLast: item_.textAlign,
        fontSize: item_.fontSize + 'px'
      }"
      v-html="item_.text"
    ></p>
  </div>
</template>
<script>
export default {
  name: "app",

  data() {
    return {
      file: "",
      imgsrc: ""
    };
  },
  mounted() {},
  // props:['fontColor_','fontSize_'],
  props: {
    item_: {
      type: Object,
      defalut: () => {}
    },
    //
    fontColor_: {
      type: String,
      defalut: () => "#848484" //'#848484'
    },
    fontSize_: {
      type: String,
      default: () => "14"
    },
    presetText: {
      type: String,
      default: () => ""
    }
  },
  methods: {
    prev(event) {
      let that = this;
      let inputDOM = this.$refs.inputer;
      // 通过DOM取文件数据
      //
      let file = inputDOM.files;
      //  this.getObjectURL(file[0])
      //
      this.imgsrc = this.getObjectURL(file[0]);
      //   let reader = new FileReader();
      //   reader.readAsDataURL(file[0]);
      //   reader.onload = function(result){
      //       //给img的src设置图片url
      //
      //       // that.imgsrc=require(this.result)
      //   }
    },
    getObjectURL(file) {
      var url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    }
  }
};
</script>
<style scoped>
.textbox {
  display: flex;
  white-space: pre-wrap;
  word-break: break-all;
  height: 100%;
}
.comments {
  height: 100%;
  width: 100%;
  /*自动适应父布局宽度*/
  overflow: auto;
  word-break: break-all;
  /*在ie中解决断行问题(防止自动变为在一行显示，主要解决ie兼容问题，ie8中当设宽度为100%时，文本域类容超过一行时，
当我们双击文本内容就会自动变为一行显示，所以只能用ie的专有断行属性“word-break或word-wrap”控制其断行)*/
}
</style>
<style >
.editP{
  outline: none;
    /* border-color: #F76A0D; */
}
</style>
