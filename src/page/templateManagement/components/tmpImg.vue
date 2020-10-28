 <!--*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************-->
 <template>
    <div class="tmpimgupload" >
      <img v-if="imgsrc.length>0" :src="imgsrc" alt="" width="100%" height="100%"  />
      <div style="backgorund:red;width:50%;height:50%;"></div>
        <!-- <div class="tmpupload_"  @click="tmpuploadimg">点击上传</div> -->
        <!-- <div v-show="imgsrc.length<=0" class="tmpupload_"  >用户添加图片</div> -->
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
    .tmpimgupload {
      position: relative;
      width: 100%;
      height: 100%;
      background:url('../../../assets/img/userUploadImg.png') no-repeat;
      background-size:100% 100%;
      background-position:50% 45%;
      /* border:0.01rem solid #dedede; */
    }

    /* .tmpupload_{
      height:0.3rem;
      width:1rem;
      font-size:0.15rem;
      
      position: absolute;
      left: 50%;
      top: 65%;
      cursor: pointer;
      transform: translate(-45px, -10px);
      color:#F76A0D;
 
      text-align: center;
      padding:5px;

  
    }
    .tmpupload_:before{
      cursor: pointer;
    } */
    .tmpupload_{
      width:100%;height:30px;
      /* line-height:30px; */
      position: absolute;
      left: 50%;
      top: 50%;
      cursor: pointer;
      transform: translate(-50%, 10px);
      color:#F76A0D;
      /* background-color:#F76A0D; */
      text-align: center;
      padding:5px;
      /* border-radius: 12%; */
      /* transform: translate(-25%, -25%); */
  
    }

    .tmpupload_:before{
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