<template>
  <div class="container">
    <div class="container_on">
      <div class="on_title">
        <p>查询条件</p>
        <p>更多</p>
      </div>
      <div class="on_input">
        <el-row>
          <el-col :span="4" :offset="1">
            <div class="grid-content bg-purple-light">
              <el-input v-model="appName" placeholder="请输入角色名称"></el-input>
            </div>
          </el-col>
          <!--<el-col :span="10">
						<div class="grid-content bg-purple">
							<el-select v-model="platform" placeholder="请选择操作平台">
								<el-option v-for="item in platformOptions" :key="item.id" :label="item.platformName" :value="item.platformName">
								</el-option>
							</el-select>
						</div>
          </el-col>-->

          <!--<el-col :span="7" :offset="1"><div class="grid-content bg-purple"><el-input v-model="input" placeholder="请输入联系方式"></el-input></div></el-col>-->
          <el-col :span="2">
            <div class="grid-content bg-purple-light">
              <el-button type="primary" icon="el-icon-search" class="query" @click="search">查询</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="container_tw">
      <div class="tw_title">
        <p>角色列表</p>
        <!--右边按钮  -->
        <div class="tools-right">
          <el-button type="primary" class="tools-button" @click="addSystem">
            <i class="el-icon-circle-plus-outline"></i> 添加
          </el-button>
        </div>
        <!--<el-button type="primary" icon="el-icon-circle-plus" size="small">搜索</el-button>-->
      </div>
      <div class="tw_form">
        <el-table :data="systemList" style="width: 100%" class="table">
          <!-- <el-table-column prop="id" label="ID" ></el-table-column> -->
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleCode" label="角色编号"></el-table-column>
          <el-table-column prop="deptCode" label="所属部门编码"></el-table-column>
          <el-table-column prop="enable" label="状态" :formatter="formatEnable">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.enable"
                type="primary"
                size="small"
                plain
                @click="status(scope.row,scope.row.enable)"
              >启用</el-button>
              <el-button
                v-if="!scope.row.enable"
                type="danger"
                size="small"
                @click="status(scope.row,scope.row.enable)"
              >停用</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="createTimeLong" label="创建时间">
            <template slot-scope="scope">{{dateFormats(new Date(scope.row.createTimeLong))}}</template>
          </el-table-column>
          <el-table-column prop="updateTimeLong" label="更新时间">
            <template slot-scope="scope">{{dateFormats(new Date(scope.row.updateTimeLong))}}</template>
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="success" size="small" @click="handleRole(scope.row)">配置权限</el-button>
              <el-button @click="handleDelete(scope.row)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 弹出框 -->
      <el-dialog title="添加角色" :visible.sync="dialogVisible" width="40%">
        <el-form ref="form" :model="form" label-width="140px" label-position="left" :rules="rules">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="form.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色编号" prop="roleCode">
            <el-input v-model="form.roleCode" :disabled="addOrEdit != 'add'"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5,10,15,20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getRoleList, saveRole, updateRole, deleteRole,rolesetEnable } from "@/api/system";

import { dateFormat } from "@/utils/validate";
export default {
  name: "PermissionGroup",
  data() {
    return {
      appName: "",
      //				platform: '',
      //				platformOptions: [],
      dialogVisible: false,
      form: {
        deptCode: this.$route.query.deptCode,
        roleName: "123",
        roleCode: 123,
      },
      pageNum: 1,
      pageSize: 5,
      total: 0,
      systemList: [],
      addOrEdit: "add",
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          //          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, message: "请输入角色编号", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    $route() {
      this.deptCode = this.$route.query.deptCode;
      this.getRoleLists();
    },
  },
  created() {
    this.getRoleLists();
  },
  methods: {
    formatEnable(row, column) {
      return row.enable == true ? "启用" : "停用";
    },
    getRoleLists() {
      getRoleList({
        key: this.appName,
        deptCode: this.$route.query.deptCode,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      })
        .then((response) => {
          if (response.code == "200") {
            this.systemList = response.data.dataList;
            this.total = response.data.total;
          }
        })
        .catch((error) => {
          this.$message.error(error.errmsg);
        });
    },
    search() {
      this.getRoleLists();
    },
    addSystem() {
      this.dialogVisible = true;
      this.addOrEdit = "add";
      this.form.roleName = "";
      this.form.roleCode = "";
    },
     status(row, type) {
      let ty = "启用";
      if (type) {
        ty = "禁用";
      }
      this.$confirm("是否" + ty + ",是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const data = {
            id: row.id,
            enable: !type,
          };
          rolesetEnable(data)
            .then((response) => {
              if (response.code == "200") {
                this.getRoleLists();
              }
            })
            .catch((error) => {
              this.$message.error(error.errmsg);
            });
        })
        .catch(() => {});
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteRole(row.id)
            .then((response) => {
              if (response.code == "200") {
                this.getRoleLists();
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
              }
            })
            .catch((error) => {
              this.$message.error(error.errmsg);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    handleEdit(row) {
      this.addOrEdit = "edit";
      this.dialogVisible = true;
      this.form.roleName = row.roleName;
      this.form.roleCode = row.roleCode;
      this.form.id = row.id;
    },
    handleRole(row) {
      let otherQuery = this.$router.push({
        path: "/systemManagement/asset-access",
        query: { deptCode: row.deptCode, type: "role", id: row.id },
      });
    },
    dateFormats(date) {
      console.log(date);
      return dateFormat("YYYY-mm-dd HH:MM:SS", date);
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          //		      	编辑
          if (this.addOrEdit == "edit") {
            updateRole(this.form)
              .then((response) => {
                if (response.code == "200") {
                  this.$message({
                    message: "编辑成功",
                    type: "success",
                  });
                  this.dialogVisible = false;
                  this.getRoleLists();
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
          //		      	新增
          else if (this.addOrEdit == "add") {
            saveRole(this.form)
              .then((response) => {
                if (response.code == "200") {
                  this.$message({
                    message: "新增成功",
                    type: "success",
                  });
                  this.dialogVisible = false;
                  this.getRoleLists();
                }
              })
              .catch((error) => {
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
      this.getRoleLists();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getRoleLists();
    },
  },
};
</script>

<style lang='scss' scoped>
.container_on {
  margin: 20px;
  height: 160px;
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
  margin: 0 20px;
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
