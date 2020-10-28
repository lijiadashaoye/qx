<template>
  <div
  @click="contenteditableParent"
    class="tmptext"
    @dblclick="editCentent_"
    :style="{
      backgroundColor: item_.backgroundColor,
    }"
  >
  <!--  -->
 
 <div
      class="editP"
      v-if="item_.type == 'textComponent'"
      @paste="onpaste"
      @keyup="keyup"
      @blur="textBlur"
      @focus="onFocus"
       :class="{ fontWeight: item_.fontWeight }"
      :ref="item_.key + '_p'"
      :contenteditable="contenteditable"
      data-event-dbclick="dbclick_noCopy"
      @dblclick="editCentent_"
      :data_="item_.placeholder"
      :data__="item_.text"
      :data_1=" item_.placeholder && item_.placeholder.length > 0"
      style="width:100%;text-align:justify;"
     :style="{
        color: item_.fontColor,
        wordBreak:'break-all',
        whiteSpace: 'pre-wrap',
        fontFamily: item_.fontFamily,
        textAlign: item_.textAlign,
        textAlignLast: item_.textAlign,
        fontSize: item_.fontSize + 'px',
       
      }" 
     
    >{{placeholderData}}</div>
   
   
  </div>
</template>
<script>
export default {
  name: "app",

  data() {
    return {
      contenteditable: true,
      file: "",
      imgsrc: "",
      eventValue1: null,
    };
  },
  props: {
    item_: {
      type: Object
    },
    value_: {
      type: String
    }
  },
  // model: {
  //   prop: "value_",
  //   event: "keyup"
  // },
computed: {
   
    placeholderData: {
      get: function() {
        
        let placeH = this.item_.placeholder=='请输入提示语'?'请输入':this.item_.placeholder;
console.log( this.eventValue1 || placeH);

        return this.eventValue1 || placeH;
      },
      set: function() {

         let placeH = this.item_.placeholder=='请输入提示语'?'请输入':this.item_.placeholder;
         
        return this.eventValue1 || placeH;
        
      }
    }
  },
 
  mounted() {
    const style = `
        #${this.item_.key}'_p'::-webkit-input-placeholder {
              font-size:${this.item_.fontSize}px !important;
              color:${this.item_.fontColor};
            
          }`;
    this.styleEl = document.createElement("style");
    this.styleEl.type = "text/css";
    this.styleEl.innerHTML = style;
    document
      .getElementsByTagName("head")
      .item(0)
      .appendChild(this.styleEl);
  },

  methods: {
     textBlur(e) {
       if(this.item_.text.length<1){
          e.target.innerText=this.item_.placeholder=='请输入提示语'?'请输入':this.item_.placeholder;
          
        
        }
        e.target.parentElement.style.border='1px solid #dedede'
         e.target.parentElement.style.padding='0'
        // this.contenteditable = false;
        if (this.item_.text.length>0) {
            this.eventValue1 = this.item_.text;
        }else{
          this.eventValue1=null;
          e.target.innerHTML=this.item_.placeholder=='请输入提示语'?'请输入':this.item_.placeholder;
        }
     },
    // change(e) {
    //   // if(e.target.value.length>28){
    //   //   e.target.value=e.target.value.substring(0,28);
    //   // }
    //   this.$emit("keyup", e.target.value);
    // },
    editCentent_(e) {
      return ;
           console.log('getSelection');
      // this.contenteditable = true;
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
        
        
       
      });

      e.stopPropagation();
      e.preventDefault();
    },
    onpaste(e){ 
      return ;
      let paste = (e.clipboardData || e.clipboardData).getData('text');
      // (e.clipboardData || e.clipboardData).setData("text", '123132')

    paste = paste.replace(/<.*?>/g, "");
    if(paste.length<1)return false;
    console.log('paste',paste);
    const selection = window.getSelection();
    if (!selection.rangeCount) return false;
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(paste));
    selection.collapseToEnd()
    e.preventDefault();
    },
    onFocus(e){
     e.target.parentElement.style.border='1px solid #F76A0D'
      e.target.parentElement.style.padding='1px '
       if(this.item_.text.length<1){
          e.target.innerText='';
         
        
        }
    },
    // 该方法获取高度实时设置高度
    keyup(e) {
    
      let value = e.target.innerText//.replace(/<.*?>/g, "");
     

      
       this.$emit("keyup", value,this.item_);
    },
    contenteditableParent(e) {
      // console.log(this.$refs[this.item_.key+'_p']);
      this.$refs[this.item_.key+'_p'].focus()
      // if(e.target.classList.value!='editP'){
      
      //   this.contenteditable = false;
      // }
    },
  }
};
</script>
<style >
.editP{
  outline: none;
  font-weight:100;
    /* border-color: #F76A0D; */
}
.fontWeight {
  font-weight: bold;
}
</style>
<style scoped>
textarea::-webkit-input-placeholder {
  font-size: 0.7rem;
}
.comments {
  box-sizing: border-box;
  /* padding:10px 0px 0px 0px; */
  height: 100%;
  width: 100%;
  /*自动适应父布局宽度*/
  overflow: auto;
  word-break: break-all;
  /*在ie中解决断行问题(防止自动变为在一行显示，主要解决ie兼容问题，ie8中当设宽度为100%时，文本域类容超过一行时，
当我们双击文本内容就会自动变为一行显示，所以只能用ie的专有断行属性“word-break或word-wrap”控制其断行)*/
}

.tmptext {
  cursor:pointer;
  display: flex;
  width: 100%;
  height: 100%;
  border: 1px solid #dedede;
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
