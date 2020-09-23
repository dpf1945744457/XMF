<template>
  <div>
    <!-- 查询和其他操作 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="filter-container">
          <el-input
            clearable
            class="filter-item"
            style="width: 200px;"
            type="number"
            placeholder="请输入展馆ID"
            v-model="listQuery.id"
          ></el-input>
          <el-input
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="请输入展馆名称"
            v-model="listQuery.name"
          ></el-input>
          <el-button
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >查找</el-button>
          <el-button
            class="filter-item"
            size="mini"
            type="primary"
            @click="handleCreate"
            v-permission
            permission-method="POST"
            permission-taskCode="/category"
            icon="el-icon-edit"
          >添加</el-button>
          <el-button
            class="filter-item"
            type="primary"
            size="mini"
            icon="el-icon-download"
            @click="Export"
            v-permission
            permission-method="GET"
            permission-taskCode="/export/category"
          >导出</el-button>
        </div>
      </div>
      <!-- 查询结果 -->
      <el-table
        size="small"
        :data="list"
        v-loading="listLoading"
        element-loading-text="正在查询中。。。"
        border
        fit
        height="calc(100vh - 300px) "
        highlight-current-row
      >
        <el-table-column align="center" label="展馆ID" prop="id"></el-table-column>

        <el-table-column align="center" label="展馆名" prop="name"></el-table-column>

        <el-table-column align="center" property="iconUrl" label="展馆图标">
          <template slot-scope="scope">
            <img :src="scope.row.iconUrl" width="40" v-if="scope.row.iconUrl" />
          </template>
        </el-table-column>

        <el-table-column align="center" property="picUrl" label="展馆图片">
          <template slot-scope="scope">
            <img :src="scope.row.picUrl" width="80" v-if="scope.row.picUrl" />
          </template>
        </el-table-column>

        <el-table-column align="center" label="关键字" prop="keywords"></el-table-column>

        <el-table-column align="center" min-width="100" label="简介" prop="desc"></el-table-column>

        <el-table-column
          align="center"
          label="级别"
          prop="level"
          :filters="[{ text: '一级展馆', value: 'L1' }, { text: '二级展馆', value: 'L2' }]"
          :filter-method="filterLevel"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.level === 'L1' ? 'primary' : 'info' "
            >{{scope.row.level === 'L1' ? '一级展馆' : '二级展馆'}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" label="父展馆ID" prop="pid"></el-table-column>

        <el-table-column
          align="center"
          label="操作"
          width="300"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              v-if="!scope.row.enabled"
              @click="isEnableds(scope.row, true)"
              v-permission
              permission-method="PUT"
              permission-taskCode="/category/enable"
            >启用</el-button>
            <el-button
              type="info"
              size="mini"
              v-if="scope.row.enabled"
              @click="isEnableds(scope.row, false)"
              v-permission
              permission-method="PUT"
              permission-taskCode="/category/enable"
            >禁用</el-button>

            <el-button
              type="primary"
              size="mini"
              @click="handleUpdate(scope.row)"
              v-permission
              permission-method="PUT"
              permission-taskCode="/category"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(scope.row)"
              v-permission
              permission-method="DELETE"
              permission-taskCode="/category"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="block" style="text-align:center; margin-top:2em">
        <el-pagination
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <!-- 添加或修改对话框 -->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="500px">
        <el-form
          :rules="rules"
          ref="dataForm"
          :model="dataForm"
          status-icon
          label-position="left"
          label-width="100px"
        >
          <el-form-item label="展馆名称" prop="name">
            <el-input v-model="dataForm.name"></el-input>
          </el-form-item>
          <el-form-item label="关键字" prop="keywords">
            <el-input v-model="dataForm.keywords"></el-input>
          </el-form-item>
          <el-form-item label="级别" prop="level">
            <el-select v-model="dataForm.level" @change="onLevelChange">
              <el-option label="一级展馆" value="L1"></el-option>
              <el-option label="二级展馆" value="L2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="父展馆"
            :prop="dataForm.level=='L1'?'':'pid'"
            v-if="dataForm.level === 'L2'"
          >
            <el-select v-model="dataForm.pid">
              <el-option v-for="item in catL1" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="展馆图标" prop="iconUrl">
            <avatarUpload :url="dataForm.iconUrl" @change="changeImg($event,'iconUrl')"></avatarUpload>
          </el-form-item>
          <el-form-item label="展馆图片" prop="picUrl">
            <avatarUpload :url="dataForm.picUrl" @change="changeImg($event,'picUrl')"></avatarUpload>
          </el-form-item>
          <el-form-item label="展馆简介" prop="desc">
            <el-input v-model="dataForm.desc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button
            v-if="dialogStatus=='create'"
            type="primary"
            :loading="loading"
            @click="createData"
          >确定</el-button>
          <el-button v-else type="primary" :loading="loading" @click="updateData">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>

<script>
import {
  categoryadd,
  categoryEdit,
  categorytdelete,
  categorydisable,
  categoryList,
  categorytree,
  categoryl1list,
  exportcategory,
} from "@/api/category";
// import { enablesSetting } from "@/api/goods";
import avatarUpload from "@/components/Upload/avatarUpload";

export default {
  name: "Category",
  components: { avatarUpload },
  data() {
    return {
      loading: false,
      list: undefined,
      total: undefined,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        name: undefined,
        sort: "add_time",
        order: "desc",
      },
      catL1: {},
      dataForm: {
        id: undefined,
        name: "",
        keywords: "",
        level: "L2",
        pid: undefined,
        desc: "",
        iconUrl: undefined,
        picUrl: undefined,
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建",
      },
      rules: {
        pid: [{ required: true, message: "请选择父亲目录", trigger: "blur" }],
        name: [{ required: true, message: "展馆名不能为空", trigger: "blur" }],
      },
      downloadLoading: false,
    };
  },
  created() {
    this.getList();
    this.getCatL1();
  },
  methods: {
    getList() {
      this.listLoading = true;
      categoryList(this.listQuery)
        .then((response) => {
          console.info(response);
          this.list = response.data.dataList;
          this.total = response.data.total;
          this.listLoading = false;
        })
        .catch((error) => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },
    Export() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      exportcategory(this.listQuery)
        .then((response) => {
          const blob = new Blob([response]);
          const fileName = "展馆列表.xls";
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
      this.dataForm[type] = val;
    },
    getCatL1() {
      categoryl1list().then((response) => {
        this.catL1 = response.data;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        name: "",
        keywords: "",
        level: "L2",
        pid: undefined,
        desc: "",
        iconUrl: undefined,
        picUrl: undefined,
      };
    },
    filterLevel: function (value, row) {
      return row.level === value;
    },
    onLevelChange: function (value) {
      if (value === "L1") {
        this.pid = undefined;
      }
    },
    handleCreate() {
      this.resetForm();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    uploadIconUrl: function (response) {
      this.dataForm.iconUrl = response.data.url;
    },
    uploadPicUrl: function (response) {
      this.dataForm.picUrl = response.data.url;
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          categoryadd(this.dataForm)
            .then((response) => {
              this.list.unshift(response.data);
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
                duration: 2000,
              });

              this.getList();

              setTimeout(() => {
                this.loading = false;
              }, 1000);
            })
            .catch((error) => {
              this.$message({
                message: error.errmsg,
                type: "error",
              });
            });
        }
      });
    },
    async isEnableds(row) {
      let data = {
        enable: !row.enabled,
        id: row.id,
      };
      categorydisable(data)
        .then((response) => {
          this.$message.success(!row.enabled ? "启用成功" : "禁用成功");
          this.getList();
        })
        .catch((error) => {
          this.$message({
            message: error.errmsg,
            type: "error",
          });
        });
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          categoryEdit(this.dataForm)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.dataForm.id) {
                  const index = this.list.indexOf(v);
                  this.list.splice(index, 1, this.dataForm);
                  break;
                }
              }
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "更新成功",
                type: "success",
                duration: 2000,
              });
              this.getList();
            })
            .catch((error) => {
              this.$message({
                message: error.errmsg,
                type: "error",
              });
            });
        }
      });
    },
    handleDelete(row) {
      categorytdelete(row)
        .then((response) => {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000,
          });
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
        })
        .catch((error) => {
          this.$message({
            message: error.errmsg,
            type: "error",
          });
        });
    },
  },
};
</script>
