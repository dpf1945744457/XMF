<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="formInline.question" placeholder="请输入问题" class="input_search" />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="onSubmit('formInline')"
            >查找</el-button>

            <el-button
              type="primary"
              size="mini"
              icon="el-icon-circle-plus-outline"
              @click="add('formInline')"
              v-permission
              permission-method="POST"
              permission-taskCode="/issue"
            >添加</el-button>
            <el-button
              class="filter-item"
              type="primary"
              size="mini"
              icon="el-icon-download"
              v-permission
              permission-method="GET"
              permission-taskCode="/issue/export"
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
          <el-table-column prop="id" label="问题ID" align="center"></el-table-column>
          <el-table-column prop="question" label="问题内容" align="center"></el-table-column>
          <el-table-column prop="answer" label="问题回复" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="300px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="edit( scope.row)"
                v-permission
                permission-method="PUT"
                permission-taskCode="/issue"
              >编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
                v-permission
                permission-method="DELETE"
                permission-taskCode="/issue"
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
          <el-form-item label="问题:" prop="question">
            <el-input v-model="form.question" style="width:200px" placeholder="请输入问题"></el-input>
          </el-form-item>
          <el-form-item label="问题回复:" prop="answer">
            <el-input
              v-model="form.answer"
              type="textarea"
              style="width:200px"
              placeholder="请输入问题回复"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button v-if="dltitle =='编辑'" type="primary" @click="editquarters('form')">确定</el-button>
          <el-button v-if="dltitle =='添加'" type="primary" @click="addquarters('form')">确定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import {
  issuepost,
  issueput,
  issuedelete,
  searchList,
  issueexport,
} from "@/api/problems";
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
       question:'',
       answer:''
      },
      rules: {
        question: [{ required: true, message: "请输入问题", trigger: "blur" }],
        answer: [
          { required: true, message: "请输入问题回复", trigger: "blur" },
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
        question: this.formInline.question,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      searchList(param).then((response) => {
        console.log(response, "response");
        this.tableData = response.data.dataList;
        this.total = response.data.total;
      });
    },
    onSubmit() {
      this.getList();
    },
    changeImg(val, type) {
      this.form[type] = val;
    },
    Export() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      const param = {
        question: this.formInline.question,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      issueexport(param)
        .then((response) => {
          const blob = new Blob([response]);
          const fileName = "通用问题.xls";
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
    edit(row) {
      this.dltitle = "编辑";
      this.dialogVisible = true;
      this.form = row;
    },
    addquarters(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          issuepost(this.form)
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
          issueput(this.form)
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
      this.dltitle = "添加";
     this. form={
       question:'',
       answer:''
      },
      this.dialogVisible = true;
    },

    handleDelete(row) {
      this.$confirm("删除问题, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          issuedelete({ id: row.id })
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

