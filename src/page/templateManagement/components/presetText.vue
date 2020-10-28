<!--*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************-->
<template>
  <div
    class="textbox"
    @dblclick="editCentent_"
    :style="{
      backgroundColor: item_.backgroundColor,
    }"
   
  >
  <!-- 
      @click="contenteditableParent"
   @mousedown="clickP($event,1)"
      @mouseup="clickP($event,2)"

   -->
    <!-- 预置文本 -->

    <p
      v-if="item_.type == 'presetText'"
       class="editP"
      :contenteditable="contenteditable"
     
      @blur="textBlur"
       @focus="onFocus"
      :ref="item_.key+'_p'"
      style="width:100%;text-align:justify;overflow: hidden;"
      data-event-dbclick="dbclick_noCopy"
      
      :class="{ fontWeight: item_.fontWeight }"
      :style="{
        color: item_.fontColor,
        fontFamily: item_.fontFamily,
        textAlign: item_.textAlign,
         
    textAlignLast: item_.textAlign,
        top:verticalAlignModule[item_.verticalAlign],
        transform:`translateY(-${verticalAlignModule[item_.verticalAlign]})`,
        fontSize: item_.fontSize + 'px',
       minHeight:'10px',
      }"
      v-html="item_.text.length > 0 ?textData : '请输入预置文本'"
    ></p>
    <!--  -->
        <!--  -->
     <!-- minHeight: item_.minh + 'px' -->
    <!-- 文本组件 -->
     <!-- minHeight: item_.minh + 'px' -->
    <p

      v-if="item_.type == 'textComponent'"
       class="editP"
     
      @blur="textBlur"
       @focus="onFocus"
      :ref="item_.key+'_p'"
      :contenteditable="contenteditable"
      data-event-dbclick="dbclick_noCopy"
     
      style="width:100%;text-align:justify;overflow: hidden;"
      :class="{ fontWeight: item_.fontWeight }"
      :style="{
        color: item_.fontColor,
        fontFamily: item_.fontFamily,
        textAlign: item_.textAlign,
      
        top:verticalAlignModule[item_.verticalAlign],
        transform:`translateY(-${verticalAlignModule[item_.verticalAlign]})`,
        textAlignLast: item_.textAlign,
        fontSize: item_.fontSize + 'px',
       minHeight:'10px',
       
      }"
      v-html="
        item_.placeholder.length > 0
          ?placeholderData
          : '请输入提示语'
      "
    ></p>
    <!-- @mousedown="clickP($event,1)"
      @mouseup="clickP($event,2)" -->
     <!-- @dblclick="editCentent_" -->
  </div>
</template>
<script>
export default {
  name: "app",

  data() {
    return {
      verticalAlignModule:{
        top:'0%',
        bottom:'100%',
        middle:'50%'
      },
      eventValue1: null,
      contenteditable: false,
      file: "",
      imgsrc: "",
      eventValue: null
    };
  },
  props: {
    item_: {
      type: Object
    }
  },
  computed: {
    textData: {
      //预置文本
      get: function() {
        return this.eventValue || this.item_.text;
      },
      set: function() {
        return this.eventValue || this.item_.text;
      }
    },
    placeholderData: {
      get: function() {
        return this.eventValue1 || this.item_.placeholder;
      },
      set: function() {
        return this.eventValue1 || this.item_.placeholder;
      }
    }
  },
  mounted() {
    // this.$nextTick(()=>{
    //   this.$refs[this.item_.key].onblur=this.pBlur()
    // })
  },
  watch: {
    "item_.fontSize": {
      deep: true,
      handler(n, o) {
        if (this.item_.type == "textComponent") {
          return;
        }
        if(n==o){
          return
        }
        this.$nextTick(() => {
          let targetScrollHeight = this.$refs[this.item_.key + "_p"]
            .scrollHeight;
          console.log("fontSize", n, o, targetScrollHeight);
          this.watchResetHeight(targetScrollHeight);
        });
      }
    },
    "item_.fontWeight": {
      deep: true,
      handler(n, o) {
        if (this.item_.type == "textComponent") {
          return;
        }
        console.log("fontWeight", n, o);
        if(n==o){
          return
        }
        this.$nextTick(() => {
          let targetScrollHeight = this.$refs[this.item_.key + "_p"]
            .scrollHeight;
          console.log("fontWeight", n, o, targetScrollHeight);
          this.watchResetHeight(targetScrollHeight);
        });
      }
    }
  },
  methods: {
    onFocus(e){
      // e.target.parentElement.style.border='1px solid #F76A0D'
      // e.target.parentElement.style.padding='1px '
       if(this.item_.type=='presetText'){
         if(this.item_.text.length<1){
          e.target.innerText='';
        }
       }else{
         if(this.item_.placeholder.length<1){
          e.target.innerText='';
        }
       }
    },
     clickP(e,type){
      //  e.stopPropagation();
      //   e.preventDefault();
      //可编辑的时候阻止事件，否则不可拖动
      // if(!!this.contenteditable){
      //   console.log('组织冒泡',type);
      //   e.stopPropagation();
      //   e.preventDefault();
      // }
    },
    watchResetHeight(targetScrollHeight) {
      // 失去焦点的时候让框显示点点点

      if (this.item_.type == "textComponent") {
        return;
      }
      // this.$nextTick(()=>{
      if (targetScrollHeight > this.item_.height) {
        console.log("watchResetHeight", targetScrollHeight);

        this.$emit("resetHeight", targetScrollHeight, this.item_);
        return;
      }
      if (targetScrollHeight > this.item_.minh) {
        this.$emit("resetHeight", targetScrollHeight, this.item_);
      }
      // })
    },
    textBlur(e) {
      console.log(e.target.scrollHeight, this.item_.height);

        // e.target.parentElement.style.border='1px solid #dedede'
        // e.target.parentElement.style.padding='0'
      this.contenteditable = false;
      let value = e.target.innerText,
        emitValue = "";
      // if(value == "双击修改文本组件提示语"){
      //   return;
      // }

      if (value.length < 1 && this.item_.type != "presetText") {
        value = "请输入提示语";
        e.target.innerText = "请输入提示语";
      }
      console.log('value',value);
      
      this.$emit("setPlaceHolder", this.item_, value);
      this.$emit('resetResizable',true,this.item_)
      this.$nextTick(() => {
        // this.$parent.$el.style.zIndex=this.item_.zIndex
        // e.target.style.height=this.item_.height;
        // e.target.style.minHeight='0px';
        // e.target.style.display='flex';
        // e.target.parentElement.style.display='flex';
        // e.target.style.overflow='hidden';
        // e.target.style.boxShadow = ''
        // e.target.style.backgroundColor='rgba(255,255,255,0)';
        // if(this.item_.type=="textComponent"){
        //   e.target.parentElement.style.whiteSpace='pre-wrap'// pre-wrap
        // }
        if (e.target.scrollHeight > this.item_.height) {
          //  let arx =Math.ceil( this.$refs[this.item_.key+'_p'].scrollHeight/this.item_.text.length)
          //  console.log('失去焦点');
          //  if(this.item_.type=='textComponent'){
          //   this.eventValue1=this.item_.placeholder.substr(0,this.item_.height/arx-3)+'...'
          //   // this.eventValue1=this.item_.placeholder.substr(0,this.item_.text.length*arx-3)+'...'
          //  }else{
          //    this.eventValue=this.item_.text.substr(0,this.item_.height/arx-3)+'...'
          //   //  this.eventValue=this.item_.text.substr(0,this.item_.text.length*arx-3)+'...'
          //  }
          // this.isTextData=true
        } else {
          if (this.item_.type == "textComponent") {
            this.eventValue1 = this.item_.placeholder;
          } else {
            this.eventValue = this.item_.text;
          }
        }
        this.$forceUpdate();
      });
    },
  
    contenteditableParent(e) {
      //console.log(e.target.tagName);

      // if (e.target.tagName != "P") {
      //   //console.log('blur',);
      //   this.contenteditable = false;
      // }
    },
   
    editCentent_(e) {
      
       if (this.item_.type == "textComponent") {
        this.eventValue1 = null;
      } else {
        this.eventValue = null;
      }
     
     
       let isChrome =navigator.userAgent.indexOf("Chrome") !== -1
      this.contenteditable =true//isChrome?'plaintext-only':true//;
      
      // e.target.innerHTML+='1'
      this.$nextTick(() => {
       

        if (document.selection) {
          var range = document.body.createTextRange();
          range.moveToElementText(e.target);
          range.select();
        } else if (window.getSelection) {
          var range = document.createRange();
          range.selectNodeContents(e.target);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
        }

        this.$emit('resetResizable',false,this.item_)

        // if(e.target.className=="textbox"){
        //   e.target.children[0].focus();
        // }else{
        //   e.target.focus();
        // }
        
        //  e.target.setSelection(0,e.target.innerText.length);
      });

      e.stopPropagation();
      e.preventDefault();
    }
  }
};
</script>
<style scoped>
p {
  text-align: justify;
  margin-top: 0;
  margin-bottom: 0;
}
.fontWeight {
  font-weight: bold;
}

/* textalign:justify 中textalignlast 不兼容的时候用这个 */
/* p:after {
    content: '123';
    text-align: justify;
    display: inline-block;
    width: 100%;
  } */

.textbox {
  /* display: table; */
  /* 识别回车和换行 */
  white-space: pre-wrap;
  word-break: break-all;
  height: 100%;
  width:100%;
  
}

</style>
<style >
.editP{
  outline: none;

  position:absolute;
    /* border-color: #F76A0D; */
}
</style>