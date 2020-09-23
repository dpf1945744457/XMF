<template>
  <div>
    <el-button
      size="mini"
      class="filter-item"
      type="primary"
      icon="el-icon-download"
      @click="completeexcel('completeDialogVisible')"
      :loading="downloadLoading"
      v-permission
      permission-method="GET"
      permission-taskCode="/export/completeOrder"
    >导出已完成订单报表</el-button>
    <el-button
      size="mini"
      class="filter-item"
      type="primary"
      icon="el-icon-download"
      @click="completeexcel('allocateCargoDialogVisible')"
      :loading="downloadLoading"
      v-permission
      permission-method="GET"
      permission-taskCode="/export/allocateCargo"
    >拣货单导出</el-button>

    <el-button
      size="mini"
      class="filter-item"
      type="primary"
      icon="el-icon-download"
      @click="completeexcel('clearanceDialogVisible')"
      v-permission
      permission-method="GET"
      permission-taskCode="/export/clearance"
      :loading="downloadLoading"
    >清关数据导出</el-button>
    <el-button
      size="mini"
      class="filter-item"
      type="primary"
      icon="el-icon-download"
      @click="completeexcel('deliveryDialogVisible')"
      :loading="downloadLoading"
      v-permission
      permission-method="GET"
      permission-taskCode="/export/delivery"
    >交货单导出</el-button>
    <el-button
      size="mini"
      class="filter-item"
      type="primary"
      icon="el-icon-download"
      @click="completeexcel('financDialogVisible')"
      :loading="downloadLoading"
      v-permission
      permission-method="GET"
      permission-taskCode="/export/financialReconciliation"
    >导出财务报表</el-button>
    <el-button
      size="mini"
      class="filter-item"
      type="primary"
      icon="el-icon-download"
      @click="completeexcel('identityDialogVisible')"
      :loading="downloadLoading"
      v-permission
      permission-method="GET"
      permission-taskCode="/export/identity"
    >身份数据信息导出</el-button>
    <el-button
      size="mini"
      class="filter-item"
      type="primary"
      icon="el-icon-download"
      @click="completeexcel('liquidationDialogVisible')"
      v-permission
      permission-method="GET"
      permission-taskCode="/export/liquidation"
      :loading="downloadLoading"
    >清算报表导出</el-button>

    <el-button
      size="mini"
      class="filter-item"
      type="primary"
      icon="el-icon-download"
      @click="completeexcel('credentialsDialogVisible')"
      :loading="downloadLoading"
      v-permission
      permission-method="GET"
      permission-taskCode="/export/milk-division-credentials"
    >奶粉证清单导出</el-button>
    <el-button
      size="mini"
      class="filter-item"
      type="primary"
      icon="el-icon-download"
      @click="completeexcel('pickedDialogVisible')"
      :loading="downloadLoading"
      v-permission
      permission-method="GET"
      permission-taskCode="/export/picked"
    >已拣货订单导出</el-button>
    <el-button
      size="mini"
      class="filter-item"
      type="primary"
      icon="el-icon-download"
      @click="completeexcel('warehouseOrderDialogVisible')"
      :loading="downloadLoading"
      v-permission
      permission-method="GET"
      permission-taskCode="/export/warehouseOrder"
    >仓库报表导出</el-button>
    <el-button
      size="mini"
      class="filter-item"
      type="primary"
      icon="el-icon-download"
      @click="completeexcel('clearanceexportDialogVisible')"
      :loading="downloadLoading"
    > 和程BC订单申报模板</el-button>
    <el-button
      size="mini"
      class="filter-item"
      type="primary"
      icon="el-icon-download"
      @click="completeexcel('orderexportDialogVisible')"
      :loading="downloadLoading"
    >和程BC订单清单导出</el-button>
    <time-data
      :Visible="clearanceexportDialogVisible"
      :title="'和程BC订单申报模板(拣货时间)'"
      :options="[]"
      :exporttype="11"
      @fatherMethod="fatherMethod('clearanceexportDialogVisible')"
      @getdeta="exportcancelcomplete"
    ></time-data>

    <time-data
      :Visible="orderexportDialogVisible"
      :title="'和程BC订单清单报表'"
      :options="[]"
      :exporttype="12"
      @fatherMethod="fatherMethod('orderexportDialogVisible')"
      @getdeta="exportcancelcomplete"
    ></time-data>

    <time-data
      :Visible="warehouseOrderDialogVisible"
      :title="'仓库报表'"
      :options="[]"
      :exporttype="3"
      @fatherMethod="fatherMethod('warehouseOrderDialogVisible')"
      @getdeta="exportcancelcomplete"
    ></time-data>
    <time-data
      :Visible="pickedDialogVisible"
      :title="'已拣货订单'"
      :options="options1"
      :exporttype="1"
      @fatherMethod="fatherMethod('pickedDialogVisible')"
      @getdeta="exportcancelcomplete"
    ></time-data>

    <time-data
      :Visible="credentialsDialogVisible"
      :title="'奶粉证清单'"
      :options="[]"
      :batchNo="true"
      :exporttype="6"
      @fatherMethod="fatherMethod('credentialsDialogVisible')"
      @getdeta="exportcancelcomplete"
    ></time-data>
    <time-data
      :Visible="liquidationDialogVisible"
      :title="'清算报表'"
      :options="[]"
      :refund="true"
      :exporttype="2"
      @fatherMethod="fatherMethod('liquidationDialogVisible')"
      @getdeta="exportcancelcomplete"
    ></time-data>
    <time-data
      :Visible="identityDialogVisible"
      :title="'身份数据信息'"
      :options="options1"
      :exporttype="10"
      @fatherMethod="fatherMethod('identityDialogVisible')"
      @getdeta="exportcancelcomplete"
    ></time-data>

    <time-data
      :Visible="financDialogVisible"
      :title="'财务报表'"
      :options="[]"
      :exporttype="5"
      @fatherMethod="fatherMethod('financDialogVisible')"
      @getdeta="exportcancelcomplete"
    ></time-data>
    <time-data
      :Visible="deliveryDialogVisible"
      :title="'交货单报表'"
      :options="[]"
      :exporttype="7"
      @fatherMethod="fatherMethod('deliveryDialogVisible')"
      @getdeta="exportcancelcomplete"
    ></time-data>
    <time-data
      :Visible="clearanceDialogVisible"
      :title="'清关数据报表'"
      :options="options"
      :exporttype="9"
      @fatherMethod="fatherMethod('clearanceDialogVisible')"
      @getdeta="exportcancelcomplete"
    ></time-data>
    <time-data
      :Visible="allocateCargoDialogVisible"
      :title="'拣货单报表'"
      :options="[]"
      :exporttype="8"
      @fatherMethod="fatherMethod('allocateCargoDialogVisible')"
      @getdeta="exportcancelcomplete"
    ></time-data>
    <time-data
      :Visible="completeDialogVisible"
      :title="'导出已完成订单报表'"
      :options="[]"
      :exporttype="4"
      @fatherMethod="fatherMethod('completeDialogVisible')"
      @getdeta="exportcancelcomplete"
    ></time-data>
  </div>
</template>

<script>
import timedata from "@/components/TIME";
import {
  completeOrder,
  preexport,
  allocateCargo,
  clearance,
  delivery,
  financialReconciliation,
  identity,
  liquidation,
  credentials,
  picked,
  warehouseOrder,
  clearanceexport,
  orderexport,
} from "@/api/export";
export default {
  name: "",
  data() {
    return {
      downloadLoading: false,
      completeDialogVisible: false,
      allocateCargoDialogVisible: false,
      clearanceDialogVisible: false,
      clearanceexportDialogVisible: false,
      orderexportDialogVisible: false,
      deliveryDialogVisible: false,
      financDialogVisible: false,
      identityDialogVisible: false,
      liquidationDialogVisible: false,
      credentialsDialogVisible: false,
      pickedDialogVisible: false,
      warehouseOrderDialogVisible: false,
      options: [
        {
          value: "gzkjy",
          label: "广州跨境云",
        },
        {
          value: "ylbdt",
          label: "永利八达通",
        },
        {
          value: "hc",
          label: "和程",
        },
      ],
      options1: [
        {
          value: "hc",
          label: "和程",
        },
      ],
    };
  },
  components: { "time-data": timedata },
  created() {},
  mounted() {},
  methods: {
    completeexcel(type) {
      this[type] = true;
    },
    fatherMethod(type) {
      this[type] = false;
    },

    getpreexport(data) {
      preexport(data)
        .then((response) => {
          if (!response.data) {
            this.$message({
              message: "没有数据",
              type: "error",
            });
          } else {
            this.dl(data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    dl(data) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      if (data.exportType == 4) {
        completeOrder(data)
          .then((response) => {
            const blob = new Blob([response]);
            const fileName = "已完成订单报表.xls";
            this.dlex(blob, fileName);
            loading.close();
            this.completeDialogVisible = false;
          })
          .catch((error) => {
            loading.close();
            console.log(error);
          });
      }
      if (data.exportType == 8) {
        allocateCargo(data)
          .then((response) => {
            const blob = new Blob([response]);
            const fileName = "拣货单报表.xls";
            this.dlex(blob, fileName);
            loading.close();
            this.allocateCargoDialogVisible = false;
          })
          .catch((error) => {
            loading.close();
            console.log(error);
          });
      }
      if (data.exportType == 9) {
        clearance(data)
          .then((response) => {
            console.log(response);
            const blob = new Blob([response]);
            const fileName = "清关数据报表.xls";
            this.dlex(blob, fileName);
            loading.close();
            this.clearanceDialogVisible = false;
          })
          .catch((error) => {
            loading.close();
            console.log(error);
          });
      }
      if (data.exportType == 1) {
        picked(data)
          .then((response) => {
            console.log(response);
            const blob = new Blob([response]);
            const fileName = "已拣货订单报表.xls";
            this.dlex(blob, fileName);
            loading.close();
            this.pickedDialogVisible = false;
          })
          .catch((error) => {
            loading.close();
            console.log(error);
          });
      }
      if (data.exportType == 7) {
        delivery(data)
          .then((response) => {
            console.log(response);
            const blob = new Blob([response]);
            const fileName = "交货单报表.xls";
            this.dlex(blob, fileName);
            loading.close();
            this.deliveryDialogVisible = false;
          })
          .catch((error) => {
            loading.close();
            console.log(error);
          });
      }
      if (data.exportType == 5) {
        financialReconciliation(data)
          .then((response) => {
            console.log(response);
            const blob = new Blob([response]);
            const fileName = "财务报表.xls";
            this.dlex(blob, fileName);
            loading.close();
            this.financDialogVisible = false;
          })
          .catch((error) => {
            loading.close();
            console.log(error);
          });
      }
      if (data.exportType == 3) {
        warehouseOrder(data)
          .then((response) => {
            console.log(response);
            const blob = new Blob([response]);
            const fileName = "仓库报表.xls";
            this.dlex(blob, fileName);
            loading.close();
            this.warehouseOrderDialogVisible = false;
          })
          .catch((error) => {
            loading.close();
            console.log(error);
          });
      }
      if (data.exportType == 10) {
        identity(data)
          .then((response) => {
            console.log(response);
            const blob = new Blob([response]);
            const fileName = "身份数据信息报表.xls";
            this.dlex(blob, fileName);
            loading.close();
            this.identityDialogVisible = false;
          })
          .catch((error) => {
            loading.close();
            console.log(error);
          });
      }
      if (data.exportType == 6) {
        credentials(data)
          .then((response) => {
            console.log(response);
            const blob = new Blob([response]);
            const fileName = "奶粉证清单.xls";
            this.dlex(blob, fileName);
            loading.close();
            this.credentialsDialogVisible = false;
          })
          .catch((error) => {
            loading.close();
            console.log(error);
          });
      }
      if (data.exportType == 12) {
        orderexport(data)
          .then((response) => {
            console.log(response);
            const blob = new Blob([response]);
            const fileName = "和程BC订单申报模板.xls";
            this.dlex(blob, fileName);
            loading.close();
            this.orderexportDialogVisible = false;
          })
          .catch((error) => {
            loading.close();
            console.log(error);
          });
      }
      if (data.exportType == 2) {
        liquidation(data)
          .then((response) => {
            console.log(response);
            const blob = new Blob([response]);
            const fileName = "清算报表.xls";
            this.dlex(blob, fileName);
            loading.close();
            this.liquidationDialogVisible = false;
          })
          .catch((error) => {
            loading.close();
            console.log(error);
          });
      }
      if (data.exportType == 11) {
        clearanceexport(data)
          .then((response) => {
            console.log(response);
            const blob = new Blob([response]);
            const fileName = "和程BC订单清单报表.xls";
            this.dlex(blob, fileName);
            loading.close();
            this.clearanceexportDialogVisible = false;
          })
          .catch((error) => {
            loading.close();
            console.log(error);
          });
      }
    },
    exportcancelcomplete(deta) {
      let data = {
        start: deta.date[0],
        end: deta.date[1],
        exportType: deta.exporttype,
        type: deta.type,
        refundTimeStart: deta.refund[0],
        refundTimeEnd: deta.refund[1],
        batchNo: deta.batchNo,
        channelCode: deta.channelCode,
        currency: deta.currency,
      };
      this.getpreexport(data);
    },
    dlex(blob, title) {
      console.log(blob);
      const fileName = title;
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
    },
  },
};
</script>
<style lang='scss' scoped>
button {
  margin-bottom: 15px;
}
</style>
