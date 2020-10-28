 <!--*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************-->
 <template>
    <div class="tmpimgupload" :style="{background:`url(${imgsrc}) no-repeat 100% 100%/100% 100%`}" >
      <!-- <img v-if="imgsrc.length>0" :src="imgsrc" alt="" width="100%" height="100%"  /> -->
      <!-- <div style="margin-bottom: 5px;font-size:10px;color:#ff6e6e;text-align:center;vertical-align:bottom;">二维码的最小宽高为：150*150</div> -->
       
    </div>
  </template>
  <script>
    export default {
      name: 'app',
      data() {
        return {
          file: '',
          imgsrc:require('../../../assets/img/comqrcode_.png')
        }
      },
      mounted() {
      },
      methods: {
        tmpuploadimg(){},
      }
    }
  </script>
  <style scoped>
    .tmpimgupload {
      display:flex;
      justify-content: center;
    align-items: flex-end;
      position: relative;
      width: 100%;
      height: 100%;
      /* background:url('../../../assets/img/userUploadImg.png') no-repeat; */
      /* background-size:100% 100%; */
      /* background-position:50% 45%; */
      /* border:0.01rem solid #dedede; */
    }

    
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