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
            <el-input v-model="formInline.userId" placeholder="用户ID" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.userMobile" placeholder="手机号码" />
          </el-form-item>

          <el-form-item>
            <el-select v-model="formInline.gender" placeholder="性别">
              <el-option label="全部" value></el-option>
              <el-option label="未知" value="0"></el-option>
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="onSubmit('formInline')"
            >搜索</el-button>

            <el-button
              class="filter-item"
              type="primary"
              size="mini"
              icon="el-icon-download"
              @click="Export"
            >导出</el-button>
            <!-- v-permission
            permission-method="GET"
            permission-taskCode="/export/category"-->
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
          <el-table-column prop="id" label="用户ID" align="center"></el-table-column>
          <el-table-column prop="addTime" label="创建时间" align="center"></el-table-column>
          <el-table-column prop="nickname" label="昵称" align="center"></el-table-column>
          <!-- <el-table-column prop="realName" label="用户名" align="center"></el-table-column> -->
          <el-table-column prop="agentNo" label="渠道号" align="center"></el-table-column>
          <el-table-column prop="mobile" label="手机号码" align="center"></el-table-column>
          <el-table-column prop="userEmail" label="邮箱" align="center"></el-table-column>
          <el-table-column prop="gender" label="性别" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.gender==0">未知</span>
              <span v-if="scope.row.gender==1">男</span>
              <span v-if="scope.row.gender==2">女</span>
            </template>
          </el-table-column>
          <el-table-column prop="birthday" label="生日" align="center"></el-table-column>
          <el-table-column prop="userLevel" label="用户等级" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.userLevel==0">普通用户</span>
              <span v-if="scope.row.userLevel==1">VIP用户</span>
              <span v-if="scope.row.userLevel==2">高级VIP用户</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status==0">可用</span>
              <span v-if="scope.row.status==1">禁用</span>
              <span v-if="scope.row.status==2">注销</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="edit( scope.row)"
                v-permission
                permission-method="POST"
                permission-taskCode="/admin/member/update"
              >编辑</el-button>
            </template>
          </el-table-column>-->
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
    <el-dialog
      :title="dltitle"
      :visible.sync="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right">
        <!-- <el-form-item label="用户名:" prop="realName">
          <el-input v-model="form.realName" style="width:200px" placeholder="用户名"></el-input>
        </el-form-item>-->
        <el-form-item label="手机号码:" prop="mobile">
          <el-input v-model="form.mobile" style="width:200px" placeholder="请输入手机号码"></el-input>
        </el-form-item>

        <el-form-item label="性别:" prop="gender">
          <el-select v-model="form.gender" placeholder="请选择性别">
            <el-option label="未知" value="0"></el-option>
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="生日:" prop="birthday">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="form.birthday"
            type="date"
            style="width:200px"
            placeholder="选择生日"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="用户等级:" prop="userLevel">
          <el-select v-model="form.userLevel" placeholder="请选择用户等级">
            <el-option label="普通用户" value="0"></el-option>
            <el-option label="VIP用户" value="1"></el-option>
            <el-option label="高级VIP用户" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-select v-model="form.status" placeholder="请选择用户等级">
            <el-option label="可用" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
            <el-option label="注销" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button v-if="dltitle =='编辑'" type="success" @click="addquarters('form')">确定</el-button>
          <el-button @click="cancel('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { searchList, memberupdate, memberexport } from "@/api/member";
// import areaJs from '../../static/select_area'
export default {
  data() {
    return {
      formInline: {},
      dialogVisible: false,
      value: "",
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      adminId: 1,
      order: "desc",
      sort: "add_time",
      total: 0,
      dltitle: "",
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
        avatar: "",
        birthday: "",
        country: "",
        gender: "",
        id: "",
        mobile: "",
        nickname: "",
        realName: "",
        status: "",
        userEmail: "",
        userLevel: "",
      },
      rules: {
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
        mobile: [{ required: true, message: "请填写电话", trigger: "blur" }],
        name: [{ required: true, message: "请填写用户名字", trigger: "blur" }],
        isDefault: [
          { required: true, message: "请选择默认地址方式", trigger: "blur" },
        ],
        address: [
          { required: true, message: "请选择所在地区", trigger: "blur" },
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
        memberId: this.formInline.memberId,
        userEmail: this.formInline.userEmail,
        userId: this.formInline.userId,
        gender: this.formInline.gender,
        userMobile: this.formInline.userMobile,
        order: "desc",
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      searchList(param).then((response) => {
        console.log(response, "response");
        this.tableData = response.data.items;
        this.total = response.data.total;
      });
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

      memberexport()
        .then((response) => {
          const blob = new Blob([response]);
          const fileName = "用户列表.xls";
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
    handleDelete(row) {
      console.log(row.id, "row6666666");
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        getDelete({ id: row.id })
          .then((response) => {
            if (response.code == "200") {
              this.getList();
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            }
          })
          .catch((error) => {
            this.$message.error(error.errmsg);
          });
      });
    },

    edit(row) {
      this.dltitle = "编辑";
      this.dialogVisible = true;
      this.form.realName = row.realName;
      this.form.mobile = row.mobile;
      this.form.gender = row.gender.toString();
      this.form.birthday = row.birthday;
      this.form.status = row.status.toString();
      this.form.userLevel = row.userLevel.toString();
      this.form.id = row.id;

      console.log(row, "row");
    },
    cancel(formName) {
      this.$refs[formName].clearValidate();
      this.dialogVisible = false;
    },
    addquarters(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.form.status = this.form.stathis.formtus.toString()
          memberupdate(this.form)
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
