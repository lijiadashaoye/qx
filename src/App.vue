<template>
  <div class="app">
    <main>
      <router-view class="view"></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: "app",
  data: function() {
    return {};
  },
  created() {
   this.setHtmlSizeWeb();
  },
  mounted(){
    // this.setHtmlSizeWeb();
  },
  updated(){
    var winW =document.body.clientWidth;
    if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
       
        //把设计图分成100份 1rem是7.5px  假设手机是375 375/100 1份是3.75 400/100 一份是4px  
        //算出 设计图和手机宽度的比列 750:400 =7.5:4
        // 也就是他俩的1rem的比列是7.5:4
        // 想要手机的1rem = 设计图的1rem   那就需要 winw/100 * （750/100)/(winW/100)  
        document.documentElement.style.fontSize = winW / (750 / 100)*2   + "px";     
        //当页面大小发生改变,重新修正rem为新窗口尺寸的3.75分之一
        window.onresize =function(){
        
          document.documentElement.style.fontSize =winW / (750 / 100)*2  + "px";
        }
      } 
  },
  methods: {
    setHtmlSizeWeb() {
       //获取页面宽度
      
      var winW =document.body.clientWidth;
       var width_=''
    
      if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        width_=750//winW / (750 / 100)*2 + "px";
        //把设计图分成100份 1rem是7.5px  假设手机是375 或者 400  
        //如果按照7.5px 去画手机端 那么手机端的1rem ==winW / (750 / 100)一份1rem=375/(7.5)=50份。或者 400/7.5=53.333f嗯
        // 也就是他俩的1rem的比列是7.5:4
        // 想要手机的*rem = 设计图的1rem   

        document.documentElement.style.fontSize = winW / (750 / 100)*2   + "px";     
        //当页面大小发生改变,重新修正rem为新窗口尺寸的3.75分之一
        window.onresize =function(){
          document.documentElement.style.fontSize =winW / (750 / 100)*2  + "px";
        }
      } else {
        width_=1920//winW / (1920 / 20)  + "px";
        document.documentElement.style.fontSize =winW / (1920 / 20)  + "px";
        //当页面大小发生改变,重新修正rem为新窗口尺寸的3.75分之一
        window.onresize =function(){
          document.documentElement.style.fontSize =winW / (1920 / 20) + "px";

        }
      }
      //根据页面宽度设置html字体大小。
     
    }
  }
};
</script>

<style lang="scss">
.app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif, arial;
  // min-height: 445px;
}
.enclass {
  font-family: arial;
}
.app main {
  height: 100%;
  width: 100%;
  padding: 0.1px;
}
</style>