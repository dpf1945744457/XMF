<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="formInline.name" placeholder="专题名称/产品ID" class="input_search" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.hasBinding" placeholder="是否绑定广告">
              <el-option label="是否绑定广告" value=""></el-option>
              <el-option label="是" value="true"></el-option>
              <el-option label="否" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="onSubmit()">查询</el-button>

            <el-button
              type="primary"
              size="mini"
              icon="el-icon-circle-plus-outline"
              v-permission
              permission-method="POST"
              permission-taskCode="/topic"
              @click="add()"
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
          <el-table-column prop="title" label="专题名称" align="center"></el-table-column>
          <el-table-column prop="goods" label="产品ID" align="center"  width="650px"></el-table-column>
          <el-table-column prop="backgroundColor" label="专题底色" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" align="center"></el-table-column>
          <el-table-column prop="bindingAd" label="是否绑定广告" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.bindingAd?'是':'否'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="adNames" label="绑定广告名称" align="center">
            <template slot-scope="scope">
              <span v-for="(text,index) in scope.row.adNames" :key="index">{{text}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="150px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="edit( scope.row)"
                v-permission
                permission-method="PUT"
                permission-taskCode="/topic"
              >编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
                v-permission
                permission-method="DELETE"
                permission-taskCode="/topic"
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
          <el-form-item label="专题标题:" prop="title">
            <el-input v-model="form.title" style="width:200px" placeholder="请输入专题标题"></el-input>
          </el-form-item>
          <el-form-item label="底色:" prop="backgroundColor">
            <el-color-picker v-model="form.backgroundColor"></el-color-picker>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input v-model="form.remark" style="width:200px" type="textarea" placeholder="请输入备注"></el-input>
          </el-form-item>
          <el-form-item label="产品ID:" prop="goods">
            <el-input
              v-model="form.goods"
              style="width:200px"
              type="textarea"
              placeholder="产品ID用“，”隔开，按照填写顺序展示"
            ></el-input>
          </el-form-item>
          <el-form-item label="专题主图:" prop="mainPic">
            <avatarUpload :url="form.mainPic" @change="changeImg($event,'mainPic')"></avatarUpload>
          </el-form-item>
          <el-form-item label="背景图片:" prop="backgroudPic">
            <avatarUpload :url="form.backgroudPic" @change="changeImg($event,'backgroudPic')"></avatarUpload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button v-if="dltitle =='编辑专题'" type="primary" @click="editquarters('form')">确定</el-button>
          <el-button v-if="dltitle =='添加专题'" type="primary" @click="addquarters('form')">确定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import { searchList, topicdelete, topicput, topicpost } from "@/api/topic";
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
        backgroundColor: "",
        goods: "",
        remark: "",
        title: "",
      },
      rules: {
        title: [{ required: true, message: "请输入专题标题", trigger: "blur" }],
        backgroundColor: [
          { required: true, message: "请输入选择底色", trigger: "blur" },
        ],
        goods: [{ required: true, message: "请输入产品ID", trigger: "blur" }],
        backgroudPic: [
          { required: true, message: "请上传背景图片", trigger: "blur" },
        ],
        mainPic: [{ required: true, message: "请上传主图", trigger: "blur" }],
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
        pageNo: this.pageNum,
        hasBinding:this.formInline.hasBinding,
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
      this.dltitle = "编辑专题";
      this.dialogVisible = true;
      this.form = row;
    },
    addquarters(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          topicpost(this.form)
            .then((response) => {
              // debugger
              this.dialogVisible = false;
               this.$message({
                type: "success",
                message: "成功!",
              });
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
          this.form.topicId = this.form.id;
          topicput(this.form)
            .then((response) => {
              // debugger
              this.dialogVisible = false;
              this.$message({
                type: "success",
                message: "成功!",
              });
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
      this.dltitle = "添加专题";
      this.form = {};
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
      this.$confirm("删除专题, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          topicdelete({ topicId: row.id })
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

