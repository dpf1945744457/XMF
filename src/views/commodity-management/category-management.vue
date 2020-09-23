<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="formInline.name" placeholder="搜索编号/分类名称" class="input_search" />
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
              @click="add()"
              v-permission
              permission-method="POST"
              permission-taskCode="/classify"
            >添加</el-button>
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
          <el-table-column prop="id" label="编号" align="center"></el-table-column>
          <el-table-column prop="name" label="商品分类名称" align="center"></el-table-column>
          <el-table-column prop="icon" label="图标" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.icon" alt style="width: 40px;height: 40px" />
            </template>
          </el-table-column>
          <el-table-column prop="pics" label="图片" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.pics" alt style="width: 40px;height: 40px" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="300px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                :type="scope.row.enabled?'info':'success'"
                @click="disable(scope.row)"
                v-permission
                permission-method="POST"
                permission-taskCode="/classify/enable"
              >{{ scope.row.enabled?'禁用':'启用' }}</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="edit( scope.row)"
                v-permission
                permission-method="PUT"
                permission-taskCode="/classify"
              >编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
                v-permission
                permission-method="DELETE"
                permission-taskCode="/classify"
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
          <el-form-item label="分类名称:" prop="name">
            <el-input v-model="form.name" style="width:200px" placeholder="请输入分类名称"></el-input>
          </el-form-item>
          <el-form-item label="公告事项:">
            <el-input v-model="form.desc" style="width:200px" type="textarea" placeholder="请输入公告事项"></el-input>
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <avatarUpload :url="form.icon" @change="changeImg($event,'icon')"></avatarUpload>
          </el-form-item>
          <el-form-item label="图片">
            <avatarUpload :url="form.pics" @change="changeImg($event,'pics')"></avatarUpload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button v-if="dltitle =='编辑分类'" type="primary" @click="editquarters('form')">确定</el-button>
          <el-button v-if="dltitle =='添加分类'" type="primary" @click="addquarters('form')">确定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import {
  classifypost,
  classifyput,
  classifydelete,
  classifyenable,
  searchList,
} from "@/api/classify";
import avatarUpload from "@/components/Upload/avatarUpload";
export default {
  components: { avatarUpload },
  data() {
    var validNumber = function (rule, value, callback) {
      if (value == "") {
        callback(new Error("请输入类目名称"));
      } else {
        var len = 0;
        for (var i = 0; i < value.length; i++) {
          var a = value.charAt(i);
          if (a.match(/[^\x00-\xff]/gi) != null) {
            len += 2;
          } else {
            len += 1;
          }
        }
        if (len > 12) {
          callback(new Error("类目名称不超过12个字符"));
        } else {
          callback();
        }
      }
    };
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
        name: [{ required: true, validator: validNumber, trigger: "change" }],
        desc: [{ required: true, message: "请输入公告事项", trigger: "blur" }],
        icon: [{ required: true, message: "请上传图标", trigger: "blur" }],
        pics: [{ required: true, message: "请上传图片", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getByteLen(val) {
      var len = 0;
      for (var i = 0; i < val.length; i++) {
        var a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/gi) != null) {
          len += 2;
        } else {
          len += 1;
        }
      }
      return len;
    },
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
    onSubmit() {
      this.getList();
    },
    changeImg(val, type) {
      this.form[type] = val;
    },
    edit(row) {
      this.dltitle = "编辑分类";
      this.dialogVisible = true;
      this.form = row;
      console.log(row, "row");
    },
    addquarters(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          classifypost(this.form)
            .then((response) => {
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
          classifyput(this.form)
            .then((response) => {
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
      this.dltitle = "添加分类";
      this.form = {
        desc: "",
        enabled: true,
        icon: "",
        id: 0,
        name: "",
        pics: "",
      };
      this.dialogVisible = true;
    },
    disable(row) {
      const tish = row.enabled ? "确定禁用" : "确定启用";
      this.$confirm(tish + ",是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          classifyenable({ id: row.id, enable: !row.enabled })
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
        .catch(() => {});
    },
    handleDelete(row) {
      this.$confirm("删除分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          classifydelete({ id: row.id })
            .then((response) => {
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
  .clearfix {
    .input_search {
      width: 380px;
    }
  }
}
</style>

