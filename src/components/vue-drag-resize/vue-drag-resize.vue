<!-- <template src="./vue-drag-resize.html"></template> -->
<!--*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************-->

<template>
  <div
    class="vdr"
    :style="style"
    :class="active || isActive ? 'active' : 'inactive'"
    @mousedown="bodyDown($event)"
    @touchstart="bodyDown($event)"
    @touchend="up($event)"
  >
    <slot></slot>
    <div
      v-for="(stick, ind) in sticks"
      :key="ind"
      class="vdr-stick"
      :class="['vdr-stick-' + stick, isResizable ? '' : 'not-resizable']"
      @mousedown.stop.prevent="stickDown(stick, $event)"
      @touchstart.stop.prevent="stickDown(stick, $event)"
      :style="vdrStick(stick)"
    ></div>
  </div>
</template>
<!-- <script src="./vue-drag-resize.js"></script> -->
<script>
const stickSize = 8;
const styleMapping = {
  y: {
    t: "top",
    m: "marginTop",
    b: "bottom",
  },
  x: {
    l: "left",
    m: "marginLeft",
    r: "right",
  },
};

export default {
  name: "vue-drag-resize",
  props: {
    // 冲突检测
    isConflictCheck: {
      type: Boolean,
      default: false,
    },
    // 当调用对齐时，用来设置组件与组件之间的对齐距离，以像素为单位
    snapTolerance: {
      type: Number,
      default: 1,
      validator: function (val) {
        return typeof val === "number";
      },
    },
    snap: {
      type: Boolean,
      default: true,
    },
    parentKey_mo: {
      type: String,
      default: "",
    },
    parentScaleX: {
      type: Number,
      default: 1,
    },
    parentScaleY: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    preventActiveBehavior: {
      type: Boolean,
      default: false,
    },
    isDraggable: {
      type: Boolean,
      default: true,
    },
    isResizable: {
      type: Boolean,
      default: true,
    },
    aspectRatio: {
      type: Boolean,
      default: false,
    },
    parentLimitation: {
      type: Boolean,
      default: false,
    },
    snapToGrid: {
      type: Boolean,
      default: true,
    },
    gridX: {
      type: Number,
      default: 10,
      validator: function (val) {
        return val > 0;
      },
    },
    gridY: {
      type: Number,
      default: 10,
      validator: function (val) {
        return val > 0;
      },
    },
    parentW: {
      type: Number,
      default: 0,
      validator: function (val) {
        return val >= 0;
      },
    },
    parentH: {
      type: Number,
      default: 0,
      validator: function (val) {
        return val >= 0;
      },
    },
    w: {
      type: Number,
      default: 100,
      validator: function (val) {
        return val > 0;
      },
    },
    h: {
      type: Number,
      default: 200,
      validator: function (val) {
        return val > 0;
      },
    },
    minw: {
      type: Number,
      default: 50,
      validator: function (val) {
        return val > 0;
      },
    },
    minh: {
      type: Number,
      default: 50,
      validator: function (val) {
        return val > 0;
      },
    },
    x: {
      type: Number,
      default: 0,
      validator: function (val) {
        return typeof val === "number";
      },
    },
    y: {
      type: Number,
      default: 0,
      validator: function (val) {
        return typeof val === "number";
      },
    },
    z: {
      type: [String, Number],
      default: "auto",
      validator: function (val) {
        let valid = typeof val === "string" ? val === "auto" : val >= 0;
        return valid;
      },
    },
    dragHandle: {
      type: String,
      default: null,
    },
    dragCancel: {
      type: String,
      default: null,
    },
    sticks: {
      type: Array,
      default: function () {
        return ["tl", "tm", "tr", "mr", "br", "bm", "bl", "ml"];
      },
    },
    axis: {
      type: String,
      default: "both",
      validator: function (val) {
        return ["x", "y", "both", "none"].indexOf(val) !== -1;
      },
    },
  },

  data: function () {
    return {
      showTipLine: false,
      active: this.isActive,
      rawWidth: this.w,
      rawHeight: this.h,
      rawLeft: this.x,
      rawTop: this.y,
      rawRight: null,
      rawBottom: null,
      zIndex: this.z,
      aspectFactor: this.w / this.h,
      parentWidth: null,
      parentHeight: null,
      left: this.x,
      top: this.y,
      right: null,
      bottom: null,
      minWidth: this.minw,
      minHeight: this.minh,
    };
  },

  created: function () {
    this.stickDrag = false;
    this.bodyDrag = false;
    this.stickAxis = null;
    this.stickStartPos = { mouseX: 0, mouseY: 0, x: 0, y: 0, w: 0, h: 0 };
    this.limits = {
      minLeft: null,
      maxLeft: null,
      minRight: null,
      maxRight: null,
      minTop: null,
      maxTop: null,
      minBottom: null,
      maxBottom: null,
    };

    this.currentStick = [];
  },

  mounted: function () {
    this.parentElement = this.$el.parentNode;
    this.parentWidth = this.parentW
      ? this.parentW
      : this.parentElement.clientWidth;

    this.parentHeight = this.parentH
      ? this.parentH
      : this.parentElement.clientHeight;
    this.rawRight = this.parentWidth - this.rawWidth - this.rawLeft;
    this.rawBottom = this.parentHeight - this.rawHeight - this.rawTop;
    document.documentElement.addEventListener("mousemove", this.move);
    document.documentElement.addEventListener("mouseup", this.up);
    document.documentElement.addEventListener("mouseleave", this.up);
    document.documentElement.addEventListener("mousedown", this.deselect);
    document.documentElement.addEventListener("touchmove", this.move, true);
    document.documentElement.addEventListener(
      "touchend touchcancel",
      this.up,
      true
    );
    document.documentElement.addEventListener("touchstart", this.up, true);
    this.settingAttribute();
    if (this.dragHandle) {
      let dragHandles = Array.prototype.slice.call(
        this.$el.querySelectorAll(this.dragHandle)
      );
      for (let i in dragHandles) {
        dragHandles[i].setAttribute("data-drag-handle", this._uid);
      }
    }
    if (this.dragCancel) {
      let cancelHandles = Array.prototype.slice.call(
        this.$el.querySelectorAll(this.dragCancel)
      );
      for (let i in cancelHandles) {
        cancelHandles[i].setAttribute("data-drag-cancel", this._uid);
      }
    }
  },

  beforeDestroy: function () {
    document.documentElement.removeEventListener("mousemove", this.move);
    document.documentElement.removeEventListener("mouseup", this.up);
    document.documentElement.removeEventListener("mouseleave", this.up);

    document.documentElement.removeEventListener("mousedown", this.deselect);

    document.documentElement.removeEventListener("touchmove", this.move, true);
    document.documentElement.removeEventListener(
      "touchend touchcancel",
      this.up,
      true
    );
    document.documentElement.removeEventListener("touchstart", this.up, true);
  },

  methods: {
    settingAttribute() {
      // 设置冲突检测
      this.isConflictCheck
        ? this.$el.setAttribute("data-is-check", "true")
        : this.$el.setAttribute("data-is-check", "false");
      // 设置对齐元素
      this.snap
        ? this.$el.setAttribute("data-is-snap", "true")
        : this.$el.setAttribute("data-is-snap", "false");
    },
    async getActiveAll(nodes) {
      const activeAll = this.isActive
        ? [{ height: this.h, width: this.w, left: this.x, top: this.y }]
        : [];
      const XArray = [];
      const YArray = [];
      let groupWidth = 0;
      let groupHeight = 0;
      let groupLeft = 0;
      let groupTop = 0;

      // for (let item of nodes) {
      //     if (item.className !== undefined && !item.className.includes('inactive')) {// active
      //         activeAll.push(item)
      //     }
      // }
      // :w="rect.width"
      //            :h="rect.height" :x="rect.left" :y="rect.top" :parentW="375" :parentH="parentH"
      //            :axis="rect.axis" :isActive="rect.active"
      // 获取激活的组件

      const AllLength = activeAll.length;
      if (AllLength > 1) {
        for (let i of activeAll) {
          const l = i.offsetLeft;
          const r = l + i.offsetWidth;
          const t = i.offsetTop;
          const b = t + i.offsetHeight;
          XArray.push(t, b);
          YArray.push(l, r);
        }
        groupWidth = Math.max(...YArray) - Math.min(...YArray);
        groupHeight = Math.max(...XArray) - Math.min(...XArray);
        groupLeft = Math.min(...YArray);
        groupTop = Math.min(...XArray);
      }
      const bln = AllLength === 1;
      return { groupWidth, groupHeight, groupLeft, groupTop, bln };
    },
    // 检测对齐元素
    async snapCheck() {
      let width = this.width;
      let height = this.height;
      console.log("watch rawbottom", this.rawBottom);

      if (this.snap) {
        // 获取当前激活组件的四个上下左右相对box的距离
        let activeLeft = this.rawLeft;
        let activeRight = this.rawLeft + width; // this.rawRight//
        let activeTop = this.rawTop;
        let activeBottom = this.rawTop + height; // //this.rawBottom//this.parentHeight - this.rawTop - height

        // 初始化辅助线数据
        const temArr = new Array(3).fill({
          display: false,
          position: "",
          origin: "",
          lineLength: "",
        });
        const refLine = { vLine: [], hLine: [] };

        for (let i in refLine) {
          refLine[i] = JSON.parse(JSON.stringify(temArr));
        }

        // 获取当前父节点下所有子节点
        const nodes = !!this.$parent.rects
          ? this.$parent.rects.filter((item) => !item.active)
          : this.$parent.$parent.rects.filter((item) => !item.active); //this.$el.parentNode.childNodes

        let tem = {
          value: { x: [[], [], []], y: [[], [], []] },
          display: [],
          position: [],
        };
        // 获取激活组件要对齐的虚线的边
        // const {  groupWidth, groupHeight, groupLeft, groupTop, bln } = await this.getActiveAll(nodes)
        const bln = true;
        // if (!bln) {
        //     width = groupWidth
        //     height = groupHeight
        //     activeLeft = groupLeft
        //     activeRight = groupLeft + groupWidth
        //     activeTop = groupTop
        //     activeBottom = groupTop + groupHeight
        // }
        for (let item of nodes) {
          //   获取其他组件
          // if (item.className !== undefined && item.className.includes('inactive') && item.getAttribute('data-is-snap') !== null && item.getAttribute('data-is-snap') !== 'false') {
          const w = item.width; // item.offsetWidth
          const h = item.height; //item.offsetHeight
          const l = item.left; // item.offsetLeft // 对齐目标的left
          const r = l + w; //item.left+item.width//l + w // 对齐目标right
          const t = item.top; //item.offsetTop// 对齐目标的top
          const b = t + h; //item.top+item.height//t + h // 对齐目标的bottom
          const hc =
            Math.abs(activeTop + height / 2 - (t + h / 2)) < this.snapTolerance; // 水平中线
          const vc =
            Math.abs(activeLeft + width / 2 - (l + w / 2)) < this.snapTolerance; // 垂直中线
          // item 和激活组件active的对应关系
          const ts = Math.abs(t - activeBottom) < this.snapTolerance; // item上边框和active的下边框

          const TS = Math.abs(b - activeBottom) < this.snapTolerance; // item下边框和active的下边框
          // console.log('TS',b ,'-', activeBottom,this.snapTolerance,Math.abs(t - activeBottom) < this.snapTolerance);
          const bs = Math.abs(t - activeTop) < this.snapTolerance; // item上边框和active的上边框
          const BS = Math.abs(b - activeTop) < this.snapTolerance; // item下边框和active的上边框

          const ls = Math.abs(l - activeRight) < this.snapTolerance; // 外左 item左边框和active的右边框
          const LS = Math.abs(r - activeRight) < this.snapTolerance; // 外右item右边框和active的右边框
          const rs = Math.abs(l - activeLeft) < this.snapTolerance; // 外左 item左边框和active的左边框
          const RS = Math.abs(r - activeLeft) < this.snapTolerance; // 外左 item右边框和active的左边框
          tem["display"] = [ts, TS, bs, BS, hc, hc, ls, LS, rs, RS, vc, vc];
          tem["position"] = [
            t,
            b,
            t,
            b,
            t + h / 2,
            t + h / 2,
            l,
            r,
            l,
            r,
            l + w / 2,
            l + w / 2,
          ];

          //  console.log('tem["display"] ',tem["display"],tem["position"] );
          if (ts) {
            if (bln) {
              //磁力吸附
              this.rawTop = t - height;

              this.rawBottom = this.parentHeight - this.rawTop - height;
            }
            tem.value.y[0].push(l, r, activeLeft, activeRight);
          }
          // tem.valuex :top bottom , top bottom,
          if (bs) {
            if (bln) {
              //   this.rawTop = t;
              //   this.rawBottom = this.parentHeight - this.rawTop - height;
            }
            tem.value.y[0].push(l, r, activeLeft, activeRight);
          }
          if (TS) {
            if (bln) {
              //   this.rawTop = b - height;
              //   this.rawBottom = this.parentHeight - this.rawTop - height;
            }

            tem.value.y[1].push(l, r, activeLeft, activeRight);
          }
          if (BS) {
            if (bln) {
              //   this.rawTop = b;
              //   this.rawBottom = this.parentHeight - this.rawTop - height;
            }
            tem.value.y[1].push(l, r, activeLeft, activeRight);
          }

          if (ls) {
            if (bln) {
              //   this.rawLeft = l - width;
              //   this.rawRight = this.parentWidth - this.rawLeft - width;
            }
            tem.value.x[0].push(t, b, activeTop, activeBottom);
          }
          if (rs) {
            if (bln) {
              //   this.rawLeft = l;
              //   this.rawRight = this.parentWidth - this.rawLeft - width;
            }
            tem.value.x[0].push(t, b, activeTop, activeBottom);
          }
          if (LS) {
            if (bln) {
              //   this.rawLeft = r - width;
              //   this.rawRight = this.parentWidth - this.rawLeft - width;
            }
            tem.value.x[1].push(t, b, activeTop, activeBottom);
          }
          if (RS) {
            if (bln) {
              //   this.rawLeft = r;
              //   this.rawRight = this.parentWidth - this.rawLeft - width;
            }
            tem.value.x[1].push(t, b, activeTop, activeBottom);
          }

          if (hc) {
            if (bln) {
              //   this.rawTop = t + h / 2 - height / 2;
              //   this.rawBottom = this.parentHeight - this.rawTop - height;
            }
            tem.value.y[2].push(l, r, activeLeft, activeRight);
          }
          if (vc) {
            if (bln) {
              //   this.rawLeft = l + w / 2 - width / 2;
              //   this.rawRight = this.parentWidth - this.rawLeft - width;
            }
            tem.value.x[2].push(t, b, activeTop, activeBottom);
          }
          // 辅助线坐标与是否显示(display)对应的数组,易于循环遍历
          const arrTem = [0, 1, 0, 1, 2, 2, 0, 1, 0, 1, 2, 2];
          for (let i = 0; i <= arrTem.length; i++) {
            // 前6为Y辅助线,后6为X辅助线
            const xory = i < 6 ? "y" : "x";
            const horv = i < 6 ? "hLine" : "vLine";
            if (tem.display[i]) {
              const { origin, length } = this.calcLineValues(
                tem.value[xory][arrTem[i]]
              );
              if (origin.length <= 0) {
              }
              refLine[horv][arrTem[i]].display = tem.display[i];
              refLine[horv][arrTem[i]].position = tem.position[i] + "px";
              refLine[horv][arrTem[i]].origin = origin;
              refLine[horv][arrTem[i]].lineLength = length;
            }
          }

          // }
        }
        this.$emit("refLineParams", refLine);
      }
    },
    calcLineValues(arr) {
      const length = Math.max(...arr) - Math.min(...arr) + "px";
      const origin = Math.min(...arr) + "px";

      return { length, origin };
    },
    hasnoactive(el, index) {
      if (
        el.getAttribute("data") == "noactive" ||
        el.className.indexOf("noactive") >= 0
      ) {
        return true;
      } else {
        if (index > 7 || !el.parentElement) {
          return false;
        } else {
          return this.hasnoactive(el.parentElement, index + 1);
        }
      }
    },
    deselect(e) {
      if (e.target.tagName == "INPUT") {
        if (e.target.parentElement.className.indexOf("input_title") >= 0) {
          //         e.stopPropagation();
          // e.preventDefault();
          return false;
        }
        // return false
      }
      if (this.preventActiveBehavior) {
        return;
      }

      let haveno_ = this.hasnoactive(e.target, 0);

      if (this.$parent.active != "pageindex") {
        //shawn 将所有的模块全部禁激活 在mouse down的时候激活
        // this.$emit('setActiveModuleStatus', e, this.parentKey_mo, false)
      }

      if (haveno_) {
        return false;
      } else {
        this.$parent.saveActive = null;
        this.active = false;
      }
    },

    move(ev) {
      if (!this.stickDrag && !this.bodyDrag) {
        return;
      }
      ev.stopPropagation();

      if (this.stickDrag) {
        console.log("stick");

        this.stickMove(ev);
      }
      if (this.bodyDrag) {
        this.bodyMove(ev);
      }
    },

    up(ev) {
      if (this.stickDrag) {
        this.stickUp(ev);
        this.$emit("refLineParams", { vLine: [], hLine: [] }); //鼠标键up的时候清空
      }
      if (this.bodyDrag) {
        this.bodyUp(ev);
        this.$emit("refLineParams", { vLine: [], hLine: [] }); //鼠标键up的时候清空
      }
    },

    bodyDown: function (ev) {
      let target = ev.target || ev.srcElement;
      if (ev.target.isContentEditable) {
        //标签是可编辑的
        return;
      }
      this.showTipLine = true;
      if (!this.preventActiveBehavior) {
        if (!this.active) {
          this.isWatchActive = true;
          if (ev.ctrlKey) {
            this.active = true;

            this.$emit("activated", ev.ctrlKey);
          } else {
            this.active = true;
            this.$emit("activated");
          }
        } else {
          this.active = true;
          //  this.$emit("activated");
          // 本身未true再次点击
        }
        /**
         * 操作：框选或者点选a,b，watch 监听this.active ，
         * 1:点击c，先走watch 设置c激活，a,b去激活
         * 2:点击a|b，active还是true,不走watch,在bodyup的时候，去激活除点击组件意外的其他组件。
         * 3:拖动a|b，a&&b仍是选中状态
         * 为了区分是拖拽还是点击，再keyup的时候才设置true和false属性
         *
         */
      }

      if (ev.button && ev.button !== 0) {
        return;
      }

      // this.$emit("clicked", ev);

      //进制拖拽
      if (!this.isDraggable || !this.active) {
        return;
      }

      if (
        this.dragHandle &&
        target.getAttribute("data-drag-handle") !== this._uid.toString()
      ) {
        return;
      }

      if (
        this.dragCancel &&
        target.getAttribute("data-drag-cancel") === this._uid.toString()
      ) {
        return;
      }

      ev.stopPropagation();
      ev.preventDefault();
      this.$emit("virtualCom", true);
      this.bodyDrag = true;

      this.stickStartPos.mouseX =
        typeof ev.pageX !== "undefined" ? ev.pageX : ev.touches[0].pageX;
      this.stickStartPos.mouseY =
        typeof ev.pageY !== "undefined" ? ev.pageY : ev.touches[0].pageY;

      this.stickStartPos.left = this.left;

      this.stickStartPos.right = this.right;
      this.stickStartPos.top = this.top;
      this.stickStartPos.bottom = this.bottom;

      if (this.parentLimitation) {
        this.limits = this.calcDragLimitation();
      }
    },

    calcDragLimitation() {
      const parentWidth = this.parentWidth;
      const parentHeight = this.parentHeight;
      if (
        !!this.$store.getters.getAllActive &&
        this.$store.getters.getAllActive.length > 1
      ) {
        let virtualData = this.$parent.$parent.multipleCom;

        // let space=this.$parent.$parent.$refs.multipleCom_0.calcDragLimitation()
        console.table("multipleCom", this.$parent.$parent.multipleCom);
        let virRight = this.parentWidth - virtualData.width - virtualData.left; //设置right
        let virBottom =
          this.parentHeight - virtualData.height - virtualData.top; //设置 bottom
        return {
          minLeft: this.x - virtualData.left,
          maxLeft: this.x + virRight,
          minRight: parentWidth - this.x - this.w - virRight,
          maxRight: parentWidth - this.x - this.w + virtualData.left,
          minTop: this.y - virtualData.top, //!!this.parentKey_mo ? 50 : 0,
          maxTop: this.y + virBottom, //!!this.parentKey_mo ? parentHeight - this.height - 50 : parentHeight - this.height,
          minBottom: parentHeight - this.y - this.h - virBottom,
          maxBottom: parentHeight - this.y - this.h + virtualData.top,
        };
      }
      return {
        minLeft: 0,
        maxLeft: parentWidth - this.width,
        minRight: 0,
        maxRight: parentWidth - this.width,
        minTop: 0, //!!this.parentKey_mo ? 50 : 0,
        maxTop: parentHeight - this.height, //!!this.parentKey_mo ? parentHeight - this.height - 50 : parentHeight - this.height,
        minBottom: 0,
        maxBottom: parentHeight - this.height,
      };
    },

    bodyMove(ev) {
      const stickStartPos = this.stickStartPos;
      const parentWidth = this.parentWidth;
      const parentHeight = this.parentHeight;
      const gridX = this.gridX;
      const gridY = this.gridY;
      const width = this.width;
      const height = this.height;
      const pageX =
        typeof ev.pageX !== "undefined" ? ev.pageX : ev.touches[0].pageX;
      const pageY =
        typeof ev.pageY !== "undefined" ? ev.pageY : ev.touches[0].pageY;
      let delta = {
        x:
          (this.axis !== "y" && this.axis !== "none"
            ? stickStartPos.mouseX - pageX
            : 0) / this.parentScaleX,
        y:
          (this.axis !== "x" && this.axis !== "none"
            ? stickStartPos.mouseY - pageY
            : 0) / this.parentScaleY,
      };

      let newTop = stickStartPos.top - delta.y;
      let newBottom = stickStartPos.bottom + delta.y;

      let newLeft = stickStartPos.left - delta.x;
      let newRight = stickStartPos.right + delta.x;

      if (this.snapToGrid) {
        let alignTop = true;
        let alignLeft = true;

        // let diffT =0 //newTop - Math.floor(newTop / gridY) * gridY;
        // let diffB =0 // (parentHeight - newBottom) - Math.floor((parentHeight - newBottom) / gridY) * gridY;
        // let diffL =0 //newLeft - Math.floor(newLeft / gridX) * gridX;
        // let diffR =0 // (parentWidth - newRight) - Math.floor((parentWidth - newRight) / gridX) * gridX;
        let diffT = newTop - Math.floor(newTop / gridY) * gridY;
        let diffB =
          parentHeight -
          newBottom -
          Math.floor((parentHeight - newBottom) / gridY) * gridY;
        let diffL = newLeft - Math.floor(newLeft / gridX) * gridX;
        let diffR =
          parentWidth -
          newRight -
          Math.floor((parentWidth - newRight) / gridX) * gridX;

        // if (diffT > (gridY / 2)) { diffT = diffT - gridY; }
        // if (diffB > (gridY / 2)) { diffB = diffB - gridY; }
        // if (diffL > (gridX / 2)) { diffL = diffL - gridX; }
        // if (diffR > (gridX / 2)) { diffR = diffR - gridX; }

        if (Math.abs(diffB) < Math.abs(diffT)) {
          alignTop = false;
        }
        if (Math.abs(diffR) < Math.abs(diffL)) {
          alignLeft = false;
        }
        newBottom = parentHeight - height - newTop;
        newRight = parentWidth - width - newLeft;
        // newTop = newTop - (alignTop ? diffT : diffB);
        // newBottom = parentHeight - height - newTop;
        // newLeft = newLeft - (alignLeft ? diffL : diffR);
        // newRight = parentWidth - width - newLeft;
      }
      if (
        Math.abs(this.stickStartPos.top - newTop) > 2 ||
        Math.abs(this.stickStartPos.bottom - newBottom) > 2 ||
        Math.abs(this.stickStartPos.left - newLeft) > 2 ||
        Math.abs(this.stickStartPos.right - newRight) > 2
      ) {
        this.isMove = true;
      } else {
      }
      this.rawTop = newTop;
      this.rawBottom = newBottom;
      this.rawLeft = newLeft;
      this.rawRight = newRight;

      this.snapCheck();
      this.$emit("dragging", {
        rect: this.rect,
        key: this.parentKey_mo,
        type: "draging",
      });
      // this.$emit('dragging', this.rect);
    },

    bodyUp(ev) {
      if (!this.isMove) {
        this.$emit("activated", ev.ctrlKey);
      }
      this.showTipLine = false;
      this.$emit("virtualCom", false);
      this.bodyDrag = false;
      this.isWatchActive = false; //如果是多选意外的组件点击，则为true
      this.isMove = false;
      //停止的时候

      this.$emit("dragging", {
        rect: this.rect,
        key: this.parentKey_mo,
        type: "dragstop",
      });
      // this.$emit('dragstop', this.rect);

      this.stickStartPos = { mouseX: 0, mouseY: 0, x: 0, y: 0, w: 0, h: 0 };
      this.limits = {
        minLeft: null,
        maxLeft: null,
        minRight: null,
        maxRight: null,
        minTop: null,
        maxTop: null,
        minBottom: null,
        maxBottom: null,
      };
    },

    stickDown: function (stick, ev) {
      console.log("stickDown");
      if (!this.isResizable || !this.active) {
        return;
      }

      this.showTipLine = true;
      this.stickDrag = true;
      this.stickStartPos.mouseX =
        typeof ev.pageX !== "undefined" ? ev.pageX : ev.touches[0].pageX;
      this.stickStartPos.mouseY =
        typeof ev.pageY !== "undefined" ? ev.pageY : ev.touches[0].pageY;
      this.stickStartPos.left = this.left;
      this.stickStartPos.right = this.right;
      this.stickStartPos.top = this.top;
      this.stickStartPos.bottom = this.bottom;
      this.currentStick = stick.split("");
      this.stickAxis = null;

      switch (this.currentStick[0]) {
        case "b":
          this.stickAxis = "y";
          break;
        case "t":
          this.stickAxis = "y";
          break;
      }
      switch (this.currentStick[1]) {
        case "r":
          this.stickAxis = this.stickAxis === "y" ? "xy" : "x";
          break;
        case "l":
          this.stickAxis = this.stickAxis === "y" ? "xy" : "x";
          break;
      }

      this.limits = this.calcResizeLimitation();
    },

    calcResizeLimitation() {
      let minw = this.minWidth;
      let minh = this.minHeight;
      const aspectFactor = this.aspectFactor;
      const width = this.width;
      const height = this.height;
      const bottom = this.bottom;
      const top = this.top;
      const left = this.left;
      const right = this.right;
      const stickAxis = this.stickAxis;

      const parentLim = 0; // this.parentLimitation
      // ? !!this.parentKey_mo
      //   ? 1
      //   : 0
      // : null;

      if (this.aspectRatio) {
        if (minw / minh > aspectFactor) {
          minh = minw / aspectFactor;
        } else {
          minw = aspectFactor * minh;
        }
      }
      let limits = {
        minLeft: parentLim,
        maxLeft: left + (width - minw),
        minRight: parentLim,
        maxRight: right + (width - minw),
        minTop: parentLim,
        maxTop: top + (height - minh),
        minBottom: parentLim,
        maxBottom: bottom + (height - minh),
      };

      if (this.aspectRatio) {
        const aspectLimits = {
          minLeft: left - Math.min(top, bottom) * aspectFactor * 2,
          maxLeft: left + ((height - minh) / 2) * aspectFactor * 2,

          minRight: right - Math.min(top, bottom) * aspectFactor * 2,
          maxRight: right + ((height - minh) / 2) * aspectFactor * 2,

          minTop: top - (Math.min(left, right) / aspectFactor) * 2,
          maxTop: top + ((width - minw) / 2 / aspectFactor) * 2,

          minBottom: bottom - (Math.min(left, right) / aspectFactor) * 2,
          maxBottom: bottom + ((width - minw) / 2 / aspectFactor) * 2,
        };

        if (stickAxis === "x") {
          limits = {
            minLeft: Math.max(limits.minLeft, aspectLimits.minLeft),
            maxLeft: Math.min(limits.maxLeft, aspectLimits.maxLeft),
            minRight: Math.max(limits.minRight, aspectLimits.minRight),
            maxRight: Math.min(limits.maxRight, aspectLimits.maxRight),
          };
        } else if (stickAxis === "y") {
          limits = {
            minTop: Math.max(limits.minTop, aspectLimits.minTop),
            maxTop: Math.min(limits.maxTop, aspectLimits.maxTop),
            minBottom: Math.max(limits.minBottom, aspectLimits.minBottom),
            maxBottom: Math.min(limits.maxBottom, aspectLimits.maxBottom),
          };
        }
      }

      return limits;
    },

    stickMove(ev) {
      // 获取鼠标按下时的对象 left,right,top,bottom,height,width,x,y
      const stickStartPos = this.stickStartPos; //鼠标第一次点击元素的位置，
      //鼠标不断更新的位置
      const pageX =
        typeof ev.pageX !== "undefined" ? ev.pageX : ev.touches[0].pageX;
      const pageY =
        typeof ev.pageY !== "undefined" ? ev.pageY : ev.touches[0].pageY;

      const delta = {
        x: (stickStartPos.mouseX - pageX) / this.parentScaleX,
        y: (stickStartPos.mouseY - pageY) / this.parentScaleY,
      };

      let newTop = stickStartPos.top - delta.y;
      let newBottom = stickStartPos.bottom + delta.y;
      let newLeft = stickStartPos.left - delta.x;
      let newRight = stickStartPos.right + delta.x;
      //  console.log('stickmove',this.currentStick );

      switch (this.currentStick[0]) {
        case "b":
          // if (this.snapToGrid) {
          //   newBottom =
          //     this.parentHeight -
          //     Math.round((this.parentHeight - newBottom) / this.gridY) *
          //       this.gridY;
          // }

          this.rawBottom = newBottom;

          break;

        case "t":
          //   if (this.snapToGrid) {
          //     newTop = Math.round(newTop / this.gridY) * this.gridY;
          //   }
          console.log(newTop, this.currentStick[0]);
          this.rawTop = newTop;
          break;
      }

      switch (
        this.currentStick[1] //算出left值
      ) {
        case "r":
          //   if (this.snapToGrid) {
          //     newRight =
          //       this.parentWidth -
          //       Math.round((this.parentWidth - newRight) / this.gridX) *
          //         this.gridX;
          //   }

          this.rawRight = newRight;
          break;

        case "l":
          //   if (this.snapToGrid) {
          //     newLeft = Math.round(newLeft / this.gridX) * this.gridX;
          //   }

          this.rawLeft = newLeft;
          break;
      }
      // this.snapCheck();
      //   this.$emit("resizing", {
      //     rect: this.rect,
      //     type: "resizing",
      //     width: this.width,
      //     height: this.height
      //   });
    },

    stickUp() {
      this.showTipLine = false;
      this.stickDrag = false;
      this.stickStartPos = {
        mouseX: 0,
        mouseY: 0,
        x: 0,
        y: 0,
        w: 0,
        h: 0,
      };
      this.limits = {
        minLeft: null,
        maxLeft: null,
        minRight: null,
        maxRight: null,
        minTop: null,
        maxTop: null,
        minBottom: null,
        maxBottom: null,
      };
      this.rawTop = this.top;

      this.rawBottom = this.bottom;
      this.rawLeft = this.left;
      this.rawRight = this.right;
      // debugger
      //       let width= this.parentWidth- this.rawLeft-this.rawRight
      //       let height= this.parentHeight- this.rawTop - this.rawBottom

      //   this.$nextTick(() => {

      this.$emit("resizing", {
        rect: this.rect,
        type: "resizingStop",
        width: this.width,
        height: this.height,
        ...this.rect,
        currentStick: Object.assign({}, this.currentStick),
      });
      this.stickAxis = null;
      //   });

      // this.$emit('resizestop', this.rect);
    },

    aspectRatioCorrection() {
      if (!this.aspectRatio) {
        return;
      }

      const bottom = this.bottom;
      const top = this.top;
      const left = this.left;
      const right = this.right;
      const width = this.width;
      const height = this.height;
      const aspectFactor = this.aspectFactor;
      const currentStick = this.currentStick;

      if (width / height > aspectFactor) {
        let newWidth = aspectFactor * height;

        if (currentStick[1] === "l") {
          this.left = left + width - newWidth;
        } else {
          this.right = right + width - newWidth;
        }
      } else {
        let newHeight = width / aspectFactor;

        if (currentStick[0] === "t") {
          this.top = top + height - newHeight;
        } else {
          this.bottom = bottom + height - newHeight;
        }
      }
    },
  },

  computed: {
    style() {
      return {
        top: this.top + "px",
        left: this.left + "px",
        width: this.width + "px",
        height: this.height + "px",
        zIndex: this.zIndex,
      };
    },

    vdrStick() {
      return (stick) => {
        const stickStyle = {
          width: `${stickSize / this.parentScaleX}px`,
          height: `${stickSize / this.parentScaleY}px`,
        };
        stickStyle[styleMapping.y[stick[0]]] = `${
          stickSize / this.parentScaleX / -2
        }px`;
        stickStyle[styleMapping.x[stick[1]]] = `${
          stickSize / this.parentScaleX / -2
        }px`;
        return stickStyle;
      };
    },

    width() {
      return this.parentWidth - this.left - this.right;
    },

    height() {
      return this.parentHeight - this.top - this.bottom;
    },

    rect() {
      return {
        left: Math.round(this.left),
        top: Math.round(this.top),
        width: Math.round(this.width),
        height: Math.round(this.height),
      };
    },
  },

  watch: {
    rawLeft(newLeft) {
      const limits = this.limits;
      const stickAxis = this.stickAxis;
      const aspectFactor = this.aspectFactor;
      const aspectRatio = this.aspectRatio;
      const left = this.left;
      const bottom = this.bottom;
      const top = this.top;
      //如果right变成0了就返回
      // if(this.right==0){
      //     return
      // }

      if (limits.minLeft !== null && newLeft < limits.minLeft) {
        newLeft = limits.minLeft;
      } else if (limits.maxLeft !== null && limits.maxLeft < newLeft) {
        //不加这个会导致左边缩小
        newLeft = limits.maxLeft;
      }

      if (aspectRatio && stickAxis === "x") {
        const delta = left - newLeft;
        this.rawTop = top - delta / aspectFactor / 2;

        this.rawBottom = bottom - delta / aspectFactor / 2;
      }

      this.left = newLeft;
    },

    rawRight(newRight) {
      const limits = this.limits;
      const stickAxis = this.stickAxis;
      const aspectFactor = this.aspectFactor;
      const aspectRatio = this.aspectRatio;
      const right = this.right;
      const bottom = this.bottom;
      const top = this.top;

      if (limits.minRight !== null && newRight < limits.minRight) {
        newRight = limits.minRight;
      } else if (limits.maxRight !== null && limits.maxRight < newRight) {
        newRight = limits.maxRight;
      }

      if (aspectRatio && stickAxis === "x") {
        const delta = right - newRight;

        this.rawTop = top - delta / aspectFactor / 2;
        this.rawBottom = bottom - delta / aspectFactor / 2;
      }
      this.right = newRight;
    },

    rawTop(newTop) {
      const limits = this.limits;
      const stickAxis = this.stickAxis;
      const aspectFactor = this.aspectFactor;
      const aspectRatio = this.aspectRatio;
      const right = this.right;
      const left = this.left;
      const top = this.top;
      if (limits.minTop !== null && newTop < limits.minTop) {
        newTop = limits.minTop;
      } else if (limits.maxTop !== null && limits.maxTop < newTop) {
        newTop = limits.maxTop;
      }

      if (aspectRatio && stickAxis === "y") {
        const delta = top - newTop;
        this.rawLeft = left - (delta * aspectFactor) / 2;
        this.rawRight = right - (delta * aspectFactor) / 2;
      }

      this.top = newTop;
    },

    rawBottom(newBottom) {
      const limits = this.limits;
      const stickAxis = this.stickAxis;
      const aspectFactor = this.aspectFactor;
      const aspectRatio = this.aspectRatio;
      const right = this.right;
      const left = this.left;
      const bottom = this.bottom;

      if (limits.minBottom !== null && newBottom < limits.minBottom) {
        newBottom = limits.minBottom;
      } else if (limits.maxBottom !== null && limits.maxBottom < newBottom) {
        newBottom = limits.maxBottom;
      }

      if (aspectRatio && stickAxis === "y") {
        const delta = bottom - newBottom;
        this.rawLeft = left - (delta * aspectFactor) / 2;
        this.rawRight = right - (delta * aspectFactor) / 2;
      }

      this.bottom = newBottom;
    },

    width() {
      this.aspectRatioCorrection();
      if (this.showTipLine) {
        this.snapCheck();
      }
    },

    height() {
      this.aspectRatioCorrection();

      if (this.showTipLine) {
        this.snapCheck();
      }
    },

    active(isActive) {
      // if (isActive) {
      //   this.$emit("activated");
      // } else {
      //   this.$emit("deactivated");
      // }
    },

    isActive(val) {
      this.active = val;
    },

    z(val) {
      if (val >= 0 || val === "auto") {
        this.zIndex = val;
      }
    },

    aspectRatio(val) {
      if (val) {
        this.aspectFactor = this.width / this.height;
      }
    },

    minw(val) {
      if (val > 0 && val <= this.width) {
        this.minWidth = val;
      }
    },

    minh(val) {
      if (val > 0 && val <= this.height) {
        this.minHeight = val;
      }
    },

    x() {
      if (this.stickDrag || this.bodyDrag) {
        return;
      }
      if (this.parentLimitation) {
        this.limits = this.calcDragLimitation();
      }

      let delta = this.x - this.left;
      this.rawLeft = this.x;
      this.rawRight = this.right - delta;
    },

    y() {
      if (this.stickDrag || this.bodyDrag) {
        return;
      }

      if (this.parentLimitation) {
        this.limits = this.calcDragLimitation();
      }

      let delta = this.y - this.top;
      this.rawTop = this.y;

      this.rawBottom = this.bottom - delta;
    },

    w() {
      if (this.stickDrag || this.bodyDrag) {
        return;
      }

      this.currentStick = ["m", "r"];
      this.stickAxis = "x";

      if (this.parentLimitation) {
        this.limits = this.calcResizeLimitation();
      }

      let delta = this.width - this.w;
      this.rawRight = this.right + delta;
    },

    h() {
      // console.log("watchH");

      if (this.stickDrag || this.bodyDrag) {
        return;
      }

      this.currentStick = ["b", "m"];
      this.stickAxis = "y";

      if (this.parentLimitation) {
        this.limits = this.calcResizeLimitation();
      }

      let delta = this.height - this.h;
      this.rawBottom = this.bottom + delta;
    },

    parentW(val) {
      this.right = val - this.width - this.left;
      this.parentWidth = val;
    },

    parentH(val) {
      this.bottom = val - this.height - this.top;
      this.parentHeight = val;
    },
  },
};
</script>
<style src="./vue-drag-resize.css"></style>
