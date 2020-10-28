 <!--*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************-->
 <template>
  <!-- :on-preview="handlePictureCardPreview" -->
  <!-- :show-file-list="true" -->
  <!-- :multiple="false" -->
  <div>
    <!-- http://dev.pay.pdx.ltd/backend -->
    <!-- :data="{type:1}" -->
    <!-- :limit='limit' -->
    <el-upload class="backcard" :value='value' :action="baseapi"  :data="{type:1}" list-type="picture-card" :auto-upload="true"
               :ref="uploadref" :class="autoClass" :file-list="fileLists" 
               :headers="headers" :on-preview="handlePictureCardPreview"
               accept=".jpg,.jpeg,.png,.JPG,.JPEG"
               :on-success="onSuccess"
           
               :on-change="onChange"
               :on-error="onError"
               :before-upload="beforeUpload"
               :on-remove="onRemove">
               <!-- :on-progress="onProgress" -->
               <!-- :on-change="(file)=>$emit('getfile','modify',file,uploadref,$refs[uploadref])" -->
               <!--  -->
      <!-- <i class="el-icon-plus"></i>
      <div v-if="bannername.length>0" class="bannername">{{ bannername }}</div> -->
  <!-- <div class="bannerdescription">{{ bannerdescription }}</div> -->
    </el-upload>

    <el-dialog :close-on-click-modal=false :visible.sync="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    var name = child.$options.componentName;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
  export default {
    props: {
        value: {
        type: Array,
        default: () => []
      },
      model:{
        type:Array,
        default:()=>[]
      },
      autoClass: { type: String, default: 'bannerAvatar-uploader' },
      limit: { type: Number, default: 1 },
      uploadref: {
        type: String,
        default: 'uploadref' + Math.floor(Math.random() * 10000)
      },
      fileLists:{type:Array, default: () => []},
      bannername: { type: String, default: '' },
      bannerdescription: { type: String, default: '' }
    },
    data() {
      return {
        baseapi:window.g.apiurl+'/admin/oss/upload',
        deveUrl:'',
        dialogImageUrl: '',
        dialogVisible: false
      };
    },

    updated(){
      this.$nextTick(function(){

        if (this.fileLists.length == this.limit) {
        // this.$refs[this.uploadref].$refs["upload-inner"].$el.style.display = 'none'
        this.$refs[this.uploadref].$refs["upload-inner"].$el.style.opacity=0
      }

})
    },
    inject: {
    elForm: {
        default: ''
    },
    elFormItem: {
        default: ''
    }
},
    computed:{
      // _elFormItemSize() {
      //   return (this.elFormItem || {}).elFormItemSize;
      // },
      // validateState() {
      //   return this.elFormItem ? this.elFormItem.validateState : '';
      // },
      // needStatusIcon() {
      //   return this.elForm ? this.elForm.statusIcon : false;
      // },
      // validateIcon() {
      //   return {
      //     validating: 'el-icon-loading',
      //     success: 'el-icon-circle-check',
      //     error: 'el-icon-circle-close'
      //   }[this.validateState];
      // },
      files(){
     
        return this.fileLists;
      }
    },
    mounted() {


 
      if (this.fileLists.length == this.limit) {
        // this.$refs[this.uploadref].$refs["upload-inner"].$el.style.display = 'none'
        this.$refs[this.uploadref].$refs["upload-inner"].$el.style.opacity=0
      }
    },
    computed:{
      headers() {

        return { 'token': this.$store.getters.token};
      },
    },
    methods: {
      onProgress(){
        
      },
      dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    },
      beforeUpload(file){

        const isJPG = file.type.indexOf('image/')>=0;
        

        if (!isJPG) {
          this.$message.error('上传文件只能是图片格式!');
        }else{
          
          
          // this.$refs[this.uploadref].$refs["upload-inner"].$el.style.display = 'none'
          this.$refs[this.uploadref].$refs["upload-inner"].$el.style.opacity=0
        }
        
        return isJPG;
      
    
        
      },
      onError(response,file,filelist){
        this.$message.error('上传失败')
      },
      onSuccess(response,file,filelist){
        let url="";
      
        if(response.code!=200){
          this.$message({message:response.msg,type:'error'})
       
          this.fileLists.splice(this.fileLists.length==0?0:this.fileLists.length-1,1)
          // this.$refs[this.uploadref].$refs["upload-inner"].$el.style.display = ''
          this.$refs[this.uploadref].$refs["upload-inner"].$el.style.opacity=1
          return false
        }
    
        if (filelist.length > this.limit) {
          filelist.splice(0,1)
          // this.$refs[this.uploadref].$refs["upload-inner"].$el.style.display = 'none'
          this.$refs[this.uploadref].$refs["upload-inner"].$el.style.opacity=0
        }
        if (filelist.length == this.limit) {
         
          // this.$refs[this.uploadref].$refs["upload-inner"].$el.style.display = 'none'
          this.$refs[this.uploadref].$refs["upload-inner"].$el.style.opacity=0
        }
      
        if (filelist.length < this.limit) {
        // this.$refs[this.uploadref].$refs["upload-inner"].$el.style.display = ''
        this.$refs[this.uploadref].$refs["upload-inner"].$el.style.opacity=1
      }
    
        if(response && response.code==200){
          this.$emit('getfile','modify',filelist,this.uploadref,this.$refs[this.uploadref])
          this.$emit('input',filelist);
          
          this.dispatch('ElFormItem', 'el.form.blur', [filelist]);
        }
        
      },
      onChange(file){
        // //
      },
      onRemove(file,fileList){
    
        if (fileList.length < this.limit) {
          // this.$refs[this.uploadref].$refs["upload-inner"].$el.style.display = ''
          this.$refs[this.uploadref].$refs["upload-inner"].$el.style.opacity=1
        } else {
        // this.$refs[this.uploadref].$refs["upload-inner"].$el.style.display = 'none'
        this.$refs[this.uploadref].$refs["upload-inner"].$el.style.opacity=0
      }
       this.$emit('getfile','remove',fileList,this.uploadref,this.$refs[this.uploadref])
      //  let file_remove= fileList.splice(fileList.length-1, 1)
   
       this.$emit('input',fileList);
       
       this.dispatch('ElFormItem', 'el.form.blur', [fileList]);
      },
      onexceed(file, fileList) {

      },
      handleRemove(file, fileList) {
     
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      }


    }
  }
</script>
<style scoped>
  .backcard .accomClassHide .el-upload {
    display: none !important;
  }

  .backcard .bannerdescription {
    display: block;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFangSC;
    font-weight: 400;
    color: rgba(192, 196, 204, 1);
    line-height: 14px;
    text-align: center;
  }

  .backcard .bannername {
    display: block;
    margin: 8px 0px 8px 0px;
    text-align: center;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFangSC;
    font-weight: 400;
    color: rgba(48, 49, 51, 1);
    line-height: 14px;
  }

  .backcard .bannerAvatar-uploader {
    height: 100px;
    overflow: hidden;
  }

  .el-upload-list__item {
    width: 190px !important;
    height: 100px !important;
  }

  .backcard .upload-container .el-upload--picture-card {
    padding-top: 30px;
    width: 190px !important;
    height: 100px !important;
    line-height: 30px;
  }

  .backcard .upload-container .el-upload--picture-card .el-icon-plus {
    margin-top: -25px;
    display:block;
  }

  .backcard .upload_box_item {
    display: inline-block;
    width: 190px;
    height: 100px;
    vertical-align: top;
  }
</style>