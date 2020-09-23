<template>
  <div>
    <p style="padding: 0;
    margin: 0;
    background: #fff;text-align: right;">
      <el-button
        type="primary"
        @click="fahuo()"
        v-permission
        permission-method="POST"
        permission-taskCode="/admin/order/getOrderRemainList"
      >发货消息提醒</el-button>
    </p>

    <el-card class="box-card">
      <div slot="header" class="clearfix" style="margin-top:20px">
        <span>{{ tongjititle }}</span>

        <el-form
          ref="formInline"
          :inline="true"
          :model="formInline"
          class="demo-form-inline"
          style="float: right;"
        >
          <el-form-item>
            <el-date-picker
              v-model="formInline.year"
              type="year"
              placeholder="选择年"
              value-format="yyyy"
              @change="yearchange"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.month" clearable placeholder="全部月份" @change="getValue">
              <el-option label="全部月份" value="0"></el-option>
              <el-option label="1月" value="01"></el-option>
              <el-option label="2月" value="02"></el-option>
              <el-option label="3月" value="03"></el-option>
              <el-option label="4月" value="04"></el-option>
              <el-option label="5月" value="05"></el-option>
              <el-option label="6月" value="06"></el-option>
              <el-option label="7月" value="07"></el-option>
              <el-option label="8月" value="08"></el-option>
              <el-option label="9月" value="09"></el-option>
              <el-option label="10月" value="10"></el-option>
              <el-option label="11月" value="11"></el-option>
              <el-option label="12月" value="12"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <echartslint ref="myechar"></echartslint>
        <!-- <div id="main" style="width: 100%;height:400px;"></div> -->
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="margin-top:20px">
        <span>商品统计</span>
        <el-form
          ref="formInline"
          :inline="true"
          :model="formInline"
          class="demo-form-inline"
          style="float: right;"
        >
          <el-form-item>
            <el-date-picker
              v-model="formInline1.year"
              type="year"
              placeholder="选择年"
              value-format="yyyy"
              @change="yearchangeshop"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline1.month" clearable placeholder="全部月份" @change="getValues">
              <el-option label="全部月份" value="0"></el-option>
              <el-option label="1月" value="01"></el-option>
              <el-option label="2月" value="02"></el-option>
              <el-option label="3月" value="03"></el-option>
              <el-option label="4月" value="04"></el-option>
              <el-option label="5月" value="05"></el-option>
              <el-option label="6月" value="06"></el-option>
              <el-option label="7月" value="07"></el-option>
              <el-option label="8月" value="08"></el-option>
              <el-option label="9月" value="09"></el-option>
              <el-option label="10月" value="10"></el-option>
              <el-option label="11月" value="11"></el-option>
              <el-option label="12月" value="12"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <echartslint ref="myechar1"></echartslint>
        <!-- <div id="main" style="width: 100%;height:400px;"></div> -->
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="margin-top:20px">
        <span>订单统计</span>
        <el-form
          ref="formInline"
          :inline="true"
          :model="formInliness"
          class="demo-form-inline"
          style="float: right;"
        >
          <el-form-item>
            <el-date-picker
              v-model="formInliness.year"
              type="year"
              placeholder="选择年"
              value-format="yyyy"
              @change="yearchangeorder"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="formInliness.month"
              clearable
              placeholder="全部月份"
              @change="getValuess"
            >
              <el-option label="全部月份" value="0"></el-option>
              <el-option label="1月" value="01"></el-option>
              <el-option label="2月" value="02"></el-option>
              <el-option label="3月" value="03"></el-option>
              <el-option label="4月" value="04"></el-option>
              <el-option label="5月" value="05"></el-option>
              <el-option label="6月" value="06"></el-option>
              <el-option label="7月" value="07"></el-option>
              <el-option label="8月" value="08"></el-option>
              <el-option label="9月" value="09"></el-option>
              <el-option label="10月" value="10"></el-option>
              <el-option label="11月" value="11"></el-option>
              <el-option label="12月" value="12"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <echartslint ref="myechar2"></echartslint>
        <!-- <div id="main" style="width: 100%;height:400px;"></div> -->
      </div>
    </el-card>

    <el-dialog title="发货消息提醒" :visible.sync="dialogVisible" width="900px">
      <Remain></Remain>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDashboard,
  getGoods,
  getOrder,
  getUser,
  getUserActive,
} from "@/api/statistics";

import echartslint from "./echartsvue";
import Remain from "./Remain";

export default {
  name: "",
  components: {
    echartslint,
    Remain,
  },
  data() {
    return {
      charts: "",
      timeDefaultShow: "",
      tongjititle: "日活统计",
      dialogVisible: false,
      echartlist: {
        data: {},
        xname: "",
        yname: "",
        userActivedata: [],
        series: [],
      },
      shangpinechartlist: {
        data: {},
        xname: "",
        yname: "",
        userActivedata: [],
        series: [],
      },
      formInline: {
        year: "",
        month: "",
      },
      formInline1: {
        year: "",
        month: "",
      },
      formInliness: {
        year: "",
        month: "",
      },
      yearList: [],
      // orderDay: dayList,
      // opinionData: [], // 注册人数
      // numberLogins: ["22", "66", "25", "25", "67"], // 登录人数
      // userActivedata: [],
      // goodTotalOrders: [], // 商品订单总量
      // quantityGoods: [], // 商品总量
      // totalGoods: [], // 商品总额
      // orderTotalOrders: [], // 订单总量
      // singleUser: [], // 下单用户
      // orderAmount: [], // 订单总额
      // customerPrice: [], // 客单价
      // datetime: [],
    };
  },
  created() {
    // this.orderList()
    // this.goodsList()

    const myDate = new Date();
    const year = "";
    const month = "";
    this.formInline.month = this.dataTime(myDate).month;
    this.formInline.year = this.dataTime(myDate).year.toString();
    this.formInline1.month = this.dataTime(myDate).month;
    this.formInline1.year = this.dataTime(myDate).year.toString();
    this.formInliness.year = this.dataTime(myDate).year.toString();
    this.formInliness.month = this.dataTime(myDate).month;
    console.log(this.formInline.year);
    this.userActive();
    this.goodsList();
    this.orderList();
  },
  mounted() {},
  methods: {
    getValue: function () {
      this.userActive();
    },
    fahuo() {
      this.dialogVisible = true;
    },
    dataTime(time) {
      const date = new Date(time);
      const Y = date.getFullYear();
      const M =
        date.getMonth() + 1 < 10
          ? "0" + parseInt(date.getMonth() + 1)
          : date.getMonth() + 1;
      const D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      const H = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      const m =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      const s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      const newTime = {
        year: Y,
        month: M,
      };
      return newTime;
    },
    yearchange(val) {
      this.userActive();
    },
    yearchangeshop() {
      this.goodsList();
    },
    yearchangeorder() {
      this.orderList();
    },
    getValues: function () {
      this.goodsList();
    },
    getValuess: function () {
      this.orderList();
    },
    getDate() {
      // x轴上的日期
      var base = +new Date(2016, 10, 21);
      var oneDay = 24 * 3600 * 1000;
      var date = [];
      var data = [Math.random() * 300];

      for (var i = 1; i < 20000; i++) {
        var now = new Date((base += oneDay));
        date.push(
          [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/")
        );
        data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
      }
      return date;
    },
    drawLine(id) {
      if (id == 1) {
        const echartlist = {
          data: ["新注册人数", "登录人数"],
          xname: "日期",
          yname: "人数",
          userActivedata: this.userActivedata,
          series: [
            {
              symbol: "circle",
              symbolSize: 2,
              itemStyle: {
                normal: {
                  color: "blue",
                  lineStyle: {
                    color: "blue",
                  },
                },
              },
              // name: '近七日收益',
              name: "新注册人数",
              type: "line",

              data: this.numberLogins,
            },
            {
              symbol: "circle",
              symbolSize: 2,
              itemStyle: {
                normal: {
                  // color: "#01ff19",
                  color: "red",
                  lineStyle: {
                    color: "red",
                  },
                },
              },
              // name: '近七日收益',
              name: "登录人数",
              type: "line",

              data: this.opinionData,
            },
          ],
        };
        window.addEventListener("resize", this.resizeTheChart);
        this.$refs.myechar.drawLine(echartlist, "main");
      } else if (id == 2) {
        {
          const echartlist = {
            data: ["订单量", "下单商品数量", "下单商品总额"],
            xname: "日期",
            yname: "数量",
            userActivedata: this.day,
            series: [
              {
                symbol: "circle",
                symbolSize: 2,
                itemStyle: {
                  normal: {
                    color: "red",
                    lineStyle: {
                      color: "red",
                    },
                  },
                },
                // name: '近七日收益',
                name: "订单量",
                type: "line",

                data: this.orders,
              },
              {
                symbol: "circle",
                symbolSize: 2,
                itemStyle: {
                  normal: {
                    // color: "#01ff19",
                    color: "blue",
                    lineStyle: {
                      color: "blue",
                    },
                  },
                },
                // name: '近七日收益',
                name: "下单商品数量",
                type: "line",

                data: this.products,
              },
              {
                symbol: "circle",
                symbolSize: 2,
                itemStyle: {
                  normal: {
                    // color: "#01ff19",
                    color: "green",
                    lineStyle: {
                      color: "green",
                    },
                  },
                },
                // name: '近七日收益',
                name: "下单商品总额",
                type: "line",

                data: this.amount,
              },
            ],
          };
          window.addEventListener("resize", this.resizeTheChart);
          this.$refs.myechar1.drawLine(echartlist, "shop");
        }
      } else if (id == 3) {
        {
          const echartlist = {
            data: ["订单量", "下单用户", "订单总额", "客单价"],
            xname: "日期",
            yname: "数量",
            userActivedata: this.orderday,
            series: [
              {
                symbol: "circle",
                symbolSize: 2,
                itemStyle: {
                  normal: {
                    color: "red",
                    lineStyle: {
                      color: "red",
                    },
                  },
                },
                // name: '近七日收益',
                name: "订单量",
                type: "line",

                data: this.orderorders,
              },
              {
                symbol: "circle",
                symbolSize: 2,
                itemStyle: {
                  normal: {
                    // color: "#01ff19",
                    color: "blue",
                    lineStyle: {
                      color: "blue",
                    },
                  },
                },
                // name: '近七日收益',
                name: "下单用户",
                type: "line",
                data: this.ordercustomers,
              },
              {
                symbol: "circle",
                symbolSize: 2,
                itemStyle: {
                  normal: {
                    // color: "#01ff19",
                    color: "green",
                    lineStyle: {
                      color: "green",
                    },
                  },
                },
                // name: '近七日收益',
                name: "订单总额",
                type: "line",
                data: this.orderamount,
              },
              {
                symbol: "circle",
                symbolSize: 2,
                itemStyle: {
                  normal: {
                    // color: "#01ff19",
                    color: "yellow",
                    lineStyle: {
                      color: "yellow",
                    },
                  },
                },
                // name: '近七日收益',
                name: "客单价",
                type: "line",

                data: this.orderpcr,
              },
            ],
          };
          window.addEventListener("resize", this.resizeTheChart);
          this.$refs.myechar2.drawLine(echartlist, "shop");
        }
      }
    },
    resizeTheChart() {
      if (this.$refs && this.$refs.myechar) {
        this.$refs.myechar.resize();
        this.$refs.myechar1.resize();
        this.$refs.myechar2.resize();
      }
    },
    // 日统计数据
    userActive() {
      const param = {
        month: this.formInline.month,
        year: this.formInline.year,
      };
      getUser(param)
        .then((response) => {
          console.log(response);
          const opinionData = [];
          const userActivedata = [];
          const numberLogins = [];
          if (response.data.rows.length > 0) {
            for (let index = 0; index < response.data.rows.length; index++) {
              const element = response.data.rows[index];
              opinionData.push(element.userActive);
              userActivedata.push(element.day);
              numberLogins.push(element.users);
            }
            this.opinionData = opinionData;
            this.userActivedata = userActivedata;
            this.numberLogins = numberLogins;
            this.echartlist.series = [];
            this.drawLine(1);
          } else {
            this.opinionData = [];
            this.userActivedata = [];
            this.numberLogins = [];
            this.echartlist.series = [];
            this.drawLine(1);
          }
          if (this.formInline.month == "0") {
            this.tongjititle = "月活统计";
          } else {
            this.tongjititle = "日活统计";
          }
        })
        .catch((error) => {
          console.log(error);
        });
      // getUser(param)
      //   .then((response) => {
      //     console.log(response);
      //     let numberLogins = [];

      //     for (let index = 0; index < response.data.rows.length; index++) {
      //       const element = response.data.rows[index];
      //       numberLogins.push(element.users);
      //     }
      //     this.numberLogins = numberLogins;
      //     this.drawLine();
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    },
    // 商品统计
    goodsList() {
      const params = {
        month: this.formInline1.month,
        year: this.formInline1.year,
      };
      getGoods(params)
        .then((response) => {
          console.log(response, "2222");
          const amount = [];
          const day = [];
          const orders = [];
          const products = [];
          for (let index = 0; index < response.data.rows.length; index++) {
            const element = response.data.rows[index];
            orders.push(element.orders);
            day.push(element.day);
            products.push(element.products);
            amount.push(element.amount);
          }
          this.amount = amount;
          this.day = day;
          this.orders = orders;
          this.products = products;
          this.drawLine(2);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 订单统计
    orderList() {
      var numberLogins = []; // 登录人数
      var numberRegistrants = []; // 注册人数
      const param = {
        month: this.formInliness.month,
        year: this.formInliness.year,
      };
      getOrder(param)
        .then((response) => {
          console.log(response, "666888888866666666");
          const amount = [];
          const day = [];
          const customers = [];
          const orders = [];
          const pcr = [];

          for (let index = 0; index < response.data.rows.length; index++) {
            const element = response.data.rows[index];
            amount.push(element.amount);
            orders.push(element.orders);
            customers.push(element.customers);
            pcr.push(element.pcr);
            day.push(element.day);
          }
          this.orderamount = amount;
          this.orderday = day;
          this.orderorders = orders;
          this.ordercustomers = customers;
          this.orderpcr = pcr;

          this.drawLine(3);
        })
        .catch((error) => {
          console.log(error);
        });
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
  margin-bottom: 20px;
  .clearfix {
    & > span {
      font-size: 20px;
      color: #000;
      font-weight: bolder;
    }
  }
}
</style>
