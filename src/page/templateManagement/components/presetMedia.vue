 <!--*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************-->
 <template>
  <div class="mediaupload">
    <video v-if="mediasrc.length>0" width="100%" height="100%" :src="mediasrc" controls="controls"> </video>
    <div style="display:none">{{hasher256}}</div>
    <!-- <i class="el-icon-plus avatar-uploader-icon upload_" style="margin-top: 25%;transform: translateY(-100%); ">点击上传</i> -->
    <!-- <div  class="upload_"> -->
      <img  v-if="mediasrc.length<=0" src="~assets/img/admin_uploadMedia.png"  @click="clickupload" alt="" width="100%" height="100%" class="" />
      <!-- <div style="line-height:30px;color:rgba(255, 102, 0, 1)">管理员添加视频区域</div> -->
      <input v-if="mediasrc.length<=0" type="file" class="upload" :key="count" @change="prev" ref="inputer" accept="" />
    <!-- </div> -->
    <!-- <input type="file" name="file"  :model="file" @change="prev($event)"/>   -->
    

  </div>
</template>
<script>
  import { ossUpload } from 'src/api/template.js';
  import sha256 from 'sha256'
  import {createNamespacedHelpers} from 'vuex';

const {
  mapActions: mapFileHasherActions
} = createNamespacedHelpers('fileHasher');
  export default {
    name: 'app',
    props: {
      comontTmp: {
        type: Object,
        detault: () => { }
      }
    },
    data() {
      return {
        file: '',
        upFile:null,
        count:0,
      }
    },
    computed:{
      mediasrc(){
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
          if(this.$store.state.fileHasher.key == this.comontTmp.key){
           
            ossUpload({ file:this.upFile, type: 1 }).then(response => {

              if (response.length > 0) {
                console.log(this.$store.state.fileHasher.fileQueue.hash);
                
                this.$emit('setPresetMedia', this.comontTmp, response,this.$store.state.fileHasher.fileQueue.hash)
                this.count++
              }
            }).catch(e=>{
              this.count++
            })
          }
          
        }
      }
    },
    methods: {
      clickupload(e){
      
      e.target.parentElement.lastElementChild.click()
     },
      ...mapFileHasherActions(['addFiles']),
      // addFiles(file){
      //   this.$store.dispatch('fileH')
      // },
      prev(event) {

        let that = this;
        let inputDOM = this.$refs.inputer;
        // 通过DOM取文件数据
        // 
        let file = inputDOM.files;
        
        if('wmv,rm,rmvb,mov,avi,mp4'.indexOf(file[0].type.split('/')[1])<0){
          this.$message({message:'支支持wmv,rm,rmvb,mov,avi,mp4的视频',type:'warning'})
          this.upFile=null;
        }else{
          this.upFile=file[0]
           file  = Array.from(file || []);
           
           this.addFiles({files:file,key:this.comontTmp.key});
        }
        
       
      }
    }
  }
</script>
<style scoped>
  .mediaupload {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .mediaupload .upload_ {
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

  }
  .upload_ img{

cursor: pointer;
  }
  .mediaupload .upload_:before {
    cursor: pointer;
  }

  .mediaupload input[type="file"] {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-45px, -25px);
    height: 50px;
    border: 1px solid red;
    /* opacity: 0; */
    display: none;
    cursor: pointer;
    width: 90px;
  }
</style>