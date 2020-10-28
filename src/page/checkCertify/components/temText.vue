<template>
  <div class="tmptext">
   {{inputText}}
  </div>
</template>
<script>
  export default {
    name: 'app',

    data() {
      return {
        file: '',
        imgsrc: ''
      }
    },
    props: {
      inputText: {
        type: String
      }
    },
    model: {
      prop: 'value_',
      event: 'keyup'
    },

    mounted() {

    },

    methods: {
      change(e) {
        this.$emit('keyup', e.target.value)
      }

    }
  }
</script>
<style scoped>
  .comments {

    height: 100%;
    width: 100%;
    /*自动适应父布局宽度*/
    overflow: auto;
    word-break: break-all;
    /*在ie中解决断行问题(防止自动变为在一行显示，主要解决ie兼容问题，ie8中当设宽度为100%时，文本域类容超过一行时，
当我们双击文本内容就会自动变为一行显示，所以只能用ie的专有断行属性“word-break或word-wrap”控制其断行)*/
  }

  .tmptext {
    position: relative;
    padding:5%;
    width: 100%;
    height: 100%;
  }
</style>