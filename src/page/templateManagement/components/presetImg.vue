 <!--*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************-->
 <template>
  <div class="imgupload">
    <img v-if="imgsrc.length>0" :src="imgsrc"  @dblclick="clickupload" alt="" width="100%" height="100%" id="prevView" />

    <!-- <i class="el-icon-plus avatar-uploader-icon upload_" style="margin-top: 25%;transform: translateY(-100%); ">点击上传</i> -->
    <!--  -->
    <!-- <div   class="upload_"> -->
      <img  v-if="imgsrc.length<=0" src="~assets/img/admin_uploadImg.png"  @dblclick="clickupload" title="双击上传" alt="" width="100%" height="100%" class="" />
      <!-- <div style="line-height:30px;color:rgba(255, 102, 0, 1)">管理员添加图片区域</div> -->
      <!--  -->
      <input name='upF'   type="file" class="upload" @change="prev" ref="inputer"
    accept="image/png,image/jpeg,image/gif,image/jpg" :key="count"/>
    <!-- </div> -->
    
    <!-- <input type="file" name="file"  :model="file" @change="prev($event)"/>   -->
   

  </div>
</template>
<script>
  import { ossUpload } from 'src/api/template.js';
  import sha256 from 'sha256'
  const {
  mapActions: mapFileHasherActions
} = createNamespacedHelpers('fileHasher');
  import {createNamespacedHelpers} from 'vuex';
  export default {
    name: 'app',
    props: {
      ispreView:{
        type:Boolean,
        default:()=>false
      },
      comontTmp: {
        type: Object,
        detault: () => { }
      }
    },
    data() {
      return {
        file: '',
        upFile:null,
        count:1,
      }
    },
    computed:{
      imgsrc(){
        return this.comontTmp.text.length>0?this.comontTmp.text:'';
      },
      hasher256(){
        
        return this.$store.getters.fileQueue.hash
      },
    },
    mounted() {
    },
    watch:{
      hasher256(new_,old){
      
        if(new_!=old && new_!=null){
          let that =this
          if(this.$store.state.fileHasher.key == this.comontTmp.key){
            if(!this.upFile){
              return
            }
            ossUpload({ file:this.upFile, type: 1 }).then(response => {
              if (response.length > 0) {
           
                this.$emit('setPresetImg', this.comontTmp, response,this.$store.state.fileHasher.fileQueue.hash)
                //  this.$refs.inputer.value=null
                this.count++
              }
            }).catch(e=>{
              this.count++
              // this.$refs.inputer.value=null
             
            })
          }
        }
      }
    },
    methods: {
      clickupload(e){
        if(this.ispreView){
          return 
        }
       e.target.parentElement.lastElementChild.click()
      },
      ...mapFileHasherActions(['addFiles']),
      prev(event) {
       
       
        let that = this;
        let inputDOM = this.$refs.inputer;
        // 通过DOM取文件数据
        let file = inputDOM.files;
       
        this.upFile=file[0]
        
       
        // inputDOM.outerHTML=inputDOM.outerHTML;
        file  = Array.from(file || []);
        this.addFiles({files:file,key:this.comontTmp.key});
       
        
      },
      
    }
  }
</script>
<style scoped>
  .imgupload {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .upload_ {
    width: 100%;
    height: 118px;
    /* line-height:30px; */
    position: absolute;
    left: 50%;
    top: 50%;
 
    transform: translate(-50%, -59px);
    font-size: 0.7rem;
    /* color:#fff; */
    /* background-color:#F76A0D; */
    text-align: center;
    padding: 5px;
    border-radius: 12%;

    /* transform: translate(-25%, -25%); */

  }
  .upload_ img{
/* width:118px;
height:118px; */
cursor: pointer;
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
    /* opacity: 0; */
    display:none;
    cursor: pointer;
    width: 90px;
  }
</style>