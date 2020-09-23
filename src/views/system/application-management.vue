<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item  label="App名称">
            <el-input v-model="formInline.appName" placeholder="App名称" class="input_search" />
          </el-form-item>
          <el-form-item label="操作平台">
            <el-select v-model="formInline.platformType" placeholder="请选择操作平台">
              <el-option
                v-for="item in platformTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="onSubmit()">查询</el-button>

            <el-button
              type="primary"
              size="mini"
              icon="el-icon-circle-plus-outline"
              @click="add()"
              v-permission
              permission-method="POST"
              permission-taskCode="/admin/apps/create"
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
size="small"
          border
        >
          <el-table-column align="center" label="ID" prop="id"></el-table-column>
          <el-table-column align="center" label="App名称" prop="appName"></el-table-column>
          <el-table-column align="center" label="操作平台" prop="platformType">
            <template slot-scope="scope">{{scope.row.platformType === 0 ? '安卓' : '苹果'}}</template>
          </el-table-column>
          <el-table-column align="center" label="文件大小 ( 字节 )" prop="fileSize"></el-table-column>
          <el-table-column align="center" label="版本号" prop="appVersion"></el-table-column>
          <el-table-column align="center" label="升级类型" prop="versionType">
            <template slot-scope="scope">{{scope.row.versionType === 0 ? '本地' : '市场'}}</template>
          </el-table-column>
          <el-table-column align="center" label="强制更新" prop="forceUpdate">
            <template slot-scope="scope">{{scope.row.forceUpdate === true ? '是' : '否'}}</template>
          </el-table-column>
          <el-table-column align="center" label="下载地址" prop="downUrl"></el-table-column>
          <el-table-column label="操作" align="center" width="200px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="edit( scope.row)"
                v-permission
                permission-method="PUT"
                permission-taskCode="/admin/apps/update"
              >编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
               v-permission
                permission-method="DELETE"
                permission-taskCode="/admin/apps/delete">删除</el-button>
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
          <el-form-item label="App名称" prop="appName">
            <el-input v-model="form.appName"></el-input>
          </el-form-item>

          <el-form-item label="版本号" prop="appVersion">
            <el-input v-model="form.appVersion"></el-input>
          </el-form-item>
          <el-form-item label="更新说明" prop="updateContent">
            <el-input v-model="form.updateContent" type="textarea" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="强制更新" prop="forceUpdate">
            <el-select v-model="form.forceUpdate" placeholder="请选择">
              <el-option
                v-for="item in forceUpdateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作平台" prop="platformType">
            <el-select v-model="form.platformType" placeholder="请选择">
              <el-option
                v-for="item in platformTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="升级类型" prop="versionType">
            <el-select v-model="form.versionType" :disabled="dltitle =='编辑'" placeholder="请选择">
              <el-option
                v-for="item in versionTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="下载地址" prop="downUrl" v-if="form.versionType==1||dltitle =='编辑'">
            <el-input v-model="form.downUrl"></el-input>
          </el-form-item>
          <el-form-item label="文件" prop="downUrl" v-if="form.versionType==0&&dltitle !='编辑'">
            <el-upload
              class="upload-demo"
              :action="uploadPath"
              :headers="headers"
              :on-success="uploadSuccess"
              multiple
              :limit="1"
              accept=".apk"
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传 *.apk 文件</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button v-if="dltitle =='编辑'" type="primary" @click="editquarters('form')">确定</el-button>
          <el-button v-if="dltitle =='添加'" type="primary" @click="addquarters('form')">确定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import {
  appsadd,
  appsupdate,
  appselete,
  searchList,
  uploadPath,
} from "@/api/apps";
import avatarUpload from "@/components/Upload/avatarUpload";
import { getToken, removeToken } from "@/utils/auth";
export default {
  computed: {
    headers() {
      return {
        token: getToken(),
      };
    },
  },
  components: { avatarUpload },
  data() {
    return {
      formInline: {},
      dialogVisible: false,
      dataList: [],
      tableData: [],
      fileList: [],
      pageNum: 1,
      pageSize: 10,
      uploadPath: uploadPath,
      total: 0,
      dltitle: "",
      dialogImageUrl: "",
      dialogVisible: false,
      platformTypeOptions: [
        {
          value: "",
          label: "全部",
        },
        {
          value: 1,
          label: "苹果",
        },
        {
          value: 0,
          label: "安卓",
        },
      ],
      versionTypeOptions: [
        {
          value: 0,
          label: "本地",
        },
        {
          value: 1,
          label: "市场",
        },
      ],
      forceUpdateOptions: [
        {
          value: true,
          label: "是",
        },
        {
          value: false,
          label: "否",
        },
      ],
      form: {
        appName: "",
        appVersion: "",
        downUrl: "",
        forceUpdate: false,
        platformType: "",
        updateContent: "",
        versionType: "",
      },
      rules: {
        appName: [
          { required: true, message: "请输入app名称", trigger: "blur" },
        ],
        platformType: [
          { required: true, message: "请选择操作平台", trigger: "change" },
        ],
        appVersion: [
          { required: true, message: "请输入版本号", trigger: "blur" },
        ],
        updateContent: [
          { required: true, message: "请输入更新内容", trigger: "blur" },
        ],
        versionType: [
          { required: true, message: "请选择升级类型", trigger: "change" },
        ],
        forceUpdate: [
          { required: true, message: "请选择是否强制更新", trigger: "change" },
        ],
        downUrl: [
          {
            required: true,
            message: "请输入文件地址或者选择文件",
            trigger: "blur",
          },
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
        appName: this.formInline.appName,
        page: this.pageNum,
        size: this.pageSize,
        platformType: this.formInline.platformType,
      };
      searchList(param).then((response) => {
        console.log(response, "response");
        this.tableData = response.data.list;
        this.total = response.data.total;
      });
    },
    onSubmit() {
      this.getList();
    },
    uploadSuccess(res) {
      console.info(res);
      let data = res.data;
      this.form.fileName = data.name;
      this.form.fileSize = data.size;
      this.form.fileKey = data.key;
      this.form.downUrl = data.url;
    },
    handleExceed(files) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`
      );
    },
    changeImg(val, type) {
      this.form[type] = val;
    },
    edit(row) {
      this.dltitle = "编辑";
      this.dialogVisible = true;
      this.form = row;
    },
    addquarters(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          appsadd(this.form)
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
    editquarters(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          appsupdate(this.form)
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
    add() {
      this.dltitle = "添加";
      (this.form = {
        addTime: "",
        appName: "",
        appVersion: "",
        downUrl: "",
        fileKey: "",
        fileName: "",
        fileSize: "",
        forceUpdate: false,
        platformType: "",
        updateContent: "",
        versionType: "",
      }),
        (this.dialogVisible = true);
    },
    disable(row) {
      const tish = row.enabled ? "确定禁用" : "确定启用";
      this.$confirm(tish + ",是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          brandenable({ id: row.id, enable: !row.enabled })
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
      this.$confirm("删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          appselete({ id: row.id })
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

