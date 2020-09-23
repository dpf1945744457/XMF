<template>
  <div>
    <div slot="header" class="clearfix">
      <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
         <el-date-picker
            v-model="formInline.date"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        <el-form-item>
         
          <el-input v-model="formInline.keys" placeholder="搜索订单编号/用户ID" class="input_search" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-search"
            @click="onSubmit('formInline')"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="tableData"
        style="width: 100%"
        class="table"
        height="calc(100vh - 500px) "
        border
      >
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column prop="addTime" label="提醒发货时间" align="center"></el-table-column>
        <el-table-column prop="orderSn" label="订单编号" align="center"></el-table-column>
        <el-table-column prop="userId" label="用户ID" align="center"></el-table-column>
        <el-table-column prop="nickName" label="用户昵称" align="center"></el-table-column>
        <el-table-column prop="productIds" label="商品ID" align="center"></el-table-column>
        <el-table-column prop="payTime" label="支付时间" align="center"></el-table-column>
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
  </div>
</template>
<script>
import { searchList } from "@/api/OrderRemainList";
import avatarUpload from "@/components/Upload/avatarUpload";
export default {
  components: { avatarUpload },
  data() {
    return {
      formInline: {date:[]},
      dialogVisible: false,
      dataList: [],
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      dltitle: "",
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      const param = {
        keys: this.formInline.keys,
        startTime:this.formInline.date?this.formInline.date[0]:' ',
        endTime:this.formInline.date?this.formInline.date[1]:' ',
        page: this.pageNum,
        size: this.pageSize,
      };
      searchList(param).then((response) => {
        console.log(response, "response");
        this.tableData = response.data.list;
        this.total = response.data.total;
      });
    },
    onSubmit() {
      console.log(this.formInline);
      this.getList();
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

