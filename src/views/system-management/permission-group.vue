<template>
  <div class="container">
    <!-- <div class="container_on">
      <div class="on_title">
        <p>查询条件</p>
      </div>
      <el-form
        ref="ruleForm"
        :inline="true"
        :model="formInline"
        :rules="rules"
        class="demo-form-inline"
      >
        <el-form-item>
          <el-input v-model="formInline.appName" placeholder="请输入系统名称"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="search">查询</el-button>

        </el-form-item>
      </el-form>
    </div> -->

    <div class="container_tw">
      <div class="tw_title">
        <p>系统列表</p>
        <!--右边按钮  -->
        <!-- <div class="tools-right">
          <el-button type="primary" class="tools-button" @click="addSystem">
            <i class="el-icon-circle-plus-outline"></i> 添加
          </el-button>
        </div> -->
        <!--<el-button type="primary" icon="el-icon-circle-plus" size="small">搜索</el-button>-->
      </div>
      <div class="tw_form">
        <el-table :data="systemList" style="width: 100%" class="table" height="calc(100vh - 350px)">
          <!-- <el-table-column prop="id" label="ID" ></el-table-column> -->
          <el-table-column prop="name" label="名称" align="center"></el-table-column>
          <el-table-column prop="code" label="编号" align="center"></el-table-column>
          <!-- <el-table-column prop="enable" label="状态" :formatter="formatEnable" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.enable" type="primary" size="small" plain>启用</el-button>
              <el-button v-if="!scope.row.enable" type="primary" size="small" plain>停用</el-button>
            </template>
          </el-table-column> -->
          <el-table-column prop="createTimeLong" label="创建时间" align="center">
			  <template slot-scope="scope">
				  {{dateFormats(new Date(scope.row.createTimeLong))}}
			  </template>
		  </el-table-column>
          <el-table-column prop="updateTimeLong" label="更新时间" align="center">
			   <template slot-scope="scope">
				  {{dateFormats(new Date(scope.row.updateTimeLong))}}
			  </template>
		  </el-table-column>
          <el-table-column label="操作" width="400" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="success" size="small" @click="handleRole(scope.row)">配置权限</el-button>
              <el-button type="success" size="small" @click="handleDept(scope.row)">部门管理</el-button>
              <!-- <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block" style="text-align:center; margin-top:2em">
        <el-pagination background :current-page="pageNum" :page-sizes="[5,10,15,20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
      <!-- 弹出框 -->
      <el-dialog title="添加系统列表" :visible.sync="dialogVisible" width="40%">

        <el-form ref="form" :model="form" label-width="140px" label-position="left" :rules="rules">
          <el-form-item label="系统名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="系统编号" prop="code">
            <el-input v-model="form.code"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>

      </el-dialog>

    </div>

    <!-- 分页 -->

  </div>
</template>

<script>
	import { getSystemList, saveSystem, updateSystem, deleteSystem } from '@/api/system'
     import { dateFormat } from '@/utils/validate'
	export default {
		name: 'PermissionGroup',
		data() {
			return {
				formInline: {},
				//				platform: '',
				//				platformOptions: [],
				dialogVisible: false,
				form: {
					name: '',
					code: ''
				},
				pageNum: 1,
				pageSize: 5,
				total: 0,
				systemList: [],
				addOrEdit: 'add',
				rules: {
					name: [{
							required: true,
							message: '请输入系统名称',
							trigger: 'blur'
						}
						//          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
					],
					code: [{
						required: true,
						message: '请输入系统编号',
						trigger: 'blur'
					}]
				}
			}
		},
		created() {
			this.getSystemLists();
		},
		methods: {
			formatEnable(row, column) {
				return row.enable == true ? '启用' : '停用';
			},
			getSystemLists() {
				getSystemList({
					key: this.formInline.appName,
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}).then(response => {
					if (response.code == '200') {
						this.systemList = response.data.dataList;
						this.total = response.data.total;
					}
				}).catch(error => {
					// this.$message.error(error.errmsg);
				})
			},
			dateFormats(date){
				console.log(date);
				return dateFormat('YYYY-mm-dd HH:MM:SS',date)
			},
			search() {
				this.getSystemLists();
			},
			addSystem() {
				this.dialogVisible = true;
				this.addOrEdit = 'add';
				this.form = {}
			},
			handleDelete(row) {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					deleteSystem(row.id).then(response => {
						if (response.code == '200') {
							this.getSystemLists();
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
						}
					}).catch(error => {
						this.$message.error(error.errmsg);
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			handleEdit(row) {
				this.addOrEdit = 'edit';
				this.dialogVisible = true;
				this.form.name = row.name;
				this.form.code = row.code;
				this.form.id = row.id;
			},
			handleRole(row) {
				const otherQuery =
					this.$router.push({
						path: '/systemManagement/asset-access',
						query: {
							systemCode: row.code,
							type: 'system'
						}
					})
			},
			handleDept(row) {
				const otherQuery =
					this.$router.push({
						path: '/systemManagement/employee-rights',
						query: {
							systemCode: row.code
						}
					})
			},
			onSubmit() {
				this.$refs.form.validate(valid => {
					if (valid) {
						//		      	编辑
						if (this.addOrEdit == 'edit') {
							updateSystem(this.form).then(response => {
								if (response.code == '200') {
									this.$message({
										message: '编辑成功',
										type: 'success'
									});
									this.dialogVisible = false;
									this.getSystemLists();
								}
							}).catch(error => {
								console.log(error)
							})
						}
						//		      	新增
						else if (this.addOrEdit == 'add') {
							saveSystem(this.form).then(response => {
								if (response.code == '200') {
									this.$message({
										message: '新增成功',
										type: 'success'
									});
									this.dialogVisible = false;
									this.getSystemLists();
								}
							}).catch(error => {
								console.log(error)
							})
						}
					} else {
						return false
					}
				})
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getSystemLists();
			},
			handleCurrentChange(val) {
				this.pageNum = val;
				this.getSystemLists();
			}
		}

	}
</script>

<style lang='scss' scoped>
.container {
  padding: 20px;
}
	.container_on {
  padding: 20px;
  height: 160px;
  background: white;
  .on_title {
    margin-bottom: 20px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 10px;
    border-bottom: 1px solid rgb(231, 234, 236);
    & > p:nth-child(1) {
      color: rgb(104, 107, 109);
      font-size: 14px;
      font-weight: bold;
    }
    & > p:nth-child(2) {
      color: rgb(1, 123, 255);
      font-size: 14px;
    }
    & > p:nth-child(2):hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .on_input {
    .el-row {
      display: flex;
      justify-content: space-around;
    }
  }
}
	.container_tw {
		.tw_title {
			height: 50px;
			background: white;
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;
			padding: 0 20px;
			border-bottom: 1px solid rgb(231, 234, 236);
			&>p {
				color: rgb(104, 107, 109);
				font-size: 14px;
				font-weight: bold;
			}
			.el-button:hover {
				background: rgb(27, 179, 148);
			}
		}
		.tw_form {
			box-sizing: border-box;
			.el-table {
				box-sizing: border-box;
				padding: 0 20px;
			}
		}
	}

	.pagination-container {
		background: #ffffff;
		padding: 10px 0;
		margin: 20px;
	}
</style>
