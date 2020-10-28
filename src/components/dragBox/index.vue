<script>
// import Bus from '../../utils/bus.js';
export default {
  name: "dragBox",
  data() {
    return {
      hasMove: false,
      boundary: {}, //拖拽界限
      basePoint: {}, //基点
      wid: "dragboxIng",
      index: 0,
      startX: 0,
      startY: 0,
      flag: false,
      retcLeft: "0px",
      retcTop: "0px",
      retcHeight: "0px",
      retcWidth: "0px"
    };
  },

  mounted() {
    // var div = document.createElement("div");
    // div.id = this.wid;
    // div.className = "div";
    // div.style.left = this.startX + "px";
    // div.style.top = this.startY + "px";
    // document.body.appendChild(div);
    this.$nextTick(() => {
      this.boundary = document
        .querySelector("#phoneDrag")
        .getBoundingClientRect();
        
      this.basePoint = document
        .querySelector(".box_phone")
        .getBoundingClientRect();
    });
    window.addEventListener("resize", this.onResize, false);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize(e) {
      this.boundary = document
        .querySelector("#phoneDrag")
        .getBoundingClientRect();
      this.basePoint = document
        .querySelector(".box_phone")
        .getBoundingClientRect();
    },
    // 获取id
    $(id) {
      return document.getElementById(id);
    },
    // 初始化选框
    initialize() {
      let wid = this.wid;
      this.$(wid).style.left = 0;
      this.$(wid).style.top = 0;
      this.$(wid).style.width = "0px";
      this.$(wid).style.height = "0px";
      this.$(wid).style.borderWidth = "0px";
      this.flag = false;
    },
    onmousedown(e) {
      let navOperate= document.querySelector('.navOperate')
    

      if(navOperate && navOperate.contains(e.target) || e.target.getAttribute('contenteditable')){
         console.log('dragbox',this.flag);
        return 
      }
      // console.log('flat=true');
      
      this.flag = true;
     
      
      // try{
      var evt = window.event || e;
      var scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop;
      var scrollLeft =
        document.body.scrollLeft || document.documentElement.scrollLeft;
      this.startX = evt.clientX + scrollLeft;
      this.startY = evt.clientY + scrollTop;

      // }catch(e){
      //   console.error('error',e);
      // }
    },

    onmouseup(e) {
      if (!this.flag) {
        return true;
      }
      // try{
      let option = this.$(this.wid).getBoundingClientRect();
      let boundary = document
        .querySelector(".box_phone")
        .getBoundingClientRect();
      let newBoundary = {};
      for (let key in option) {
        if (key != "width" && key != "height" && key != "toJSON") {
          newBoundary[key] = option[key] - boundary[key];
        } else {
          (key == "width" || key == "height") &&
            (newBoundary[key] = option[key]);
        }
      }
      this.initialize();
      let rectModule = this.$store.state.dragLesize.rects;
      rectModule.map((item, index) => {
        if (
          newBoundary.left < item.left &&
          newBoundary.top < item.top &&
          newBoundary.left + newBoundary.width > item.left + item.width &&
          newBoundary.top + newBoundary.height > item.top + item.height
        ) {
          this.$store.dispatch("dragLesize/setActiveMultiple", { id: index });
        } else {
          this.$store.dispatch("dragLesize/unsetActive", { id: index });
        }
        return item;
      });

      //     }catch(e){
      //   console.error('err',e);

      //     }
    },
    onmouseleave(e) {
      this.initialize();
    },

    onmousemove(e) {

      if (this.flag) {
        //移除可控制范围
        if (
          e.clientX <= this.boundary.left + 5 ||
          e.clientX > this.boundary.right - 5 ||
          e.clientY <= this.boundary.top + 5 ||
          e.clientY > this.boundary.bottom - 5
        ) {
          
          // document.body.removeChild(this.$(this.wid));
          this.initialize();
          return false;
        }

        this.hasMove = true;
        window.getSelection
          ? window.getSelection().removeAllRanges()
          : document.selection.empty();
        // try{
        let wid = this.wid;
        var evt = window.event || e;
        var scrollTop =
          document.body.scrollTop || document.documentElement.scrollTop;
        var scrollLeft =
          document.body.scrollLeft || document.documentElement.scrollLeft;
        this.retcLeft =
          (this.startX - evt.clientX - scrollLeft > 0
            ? evt.clientX + scrollLeft
            : this.startX) + "px";
        this.retcTop =
          (this.startY - evt.clientY - scrollTop > 0
            ? evt.clientY + scrollTop
            : this.startY) + "px";
        this.retcHeight =
          Math.abs(this.startY - evt.clientY - scrollTop) + "px";
        this.retcWidth =
          Math.abs(this.startX - evt.clientX - scrollLeft) + "px";
        // 如果是点击，那么间距会很小，就不设置
        if (
          Math.abs(this.startY - evt.clientY - scrollTop) < 15 ||
          Math.abs(this.startX - evt.clientX - scrollLeft) < 15
        ) {
          return;
        }
        this.$(wid).style.left = this.retcLeft;
        this.$(wid).style.top = this.retcTop;
        this.$(wid).style.width = this.retcWidth;
        this.$(wid).style.height = this.retcHeight;
        this.$(wid).style.borderWidth = "1px";
        // }catch(e){
        //   console.error(e)
        // }
      }
    }
  },
  watch:{
    flag(n,o){
      if(o && !n){
        console.log('框选结束');
        this.$emit('mouseEnd')
        
      }
    }
  },
  render(h) {
    let {
      handleClick,
      drag,
      name,
      handleChange,
      multiple,
      accept,
      listType,
      uploadFiles,
      disabled,
      handleKeydown
    } = this;
    const data = {
      id: {
        phoneDrag: true
      },
      class: {
        phoneDrag: true
      },
      on: {
        mousedown: this.onmousedown,
        mouseup: this.onmouseup,
        mousemove: this.onmousemove,
        mouseleave: this.onmouseleave
      }
    };

    return (
      <div id="phoneDrag" {...data}>
        <div id="dragboxIng" class="div" style=""></div>
        {this.$scopedSlots.default({})}
      </div>
    );
  }
};
</script>
<style>
#dragboxIng {
  position: fixed;
  background: rgba(11, 204, 43, 0.1);
  border: 1px dashed red;
  z-index: 9999999;
}
</style>
<style lang="scss" scoped>
@import "./index";
@import "~assets/css/mixin";
</style>
