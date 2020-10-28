<template>
  <div class="presettext" >
    <!-- <div>123</div> -->
    <div class="label" :style="{'color':fontColor_,'fontSize':fontSize_/20+'rem'}">{{presetText}}</div>
    <!-- <textarea class="comments" style="height:expression((this.scrollHeight>150)?'150px':(this.scrollHeight+5)+'px');overflow:auto;"></textarea>  -->
  </div>
</template>
<script>
  export default {
    name: 'app',

    data() {
      return {
        file: '',
        imgsrc: ''
      }
    },
    mounted() {

    },
    // props:['fontColor_','fontSize_'],
    props: {
      // 
      fontColor_:{
        type:String,
        defalut:()=>'#848484'//'#848484'
      },
      fontSize_:{
        type:String,
        default:()=>"14"
      },
      presetText: {
        type: String,
        default: () => ''
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
        if (window.createObjectURL != undefined) { // basic
          url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file);
        }
        return url;
      },
    }
  }
</script>
<style scoped>
  .comments {

    height: 100%;
    width: 100%;
    /*自动适应父布局宽度*/
    overflow: auto;
    word-break: break-all;
    /*在ie中解决断行问题(防止自动变为在一行显示，主要解决ie兼容问题，ie8中当设宽度为100%时，文本域类容超过一行时，
当我们双击文本内容就会自动变为一行显示，所以只能用ie的专有断行属性“word-break或word-wrap”控制其断行)*/
  }

  .presettext {
    position: relative;

    width: 100%;
    height: 100%;
  }

  .label {
    /* line-height:30px; */
    width: 100%;
    position: absolute;
    /* padding:10px; */
    height: 40px;
    line-height: 40px;
    /* cursor: pointer; */
    /* color:#fff; */
    text-align: center;
    top: 50%;
    /* left:50%; */
    transform: translateY(-20px);
  }

  .upload_:before {
    cursor: pointer;
  }

  input[type="file"] {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-45px, -25px);
    height: 50px;
    border: 1px solid red;
    opacity: 0;
    cursor: pointer;
    width: 90px;
  }
</style>