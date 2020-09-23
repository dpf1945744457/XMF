<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="Visible"
      width="600px"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="right"
        label-width="120px"
      >
        <el-form-item label="批次号" prop="batchNo" v-if="batchNo">
          <el-input v-model="dataForm.batchNo" placeholder="批次号" style="width:200px" />
        </el-form-item>
        <el-form-item label="清关公司" prop="type" v-if="options.length>0">
          <el-select v-model="dataForm.type" placeholder="请选择" filterable style="width: 380px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="海关通道" prop="channelCode" v-if="title=='清关数据报表'&&dataForm.type=='hc'">
          <el-select
            v-model="dataForm.channelCode"
            placeholder="请选择"
            filterable
            style="width: 380px"
          >
            <el-option
              v-for="item in channelCodeoption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="币种"
          prop="currency"
          v-if="title=='清关数据报表'&&(dataForm.type=='hc'&&dataForm.channelCode=='GZ')"
        >
          <el-select v-model="dataForm.currency" placeholder="请选择" filterable style="width: 380px">
            <el-option
              v-for="item in currencyoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="refund?'付款日期范围':'日期范围'" prop="date">
          <el-date-picker
            v-model="dataForm.date"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="退款日期范围" v-if="refund">
          <el-date-picker
            v-model="dataForm.refund"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelcomplete">取消</el-button>
        <el-button type="primary" @click="exportcancelcomplete('dataForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    title: null,
    Visible: null,
    options: null,
    exporttype: null,
    refund: null,
    batchNo: null,
  },
  data() {
    return {
      dataForm: {
        date: null,
        type: "",
        exporttype: this.exporttype,
        refund: [],
        batchNo: "",
        channelCode:'',
        currency:'',
      },
      channelCodeoption: [
        { value: "GZ", label: "广州口岸" },
        { value: "SZ", label: "深圳口岸" },
      ],
      currencyoptions: [
        { value: "CNY", label: "人民币" },
        { value: "HKD", label: "港元" },
        { value: "USD", label: "美元" },
      ],
      completeDialogVisible: true,
      rules: {
        date: [{ required: true, message: "请选择日期", trigger: "change" }],
        type: [
          { required: true, message: "请选择清关公司", trigger: "change" },
        ],
        batchNo: [
          {
            required: true,
            message: "批次号不能为空",
            trigger: "change",
          },
        ],
        channelCode: [
          {
            required: true,
            message: "请选择海关通道",
            trigger: "change",
          },
        ],
        currency: [
          {
            required: true,
            message: "请选择币种",
            trigger: "change",
          },
        ],
      },
    };
  },
  components: {},
  created() {},
  mounted() {},
  watch: {
    Visible() {
      this.completeDialogVisible = this.Visible;
    },
  },
  methods: {
    exportcancelcomplete(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.dataForm);
          this.$emit("getdeta", this.dataForm);
          this.$refs["dataForm"].resetFields();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancelcomplete() {
      this.$emit("fatherMethod");
      this.$refs["dataForm"].resetFields();
    },
  },
};
</script>
<style lang='scss' scoped>
</style>
