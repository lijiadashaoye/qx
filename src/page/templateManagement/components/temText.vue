 <!--*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************-->
 <template>
    <div class="tmptext" >
        <!-- <textarea class="comments" rows=1 placeholder="用户输入内容区域"   name=s1   cols=27   onpropertychange= "this.style.posHeight=this.scrollHeight "></textarea> -->
 <div class="comments" data-event-dbclick='dbclick' @dblclick="editPlaceholder">
   请输入提示语 </div>
        <!-- <textarea class="comments" style="height:expression((this.scrollHeight>150)?'150px':(this.scrollHeight+5)+'px');overflow:auto;"></textarea>  -->
  
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
        editPlaceholder(e){
console.log(e)
        },
        prev(event) {
         
          let that =this;
          let inputDOM = this.$refs.inputer;
          // 通过DOM取文件数据
          // 
         let file= inputDOM.files;
        //  this.getObjectURL(file[0])
        //  
        this.imgsrc=this.getObjectURL(file[0]);
        //   let reader = new FileReader();
        //   reader.readAsDataURL(file[0]);
        //   reader.onload = function(result){
        //       //给img的src设置图片url
        //       
        //       // that.imgsrc=require(this.result)
        //   }
        },
        getObjectURL(file) {
          var url = null ;
          if (window.createObjectURL!=undefined) { // basic
            url = window.createObjectURL(file) ;
          } else if (window.URL!=undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file) ;
          } else if (window.webkitURL!=undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file) ;
          }
          return url ;
        },
      }
    }
  </script>
  <style scoped>
    .comments {
      cursor: pointer;
      height: 100%;
 width:100%;/*自动适应父布局宽度*/
 overflow:auto;
 word-break:break-all;
/*在ie中解决断行问题(防止自动变为在一行显示，主要解决ie兼容问题，ie8中当设宽度为100%时，文本域类容超过一行时，
当我们双击文本内容就会自动变为一行显示，所以只能用ie的专有断行属性“word-break或word-wrap”控制其断行)*/
}
.comments::after{
  content:'123';
  display:inline-block;
}
    .tmptext {
      position: relative;
      /* padding:5%; */
      width: 100%;
      height: 100%;
    }
    .upload_{
      width:80px;height:30px;
      /* line-height:30px; */
      position: absolute;
      left: 50%;
      top: 50%;
      cursor: pointer;
      transform: translate(-35px, -15px);
      color:#fff;
      background-color:#F76A0D;
      text-align: center;
      padding:5px;
      border-radius: 12%;
      /* transform: translate(-25%, -25%); */
  
    }
    .upload_:before{
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