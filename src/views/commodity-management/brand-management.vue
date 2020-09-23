<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="formInline.name" placeholder="搜索品牌ID/品牌名称" class="input_search" />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="onSubmit('formInline')"
            >查询</el-button>

            <el-button
              type="primary"
              size="mini"
              icon="el-icon-circle-plus-outline"
              @click="add('formInline')"
              v-permission
              permission-method="POST"
              permission-taskCode="/brand"
            >添加</el-button>

            <el-button
              v-permission
              permission-method="GET"
              permission-taskCode="/brand/export"
              type="primary"
              size="mini"
              icon="el-icon-download"
              @click="Export"
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
          <el-table-column prop="id" label="品牌ID" align="center"></el-table-column>
          <el-table-column prop="name" label="品牌名称" align="center"></el-table-column>
          <el-table-column prop="englishName" label="英文名称" align="center"></el-table-column>
          <el-table-column prop="picUrl" label="品牌图片" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.picUrl" alt style="width: 40px;height: 40px" />
            </template>
          </el-table-column>
          <el-table-column prop="manufactory" label="厂家/供应商" align="center"></el-table-column>
          <el-table-column prop="desc" label="介绍" align="center"></el-table-column>
          <el-table-column prop="floorPrice" label="底价" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="300px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="edit( scope.row)"
                v-permission
                permission-method="PUT"
                permission-taskCode="/brand"
              >编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
                v-permission
                permission-method="DELETE"
                permission-taskCode="/brand"
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
      <el-dialog
        :title="dltitle"
        :visible.sync="dialogVisible"
        width="500px"
        :close-on-click-modal="false"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="140px" label-position="left">
          <el-form-item label="品牌名称:" prop="name">
            <el-input v-model="form.name" style="width:200px" placeholder="请输入品牌名称"></el-input>
          </el-form-item>
          <el-form-item label="英文名称:" prop="englishName">
            <el-input v-model="form.englishName" style="width:200px" placeholder="请输入英文名称"></el-input>
          </el-form-item>
          <el-form-item label="介绍:">
            <el-input v-model="form.desc" style="width:200px" type="textarea" placeholder="请输入品牌介绍"></el-input>
          </el-form-item>
          <el-form-item label="厂家/供应商:">
            <el-input
              v-model="form.manufactory"
              style="width:200px"
              type="textarea"
              placeholder="请输入厂家/供应商"
            ></el-input>
          </el-form-item>
          <el-form-item label="品牌图片">
            <avatarUpload :url="form.picUrl" @change="changeImg($event,'picUrl')"></avatarUpload>
          </el-form-item>
          <el-form-item label="底价:">
            <el-input v-model="form.floorPrice" style="width:200px" placeholder="请输入底价"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button v-if="dltitle =='编辑品牌'" type="primary" @click="editquarters('form')">确定</el-button>
          <el-button v-if="dltitle =='添加品牌'" type="primary" @click="addquarters('form')">确定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import {
  brandpost,
  brandput,
  branddelete,
  searchList,
  brandexport,
} from "@/api/brand";
import avatarUpload from "@/components/Upload/avatarUpload";
export default {
  components: { avatarUpload },
  data() {
    return {
      formInline: {},
      dialogVisible: false,
      dataList: [],
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      dltitle: "",
      dialogImageUrl: "",
      dialogVisible: false,
      form: {
        desc: "",
        enabled: true,
        icon: "",
        id: 0,
        name: "",
        pics: "",
      },
      rules: {
        name: [{ required: true, message: "请输入品牌名称", trigger: "blur" }],
        desc: [{ required: true, message: "请输入品牌介绍", trigger: "blur" }],
        englishName: [
          { required: true, message: "请输入英文名称", trigger: "blur" },
        ],
        picUrl: [
          { required: true, message: "请上传品牌图片", trigger: "blur" },
        ],
        floorPrice: [
          { required: true, message: "请输入厂家/供应商", trigger: "blur" },
        ],
        manufactory: [
          { required: true, message: "请输入底价", trigger: "blur" },
        ],
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
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      searchList(param).then((response) => {
        console.log(response, "response");
        this.tableData = response.data.dataList;
        this.total = response.data.total;
      });
    },
    Export() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      const param = {
        name: this.formInline.name,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      brandexport(param)
        .then((response) => {
          const blob = new Blob([response]);
          const fileName = "商品品牌列表.xls";
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
    onSubmit() {
      this.getList();
    },
    changeImg(val, type) {
      this.form[type] = val;
    },
    edit(row) {
      this.dltitle = "编辑品牌";
      this.dialogVisible = true;
      this.form = row;
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
          brandput(this.form)
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
    add() {
      this.dltitle = "添加品牌";
      (this.form = {
        desc: "",
        enabled: true,
        icon: "",
        id: 0,
        name: "",
        pics: "",
      }),
        (this.dialogVisible = true);
    },
    disable(row) {
      const tish = row.enabled ? "确定禁用" : "确定启用";
      this.$confirm(tish + ",是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          brandenable({ id: row.id, enable: !row.enabled })
            .then((response) => {
              // debugger
              this.$message({
                type: "success",
                message: "操作成功!",
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
    handleDelete(row) {
      this.$confirm("删除品牌, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          branddelete({ id: row.id })
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

