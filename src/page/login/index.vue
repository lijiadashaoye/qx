<template>
  <div id="loginPage">
    <div class="left">
      <div class="titleTop">
        <div class="logoSmall"></div>
        <div>证书防伪平台管理系统</div>
      </div>
      <div class="loginOut">
        <div class="input">
          <div class="loginName">登录</div>
          <div class="inputOut">
            <img src="../../assets/img/zhanghao.png" alt="" />
            <el-input
              v-model="loginName"
              v-on:keyup.native.13="listenKeyup"
              placeholder="请输入用户名"
            ></el-input>
          </div>
          <div class="inputOut">
            <img src="../../assets/img/mima.png" alt="" />
            <el-input
              type="password"
              v-model="passWord"
              v-on:keyup.native.13="listenKeyup"
              placeholder="请输入密码"
            ></el-input>
          </div>
          <div class="loginBtn" @click="login">登录</div>
          <div class="ceeatWallet">
            注册或忘记密码请联系客服（service@tongcelian.com）
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="app_down_label">
        <div class="app_down_labelText">APP下载</div>
        <div class="app_down_labelQrcode">
          <div class="qrcode"></div>
          <div class="app_d_label_desc">扫码下载通测链APP</div>
        </div>
      </div>
    </div>
    <el-dialog
      title="友情提示："
      class="protocal_dia"
      :visible.sync="showIE"
      width="21rem"
      :close-on-click-modal="false"
    >
      <div style="hegiht: 32px; line-height: 32px">
        建议您使用chrome浏览器或者360浏览器打开此平台
      </div>
      <div slot="footer" class="dialog-footer">
        <div style="height: 1rem"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { apiLogin, modelList } from "api/login.js";
// import mixin from "utils/mixin.js";
export default {
  // mixins: [mixin],
  data() {
    return {
      showIE: false,
      isLoading: false,
      loginName: "",
      passWord: "",
    };
  },
  methods: {
    IEVersion() {
      var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
      var isIE =
        userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
      var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
      var isIE11 =
        userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1;
      if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
          return 7;
        } else if (fIEVersion == 8) {
          return 8;
        } else if (fIEVersion == 9) {
          return 9;
        } else if (fIEVersion == 10) {
          return 10;
        } else {
          return 6; //IE版本<=7
        }
      } else if (isEdge) {
        return "edge"; //edge
      } else if (isIE11) {
        return 11; //IE11
      } else {
        return false; //不是ie浏览器
      }
    },
    listenKeyup(e) {
      if (this.loginName.length < 1 || this.passWord.length < 1) {
        return false;
      }
      if (e.keyCode != 13) {
        return;
      }

      this.login();
    },
    async login() {
      if (this.loginName.length < 1) {
        this.$message({ message: "请输入用户名", type: "error" });
        return false;
      }
      //  var re = /^[a-zA-Z0-9]+$/;
      // if(!re.test(this.loginName)){
      //   this.$message({message:'用户名为最大16位的英文或数字',type:'error'})
      //   return false;
      // }
      if (this.passWord.length < 1) {
        this.$message({ message: "请输入密码", type: "error" });
        return false;
      }
      //  if(this.passWord.length>16){
      //   this.$message({message:'密码必须是小于16的位的英文或数字',type:'error'})
      //   return false;
      // }

      // if(!re.test(this.passWord)){
      //   this.$message({message:'密码必须是小于16的位的英文或数字',type:'error'})
      //   return false;
      // }
      let params = {
        username: this.loginName,
        password: this.$md5(this.passWord),
      };
      let salt = this.$md5("PDXSafe" + this.passWord);
      sessionStorage.setItem("salt", salt); //加盐，在layout/index中设置私钥加密对
      let result = await apiLogin(params);
      sessionStorage.setItem("userInfo", JSON.stringify(result));
      let result2 = await modelList();

      modelList().then((result) => {
        sessionStorage.setItem("permissionModel", JSON.stringify(result2));

        let ModelIndex = result.reduce(
          (total, curdata, index) => {
            if (total.sort < curdata.sort) {
              return total;
            } else {
              return curdata;
            }
          },
          { id: null, sort: 1000 }
        );
        if (ModelIndex.sort > 10) {
          this.$message({
            message: "您没有任何权限，请联系管理员添加授权",
            type: "waring",
          });
          return false;
        }
        let urlObj = {
          100500: "manage/accountManagement",
          100600: "manage/department",
          100300: "manage/certificateManagement",
          100200: "manage/templateManagement",
        };

        this.$router.push({ path: urlObj[ModelIndex.id] });
      });
      this.isLoading = true;
    },
  },
  mounted() {},
  created() {
    // let isIe =this.IEVersion()
    // if(isIe){
    //   this.showIE=true;
    // }
  },
};
</script>

<style lang="scss" scoped>
@import "./index";
@import "~assets/css/mixin";
</style>
<style>
#loginPage .app_down_label {
  top: 3rem;
  right: 3rem;
  /* height:30px; */
  /* margin-right:2rem; */
  position: absolute;
  width: 6rem;
  height: 1.8rem;
  border: #f76a0d 1px solid;
  border-radius: 1rem;
  text-align: center;
}
#loginPage .app_down_labelText {
  line-height: 1.8rem;
  font-size: 0.7rem;
  color: #f76a0d;
  cursor: pointer;
  text-align: center;
}
#loginPage .app_down_labelQrcode::after {
  position: absolute;
  content: "";
  top: -1rem;
  left: 50%;
  transform: translateX(-50%);
  border-top: 0.5rem transparent dashed;
  border-left: 0.5rem transparent dashed;
  border-bottom: 0.5rem #fff dashed;
  border-right: 0.5rem transparent dashed;
  /* box-shadow: 0px 1px 12px 0px rgba(75, 75, 72, 1), 0px 0px 0px 0px rgba(255,255,255,1); */
}
#loginPage .app_down_labelQrcode {
  position: absolute;
  z-index: 9999;
  left: 50%;
  transform: translateX(-50%);
  top: 2.5rem;
  box-shadow: 0px 1px 12px 0px rgba(75, 75, 72, 0.5),
    0px 0px 0px 0px rgba(255, 255, 255, 0.5);
  background-color: #ffffff;
  width: 9rem;
  height: 11rem;
  text-align: center;
  padding: 1rem 0.5rem 1rem 1rem;
  display: none;
  border: 1px solid #ecf0f1;
  border-radius: 15px;
}
#loginPage .app_d_label_desc {
  text-align: center;
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  color: #848484;
  font-size: 0.8rem;
  width: 100%;
}
#loginPage .app_down_label:hover .app_down_labelQrcode {
  display: block;
}
#loginPage .input input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px white inset;
  /* -webkit-text-fill-color: #CDCDCD; */
}
#loginPage .el-input__inner {
  background-color: #fff;
  height: 2rem;
  line-height: 2rem;
  padding-left: 2.4rem;
  font-size: 1rem;
  color: black;
  border: none;
  border-bottom: 1px solid #dcdfe6;
  border-radius: 0;
}
#loginPage .el-textarea__inner {
  width: 18rem;
  height: 5.5rem;
  background-color: #fff;
  font-size: 0.8rem;
}
</style>

