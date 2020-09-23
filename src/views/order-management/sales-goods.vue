<template>
  <div style="padding: 40px">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card" :body-style="{padding:'5px'}">
          <div slot="header" class="clearfix">
            <span style="font-weight: bold;">商品销售榜（交易完成）</span>
            <el-button-group style="float: right;">
              <el-button
                v-for="(but,index) in buttonlist"
                :key="index"
                size="mini"
                type
                @click="but.cb(0)"
              >{{but.label}}</el-button>
            </el-button-group>
          </div>
          <div style="height:calc(100vh - 350px);overflow: auto; color:#333333" v-if="total!=0">

            <el-table :data="goodslist" style="width: 100%;color:#333333" :show-header="false">
              <el-table-column prop="id" width="50"></el-table-column>
              <el-table-column prop="name" align="center">
                <template slot-scope="scope">{{scope.row.goods_name}}</template>
              </el-table-column>
              <el-table-column prop="address" width="50">
                <template slot-scope="scope">{{scope.row.num}}件</template>
              </el-table-column>
            </el-table>

          </div>
          <div v-if="total==0" style="height:calc(100vh - 350px);text-align: center;">
            <img :src="img" alt />
            <p>无数据</p>
          </div>
          <div class="block" style="text-align:center; margin-top:2em">
            <el-pagination
              :total="total"
              layout="prev, pager, next"
              background
              :page-size="20"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" :body-style="{padding:'5px'}">
          <div slot="header" class="clearfix">
            <span style="font-weight: bold;">购物车添加榜</span>
            <el-button-group style="float: right;">
              <el-button
                v-for="(but,index) in buttonlist"
                :key="index"
                size="mini"
                type
                @click="but.cb(1)"
              >{{but.label}}</el-button>
            </el-button-group>
          </div>
          <div style="height:calc(100vh - 350px);overflow: auto;" v-if="carttotal!=0">
            <el-table :data="cartlist" style="width: 100%; color:#333333" :show-header="false">
              <el-table-column  prop="id" width="50"></el-table-column>
              <el-table-column prop="name" align="center">
                <template slot-scope="scope">{{scope.row.goodsName}}</template>
              </el-table-column>
              <el-table-column prop="address" width="50">
                <template slot-scope="scope">{{scope.row.sumNum}}件</template>
              </el-table-column>
            </el-table>
            
          </div>
          <div v-if="carttotal==0" style="height:calc(100vh - 350px);text-align: center;">
            <img :src="img" alt />
            <p>无数据</p>
          </div>
          <div class="block" style="text-align:center; margin-top:2em">
            <el-pagination
              :total="carttotal"
              :page-size="20"
              background
              layout="prev, pager, next"
              @size-change="handleSizeChangecart"
              @current-change="handleCurrentChangecart"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <time-data
      :Visible="completeDialogVisible"
      :options="[]"
      :title="'选择时间'"
      @fatherMethod="fatherMethod('completeDialogVisible')"
      @getdeta="getdeta"
    ></time-data>
    <time-data
      :Visible="DialogVisible"
      :options="[]"
      :title="'选择时间'"
      @fatherMethod="fatherMethod('DialogVisible')"
      @getdeta="getdetas"
    ></time-data>
  </div>
</template>

<script>
import { getLastWeek, LastWeekStr, getLastMonth } from "@/utils/dateSerialize";
import { goodsSellTop, cartSellTop } from "@/api/top";
import img from "@/assets/image/wushuju.png";
import timedata from "@/components/TIME";
import avatarUpload from "@/components/Upload/avatarUpload";
export default {
  components: {
    avatarUpload,
    "time-data": timedata,
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 20,
      total: 0,
      img: img,
      completeDialogVisible: false,
      DialogVisible: false,
      type: "",
      goodslist: [],
      cartlist: [],
      carttotal: 0,
      cartpageNum: 1,
      cartpageSize: 20,
      buttonlist: [
        {
          label: "近七天",
          cb: (type) => {
            this.timeSelect("thisweek", type);
          },
        },
        {
          label: "近30天",
          cb: (type) => {
            this.timeSelect("getLastMonth", type);
          },
        },
        {
          label: "自定义",
          cb: (type) => {
            this.timeSelect("custom", type);
          },
        },
      ],
    };
  },
  created() {},
  mounted() {
    this.timeSelect("thisweek", 0);
    this.timeSelect("thisweek", 1);
  },
  methods: {
    timeSelect(type, i) {
      let startTime = "";
      let endTime = "";
      this.type = type;
      if (type == "thisweek") {
        startTime = getLastWeek().last;
        endTime = getLastWeek().now;
      }
      if (type == "getLastMonth") {
        console.log(getLastMonth());
        startTime = getLastMonth().last;
        endTime = getLastMonth().now;
      }
      if (type == "custom") {
        if (i == 0) {
          this.completeDialogVisible = true;
        }
        if (i == 1) {
          this.DialogVisible = true;
        }
      } else {
        if (i == 0) {
          this.goodsdata = {
            startTime: startTime,
            endTime: endTime,
            pageNum: this.pageNum,
            pageSize: this.pageSize,
          };
          this.getgoodsSellTop(this.goodsdata);
        }
        if (i == 1) {
          console.log(startTime);
          let startTimes = new Date(startTime).valueOf();
          let endTimes = new Date(endTime).valueOf();
          this.cartdata = {
            statisticsType: 3,
            startDate: startTimes,
            endDate: endTimes,
            pageNo: this.cartpageNum,
            pageSize: this.cartpageSize,
          };
          this.getcartSellTop(this.cartdata);
        }
      }
    },

    getcartSellTop(data) {
      cartSellTop(data)
        .then((response) => {
          // debugger
          console.log(response, "6666666666688888");
          this.cartlist = response.data.dataList;
          this.carttotal = response.data.total;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getgoodsSellTop(data) {
      goodsSellTop(data)
        .then((response) => {
          // debugger
          console.log(response, "6666666666688888");
          this.goodslist = response.data.list;
          this.total = response.data.total;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val;
      this.goodsdata.pageNum = val;
      this.getgoodsSellTop(this.goodsdata);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.goodsdata.pageSize = val;
      this.getgoodsSellTop(this.goodsdata);
    },
    handleCurrentChangecart(val) {
      console.log(`当前页: ${val}`);
      this.cartdata.pageNo = val;
      this.cartpageNum = val;
      this.getcartSellTop(this.cartdata);
    },
    handleSizeChangecart(val) {
      console.log(`每页 ${val} 条`);
      this.cartpageSize = val;
      this.cartdata.pageSize = val;
      this.getcartSellTop(this.cartdata);
    },

    fatherMethod(type) {
      this[type] = false;
    },
    getdeta(deta) {
      console.log(deta);
      this.goodsdata = {
        startTime: deta.date[0],
        endTime: deta.date[1],
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      this.getgoodsSellTop(this.goodsdata);
      this.completeDialogVisible = false;
    },
    getdetas(deta) {
      console.log(deta);
      let startTimes = new Date(deta.date[0]).valueOf();
      let endTimes = new Date(deta.date[1]).valueOf();
      this.cartdata = {
        statisticsType: 3,
        startDate: startTimes,
        endDate: endTimes,
        pageNo: this.cartpageNum,
        pageSize: this.cartpageSize,
      };
      this.getcartSellTop(this.cartdata);
      this.DialogVisible = false;
    },
  },
};
</script>
<style lang='scss' scoped>
.grid-content {
  text-align: center;
}
.text {
  padding: 10px;
}
</style>

