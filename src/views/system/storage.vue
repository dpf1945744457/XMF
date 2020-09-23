<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="formInline.key" placeholder="请输入对象key" class="input_search" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.name" placeholder="请输入对象名称" class="input_search" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="onSubmit()">查询</el-button>

            <el-button
              type="primary"
              size="mini"
              icon="el-icon-circle-plus-outline"
              @click="add()"
               v-permission
      permission-method="POST"
      permission-taskCode="/admin/storage/create"
            >添加</el-button>
              <el-button
              size="mini"
              type="primary"
              icon="el-icon-download"
              @click="Export()"
              v-permission
      permission-method="GET"
      permission-taskCode="/admin/storage/export"
            >导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-table
          :data="tableData"
          style="width: 100%"
          class="table"
         height="calc(100vh - 300px) "
size="small"
          border
        >
          <el-table-column align="center" label="对象key" prop="keyword"></el-table-column>

          <el-table-column align="center" label="对象名称" prop="name"></el-table-column>

          <el-table-column align="center" label="对象类型" prop="type"></el-table-column>

          <el-table-column align="center" label="对象大小" prop="size"></el-table-column>

          <el-table-column align="center" property="url" label="图片">
            <template slot-scope="scope">
              <img :src="scope.row.url" width="40" v-if="scope.row.type.indexOf('image') > -1" />
              <img src="../../assets/file/file.png" width="40" v-else />
            </template>
          </el-table-column>

          <el-table-column align="center" label="图片链接" prop="url"></el-table-column>

          <el-table-column label="操作" align="center" width="300px">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="edit( scope.row)" v-permission
                  permission-method="POST"
                permission-taskCode="/admin/storage/update">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                v-permission
                  permission-method="DELETE"
                permission-taskCode="/admin/storage/delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="text-align:center; margin-top:2em">
          <el-pagination
            :page-sizes="[10, 20, 30, 50]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <!-- 弹出框 -->
      <el-dialog title="上传对象" :visible.sync="createDialogVisible">
        <el-upload
          class="upload-demo"
          :action="uploadPath"
          :headers="headers"
          :on-success="uploadSuccess"
          multiple
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-dialog>

      <!-- 修改对话框 -->
      <el-dialog title="修改对象名称" :visible.sync="updateDialogVisible" width="500px">
        <el-form
          :rules="rules"
          ref="dataForm"
          :model="dataForm"
          status-icon
          label-position="left"
          label-width="100px"
        >
          <el-form-item label="对象名称" prop="name">
            <el-input v-model="dataForm.name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="editquarters('dataForm')">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import {
  searchList,
  uploadPath,
  storageupdate,
  storagedelete,
  storageexport
} from "@/api/storage";
import avatarUpload from "@/components/Upload/avatarUpload";
import { getToken, removeToken } from "@/utils/auth";
export default {
  components: { avatarUpload },
  computed: {
    headers() {
      return {
        token: getToken(),
      };
    },
  },
  data() {
    return {
      formInline: {},
      dialogVisible: false,
      createDialogVisible: false,
      dataList: [],
      updateDialogVisible: false,
      tableData: [],
      pageNum: 1,
      fileList: [],
      uploadPath: uploadPath,
      pageSize: 10,
      total: 0,
      dltitle: "",
      dialogImageUrl: "",
      dataForm: {
        desc: "",
        enabled: true,
        icon: "",
        id: 0,
        name: "",
        pics: "",
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      const param = {
        name: this.formInline.name,
        key: this.formInline.key,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      searchList(param).then((response) => {
        console.log(response, "response");
        this.tableData = response.data.list;
        this.total = response.data.total;
      });
    },
    uploadSuccess() {
      this.createDialogVisible = false;
      this.getList();
    },
    onSubmit() {
      this.getList();
    },
     Export() {
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          storageexport()
            .then((response) => {
              const blob = new Blob([response]);
              const fileName = "对象存储.xls";
              if ("download" in document.createElement("a")) {
                // 非IE下载
                const elink = document.createElement("a");
                elink.download = fileName;
                elink.style.display = "none";
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href); // 释放URL 对象
                document.body.removeChild(elink);
              } else {
                // IE10+下载
                navigator.msSaveBlob(blob, fileName);
              }
              loading.close();
            })
            .catch((error) => {
              console.log(error);
            });
       
    },
    changeImg(val, type) {
      this.form[type] = val;
    },
    edit(row) {
      this.updateDialogVisible = true;
      this.dataForm = row;
    },
    handleExceed(files) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`
      );
    },
    addquarters(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          brandpost(this.form)
            .then((response) => {
              // debugger
              console.log(response, "6666666666688888");
              this.dialogVisible = false;
              this.getList();
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    editquarters(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          storageupdate(this.dataForm)
            .then((response) => {
              // debugger

              this.updateDialogVisible = false;
              this.getList();
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    add() {
      this.createDialogVisible = true;
    },

    handleDelete(row) {
      this.$confirm("删除文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          storagedelete({ id: row.id })
            .then((response) => {
              // debugger
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getList();
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },

    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val;
      this.getList();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getList();
    },
  },
};
</script>

<style lang='scss' scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  box-sizing: border-box;
  // width: 480px;
  .clearfix {
    .input_search {
      width: 380px;
    }
  }
}
</style>

