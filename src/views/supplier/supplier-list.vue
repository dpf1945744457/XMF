<template>
  <div>
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <el-form
          ref="formInline"
          :inline="true"
          :model="formInline"
          class="demo-form-inline"
        >
          <el-form-item>
            <el-input
              v-model="formInline.id"
              placeholder="请输入商户ID"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="formInline.merName"
              placeholder="请输入商户/店铺名称"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="formInline.settleBankAccount"
              placeholder="请输入结算银行账号"
            />
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="formInline.deta"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            ></el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="medium  "
              icon="el-icon-search"
              @click="onSubmit('formInline')"
            >查询</el-button>
            <el-button
              class="filter-item"
              type="success"
              icon="el-icon-edit"
              @click="add"
              size="medium"
              v-permission
              permission-method="POST"
              permission-taskCode="/merchant/add"
            >添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-table
          :data="tableData"
          style="width: 100%"
          class="table"
          height="calc(100vh - 300px) "
          border
        >
          <el-table-column
            prop="id"
            label="商户ID"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="merName"
            label="商户名称"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="settleBankName"
            label="结算银行名称"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="settleBankAccount"
            label="结算银行账号"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="settleAccountName"
            label="结算账号户名"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="enunSocrCode"
            label="社会信代码"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="enterTime"
            label="入驻时间"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="useStatus"
            label="商户状态"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.useStatus==0">等待开通</span>
              <span v-if="scope.row.useStatus==1">正常使用</span>
              <span v-if="scope.row.useStatus==2">限制使用</span>
              <span v-if="scope.row.useStatus==3">完全禁用</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="useStatus"
            label="使用状态"
            align="center"
          >
            <template slot-scope="scope">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.useStatus"
                @change="enabchange($event,scope.row,scope.$index)"
              ></el-switch>

            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="edit( scope.row)"
                v-permission
                permission-method="POST"
                permission-taskCode="/merchant/update"
              >编辑</el-button>
              <el-button
                size="mini"
                type="danger  "
                @click="handleDelete( scope.row)"
                v-permission
                permission-method="DELETE"
                permission-taskCode="/merchant/delete"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div
          class="block"
          style="text-align:center; margin-top:2em"
        >
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
    <!--  弹出框 -->
    <el-dialog
      :title="dltitle"
      :visible.sync="dialogVisible"
      width="500px"
      @click="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item
          label="商户名称:"
          prop="merName"
        >
          <el-input
            v-model="form.merName"
            style="width:300px"
            placeholder="商户名称"
            :disabled="isDisabled"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="结算银行名称:"
          prop="settleBankName"
        >
          <el-input
            v-model="form.settleBankName"
            style="width:300px"
            placeholder="请输入结算银行名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="结算银行账号:"
          prop="settleBankAccount"
        >
          <el-input
            v-model="form.settleBankAccount"
            style="width:300px"
            placeholder="请输入结算银行账号"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="结算账号户名:"
          prop="settleAccountName"
        >
          <el-input
            v-model="form.settleAccountName"
            style="width:300px"
            placeholder="请输入结算账号户名"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="社会信用代码:"
          prop="enunSocrCode"
        >
          <el-input
            v-model="form.enunSocrCode"
            style="width:300px"
            placeholder="请输入社会信用代码"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item
          label="是否启用:"
          prop="useStatus"
        >
          <el-switch v-model="form.useStatus"></el-switch>
        </el-form-item> -->
        <el-form-item
          label="使用状态"
          prop="useStatus"
          v-if="dltitle =='编辑'"
        >
          <el-select
            v-model="form.useStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="item in optionsType"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            @click="cancel('form')"
          >取消</el-button>
          <el-button
            v-if="dltitle =='添加'"
            type="success"
            @click="addquarters('form')"
          >确定</el-button>
          <el-button
            v-if="dltitle =='编辑'"
            type="success"
            @click="editquarters('form')"
          >确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { searchList, memberupdate } from '@/api/member'
import { merchantAdd, merchantList, editList, deleteList } from '@/api/supplier'
import { dateFormat } from '@/utils/validate'
// import areaJs from '../../static/select_area'
export default {
  data() {
    return {
      formInline: {
        id: '',
        merName: '',
        settleBankAccount: '',
        deta: '',
      },
      dialogVisible: false,
      value: '',
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      order: 'desc',
      total: 0,
      isDisabled: false,
      dltitle: '',
      optionsType: [
        {
          key: '0',
          label: '等待开通',
        },
        {
          key: '1',
          label: '正常使用',
        },
        {
          key: '2',
          label: '限制使用',
        },
        {
          key: '3',
          label: '完全禁用',
        },
      ],
      form: {
        merName: '',
        settleBankName: '',
        settleBankAccount: '',
        settleAccountName: '',
        enunSocrCode: '',
        useStatus: '',
      },
      rules: {
        merName: [
          { required: true, message: '请输入商户名称', trigger: 'blur' },
        ],
        settleBankName: [
          { required: true, message: '请填写结算银行名称', trigger: 'blur' },
        ],
        settleBankAccount: [
          { required: true, message: '请填写结算银行帐号', trigger: 'blur' },
        ],
        settleAccountName: [
          { required: true, message: '请填写结算账号户名', trigger: 'blur' },
        ],
        enunSocrCode: [
          { required: true, message: '请填写社会信用代码', trigger: 'blur' },
        ],
        useStatus: [{ required: true, message: '请选择状态', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      let endTime = ''
      let startTime = ''
      if (this.formInline.deta) {
        startTime = dateFormat('YYYY-mm-dd', this.formInline.deta[0])
        endTime = dateFormat('YYYY-mm-dd', this.formInline.deta[1])
      }
      const param = {
        id: this.formInline.id,
        merName: this.formInline.merName,
        settleBankAccount: this.formInline.settleBankAccount,
        startTime: startTime,
        endTime: endTime,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
      merchantList(param).then((response) => {
        this.tableData = response.data.dataList
        this.total = response.data.total
      })
    },
    enabchange(data, row, index) {
      const param = {
        id: row.id,
        useStatus: row.useStatus,
        version: row.version,
      }
      editList(param)
        .then((response) => {
          if (response.code == '200') {
            this.$message({
              type: 'success',
              message: '修改成功!',
            })
            this.formInline.enable = ''
            this.getList()
          }
          // else {
          //   let newData = row
          //   newData.useStatus = newData.useStatus == 0 ? '1' : '0'
          //   this.tableData[index] = newData
          // }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    onSubmit() {
      this.getList()
    },
    handleClose() {
      // this.$confirm('确认关闭？')
      //   .then((_) => {
      //     done()
      //     this.getList()
      //   })
      //   .catch((_) => {})
      this.dialogVisible = false
      this.getList()
    },
    add() {
      this.dltitle = '添加'
      this.dialogVisible = true
    },
    handleDelete(row) {
      console.log(row)
      this.$confirm('是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteList({
          id: row.id,
        })
          .then((response) => {
            if (response.code == '200') {
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
              this.getList()
            }
          })
          .catch((error) => {
            this.$message.error(error.errmsg)
          })
      })
    },
    add() {
      this.dltitle = '添加'
      this.isDisabled = false
      this.form = {
        merName: '',
        settleBankName: '',
        settleBankAccount: '',
        settleAccountName: '',
        enunSocrCode: '',
        useStatus: '',
      }
      this.form.useStatus = this.form.useStatus.toString()
      console.log(this.form.useStatus, '2222222')
      this.dialogVisible = true
    },

    edit(row) {
      this.dltitle = '编辑'
      this.isDisabled = true
      this.form = row
      this.dialogVisible = true
      row.useStatus = row.useStatus.toString()
    },
    cancel(formName) {
      this.$refs[formName].clearValidate()
      this.dialogVisible = false
    },
    addquarters(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.form.status = this.form.stathis.formtus.toString()
          merchantAdd(this.form)
            .then((response) => {
              this.$message({
                type: 'success',
                message: '添加成功!',
              })
              // debugger
              this.dialogVisible = false
              this.getList()
            })
            .catch((error) => {
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    editquarters(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.form.status = this.form.stathis.formtus.toString()
          editList(this.form)
            .then((response) => {
              this.$message({
                type: 'success',
                message: '修改成功!',
              })
              // debugger
              console.log(response, '6666666666688888')
              this.dialogVisible = false
              this.getList()
            })
            .catch((error) => {
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageNum = val
      this.getList()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.getList()
    },
  },
}
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
  content: '';
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
