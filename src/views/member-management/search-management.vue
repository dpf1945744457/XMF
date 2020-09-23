<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- <span>卡片名称</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
        >操作按钮</el-button>-->
        <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="formInline.searchKey" placeholder="搜索内容" />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="onSubmit('formInline')"
            >搜索</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="add('formInline')"
              v-permission
              permission-method="POST"
              permission-taskCode="/hot-search"
            >新增搜索关键词</el-button>
          </el-form-item>
        </el-form>
        <el-button type="text" size="mini" @click="listpge()">搜索记录查看</el-button>
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
          <el-table-column type="index" label="序号" width="50px" align="center"></el-table-column>
          <el-table-column prop="searchKey" label="搜索关键词" align="center"></el-table-column>
          <el-table-column prop="enable" label="是否生效" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enable"
                @change="enabchange(scope.row)"
                v-permission
                permission-method="PUT"
                permission-taskCode="/hot-search/enable"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" align="center"></el-table-column>
          <el-table-column prop="validTime" label="生效日期" align="center">
            <template slot-scope="scope">{{format(scope.row.validTime)}}</template>
          </el-table-column>
          <el-table-column prop="searchCount" label="搜索次数" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete( scope.row)"
                v-permission
                permission-method="DELETE"
                permission-taskCode="/hot-search"
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
    </el-card>
    <el-dialog title="新增" :visible.sync="dialogVisible" width="500px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right">
        <el-form-item label="搜索关键词:" prop="searchKey">
          <el-input v-model="form.searchKey" style="width:200px" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="排序:" prop="sort">
          <el-input v-model="form.sort" style="width:200px" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="是否生效:">
          <el-switch v-model="form.enable"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="addquarters('form')">确定</el-button>
          <el-button @click="cancel('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisiblelist" :close-on-click-modal="false">
      <el-form ref="form" :model="formlist">
        <el-form-item prop="searchKey">
          <el-input v-model="formlist.searchContent" style="width:200px" placeholder="搜索用户ID/搜索内容"></el-input>
          <el-button type="primary" @click="searchhistory()">搜索</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-table
          :data="historytableData"
          style="width: 100%"
          class="table"
          height="calc(100vh - 420px) "
          size="small"
          border
        >
          <el-table-column prop="id" label="搜索ID" width="70px" align="center"></el-table-column>
          <el-table-column prop="searchKey" label="搜索内容" align="center"></el-table-column>
          <el-table-column prop="userId" label="用户ID" align="center"></el-table-column>
          <el-table-column prop="addTime" label="搜索时间" align="center">
            <template slot-scope="scope">{{format(scope.row.addTime)}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDeletepage( scope.row)"
                v-permission
                permission-method="DELETE"
                permission-taskCode="/search-history"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="text-align:center; margin-top:2em">
          <el-pagination
            :page-sizes="[10, 20, 30, 50]"
            :total="totalpage"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChangepage"
            @current-change="handleCurrentChangepage"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  searchList,
  enable,
  searchdelete,
  searchpost,
  searchhistoryList,
  historydelete,
} from "@/api/search";
// import areaJs from '../../static/select_area'
export default {
  data() {
    return {
      formInline: {},
      dialogVisible: false,
      dialogVisiblelist: false,
      value: "",
      tableData: [],
      historytableData: [],
      pageNum: 1,
      pageSize: 10,
      adminId: 1,
      historypageNum: 1,
      historypageSize: 10,
      order: "desc",
      sort: "add_time",
      total: 0,
      totalpage: 0,
      dltitle: "",
      formlist: {},
      defaultList: [
        {
          value: 1,
          label: "是",
        },
        {
          value: 0,
          label: "否",
        },
      ],
      form: {
        enable: true,
        searchKey: "",
        sort: "",
      },
      rules: {
        sort: [{ required: true, message: "请填写排序", trigger: "blur" }],
        searchKey: [
          { required: true, message: "请填写关键词", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    add0(m) {
      return m < 10 ? "0" + m : m;
    },
    listpge() {
      this.dialogVisiblelist = true;
      this.getsearchhistory();
    },
    searchhistory() {
      this.getsearchhistory();
    },
    getsearchhistory() {
      const param = {
        searchContent: this.formlist.searchContent,
        pageNo: this.historypageNum,
        pageSize: this.historypageSize,
      };
      searchhistoryList(param).then((response) => {
        console.log(response, "response");
        this.historytableData = response.data.dataList;
        this.totalpage = response.data.total;
      });
    },
    format(shijianchuo) {
      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(shijianchuo);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return (
        y +
        "-" +
        this.add0(m) +
        "-" +
        this.add0(d) +
        " " +
        this.add0(h) +
        ":" +
        this.add0(mm) +
        ":" +
        this.add0(s)
      );
    },
    add() {
      this.form = {
        enable: true,
        searchKey: "",
        sort: "",
      };
      this.dialogVisible = true;
    },
    enabchange(row) {
      const tish = row.enable ? "确定启用" : "确定禁用";
      this.$confirm(tish + ",是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          enable({ id: row.id, enable: row.enable })
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
          this.getList();
        });
    },
    getList() {
      const param = {
        searchKey: this.formInline.searchKey,
        pageNo: this.pageNum,
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
    handleDelete(row) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          searchdelete({ id: row.id })
            .then((response) => {
              this.$message({
                message: "删除成功",
                type: "success",
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
    handleDeletepage(row) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          historydelete({ id: row.id })
            .then((response) => {
              this.$message({
                message: "删除成功",
                type: "success",
              });

              this.getsearchhistory();
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

    cancel(formName) {
      this.$refs[formName].clearValidate();
      this.dialogVisible = false;
    },
    addquarters(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.form.status = this.form.stathis.formtus.toString()
          searchpost(this.form)
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
    changeStatus(val, index) {
      console.log(index, "index");
      console.log(val, "val");
    },
    handleChange(value) {
      console.log(value);
    },
    ifendcase(val) {
      if (val.status == "0") {
        return "待审核";
      } else if (val.status == "1") {
        return "审核通过";
      } else {
        return "审批未通过";
      }
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
    handleCurrentChangepage(val) {
      console.log(`当前页: ${val}`);
      this.historypageNum = val;
      this.getsearchhistory();
    },
    handleSizeChangepage(val) {
      console.log(`每页 ${val} 条`);
      this.historypageSize = val;
      this.getsearchhistory();
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
  .span_color {
    padding: 5px;
    background: #ecf5ff;
    color: #56a5ff;
  }
}
</style>
