 <!--*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************-->
 <template>
  <div class='app-container'>
      
      
    <el-form :inline="false" :inline-message="false" :status-icon='true' size="mini" :model="ruleForm" :rules="rules"
             ref="vimForm" class="demo-ruleForm" label-width="100px" style="width:280px;">
      <div class="demo-ruleForm">
        <div class="bttitle"></div>
   
       
        <el-form-item label="账号" prop="username">
          <el-input v-model="ruleForm.username" ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="nickname">
          <el-input v-model='ruleForm.nickname'></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model.number="ruleForm.phone"></el-input>
        </el-form-item>


        <el-form-item label="权限" prop="roleIds">
            <!-- multiple collapse-tags -->
          <el-select   v-model="ruleForm.roleIds" placeholder="请选择">
            <el-option v-for="item in userRoles" :key="item.id" :label="item.name" :value-key="item.id" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>


      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel('vimForm')">取消</el-button>
      <el-button size="small" type="primary"  @click="addData('vimForm')">确 定</el-button>

    </div>
  </div>
</template>
<script>
  import { getpermissions, updateUserWeb, saveUserWeb } from '@/api/members'
  export default {
    data() {
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/
          console.log(reg.test(value));
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      };


      return {
        userRoles: [],
        rules: {

         
          phone: [
          {required: true,validator: checkPhone, trigger: 'blur'}
            // {  required: true, message: '手机号必须填' },
            // { type: 'number', required: true, message: '电话格式不对' }
          ],
          roleIds: [
            {  required: true, message: '请选择一项权限', trigger: 'change' },//type:'array',
          ],
          username: [
            {  required: true, message: '账号必须填' },
          ],
          nickname: [
            {  required: true, message: '姓名必须填' },
          ],
        },
        ruleForm: {
         
          phone: null,
          roleIds:'',
          username: '',
          nickname: '',
        },

      }
    },
    created(){
      this.getdata();
      
    },

    methods: {
      setDefaultValue(){
        let obj={
          phone:Number(this.$route.query.phone),
          roleIds:Number(this.$route.query.roleId),//[{name:this.$route.query.roleName,id:this.$route.query.roleId}],
          username: this.$route.query.username,
          nickname: this.$route.query.nickname
        };
        this.$nextTick(()=>{
          this.ruleForm=obj;
        })
        
      },
      addData(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            
            let params = Object.assign({}, this.ruleForm)
            params.roleIds=[params.roleIds];
            if (this.$route.query.operate == 'update') {
              params.id = this.$route.query.id;
           
              updateUserWeb(params).then(response => {
                this.$message({ type: 'success',
            message: '成员修改成功'})
                this.resetForm(formName)
              })
              return false
            }

            saveUserWeb(params).then(response => {
              this.$message({ type: 'success',
            message: '成员添加成功'})
              this.resetForm(formName)
            })
          }
        })
      },
      cancel(formName){
          this.resetForm(formName)
         },
      resetForm(formName) {
          this.$refs[formName].resetFields();
          this.$router.push({path:'memberslist'})
        },
      getdata() {
        getpermissions().then(response => {//获取已经设置的权限
          
          if (response.data.length > 0) {
            this.userRoles = response.data;
          }
        })
      }

    },
    mounted: function () {
      this.$route.query.operate=='update' && this.setDefaultValue()
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .demo-ruleForm .el-input__inner {
    width: 700px !important;
  }

  .versionclass {
    width: 120px;
  }

  .el-select .el-input {
    width: 90px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>

<style>
  .mutilBox .el-input-group__append {
    padding: 0px 10px 0px 0px !important;
  }

  .demo-ruleForm .mutilBox .selectclass .el-input__inner {
    width: 120px !important;
  }

  .demo-ruleForm .mutilBox .ipclass>.el-input__inner {
    height: 30px;
    padding: 0px 5px;
    width: 100px;
  }

  .demo-ruleForm .mutilBox .el-input-group__append .el-input__inner {
    width: 80px !important;
    padding: 0px 5px;
  }

  .demo-ruleForm .mutilBox .el-input-group__append .portclass .el-input__inner {
    width: 50px !important;
  }

  .demo-ruleForm .mutilBox .el-input-group__append .versionclass .el-input__inner {
    width: 50px !important;
  }

  .el-form-item {
    margin-bottom: 20px !important;
  }

  .demo-ruleForm .el-input__inner {
    width: 180px;
  }
</style>