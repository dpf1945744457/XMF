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
            <el-input v-model="formInline.keyword" placeholder="搜索足迹ID/商品ID/商品标题" />
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
          <el-table-column prop="id" label="足迹ID" align="center"></el-table-column>
          <el-table-column prop="userId" label="用户ID" align="center"></el-table-column>
          <el-table-column prop="goodsId" label="商品ID" align="center"></el-table-column>
          <el-table-column prop="goodsName" label="商品标题" align="center"></el-table-column>
          <el-table-column prop="addTime" label="添加时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
                v-permission
                permission-method="DELETE"
                permission-taskCode="/admin/footprint/delete"
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
import { searchList, footprintdelete } from "@/api/footprint";
// import areaJs from '../../static/select_area'
export default {
  data() {
    return {
      formInline: {},
      dialogVisible: false,
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      form: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      const param = {
        keyword: this.formInline.keyword,
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
    handleDelete(row) {
      this.$confirm("删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        footprintdelete({ id: row.id })
          .then((response) => {
            this.getList();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          })
          .catch((error) => {
            this.$message.error(error.errmsg);
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
  .span_color {
    padding: 5px;
    background: #ecf5ff;
    color: #56a5ff;
  }
}
</style>
