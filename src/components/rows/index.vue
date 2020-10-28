<template>
<div>
    <template v-for="(item,index) in List">
    <el-row v-if="List.length>0"   :gutter="item.gutter || 10" :key="index+'_row'" >
         <template v-for="(it,ind) in item.child">
        <el-col v-if="item.child.length>0"  :span="it.span || 12" :key="ind+'_col'">
            <slot name="colBefore"></slot>
            <slot class="grid-content bg-purple">it[defaultProps]</slot>
            <slot name="colAfter"></slot>
        </el-col>
    </template>   
    </el-row>
    
</div>  
</template>

<script>
export default {
    data(){
        return {

        }
    },
    props:{
        List: {
            type: Array,
            default: []
        },
        defaultProps:{
            type:Object,
            default:{}
        },
        
    },
    
}
</script>

<style>

</style>