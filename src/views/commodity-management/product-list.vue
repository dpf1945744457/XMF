<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-input
              v-model="formInline.name"
              placeholder="搜索商品编码/商品名称"
              class="input_search"
              style="width:200px"
            />
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.shelveStatus" placeholder="请选择上架状态">
              <el-option label="初始化" value="0"></el-option>
              <el-option label="已上架" value="3"></el-option>
              <el-option label="已下架" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.isTop" placeholder="是否推荐">
              <el-option label="否" value="false"></el-option>
              <el-option label="是" value="true"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="onSubmit('formInline')"
            >查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-circle-plus-outline"
              @click="add('formInline')"
              v-permission
              permission-method="POST"
              permission-taskCode="/goods"
            >添加商品</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-download"
              @click="Export"
              v-permission
              permission-method="GET"
              permission-taskCode="/goods/export/"
            >商品导出</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-download"
              @click="Exportprice"
              v-permission
              permission-method="GET"
              permission-taskCode="/goods-price/export/"
            >商品价格导出</el-button>
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
          <!-- <el-table-column type="index" label="序号" align="center"></el-table-column> -->
          <el-table-column prop="id" label="商品id" align="center"></el-table-column>
          <el-table-column prop="goodsSn" label="商品编号" align="center"></el-table-column>
          <el-table-column prop="name" label="名称" align="center" width="300"></el-table-column>
          <el-table-column prop="picUrl" label="图片" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.picUrl" alt style="width: 40px;height: 40px" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="详情" prop="detail">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="showDetail(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="counterPrice" label="专柜价格" align="center"></el-table-column>
          <el-table-column prop="retailPrice" label="当前价格" align="center"></el-table-column>
          <el-table-column prop="isTop" label="是否推荐" align="center">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.isTop?'success':'warning'"
                @click="recommend(scope.row)"
                v-permission
                permission-method="PUT"
                permission-taskCode="/goods/recommend"
              >{{scope.row.isTop?'推荐':'非推荐'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="shelveStatus" label="上架状态" align="center">
            <template slot-scope="scope">
              <el-tag style="color:#fff" :color="formatSales(scope.row.shelveStatus).color">{{formatSales(scope.row.shelveStatus).value}}</el-tag>
              <span></span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="发货区域" prop="shipmentRegion">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.shipmentRegion ? 'success' : 'error' "
              >{{scope.row.shipmentRegion == '0' ? '国内' : '国外'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="recordStatus" label="备案状态" align="center">
            <template slot-scope="scope">
              <span>{{StatusText(scope.row.recordStatus)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="300px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleShelves(scope.row)"
                v-permission
                permission-method="PUT"
                permission-taskCode="/goods/sale"
              >{{scope.row.shelveStatus==4||scope.row.shelveStatus==0?'上架':'下架'}}</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="edit(scope.row)"
                v-permission
                permission-method="PUT"
                permission-taskCode="/goods"
              >编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
                v-permission
                permission-method="DELETE"
                permission-taskCode="/goods/goods-id/{goodsId}"
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
  </div>
</template>
<script>
import {
  goodsadd,
  goodsend,
  goodsdelete,
  goodsList,
  goodsrecommend,
  goodssale,
  goodsid,
  goodsexport,
  goodspriceexport,
} from "@/api/goods";
import avatarUpload from "@/components/Upload/avatarUpload";
export default {
  components: { avatarUpload },
  data() {
    return {
      formInline: {},
      dataList: [],
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      dltitle: "",
      dialogImageUrl: "",
      form: {
        desc: "",
        enabled: true,
        icon:
          "https://kuajingdianshang.oss-cn-shenzhen.aliyuncs.com/yFKU9OHWT5PtCwKKArTrBMEy5GvdtMf06rUNJ09Et81XhxTv.png",
        id: 0,
        name: "",
        pics:
          "https://kuajingdianshang.oss-cn-shenzhen.aliyuncs.com/yFKU9OHWT5PtCwKKArTrBMEy5GvdtMf06rUNJ09Et81XhxTv.png",
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
        shelveStatus: this.formInline.shelveStatus,
        isTop: this.formInline.isTop,
        name: this.formInline.name,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      goodsList(param).then((response) => {
        console.log(response, "response");
        this.tableData = response.data.dataList;
        this.total = response.data.total;
      });
    },
    add() {
      this.$router.push({
        name: "productadd",
      });
    },
    StatusText(data) {
      if (data === 0) {
        return "尚未备案";
      } else if (data === 1) {
        return "正在受理";
      } else if (data === 2) {
        return "正在审核";
      } else if (data === 3) {
        return "受理失败";
      } else if (data === 4) {
        return "备案成功";
      } else if (data === 5) {
        return "审核拒绝";
      }
    },
    Export() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      const param = {
        shelveStatus: this.formInline.shelveStatus,
        isTop: this.formInline.isTop,
        name: this.formInline.name,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      goodsexport(param)
        .then((response) => {
          const blob = new Blob([response]);
          const fileName = "商品.xls";
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
    showDetail(detail) {
      window.open(
        process.env.VUE_APP_MOBILE_URL +
          "/h5/pages/productDetails/index?goodsId=" +
          detail.id
      );
    },
    Exportprice() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      goodspriceexport()
        .then((response) => {
          const blob = new Blob([response]);
          const fileName = "商品价格.xls";
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
    recommend(row) {
      const tish = row.isTop ? "取消推荐" : "确定推荐";
      this.$confirm(tish + ",是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          goodsrecommend({
            goodsId: row.id,
            isTop: row.isTop ? false : true,
          })
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
    formatSales(type) {
      let data={ value: "", color: ""}
      if (type == 0) {
        data= { value: "初始化", color: "#e6a23c" };
      }
      if (type == 3) {
        data= { value: "已上架", color: "#67c23a" };
      }
      if (type == 4) {
        data= { value: "已下架", color: "#e6a23c" };
      }
      return data
    },
    onSubmit() {
      this.getList();
    },

    edit(row) {
      this.$router.push({
        name: "productend",
        query: { id: row.id },
      });
    },

    handleShelves(row) {
      const tish = (row.shelveStatus == 4||row.shelveStatus == 0) ? "确定上架" : "确定下架";
      this.$confirm(tish + ",是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          goodssale({
            goodsId: row.id,
            saleStatus: (row.shelveStatus == 4||row.shelveStatus == 0) ? 3 : 4,
          })
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
      this.$confirm("删除商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          goodsdelete({ goodsId: row.id })
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

