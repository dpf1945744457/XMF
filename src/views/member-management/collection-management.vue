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
            <el-input
              v-model="formInline.searchParam"
              placeholder="搜索用户ID/商品ID/商品标题"
              class="input_search"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="onSubmit('formInline')"
            >搜索</el-button>
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
          <el-table-column prop="id" label="收藏ID" align="center"></el-table-column>
          <el-table-column prop="userId" label="用户ID" align="center"></el-table-column>
          <el-table-column prop="valueId" label="商品ID" align="center"></el-table-column>
          <el-table-column prop="goodsName" label="商品标题" align="center"></el-table-column>
          <el-table-column prop="addTime" label="添加时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <!-- <el-button
                size="mini"
                type="primary"
                @click="edit( scope.row)"
              >编辑</el-button>-->
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete( scope.row)"
                v-permission
                permission-method="DELETE"
                permission-taskCode="/admin/collect/delete"
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
      <!-- <el-dialog
        :title="dltitle"
        :visible.sync="dialogVisible"
        width="500px"
        :close-on-click-modal="false"
      >
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="140px"
          label-position="left"
        >
          <el-form-item
            label="收货人名称:"
            prop="name"
          >
            <el-input
              v-model="form.name"
              style="width:200px"
              placeholder="收货人姓名"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="手机号码:"
            prop="mobile"
          >
            <el-input
              v-model="form.mobile"
              style="width:200px"
              placeholder="请输入手机号码"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="所在地区:"
            prop="companyId"
          >
            <el-cascader
              v-model="value"
              :options="options"
              clearable
              :props="{checkStrictly:true}"
              filterable
              @change="handleChange"
            ></el-cascader>

          </el-form-item>

          <el-form-item
            label="详细地址:"
            prop="address"
          >
            <el-input
              v-model="form.address"
              style="width:200px"
              placeholder="请输入详细地址"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="是否默认地址:"
            prop="isDefault"
          >
            <el-select
              v-model="form.isDefault"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in defaultList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button
              v-if="dltitle =='编辑地址'"
              type="success"
              @click="addquarters('form')"
            >确定</el-button>
            <el-button @click="cancel('form')">取消</el-button>

          </el-form-item>
        </el-form>

      </el-dialog>-->
    </el-card>
  </div>
</template>

<script>
import { getCollectList, getDelete } from "@/api/collection";
// import areaJs from '../../static/select_area'
export default {
  data() {
    return {
      formInline: {},
      dialogVisible: false,
      value: "",
      // options: areaJs.options,
      recordstatuslist: [
        {
          key: "0",
          label: "待审核",
        },
        {
          key: "1",
          label: "审核通过",
        },
        {
          key: "2",
          label: "审核未通过",
        },
      ],
      statuslist: [
        {
          key: "1",
          label: "通过",
        },
        {
          key: "2",
          label: "不通过",
        },
      ],
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
        id: "",
        status: "",
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
        searchParam: this.formInline.searchParam,
        order: this.order,
        sort: this.sort,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      getCollectList(param).then((response) => {
        console.log(response, "response");
        this.tableData = response.data.dataList;
        this.total = response.data.total;
      });
    },
    onSubmit() {
      this.getList();
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
      this.dltitle = "编辑地址";
      this.dialogVisible = true;
      this.form.address = row.address;
      this.form.mobile = row.mobile;
      this.form.name = row.name;
      console.log(this.form.isDefault, "this.form.isDefault");
      // this.form.goodsName = row.goodsName
      // this.form.picUrls = row.picUrls
      // this.form.content = row.content
      // this.form.id = row.id
      // this.form.content = row.content
      console.log(row, "row");
    },
    cancel(formName) {
      this.$refs[formName].clearValidate();
      this.dialogVisible = false;
    },
    // addquarters(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       // this.form.status = this.form.status.toString()
    //       getEdit({
    //         address: this.form.address,
    //         areaId: this.form.areaId,
    //         cityId: this.form.cityId,
    //         isDefault: this.form.isDefault,
    //         id: this.form.id,
    //         mobile: this.form.mobile,
    //         name: this.form.name,
    //         provinceId: this.form.provinceId,
    //       })
    //         .then((response) => {
    //           // debugger
    //           console.log(response, '6666666666688888')
    //           this.dialogVisible = false
    //           this.getList()
    //         })
    //         .catch((error) => {
    //           console.log(error)
    //         })
    //     } else {
    //       console.log('error submit!!')
    //       return false
    //     }
    //   })
    // },
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
