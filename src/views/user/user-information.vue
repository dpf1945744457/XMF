<template>
  <div class="container">
    <div class="container_on">
      <div class="on_title">
        <p>查询条件</p>
      </div>
      <el-form
        ref="ruleForm"
        :inline="true"
        :model="formInline"
        :rules="rules"
        class="demo-form-inline"
      >
        <el-form-item>
          <el-input v-model="formInline.key" placeholder="登录账号或者用户名或者手机号"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="container_tw">
      <div class="tw_title">
        <p>系统列表</p>
        <!--右边按钮  -->
        <div class="tools-right">
          <el-button type="primary" class="tools-button" @click="addSystem">
            <i class="el-icon-circle-plus-outline"></i> 添加
          </el-button>
        </div>
        <!--<el-button type="primary" icon="el-icon-circle-plus" size="small">搜索</el-button>-->
      </div>
      <div class="tw_form">
        <el-table :data="systemList" style="width: 100%" class="table" height="calc(100vh - 450px)">
          <!-- <el-table-column prop="id" label="ID" ></el-table-column> -->

          <el-table-column prop="userName" label="用户名" align="center"></el-table-column>
          <el-table-column prop="account" label="登录账号" align="center"></el-table-column>
          <el-table-column prop="email" label="邮箱" align="center"></el-table-column>

          <el-table-column prop="enable" label="状态" :formatter="formatEnable" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status==1"
                type="primary"
                size="small"
                plain
                @click="status(scope.row,0)"
              >启用</el-button>
              <el-button
                v-if="scope.row.status==0"
                type="danger"
                size="small"
                @click="status(scope.row,1)"
              >停用</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="mobilePhone" label="移动电话" align="center"></el-table-column>
          <el-table-column prop="sex" label="性别" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.sex==1">女</span>
              <span v-if="scope.row.sex==0">男</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="400" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="success" size="small" @click="resetPassword(scope.row)">重置密码</el-button>
              <el-button type="success" size="small" @click="handleDept(scope.row)">账号角色</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block" style="text-align:center; margin-top:2em">
        <el-pagination
          background
          :current-page="pageNum"
          :page-sizes="[5,10,15,20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
      <!-- 弹出框 -->
      <el-dialog title="添加账号" :visible.sync="dialogVisible" width="500px">
        <el-form ref="form" :model="form" label-width="140px" label-position="left" :rules="rules">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="form.userName" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item label="登录账号" prop="account">
            <el-input v-model="form.account" placeholder="登录账号"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="邮箱"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobilePhone">
            <el-input v-model="form.mobilePhone" placeholder="手机号码"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="form.sex" placeholder="请选择性别">
              <el-option label="男" value="0"></el-option>
              <el-option label="女" value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog title="设置角色" :visible.sync="dialogVisibleuser" width="500px">
        <el-form ref="form" :model="form" label-width="140px" label-position="left" :rules="rules">
          <el-tree
            ref="tree"
            :data="MenuList"
            show-checkbox
            default-expand-all
            node-key="code"
            highlight-current
            :props="defaultProps"
            @check-change="handleCheckChange"
          ></el-tree>
          <el-form-item>
            <el-button type="primary" @click="onSubmitlisu">保存</el-button>
            <el-button @click="dialogVisibleuser = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

    <!-- 分页 -->
  </div>
</template>

<script>
import {
  userlist,
  resetPassword,
  usersave,
  userupdate,
  usersetEnable,
  usergetDeptTree,
  userfindUserRoleList,
  usersetRole
} from '@/api/userlist';
import { username, validEmail, validphone } from '@/utils/validate';
export default {
  name: 'PermissionGroup',
  data() {
    var validateusername = (rule, value, callback) => {
      if (value == '' || value == undefined) {
        callback(new Error('请输入登录账号'));
      } else if (!username(value)) {
        callback(new Error('只能包含字母和数字'));
      }
      callback();
    };
    var validateemail = (rule, value, callback) => {
      if (value == '' || value == undefined) {
        callback(new Error('请输入邮箱'));
      } else if (!validEmail(value)) {
        callback(new Error('请输入正确的邮箱'));
      }
      callback();
    };
    var phone = (rule, value, callback) => {
      if (value == '' || value == undefined) {
        callback(new Error('请输入手机号码'));
      } else if (!validphone(value)) {
        callback(new Error('请输入正确的手机号码'));
      }
      callback();
    };
    return {
      formInline: {},
      //				platform: '',
      //				platformOptions: [],
      dialogVisible: false,
      form: {
        account: '',
        code: ''
      },
      pageNum: 1,
      pageSize: 5,
      total: 0,
      MenuList: [],
      systemList: [],
      deptCodes: [],
      addOrEdit: 'add',
      defaultProps: {
        children: 'roleList',
        label: 'name'
      },
      dialogVisibleuser: false,
      rules: {
        account: [
          {
            required: true,
            validator: validateusername,
            trigger: 'blur'
          }
          //          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        userName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            validator: validateemail,
            trigger: 'blur'
          }
        ],
        mobilePhone: [
          {
            required: true,
            validator: phone,
            trigger: 'blur'
          }
        ],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }]
      }
    };
  },
  created() {
    this.userlists();
    this.getusergetDeptTree();
  },
  methods: {
    formatEnable(row, column) {
      return row.enable == true ? '启用' : '停用';
    },
    userlists() {
      userlist({
        key: this.formInline.key,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      })
        .then(response => {
          if (response.code == '200') {
            this.systemList = response.data.dataList;
            this.total = response.data.total;
          }
        })
        .catch(error => {
          // this.$message.error(error.errmsg);
        });
    },
    onSubmitlisu() {
      const data = {
        deptCodes: this.deptCodes,
        roleCodes: this.menuIds,
        id: this.userID
      };
      usersetRole(data)
        .then(response => {
          console.log(response);
		  // this.MenuList = response.data;
		    this.$message({
            type: 'success',
            message: '角色设置成功'
          });
          this.dialogVisibleuser = false;
          this.userlists();
        })
        .catch(error => {
          this.$message.error(error.errmsg);
        });
    },
    getusergetDeptTree() {
      usergetDeptTree()
        .then(response => {
          console.log(response);
          this.MenuList = response.data;
        })
        .catch(error => {
          this.$message.error(error.errmsg);
        });
    },
    status(row, type) {
      let ty = '启用';
      if (type == 0) {
        ty = '禁用';
      }
      this.$confirm('是否' + ty + ',是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const data = {
            id: row.id,
            status: type
          };
          usersetEnable(data)
            .then(response => {
              if (response.code == '200') {
                this.userlists();
              }
            })
            .catch(error => {
              this.$message.error(error.errmsg);
            });
        })
        .catch(() => {});
    },
    menulist(id, adminMenu, arr) {
      //       console.log("element",element);
      //        console.log("adminMenu",adminMenu);

      //  console.log("arr",arr);

      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if (element == adminMenu) {
          // console.log(22222222,arr.indexOf(id));
          //  arr.splice(0, arr.indexOf(id));
          //  arr.splice(0, arr.indexOf(id));
          this.deptCodes.push(id);
          console.log(11111111111, this.unique1(this.deptCodes));
          this.deptCodes = this.unique1(this.deptCodes);
          return arr;
        }
      }
    },
    handleCheckChange() {
      const res = this.$refs.tree.getCheckedNodes();

      const arr = [];

      res.forEach(item => {
        arr.push(item.code);
      });
      for (let index = 0; index < this.MenuList.length; index++) {
        const element = this.MenuList[index];
        for (let index = 0; index < element.roleList.length; index++) {
          const adminMenu = element.roleList[index].code;
          this.menulist(element.code, adminMenu, arr);
        }
      }
      this.menuIds = this.unique1(arr);
      // this.menuIds = menuIds.substring(1, menuIds.length - 1);
      for (let i = 0; i < this.unique1(arr).length; i++) {
        const element1 = this.unique1(arr)[i];
        for (let index = 0; index < this.deptCodes.length; index++) {
          const element = this.deptCodes[index];
          if (element1 == element) {
            this.menuIds.splice(index, 1);
          }
        }
      }
      console.log(this.menuIds);
    },
    unique1(arr) {
      var hash = [];
      for (var i = 0; i < arr.length; i++) {
        if (hash.indexOf(arr[i]) == -1) {
          hash.push(arr[i]);
        }
      }
      return hash;
    },
    search() {
      this.userlists();
    },
    
    addSystem() {
      this.dialogVisible = true;
      this.addOrEdit = 'add';
      this.form = {};
    },

    handleEdit(row) {
      this.addOrEdit = 'edit';
      this.dialogVisible = true;
      this.form = row;
    },
    handleRole(row) {
      const otherQuery = this.$router.push({
        path: '/systemManagement/asset-access',
        query: {
          systemCode: row.code,
          type: 'system'
        }
      });
    },
    resetPassword(row) {
      this.$confirm('重置密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          resetPassword({ id: row.id })
            .then(response => {
              console.log(response);
              this.$notify({
                type: 'success',
                title: '提示',
                message: '密码重置成功,新密码为123456',
                duration: 0
              });
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    handleDept(row) {
      this.dialogVisibleuser = true;
      this.userID = row.id;
      const data = {
        id: row.id
      };
      userfindUserRoleList(data)
        .then(response => {
          console.log(response);
          this.$refs.tree.setCheckedKeys(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          //		      	编辑

          if (this.addOrEdit == 'edit') {
            userupdate(this.form)
              .then(response => {
                if (response.code == '200') {
                  this.$message({
                    message: '编辑成功',
                    type: 'success'
                  });
                  this.dialogVisible = false;
                  this.userlists();
                }
              })
              .catch(error => {
                console.log(error);
              });
          }
          //		      	新增
          else if (this.addOrEdit == 'add') {
            usersave(this.form)
              .then(response => {
                if (response.code == '200') {
                  this.$message({
                    message: '新增成功',
                    type: 'success'
                  });
                  this.dialogVisible = false;
                  this.userlists();
                }
              })
              .catch(error => {
                console.log(error);
              });
          }
        } else {
          return false;
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.userlists();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.userlists();
    }
  }
};
</script>

<style lang='scss' scoped>
.container {
  padding: 20px;
}
.container_on {
  padding: 20px;
  background: white;
  .on_title {
    margin-bottom: 20px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 10px;
    border-bottom: 1px solid rgb(231, 234, 236);
    & > p:nth-child(1) {
      color: rgb(104, 107, 109);
      font-size: 14px;
      font-weight: bold;
    }
    & > p:nth-child(2) {
      color: rgb(1, 123, 255);
      font-size: 14px;
    }
    & > p:nth-child(2):hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .on_input {
    .el-row {
      display: flex;
      justify-content: space-around;
    }
  }
}
.container_tw {
  .tw_title {
    height: 50px;
    background: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20px;
    border-bottom: 1px solid rgb(231, 234, 236);
    & > p {
      color: rgb(104, 107, 109);
      font-size: 14px;
      font-weight: bold;
    }
    .el-button:hover {
      background: rgb(27, 179, 148);
    }
  }
  .tw_form {
    box-sizing: border-box;
    .el-table {
      box-sizing: border-box;
      padding: 0 20px;
    }
  }
}

.pagination-container {
  background: #ffffff;
  padding: 10px 0;
  margin: 20px;
}
</style>
