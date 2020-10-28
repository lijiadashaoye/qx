<template>
    <div id="noData">
        <img src="../../assets/img/noData.png" alt="">
         <slot name="header" class="title"><div class="title">{{title}}</div></slot>
    </div>
</template>
<script>
export default {
    data () {
        return {
            title:''
        }
    },
    created() {
        if(this.$route.path.substring(1).slice(7) == 'certificateManagement'){
            this.title = '暂未查询到证书'
        }else{
            this.title = '暂未查询到模板'
        }
    },
    updated() {
        if(this.$route.path.substring(1).slice(7) == 'certificateManagement'){
            this.title = '暂未查询到证书'
        }else{
            this.title = '暂未查询到模板'
        }
    },
}
</script>
<style scoped>
#noData{
    width: 100%;
}
#noData img{
    width: 23.2rem;
}
#noData .title{
    color: #C8C8C8;
    font-size: 0.9rem;
}
</style>
