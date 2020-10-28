import {
  apiNoce,
  apiVersion,
  getJwtTokenConsortium
} from '../api/upChain.js'
import sha256 from 'sha256';
import aes from 'utils/aes.js'

export default {
  //     safe合约属于chaincode合约一种,具体Invocation传参如下:
  // Invocation:
  // 	args:keyItem
  // 	meta:PDX_SAFE_ACTION→[4]     //创建key传4 更新传5 删除传6 获取传7
  // 	meta:PDX_SAFE_AUTHZ→jwtToken  //自签名的token

  // 参数说明:
  // 1.keyItem
  // 	keyItem为protobuf对象,KeyItem的protobuf定义参考pdxsafe_body.proto
  // 	keyItem需传参如下:
  // 		dname:report	//report固定
  // 		desc:{desc}	//描述,可以为空
  // 		key:{keyparam}
  // 			//用户公钥上链:user_{username};如user_zhangsan
  // 			//成员公钥上链:sysUser_{username};如sysUser_admin
  // 			//验证报告上链:report_{fileHash};如report_123
  // 		value:{valueparam}
  // 			//用户公钥上链如:{“username”:”zhangsan”,”pubKey”:”123”,”cadre”:”张三”,”level”:”节点用户”}
  // 			//成员公钥上链如:{“username”:”admin”,”pubKey”:”123”,”realName”:”霍霍”}
  // 			//验证报告上链如:{“fileName”:”abc.txt”,”fileHash”:”123”,”username”:”王柳”}
  // 		version:{version}	//创建key版本不用传,更新时传最新版本号,最新版本号可以从链上获取



  // 2. jwtToken
  // 		jwtToken为用户自签名的授权token,参数如下
  // {
  // "sk": "", // 被授权方的public key
  // "d" : "",  // domain
  // "k" : "",  // key //如果设置了k的值，这个token的权限就只能操作这个key，不能操作	domain，如果操作domain，k应为空（不设置）
  // "a" : "",  // “C”, “R”, "U", or "D"
  // "n" : "",  // nonce 协议栈暂时不用 String类型
  // "ak" : "", // 授权方的public key
  // "s: : ""   // 授权方为本次授权赋予的seq number 协议栈暂时不用
  // }
  data() {
    return {
      header: {
        "alg": 'ES256',
        "typ": 'JWT',
      },
      payload: {
        "sk": '', //当前登录者公钥
        "ak": '', //当前登录者公钥
        "d": "report", //jwt会重新赋值
        "k": "",
        "a": "CU",
        "n": "1",
        "s": 10
      },
      noce: '',
      Base64Url: require('base64url'),
      Base64: require('js-base64').Base64,
      memberForm: {
        pubKey: ""
      },
      memberRules: {
        pubKey: [{
          required: false,
          message: "请输入用户私钥",
          trigger: "change"
        }]
      },
      isPiveKey: false,
      loading2_: false,
      showCreatedKey: false,
      pubk: '',
      prik: ''
    }
  },
  methods: {
    //重置私钥
    resetPubkey(pwd) {
      // 创建私钥
      let salt = this.$md5('PDXSafe' + pwd)
      // let radom16Salt = salt.substr(7,16)
      sessionStorage.setItem('salt', salt)
      let walletAccount = this.wallet();
      let privateKey = walletAccount.privateKey;
      let PublicKey = walletAccount.signingKey.keyPair.compressedPublicKey;

      let address = this.checkAddress(privateKey);

      // aes.Encrypt(privateKey,salt),aes.Decrypt('D95E973','be19e28'));
      //生成加密对
      let aesData = aes.Encrypt(privateKey, salt);
      sessionStorage.setItem('PPkey', JSON.stringify({
        address: address,
        pubK: PublicKey,
        priK: aesData
      }))
      return {
        pubK: PublicKey,
        priK: aesData
      }
    },
    // 交易
    async txSign(type, valueInfo, setUserName) {
      // pubKey 使用操作人的 ， domain，K 的值是操作谁就用谁的。
      let username = ''
      let userinfo = JSON.parse(sessionStorage.getItem('user'))
      if (setUserName) {
        // 修改企业用户和成员，username用设置人的username
        username = setUserName
      } else {
        //修改自己的信息
        username = userinfo.username
      }
      //获取交易顺序
      let noce = await this.getNoce();
      // let versionParams={
      //   userName:userinfo.username,
      //   type:type//溯源-管理员上链
      // };
      //获取version
      let version = await this.getVersion(type, username) //
      let jwt = await this.messageSign(type, username)
      // let PublicKey = JSON.parse(sessionStorage.getItem('PPkey')).pubK;
      // 合约内容数据
      let lolJwt = await getJwtTokenConsortium()
      let sginPrams = this.tranSgin(type, username, valueInfo, version, jwt, noce, lolJwt);
      return sginPrams

    },
    //解密出私钥
    Decrypt() {
      let ppkey = JSON.parse(sessionStorage.getItem('PPkey'))
      let privateKey = ppkey.priK;
      let salt = sessionStorage.getItem('salt');
      return aes.Decrypt(privateKey, salt)
    },

    // cachePrikeyPubkey(){


    //    let walletAccount = this.wallet();
    //    let privateKey = walletAccount.privateKey;
    //    let PublicKey = walletAccount.signingKey.keyPair.compressedPublicKey;

    //    sessionStorage.setItem('PPkey',JSON.stringify({prik:privateKey,pubK:PublicKey}))
    //    return {prk:privateKey,puk:PublicKey}
    // },
    copy() {
      this.$message({
        message: '复制成功！',
        type: 'success'
      });
    },
    creatWallet2() {
      this.loading2_ = true;
      setTimeout(() => {
        let walletAccount = this.wallet();


        this.prik = walletAccount.privateKey;
        this.pubk = walletAccount.signingKey.keyPair.compressedPublicKey;

        this.loading2_ = false;
      }, 1500);
    },
    creatPrikey() {
      this.loading2_ = true;
      this.showCreatedKey = true;
      setTimeout(() => {
        let walletAccount = this.wallet();
        //privateKey 即生成的私钥
        this.prik = walletAccount.privateKey;
        this.pubk = walletAccount.signingKey.keyPair.compressedPublicKey;
        this.loading2_ = false;

      }, 1000);
    },
    resetPubPriKey() {

      let checkIsPub = this.checkPubKey(this.delete(this.memberForm.pubKey));
      if (!checkIsPub) {
        this.$message({
          message: '请检查私钥格式!',
          type: 'warning'
        });
        return;
      }
      let privateKeyInput1 = ''
      if (this.memberForm.pubKey.substr(0, 2) != "0x") {
        privateKeyInput1 = this.memberForm.pubKey;
      } else {
        privateKeyInput1 = this.memberForm.pubKey.slice(2);
      }

      this.$store.state.user.walletInfo.privateKey = privateKeyInput1;
      this.$store.state.user.walletInfo.publick = checkIsPub;

      var privateKey = '';
      if (this.memberForm.pubKey.substr(0, 2) != "0x") {
        privateKey = "0x" + this.memberForm.pubKey;
      } else {
        privateKey = this.memberForm.pubKey;
      }
      this.$store.state.user.walletInfo.address = this.checkAddress(privateKey);
      this.isPiveKey = false;
    },
    async getNoce() {

      let ppkey = JSON.parse(sessionStorage.getItem('PPkey'))
      let privateKey = ppkey.priK
      let salt = sessionStorage.getItem('salt')
      privateKey = aes.Decrypt(privateKey, salt)


      let address = this.checkAddress(privateKey);
      let params = {
        from: address
      }
      let data = await apiNoce(params);
      this.noce = data
      return data;
    },

    async getVersion(type, userName) {
      // 溯源-管理员上链keyItem定义
      // 溯源-企业用户上链keyItem定义
      // 溯源-产品上链keyItem定义
      // 证书-管理员上链keyItem定义
      // 证书-颁发证书上链keyItem定义
      // 验证报告-管理员上链keyItem定义
      // 验证报告-普通用户上链keyItem定义
      // 验证报告-报告文件上链keyItem定义

      let arr = ['trace-admin', 'trace-company', 'trace-product', 'cert-admin', 'cert-issue', 'report-admin', 'report-user', 'report-file']
      let params = {
        keyName: userName,
        domain: arr[type]
      }
      let result = await apiVersion(params);
      return result;
    },
    //交易签名
    tranSgin(type, username, valueInfo, version, jwt, noce, lolJwt) {
      // 溯源-管理员上链keyItem定义
      // 溯源-企业用户上链keyItem定义
      // 溯源-产品上链keyItem定义
      // 证书-管理员上链keyItem定义
      // 证书-颁发证书上链keyItem定义
      // 验证报告-管理员上链keyItem定义
      // 验证报告-普通用户上链keyItem定义
      // 验证报告-报告文件上链keyItem定义

      let arr = ['trace-admin', 'trace-company', 'trace-product', 'cert-admin', 'cert-issue', 'report-admin', 'report-user', 'report-file']
      var keyItem = {
        'key': username, //根据类型不同组成数据；
        'value': this.toByte(JSON.stringify(valueInfo)), //类型不同 JSON对象不同；
        'desc': '',
        'dname': arr[type], //domain
        'version': version, //获取版本号
        'Uauth': [new Buffer(33)] //这个公共权限
      }

      var stauts = version > 0 ? 5 : 4
      // let meta_ = {}
      // meta_[window.g.action] = this.intByt(stauts)//版本号大于0更新 5，等于0创建 4
      // meta_[window.g.authz]= this.toByte(jwt)
      var Invocation = {
        "fcn": "",
        "args": [this.buffer(keyItem, 'KeyItem', 1)],
        "meta": {
          // ...meta_,
          'PDX_SAFE_ACTION': this.intByt(stauts), //版本号大于0更新 5，等于0创建 4
          'PDX_SAFE_AUTHZ': this.toByte(jwt),
          'jwt': this.toByte(lolJwt) //联盟链参数
        }
      }
      var payload = this.buffer(Invocation, 'Invocation', 1);
      var Transaction = {
        "type": 1, //固定的值
        "payload": payload //对象payload信息
      }
      var buff = this.buffer(Transaction, 'Transaction', 1);
      var gasPrice = "0x6fc23ac00";
      var gasLimit = "0x0";
      var num = "0x0";

      //合约地址
      var toName = window.g.contractAddress;
      //nonce需要前端通过URL获取； gasPrice gasLimit num参考iaas 写死
      var deployTxSign = {
        nonce: noce,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        to: toName, //合约地址
        value: num,
        data: Array.from(buff),
        chainId: Number(window.g.chainId)
      }

      var privateKey = this.Decrypt();

      if (privateKey.substr(0, 2) != "0x") {
        privateKey = privateKey;
      } else {
        privateKey = privateKey.slice(2)
      }


      var deploy = '0x' + this.eth_getParems(deployTxSign, privateKey);
      return deploy;
      // 接口请求
      // var paramsValue = '{"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":["'+deploy+'"],"id":1}';
    },
    //   jwt
    messageSign(type, username) {
      let header = this.header;
      let payload = this.payload;

      // 溯源-管理员上链keyItem定义
      // 溯源-企业用户上链keyItem定义
      // 溯源-产品上链keyItem定义
      // 证书-管理员上链keyItem定义
      // 证书-颁发证书上链keyItem定义
      // 验证报告-管理员上链keyItem定义
      // 验证报告-普通用户上链keyItem定义
      // 验证报告-报告文件上链keyItem定义

      let arr = ['trace-admin', 'trace-company', 'trace-product', 'cert-admin', 'cert-issue', 'report-admin', 'report-user', 'report-file']
      payload.d = arr[type]
      let ppk = JSON.parse(sessionStorage.getItem('PPkey'))
      let publick = ppk.pubK


      if (publick.substr(0, 2) != "0x") {
        publick = publick;
      } else {
        publick = publick.slice(2)
      }
      let newPublck = publick;
      payload.ak = newPublck;
      payload.sk = newPublck;
      payload.k = username; // key //如果设置了k的值，这个token的权限就只能操作这个key，不能操作	domain，如果操作domain，k应为空（不设置）
      var suanfa = require('secp256k1');

      let message = this.Base64.encodeURI(JSON.stringify(header)) + '.' + this.Base64.encodeURI(JSON.stringify(payload));
      const msg = this.tostringToUint8Array(message);
      let sha256String = sha256(msg);
      let mesByte = this.toByte2(sha256String);
      let mesByte2 = new Buffer(32);
      for (let i = 0; i < mesByte2.length; i++) {
        mesByte2[i] = mesByte[i];
      }

      //this.$store.state.user.walletInfo.privateKey //之前是用store维护
      //现在是从服务器取然后解密
      let privateKey_ = this.Decrypt()

      if (privateKey_.substr(0, 2) != "0x") {
        privateKey_ = privateKey_;
      } else {
        privateKey_ = privateKey_.slice(2)
      }

      const privateKey = this.toByte2(privateKey_) //this.toByte2(this.$store.state.user.walletInfo.privateKey);
      let privateKey2 = new Buffer(32);
      for (let i = 0; i < privateKey2.length; i++) {
        privateKey2[i] = privateKey[i];
      }
      let sginMess = suanfa.sign(mesByte2, privateKey2);
      let last2 = this.Base64Url(sginMess.signature);
      this.jwt = message + '.' + last2;


      return this.jwt;
    },

    // async checkuploadAct(data) {
    //   let result = await checkUpload(data)
    //   return result
    // }
  }
}
