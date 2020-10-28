 <!--*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************-->
 <template>
  <div class="app-container permission" id="permission">
    <div class="permissionOut" v-for="(item,index) in permissionList" :key="index">
      <div class="nameOut">
        <el-input
          
          v-model="item.name"
          placeholder="请输入权限名称"
          maxlength="10"
        ></el-input>
        <!-- <span v-else>{{item.name}}</span> -->
        <img
          src="../../assets/img/deletePermission.png"
          v-if="permissionList.length > 1 &&  $parent.permissionArr.indexOf(100552)>=0"
          class="delete"
          @click="openIsDelete(permissionList,item)"
          alt
        />
        <img
          v-if="index == permissionList.length-1"
          src="../../assets/img/addPermission.png"
          @click="addPermission"
          class="add"
          alt
        />
      </div>
      <div class="permissionTreeOut">
        <el-checkbox
          v-model="item.checked"
          @change="allSelect(item,index)"
        >全部</el-checkbox>

        <el-tree
          :data="item.option"
          :props="props"
          node-key="id"
          :ref="'tree'+index"
          @node-expand="nodeExpand"
          @check-change="(a,b,c)=>checkChange(a,b,c,index)"
          @check="(a,b)=>check(a,b,index)"
          :default-checked-keys="item.permissionArr"
          show-checkbox
        ></el-tree>
        <div class="btnOut" v-if="$parent.permissionArr.indexOf(100552)>=0">
          <div class="save" @click="postRoleList(item,index)">保存</div>
        </div>
      </div>
    </div>
    <el-dialog title="提示" :visible.sync="isDelete" width="20%">
      <div style="margin-bottom:1.5rem;text-align:left;">是否删除该权限？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDelete = false">取 消</el-button>
        <el-button type="primary" @click="deletePerission(permissionList,permissionItem)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  <script>
// import { permissinsall,setpermissions ,getpermissions,rolesdelete} from '@/api/account'
import {
  allPermission,
  allRoleList,
  postRole,
  deleteRole
} from "src/api/account";
export default {
  data() {
    return {
      permissionItem: {},
      isDelete: false,
      props: {
        label: "name",
        children: "childs"
      },
      permissionOption: [],
      permissionList: []
    };
  },
  mounted() {
    //  this.$nextTick(() => {
    this.getAllPerssion();
    //  })
  },
  created() {},
  methods: {
    nodeExpand(a, b, d) {
      // if (this.$parent.permissionArr.indexOf(552) >= 0) {
      //   a.childs.map(item => {
      //     item.disabled = false;
      //   });
      // } else {
      //   a.childs.map(item => {
      //     item.disabled = true;
      //   });
      // }
    },
    check(a, b, index) {
       // 如果用户列表去掉了,那么依赖用户列表的权限也被去掉
      if (a.id == 100205 && b.checkedKeys.indexOf(100205) < 0) {
        let checkedData = b.checkedKeys.filter(item => item >= 100250 );
        this.$refs["tree" + index][0].setCheckedKeys(checkedData);
      }
      // 如果证书列表去掉了,那么依赖证书列表的权限也被去掉
      if (a.id == 100301 && b.checkedKeys.indexOf(100301) < 0) {
        let checkedData = b.checkedKeys.filter(
          item => item >= 100500 && item <= 100300
        );
        this.$refs["tree" + index][0].setCheckedKeys(checkedData);
      }
      // 如果成员列表去掉了,那么依赖成员列表的权限也被去掉
      if (a.id == 100505 && b.checkedKeys.indexOf(100505) < 0) {
        let checkedData = b.checkedKeys.filter(
          item => item >= 100600 && item <= 100500
        );
        this.$refs["tree" + index][0].setCheckedKeys(checkedData);
      }
      if (a.id == 100601 && b.checkedKeys.indexOf(100601) < 0) {
        let checkedData = b.checkedKeys.filter(
          item => item <= 100600
        );
        this.$refs["tree" + index][0].setCheckedKeys(checkedData);
      }
    },
    checkChange(a, b, c, d) {
      if (!b) {
        this.permissionList[d].checked = false;
      } else {
        let checkedKey = this.$refs["tree" + d][0].getCheckedKeys();
        //  [306,307]//303
        //  [103]//102
        // 企业：104 ，模板：211，产品：308 ， 用户留言：401  成员管理505；
        //找出第一个小于0的成员
        //获取用户管理选中项 ，除了邀请码管理和用户列表 
        let user = checkedKey.find(
          x => Number(x) >= 100200 && Number(x) < 100250  && x != Number(100205)
        );
        // 如果有选中得，默认选中用户列表按钮
        if (!!user) {
          checkedKey.push(100205);
          this.$refs["tree" + d][0].setCheckedKeys(checkedKey);
        }
         //获取证书选中项 ，除了证书列表 
        let cret = checkedKey.find(
          x => Number(x) >= 100300 && Number(x) <= 100350 && x != Number(100301)
        );
         // 如果有选中得，默认选中成员列表按钮
        if (!!cret) {
          checkedKey.push(100301);
          this.$refs["tree" + d][0].setCheckedKeys(checkedKey);
        }
         //获取员管理选中项 ，除了成员列表 

        let  account= checkedKey.find(
          x => Number(x) >= 100500 && Number(x) <= 100550 && x != Number(100505)
        );
         // 如果有选中得，默认选中成员管理按钮
        if (!!account) {
          checkedKey.push(100505);
          this.$refs["tree" + d][0].setCheckedKeys(checkedKey);
        }
        //组织架构 
        let department  = checkedKey.find(
          x => Number(x) >= 100600 && Number(x) <= 100650 && x != Number(100601)
        );
         // 如果有选中得，默认选中组织架构列表按钮
        if (!!department) {
          checkedKey.push(100601);
          this.$refs["tree" + d][0].setCheckedKeys(checkedKey);
        }
        let haveAll =
          checkedKey.indexOf(100200) >= 0 &&
          checkedKey.indexOf(100300) >= 0 &&
          checkedKey.indexOf(100500) >= 0 &&
          checkedKey.indexOf(100600) >= 0 ;
        this.permissionList[d].checked = haveAll;
      }
    },
    allSelect(item, index) {
      if (item.checked == true) {
        item.permissionIds = [100200, 100300,100500,100600];
        this.$nextTick(() => {
          this.$refs["tree" + index][0].setCheckedKeys([100200, 100300,100500,100600]);
        });
      } else {
        item.permissionIds = [];
        this.$nextTick(() => {
          this.$refs["tree" + index][0].setCheckedKeys([]);
        });
      }
    },
    //提交权限
    async postRoleList(item, index) {
      let params = [
        {
          id: item.id ? item.id : "",
          name: item.name,
          permissionIds: this.$refs["tree" + index][0].getCheckedKeys()
        }
      ];
      if (!item.name || item.name.length < 1) {
        this.$message({
          message: "请输入角色名称！",
          type: "warning"
        });
        return;
      }
      let result = await postRole(params);
      this.$message({
        message: "保存成功！",
        type: "success"
      });
      this.getAllRole();
    },
    //删除权限
    async deleteRoleList(item) {
      let params = {
        id: item.id
      };
      let result = await deleteRole(params);
      this.$message({
        message: "删除成功！",
        type: "success"
      });
      this.getAllRole();
    },
    //获取所有权限
    async getAllPerssion() {
      let result = await allPermission();
      // if (this.$parent.permissionArr.indexOf(552) >= 0) {
      //   result.map(item => (item.disabled = false));
      // } else {
      //   result.map(item => (item.disabled = true));
      // }
      this.permissionOption = result;
      // this.permissionOption=[]
      this.getAllRole();
    },

    //获取所有角色列表
    async getAllRole() {
      let result = await allRoleList();
      if (result.length > 0) {
        this.permissionList = [];
        for (let i = 0; i < result.length; i++) {
          this.permissionList.push({
            id: result[i].id,
            checked: false,
            name: result[i].name,
            option: this.permissionOption
          });

          this.$nextTick(() => {
            this.$refs["tree" + i][0].setCheckedKeys(result[i].permissions);
          });
        }
        for (let j = 0; j < this.permissionList.length; j++) {
          if (
            result[j].permissions.indexOf(100200) != -1 &&
            result[j].permissions.indexOf(100300) != -1 &&
            result[j].permissions.indexOf(100500) != -1 &&
            result[j].permissions.indexOf(100600) != -1 
          ) {
            this.permissionList[j].checked = true;
          }
        }
      }else{
        this.addPermission();
      }
    },
    addPermission() {
      let obj = {
        id: "",
        checked: false,
        name: "",
        option: this.permissionOption
      };
      this.permissionList.push(obj);
    },
    openIsDelete(list, item) {
      this.isDelete = true;
      this.permissionItem = item;
    },
    deletePerission(list, item) {
      if (item && item.id) {
        this.deleteRoleList(item);
      } else {
        var index = list.indexOf(item);
        if (index > -1) {
          list.splice(index, 1);
        }
      }
      this.isDelete = false;
    }
  },
  watch: {}
};
</script>
<style lang="scss" scoped>
@import "./saveRoleweb.scss";
@import "~assets/css/mixin";
</style>
<style>
#permission .el-input {
  width: 100%;
}
#permission .el-input__inner {
  width: 100%;
  color: #303133;
  font-size: 0.8rem;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid #e4e7ed;
}
#permission input::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #ff6600;
  font-size: 0.8rem;
}

#permission input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #ff6600;
  font-size: 0.8rem;
}

#permission input:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #ff6600;
  font-size: 0.8rem;
}
#permission .el-tree {
  display: flex;
}
#permission .el-tree-node {
  margin-right: auto;
}
#permission .el-tree-node__label {
  font-size: 0.7rem;
  color: #363636;
}
#permission .el-checkbox__label {
  font-size: 0.7rem;
  color: #363636;
}

#permission .el-dialog__body {
  font-size: 0.8rem;
  text-align: center;
}
</style>
