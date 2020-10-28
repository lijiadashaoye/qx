<template>
	<div id="open">
		<div v-if="iswx" class="wx">
			<div class="cover" v-if="isCover">
				<img v-if="AndroidImg" src="../../assets/img/browserOpen.png" />
                <img v-if="iosImg" src="../../assets/img/browserOpenIos.png" />
			</div>
			<div class="img">
				<img src="../../assets/img/sureLogo.png" />
				<div class="wallet" v-if="linkObj.page == 'trace'">信息溯源平台</div>
                <div class="wallet" v-if="linkObj.page == 'cert'">证书防伪平台</div>
				<!-- <div>带你链接一个全新世界</div> -->
			</div>
			<div class="down" @click="cover">
				点击下载
			</div>
           
		</div>
		<div v-if="mark" class="ios wx">
            <div class="out" v-show="isIos">
                <div class="cover" v-if="isCover">
                    <img v-if="AndroidImg" src="../../assets/img/browserOpen.png" />
                    <img v-if="iosImg" src="../../assets/img/browserOpenIos.png" />
                </div>
                <div class="img">
                    <img src="../../assets/img/sureLogo.png" />
                    <div class="wallet" v-if="linkObj.page == 'trace'">信息溯源平台</div>
                    <div class="wallet" v-if="linkObj.page == 'cert'">证书防伪平台</div>
                </div>
                <div class="down" @click="downIos">
                    点击下载
                </div>
            </div>
            <!-- <div class="out2" v-show="noIos">
                <div class="img">
                    <img src="../../assets/img/sureLogo.png" />
                    <div class="wallet" v-if="linkObj.page == 'trace'">信息溯源平台</div>
                    <div class="wallet" v-if="linkObj.page == 'cert'">证书防伪平台</div>
                </div>
                <div class="down" @click="downIos">
                    点击下载
                </div>
            </div> -->
			<!-- <div class="appLogo">
                <img src="../../assets/img/appLogo2.png" alt="">
                <div class="titleVeron">版本号：2.4</div>
            </div>
            <div class="btnOut">
                <a href="itms-services:///?action=download-manifest&url=https://demo.wallet.pdx.ltd/manifest.plist" class="iosBtn">iOS版钱包下载</a>
            </div>
            <div class="tip">
                若出现无法安装，请先备份好助记词并卸载旧版后重新安装新版本。
            </div>
            <div class="title">
                安装教程
            </div>
            <div class="step">
                <div class="titOut">
                    <span class="stepIndex">STEP 1</span>
                    <span class="stepTit">第一次打开PDX钱包会弹出下框：</span>
                </div>
                <div class="imgOut">
                    <img src="../../assets/img/ios1.png" alt="">
                </div>
            </div>
            <div class="step">
                <div class="titOut">
                    <span class="stepIndex">STEP 2</span>
                    <span class="stepTit">在手机设置 → 通用 → 设备管理中找到PDX钱包证书：</span>
                </div>
                <div class="imgOut">
                    <img src="../../assets/img/ios2.png" alt="">
                </div>
            </div>
            <div class="step">
                <div class="titOut">
                    <span class="stepIndex">STEP 3</span>
                    <span class="stepTit">点击信任证书就可以开始使用PDX钱包了：</span>
                </div>
                <div class="imgOut">
                    <img src="../../assets/img/ios3.png" alt="">
                </div>
            </div> -->
		</div>
	</div>
	
</template>

<script>
export default {
    data() {
        return {
            iswx:true,
		    mark:false,
		    mark:false,
            isCover:false,
            AndroidImg:false,
            iosImg:false,
            isIos:true,
            noIos:false,
            linkObj:{}
        }
    },
    methods: {
        searchParse() {
      var url = window.location.href; //获取url中"?"符后的字串
      if (url.indexOf("=") != -1) {
        var obj = {};
        var arr1 = url.split("?");
        var arr2 = arr1[1].split("&");
        for (var i = 0; i < arr2.length; i++) {
          var res = arr2[i].split("=");
          obj[res[0]] = res[1];
        }
        return obj;
      } else {
        // this.ruleForm.inviteUrl = "";
      }
    },
        downIos(){
            // this.isIos = false;
            // this.noIos = true;
             this.isCover = true;
            if(this.is_ios())
            {
                this.iosImg = true;
            }else{
                this.AndroidImg = true;
            }
        },
    	cover()
    	{
            this.isCover = true;
            if(this.is_ios())
            {
                this.iosImg = true;
            }else{
                this.AndroidImg = true;
            }
    	},
        is_weixin() {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") 
            {
                return true;
            } 
            else 
            {
                return false;
            }
        },
        is_ios()
        {
            //判断是ios并且是不是safira
            return /iPhone/.test(navigator.userAgent);
        },
        is_safira(){
            var ua = navigator.userAgent.toLowerCase();
            //判断是不是在iPhone的Safair浏览器打开的本页面
            if (ua.indexOf('applewebkit') > -1 && ua.indexOf('mobile') > -1 && ua.indexOf('safari') > -1 &&
                ua.indexOf('linux') === -1 && ua.indexOf('android') === -1 && ua.indexOf('chrome') === -1 &&
                ua.indexOf('ios') === -1 && ua.indexOf('browser') === -1) {
                return true
            }
            else {
                //alert("请使用iPhone中的Safari浏览器打开本页面！");
                return false
            }
        }
    },
    created() {
         
        // //获取页面宽度
        // var winW =document.body.clientWidth;
        // //根据页面宽度设置html字体大小。
        // document.documentElement.style.fontSize =winW / (750 / 100)  + "px";
        // //当页面大小发生改变,重新修正rem为新窗口尺寸的3.75分之一
        // window.onresize =function(){
        // document.documentElement.style.fontSize =(document.body.clientWidth) / (750 / 100) + "px";
        // }
        document.getElementsByTagName("html")[0].style.minWidth="20px";
        document.getElementsByTagName("body")[0].style.minWidth="20px";
        var winW =document.body.clientWidth;
        //console.log(winW / (750 / 100))
        document.documentElement.style.fontSize =winW / (750 / 100) + "px";
        window.onresize =function(){
        document.documentElement.style.fontSize =(document.body.clientWidth) / (750 / 100)+ "px";
        }
        this.linkObj ={page:'cert'} //this.searchParse();
        
        if(!this.is_weixin())
        {
            if(this.is_ios())
            {
                if(this.is_safira()){
                    if(this.linkObj &&  this.linkObj.page == 'cert'){
                        window.location.href = window.g.certificateIos ;
                    }else if(this.linkObj &&  this.linkObj.page == 'trace'){
                        window.location.href = window.g.traceIos ;
                    }
                }else{
                    this.mark = true;
                    this.iswx = false;
                }
                // this.mark = true;
                // this.iswx = false;
            }
            else
            {
                this.mark = false;
                this.iswx = false;
                if(this.linkObj &&  this.linkObj.page == 'cert'){
                    window.location.href = window.g.certificate ;
                }else if(this.linkObj &&  this.linkObj.page == 'trace'){
                     window.location.href = window.g.trace ;
                }
                
            }
        }else{
            this.iswx = true;
        }
    },
    mounted(){
  this.$nextTick(()=>{
       var winW =document.body.clientWidth;
        //console.log(winW / (750 / 100))
        document.documentElement.style.fontSize =winW / (750 / 100) + "px";
        window.onresize =function(){
        document.documentElement.style.fontSize =(document.body.clientWidth) / (750 / 100)+ "px";
        }
  })
    }
}
</script>

<style scoped="">
    #open{
        height: 100%;
    }
    #open .wx
    {
    	width: 100%;
        height: 100%;
        background: url('../../assets/img/wxBg.png') no-repeat center;
        background-size: cover;
		text-align: center;
    }
    .wx .cover
    {
    	position: fixed;
    	top: 0;
    	left: 0;
    	width: 100%;
    	height: 100%;
    	background: rgba(0,0,0,0.65);
    	text-align: right;
    }
    .out2{
        width: 100%;
        height: 100%;
        /* background: url('../../assets/img/pleaseWait.png') no-repeat center; */
        background-size: cover;
		text-align: center;
    }
    .cover img
    {
    	margin-right: 0.5rem;
    	margin-top: 0.2rem;
    	width: 3rem;
    	height: 2rem;
    }
    .img
    {
    	font-size: 0;
    }
	.img img
	{
		margin-top: 3.5rem;
		margin-bottom: 0.4rem;
		width: 1.6rem;
		height: 1.6rem;
	}
	.img div
	{
		font-size: 0.36rem;
		color: #666;
	}
	.img .wallet
	{
		font-size: 0.56rem;
		color: #000;
		margin-bottom: 0.9rem;
	}
	.down
	{
		border: none;
	    margin: 0 auto;
	    margin-top: 1.6rem;
	    font-size: 0.36rem;
	    color: #fff;
	    width: 4.2rem;
	    height: 0.88rem;
	    line-height: 0.88rem;
	    background: #FF6600;
	    border-radius: 0.7rem;
	}
	.mark
	{
		font-size: 0.36rem;
		text-align: center;
	}
    .appLogo{
        width: 100%;
        text-align: center;
        margin-top: 0.6rem;
    }
    .appLogo img{
        width: 1.2rem;
        height: 1.2rem;
    }
    .titleVeron{
        font-size: 0.26rem;
        color:#666;
        text-align: center
    }
    .btnOut{
        width: 100%;
        text-align: center;
        margin-top: 0.4rem;
    }
    .iosBtn{
        margin: 0 auto;
        width: 3.0rem;
        height: 0.8rem;
        color:#fff;
        line-height: 0.8rem;
        background-color: #4776e6;
        border-radius: 0.5rem;
        font-size: 0.26rem;
        text-decoration:none;
        display: block;
    }
    .tip{
        margin-top: 0.4rem;
        padding:0 0.3rem 0;
        color:#888;
        font-size: 0.25rem;
        line-height: 0.4rem;
    }
    .title{
       margin-top: 0.4rem;
        padding:0 0.3rem 0; 
        color: #000;
        font-size: 0.35rem;
        text-align: center;
    }
    .step{
        width: 100%;
         margin-top: 0.4rem;
        padding:0 0.3rem 0; 
    }
    .step span{
        display: inline-block;
        line-height: 1.5;
    }
    .stepIndex{
        color:#999;
        width: 18%;
        padding-right: 0.05rem;
        font-size: 0.3rem;
    }
    .stepTit{
        color:#333;
        font-size: 0.3rem;
        width: 82%;
    }
    .imgOut{
        margin-top: 0.3rem;
        width: 100%;
        text-align: center;
    }
    .step img{
        margin: 0 auto;
        width: 3.8rem;
        height: 3.35rem;
    }
    .titOut{
        display: flex;
    }
</style>