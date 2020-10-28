 <!--*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************-->
 <template>
    <div class="tmpmediaupload" >
      <img v-if="imgsrc.length>0" :src="imgsrc" alt="" width="100%" height="100%" id="prevView" />
      
        <!-- <i class="el-icon-plus avatar-uploader-icon upload_" style="margin-top: 25%;transform: translateY(-100%); ">点击上传</i> -->
        <!-- <div class="tmpmediaupload_"  @click="tmpuploadimg">点击上传</div> -->
        <!-- <div class="tmpmediaupload_"  >用户添加视频</div> -->
     
      <!-- <input type="file" name="file"  :model="file" @change="prev($event)"/>   -->
      <!-- <input type="file" class="upload" @change="prev" ref="inputer"
             accept="image/png,image/jpeg,image/gif,image/jpg" /> -->
  
    </div>
  </template>
  <script>
    export default {
      name: 'app',
      data() {
        return {
          file: '',
          imgsrc:''
        }
      },
      mounted() {
      },
      methods: {
        tmpuploadimg(){},
        // prev(event) {
        //   let that =this;
        //   let inputDOM = this.$refs.inputer;
        //   // 通过DOM取文件数据
        //   // 
        //  let file= inputDOM.files;
        // //  this.getObjectURL(file[0])
        // //  
        // this.imgsrc=this.getObjectURL(file[0]);
        // //   let reader = new FileReader();
        // //   reader.readAsDataURL(file[0]);
        // //   reader.onload = function(result){
        // //       //给img的src设置图片url
        // //       
        // //       // that.imgsrc=require(this.result)
        // //   }
          
         
          
        // },
        // getObjectURL(file) {
        //   var url = null ;
        //   if (window.createObjectURL!=undefined) { // basic
        //     url = window.createObjectURL(file) ;
        //   } else if (window.URL!=undefined) { // mozilla(firefox)
        //     url = window.URL.createObjectURL(file) ;
        //   } else if (window.webkitURL!=undefined) { // webkit or chrome
        //     url = window.webkitURL.createObjectURL(file) ;
        //   }
        //   return url ;
        // },
      }
    }
  </script>
  <style scoped>
    .tmpmediaupload {
      position: relative;
      width: 100%;
      height: 100%;
      background:url('../../../assets/img/userUploadMedia.png') no-repeat;
      background-size:100% 100%;
      background-position:50% 40%;
      border:0.01rem solid #dedede;
    }
    .tmpmediaupload_{
      width:100%;height:30px;
      /* line-height:30px; */
      position: absolute;
      left: 50%;
      top: 50%;
      cursor: pointer;
      transform: translate(-50%,15px);
      color:#F76A0D;
      /* background-color:#F76A0D; */
      text-align: center;
      padding:5px;
      /* border-radius: 12%; */
      /* transform: translate(-25%, -25%); */
  
    }
    .tmpmediaupload_:before{
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