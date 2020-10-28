 <!--*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************-->
 <template>
    <div style="width:180px;">
      <!-- default-expand-all -->
      <!-- -->
      <el-tree :data="dataTree"  :default-checked-keys='checkedItem'  @check-change="checkCge" show-checkbox node-key="id" ref="tree" highlight-current  :props="defaultProps">
      </el-tree>
  
      <!-- <div class="buttons">
    <el-button @click="getCheckedNodes">通过 node 获取</el-button>
    <el-button @click="getCheckedKeys">通过 key 获取</el-button>
    <el-button @click="setCheckedNodes">通过 node 设置</el-button>
    <el-button @click="setCheckedKeys">通过 key 设置</el-button>
    <el-button @click="resetChecked">清空</el-button>
  </div> -->
    </div>
  </template>
  <script>
    // import { permissinsall } from '@/api/members'
    export default {
      props:['dataTree','setKeys','domainkey','checkedItem'],
      mounted(){
        
      },
      
      data() {
        return {
         
          defaultProps: {
            children: 'childs',
            label: 'name'
          }
        };
      },
      methods: {
        checkCge(a,b,c){

          this.$emit('input',this.$refs.tree.getCheckedKeys())
        },
        value(){
          return this.$refs.tree.getCheckedKeys();
        },
        // handleCheckChange(data, checked, indeterminate){
        //   this.$emit('changetreevalue',this.$refs.tree.getCheckedKeys(),this.domain)
         
        // },
        getCheckedKeys() {
         let aa= this.$refs.tree.getCheckedNodes()
        },
        resetChecked() {
          this.$refs.tree.setCheckedKeys([]);
        }
      },
      watch:{
        setKeys(v,o){
          if(v.length!=o.length){
            this.$refs.tree.setCheckedKeys(v);
          }
        }
      }
  
      
    };
  </script>