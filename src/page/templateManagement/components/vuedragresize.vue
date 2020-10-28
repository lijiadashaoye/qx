 <!--*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************-->
 <template>
  <!-- <div id="app" >
      <div class="list" id="list"> -->
          <VueDragResize v-if="rects.length>0" v-for="(rect, index) in rects"
                         :key="index"
                         :w="rect.width"
                         :h="rect.height"
                         :x="rect.left"
                         :y="rect.top"
                         :parentW="'375'"
                         :parentH="667"
                         :axis="rect.axis"
                         :isActive="rect.active"
                         :minw="rect.minw"
                         :minh="rect.minh"
                         :isDraggable="rect.draggable"
                         :isResizable="rect.resizable"
                         :parentLimitation="rect.parentLim"
                         :snapToGrid="rect.snapToGrid"
                         :aspectRatio="rect.aspectRatio"
                         :z="rect.zIndex"
                         v-on:activated="activateEv(index)"
                         v-on:deactivated="deactivateEv(index)"
                         v-on:dragging="changePosition($event, index)"
                         v-on:resizing="changeSize($event, index)"
          >
              <div class="filler" :style="{backgroundColor:rect.color}"></div>
          </VueDragResize>
      <!-- </div>

      <toolbar></toolbar>
  </div> -->
</template>

<style>
  body {
      height: 100vh;
      width: 100vw;
      background-color: #ECECEC;
  }
  #app {
      margin: 0;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      position: absolute;
      font-family: 'Lato', sans-serif;
  }

  .list {
      position: absolute;
      top: 30px;
      height:1400px;
      width:700px;
      bottom: 30px;
      left: 30px;
      right: 300px;
      box-shadow: 0 0 2px #AAA;
      background-color: white;
  }
</style>

<script>
  import VueDragResize from '@/components/vue-drag-resize/vue-drag-resize.vue';
//   import toolbar from '@/components/toolbar/toolbar.vue';
  // import '@/icons';
  export default {
      name: 'app',
      components: {
          VueDragResize,
        //   toolbar
      },
      data(){
          return {
              listWidth: 1050,
              listHeight: 700
          }
      },
      mounted() {
          let listEl = document.getElementById('list');
        //
          this.listWidth = listEl.clientWidth;
          this.listHeight = listEl.clientHeight;
          window.addEventListener('resize', ()=>{
              this.listWidth = listEl.clientWidth;
              this.listHeight = listEl.clientHeight;
          })
      },
      computed: {
          rects() {
            console.log(this.$store.state.dragLesize.rects[0].height)
              return this.$store.state.dragLesize.rects
          }
      },
      methods: {
          activateEv(index) {
            //
              this.$store.dispatch('dragLesize/setActive', {id: index});
          },
          deactivateEv(index) {
              this.$store.dispatch('dragLesize/unsetActive', {id: index});
          },
          changePosition(newRect, index) {
              this.$store.dispatch('dragLesize/setTop', {id: index, top: newRect.top});
              this.$store.dispatch('dragLesize/setLeft', {id: index, left: newRect.left});
              this.$store.dispatch('dragLesize/setWidth', {id: index, width: newRect.width});
              this.$store.dispatch('dragLesize/setHeight', {id: index, height: newRect.height});
          },
          changeSize(newRect, index) {
              this.$store.dispatch('dragLesize/setTop', {id: index, top: newRect.top});
              this.$store.dispatch('dragLesize/setLeft', {id: index, left: newRect.left});
              this.$store.dispatch('dragLesize/setWidth', {id: index, width: newRect.width});
              this.$store.dispatch('dragLesize/setHeight', {id: index, height: newRect.height});
          }
      }
  }
</script>