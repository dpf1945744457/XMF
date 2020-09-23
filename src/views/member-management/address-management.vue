<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-input
              v-model="formInline.searchParam"
              placeholder="搜索用户ID/手机号码/收货人名称/身份证号码/地址"
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
          <el-table-column prop="id" label="地址ID" align="center"></el-table-column>
          <el-table-column prop="userId" label="用户ID" align="center"></el-table-column>
          <el-table-column prop="userName" label="用户名称" align="center"></el-table-column>
          <el-table-column prop="name" label="收货人名称" align="center"></el-table-column>
          <el-table-column prop="mobile" label="手机号码" align="center"></el-table-column>
          <el-table-column prop="address" label="地址" align="center"></el-table-column>
          <el-table-column prop="postalCode" label="邮政编码" align="center"></el-table-column>
          <el-table-column prop="personCard" label="身份证号" align="center" width="200px"></el-table-column>
          <el-table-column prop="isDefault" label="默认" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isDefault==true" class="span_color">是</span>
              <span v-if="scope.row.isDefault==false" class="span_color">否</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="edit( scope.row)"
                v-permission
                permission-method="PUT"
                permission-taskCode="/admin/address/update"
              >编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete( scope.row)"
                v-permission
                permission-method="DELETE"
                permission-taskCode="/admin/address/delete"
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
          <el-form-item label="收货人名称:" prop="name">
            <el-input v-model="form.name" style="width:200px" placeholder="收货人姓名"></el-input>
          </el-form-item>
          <el-form-item label="手机号码:" prop="mobile">
            <el-input v-model="form.mobile" style="width:200px" placeholder="请输入手机号码"></el-input>
          </el-form-item>

          <el-form-item label="所在地区:" prop="companyId">
            <el-cascader
              v-model="form.regionList"
              :options="options"
              clearable
              :props="{checkStrictly:true,value:'code',label:'name'}"
              filterable
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址:" prop="address">
            <el-input v-model="form.address" style="width:200px" placeholder="请输入详细地址"></el-input>
          </el-form-item>
          <el-form-item label="是否默认地址:" prop="isDefault">
            <el-select v-model="form.isDefault" clearable placeholder="请选择">
              <el-option
                v-for="item in defaultList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button v-if="dltitle =='编辑地址'" type="success" @click="addquarters('form')">确定</el-button>
            <el-button @click="cancel('form')">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import {
  getDelete,
  getAddressList,
  getEdit,
  getAddressData,
} from "@/api/position";
export default {
  data() {
    return {
      formInline: {},
      dialogVisible: false,
      value: "",
      options: [],
      tableData: [],
      options: [],
      pageNum: 1,
      pageSize: 10,
      adminId: 1,
      order: "desc",
      sort: "add_time",
      total: 0,
      dltitle: "",
      defaultList: [
        {
          value: true,
          label: "是",
        },
        {
          value: false,
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
    getAddressData().then((response) => {
      console.log(response, "response");
      this.options = response;
    });
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
      getAddressList(param).then((response) => {
        console.log(response, "response");
        this.tableData = response.data.dataList;
        this.total = response.data.total;
      });
    },
    // getPlace(){
    //   place().then((response) => {
    //     console.log(response,'palce66666666666')
    //   })
    // },
    onSubmit() {
      this.getList();
    },
    handleDelete(row) {
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
      this.form.regionList = [
        JSON.stringify(row.provinceId),
        JSON.stringify(row.cityId),
        JSON.stringify(row.areaId),
      ];
      this.form.mobile = row.mobile;
      this.form.name = row.name;
      this.form.id = row.id;
      this.form.isDefault = row.isDefault;
      console.log(this.form.regionList);
    },
    cancel(formName) {
      this.$refs[formName].clearValidate();
      this.dialogVisible = false;
    },
    addquarters(formName) {
      console.log(this.form.regionList);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          getEdit({
            address: this.form.address,
            areaId: this.form.regionList[2],
            cityId: this.form.regionList[1],
            isDefault: this.form.isDefault,
            id: this.form.id,
            mobile: this.form.mobile,
            name: this.form.name,
            provinceId: this.form.regionList[0],
          })
            .then((response) => {
              // debugger
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
    handleChange(value) {
      console.log(value);
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
