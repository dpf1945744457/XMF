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
            placeholder="请输入商品税号"
            v-model="listQuery.taxCcCode"
          ></el-input>
          <el-input
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="请输入商品类目"
            v-model="listQuery.taxHsName"
          ></el-input>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleFilter"
          >查找</el-button>
          <!-- <el-button class="filter-item" type="primary" icon="el-icon-download" @click="Imports()">导入</el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="danglong()"
          >导入模板下载</el-button>-->
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-edit"
            @click="add"
            size="mini"
            v-permission
            permission-method="POST"
            permission-taskCode="/cc-tax-rate"
          >添加</el-button>
          <!-- <el-switch v-model="value1" active-text="开启" inactive-text="关闭" style="margin-left: 20px;"   @change="stlechange"></el-switch> -->
        </div>
      </div>
      <!-- 查询结果 -->
     <el-table
      size="small"
          :data="list"
          style="width: 100%"
          class="table"
         height="calc(100vh - 300px) "

          border
        >
        <el-table-column align="center" width="100px" label="商品税号" prop="taxCcCode"></el-table-column>
        <el-table-column align="center" label="商品类目" prop="taxHsName"></el-table-column>
        <el-table-column align="center" label="规格" prop="consolidatedTaxRate">
          <template slot-scope="scope">
            <span>{{scope.row.specification }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品税(%)" prop="salesTaxRate">
          <template slot-scope="scope">
            <span>{{scope.row.ccTax }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="完税价格(人民币：元)" prop="addedTaxRate">
          <template slot-scope="scope">
            <span>{{scope.row.priceAfterTax }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="250"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="handleUpdate(scope.row)"
              v-permission
              permission-method="PUT"
              permission-taskCode="/cc-tax-rate"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(scope.row)"
              v-permission
              permission-method="DELETE"
              permission-taskCode="/cc-tax-rate"
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
      <el-dialog title="导入" :visible.sync="importdialogFormVisibled" width="500px">
        <el-form :model="dform" :label-width="formLabelWidth">
          <el-form-item label="选择文件:" :label-width="formLabelWidth">
            <div style="position: relative;width: 100px;height: 40px;">
              <input
                type="file"
                ref="inputer"
                style="opacity: 0;position: absolute;left: 0;top: 0;z-index: 100;height: 100%;width: 100%;"
                multiple="multiple"
                @change="Import()"
              />
              <el-button type="primary" style="position: absolute;left: 0;top: 0;">选择文件</el-button>
            </div>
            <p v-if="plist">{{fil[0].name}}</p>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelsub()">取 消</el-button>
          <el-button type="primary" @click="dsub('dform')">确定</el-button>
        </div>
      </el-dialog>

      <el-dialog :title="title" :visible.sync="createdialogFormVisibled" width="700px">
        <el-form :model="addrom" :label-width="formLabelWidth" :rules="rules" ref="addrom">
          <el-form-item
            label="商品税号:"
            :label-width="formLabelWidth"
            style="width: 49%;display: inline-block;"
            prop="taxCcCode"
          >
            <el-input
              v-model="addrom.taxCcCode"
              :disabled="title=='编辑'"
              type="number"
              style="width: 200px;"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="商品类目:"
            :label-width="formLabelWidth"
            style="width: 49%;display: inline-block;"
            prop="taxHsName"
          >
            <el-input v-model="addrom.taxHsName" style="width: 200px;"></el-input>
          </el-form-item>
          <!-- <el-form-item
          label="跨境电商综合税:"
          :label-width="formLabelWidth"
          style="width: 49%;display: inline-block;"
          prop="consolidatedTaxRate"
        >
          <el-input v-model="addrom.consolidatedTaxRate" type="number" style="width: 200px;">
            <template slot="append">%</template>
          </el-input>
          </el-form-item>-->
          <el-form-item
            label="商品税率:"
            :label-width="formLabelWidth"
            style="width: 49%;display: inline-block;"
            prop="ccTax"
          >
            <el-input v-model="addrom.ccTax" type="number" style="width: 200px;">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item
            label="规格:"
            :label-width="formLabelWidth"
            style="width: 49%;display: inline-block;"
            prop="specification"
          >
            <el-input v-model="addrom.specification" style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item
            label="完税价格:"
            :label-width="formLabelWidth"
            style="width: 49%;display: inline-block;"
            prop="priceAfterTax"
          >
            <el-input v-model="addrom.priceAfterTax" type="number" style="width: 200px;">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="quxiao('addrom')">取 消</el-button>
          <el-button v-if="title=='添加'" type="primary" @click="addcreate('addrom')">确定</el-button>
          <el-button v-if="title=='编辑'" type="primary" @click="updatadcreate('addrom')">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  taxratelist,
  taxratecreate,
  taxrateupdate,
  taxratedelete,
} from "@/api/cctaxrate";

export default {
  name: "",
  data() {
    return {
      total: 0,
      listLoading: false,
      list: [],
      title: "",
      value1: "",
      plist: false,
      importdialogFormVisibled: false,
      createdialogFormVisibled: false,
      addrom: {},
      dform: {},
      fil: "",
      rules: {
        taxCcCode: [
          {
            required: true,
            message: "请输入商品税号",
            trigger: "blur",
          },
        ],
        taxHsName: [
          {
            required: true,
            message: "请输入商品类目",
            trigger: "blur",
          },
        ],
        specification: [
          {
            required: true,
            message: "请输入规格",
            trigger: "blur",
          },
        ],
        ccTax: [
          {
            required: true,
            message: "请输入商品税率",
            trigger: "blur",
          },
        ],
        priceAfterTax: [
          {
            required: true,
            message: "请输入完税价格",
            trigger: "blur",
          },
        ],
      },
      formLabelWidth: "125PX",
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        taxCcCode: "",
        taxHsName: "",
      },
    };
  },
  components: {},
  created() {},
  mounted() {
    this.getList();
    // status({type:'cc'})
    //  .then((response) => {
    //    this.value1=response.data
    //      console.log(response);
    //     })
    //     .catch((error) => {

    //     });
  },
  methods: {
    handleFilter() {
      this.getList();
    },
    stlechange(val) {
      console.log(val);

      openstatucc({ type: "cc", openStatus: val })
        .then((response) => {
          this.$message({
            message: response.errmsg,
            type: "success",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    Import() {
      let inputDOM = this.$refs.inputer;
      // 通过DOM取文件数据
      this.fil = inputDOM.files;
      this.plist = true;
      console.log(this.fil);
    },
    handleDelete(row) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          taxratedelete({ id: row.id })
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
    danglong() {
      window.location.href =
        "https://kuajingdianshang.oss-cn-shenzhen.aliyuncs.com/BC-%E5%95%86%E5%93%81%E7%B1%BB%E7%9B%AE%E5%92%8C%E7%A8%8E%E5%8F%B7%E7%A8%8E%E7%8E%87-%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xls";
    },
    Imports() {
      this.importdialogFormVisibled = true;
    },
    quxiao() {
      this.$refs["addrom"].clearValidate();
      this.createdialogFormVisibled = false;
    },
    handleUpdate(row) {
      //     this.$refs["addrom"].clearValidate();
      this.title = "编辑";
      this.createdialogFormVisibled = true;
      console.log(row);

      this.addrom = row;
    },
    dsub(formName) {
      const loading = this.$loading({
        lock: true,
        text: "导入中....",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      if (this.fil.length > 0) {
        let formData = new FormData();
        formData.append("file", this.fil[0]);
        taxrateimport(formData)
          .then((response) => {
            loading.close();
            this.importdialogFormVisibled = false;
            this.plist = false;
            this.fil = [];
            this.getList();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.$message({
          type: "error",
          message: "请选择文件",
        });
        loading.close();
      }
    },
    cancelsub() {
      this.importdialogFormVisibled = false;
      this.plist = false;
      this.fil = [];
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val;
      this.getList();
    },
    add() {
      this.title = "添加";
      this.createdialogFormVisibled = true;
      this.addrom = {};
    },
    addcreate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          delete this.addrom.consolidatedTaxRate;
          taxratecreate(this.addrom)
            .then((response) => {
              this.$message({
                message: response.errmsg,
                type: "success",
              });
              this.getList();
              this.createdialogFormVisibled = false;
            })
            .catch((error) => {
              this.$message.error(error.errmsg);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    updatadcreate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          delete this.addrom.consolidatedTaxRate;
          taxrateupdate(this.addrom)
            .then((response) => {
              this.$message({
                message: response.errmsg,
                type: "success",
              });
              this.getList();
              this.createdialogFormVisibled = false;
            })
            .catch((error) => {
              this.$message.error(error.errmsg);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    getList() {
      this.listLoading = true;
      taxratelist(this.listQuery)
        .then((response) => {
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
  },
};
</script>
<style lang='scss' scoped>
</style>
