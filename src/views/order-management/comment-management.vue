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
              v-model="formInline.keys"
              placeholder="用户ID/商品编号/商品名称/订单编号  "
              class="input_search"
            />
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.status" clearable placeholder="审批状态">
              <el-option
                v-for="item in recordstatuslist"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              ></el-option>
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
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="goodsSn" label="商品编号" align="center"></el-table-column>
          <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="userId" label="用户ID" align="center"></el-table-column>
          <el-table-column prop="userName" label="用户信息" align="center"></el-table-column>
          <el-table-column prop="content" label="评论内容" align="center">
            <template slot-scope="scope">
                 <span>{{scope.row.content}}</span>
                 <span v-if="scope.row.appendComment">追加评论{{scope.row.appendComment}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="picUrls" label="评论图片" align="center">
            <template slot-scope="scope">
              <el-image
                v-if="scope.row.picUrls.length>0"
                style="width: 50px; height: 50px"
                :src="scope.row.picUrls[0]"
                :preview-src-list="scope.row.picUrls"
              ></el-image>
              <span v-else>无图片</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="审批状态" align="center" :formatter="ifendcase"></el-table-column>
          <el-table-column prop="orderSn" label="订单编号" align="center"></el-table-column>
          <el-table-column prop="addTime" label="评论时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status==0"
                size="mini"
                @click="audit( scope.row)"
                v-permission
                permission-method="PUT"
                permission-taskCode="/admin/comment/approval"
              >审核</el-button>
              <el-button
                size="mini"
                type="danger"
                v-permission
                permission-method="DELETE"
                permission-taskCode="/admin/comment/delete"
                @click="handleDelete( scope.row)"
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
          <el-form-item label="商品名称:" prop="goodsName">{{ form.goodsName }}</el-form-item>
          <el-form-item label="商品图片:" prop="picUrls">
            <el-image
              style="width: 50px; height: 50px"
              :src="form.goodsPicUrls[0]"
              :preview-src-list="form.goodsPicUrls"
            ></el-image>
          </el-form-item>
          <el-form-item label="评价内容:" prop="content">{{ form.content }}</el-form-item>
          <el-form-item v-if="form.picUrls.length>0" label="评价图片:" prop="picUrls">
            <!-- <img :src="form.picUrls" class="image-show" style="width: 40px;height: 40px" /> -->
            <el-image
              style="width: 50px; height: 50px"
              :src="form.picUrls[0]"
              :preview-src-list="form.picUrls"
            ></el-image>
            <!-- {{ form.picUrls}} -->
          </el-form-item>
          <el-form-item label prop="status">
            <el-select v-model="form.status" placeholder="审核状态">
              <el-option
                v-for="item in statuslist"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button v-if="dltitle =='审核评论'" type="success" @click="addquarters('form')">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getExamine, newComments, Delete, getSearchList } from "@/api/comment";
export default {
  data() {
    return {
      formInline: {},
      dialogVisible: false,
      dataList: [],
      recordstatuslist: [
        {
          key: " ",
          label: "审核状态",
        },
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
      total: 0,
      dltitle: "",
      form: {
        id: "",
        status: "",
        picUrls: [],
        goodsPicUrls: [],
      },
      rules: {
        status: [
          { required: true, message: "请选择审核状态", trigger: "blur" },
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
        status: this.formInline.status,
        keys: this.formInline.keys,
        page: this.pageNum,
        size: this.pageSize,
      };
      getSearchList(param).then((response) => {
        console.log(response, "response");
        this.tableData = response.data.dataList;
        this.total = response.data.total;
      });
    },
    onSubmit() {
      this.getList();
    },
    handleDelete(row) {
      this.$confirm("确认删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Delete({ id: row.id }).then((response) => {
            console.log(response, "response");
            this.getList();
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    audit(row) {
      this.dltitle = "审核评论";
      this.dialogVisible = true;
      this.form.goodsName = row.goodsName;
      this.form.goodsPicUrls = row.goodsPicUrls;

      this.form.picUrls = row.picUrls;
      this.form.content = row.content;
      this.form.id = row.id;
      console.log(row, "row");
    },
    addquarters(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // if(this.form.status == '1'){
          // this.form.status ==  '通过'
          // }else{
          //   this.form.status == '不通过'
          // }
          // this.form.customsChannelsIds = JSON.stringify(
          //   this.form.customsChannelsIds
          // )
          // this.form.status = JSON.parse(this.form.status)
          this.form.status = this.form.status.toString();
          getExamine({
            id: this.form.id,
            status: this.form.status,
          })
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
}
</style>
