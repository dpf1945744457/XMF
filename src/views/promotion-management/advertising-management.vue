<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="formInline.name" placeholder="广告标题/ID/专题名称" class="input_search" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.enable" placeholder="是否启用">
              <el-option label="是否启用" value></el-option>
              <el-option label="启用" value="true"></el-option>
              <el-option label="禁用" value="false"></el-option>
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
              permission-taskCode="/ad"
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
          <el-table-column prop="adId" label="广告ID" align="center"></el-table-column>
          <el-table-column prop="name" label="广告标题" align="center"></el-table-column>
          <el-table-column prop="content" label="广告内容" align="center"></el-table-column>
          <el-table-column prop="url" label="广告图片" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.url" alt style="width: 40px;height: 40px" />
            </template>
          </el-table-column>
          <el-table-column prop="position" label="广告位置" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.position==1">首页</span>
              <span v-else>{{scope.row.position}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="link" label="活动链接" align="center">
            <template slot-scope="scope">
              <a :href="scope.row.link" target="_blank">{{scope.row.link}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="topicName" label="专题名称" align="center">
            <template slot-scope="scope">{{gettopicName(scope.row.topicId)}}</template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" align="center"></el-table-column>
          <el-table-column prop="enabled" label="是否启用" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.enabled" @change="enabchange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="生效时间" align="center">
            <template
              slot-scope="scope"
            >{{format(scope.row.startTime)}}到 {{format(scope.row.endTime)}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="edit( scope.row)"
                v-permission
                permission-method="PUT"
                permission-taskCode="/ad"
              >编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
                v-permission
                permission-method="DELETE"
                permission-taskCode="/ad"
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
        width="550px"
        :close-on-click-modal="false"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right">
          <el-form-item label="广告标题:" prop="name">
            <el-input v-model="form.name" style="width:200px" placeholder="请输入广告标题"></el-input>
          </el-form-item>
          <el-form-item label="广告内容:" prop="content">
            <el-input v-model="form.content" style="width:200px" placeholder="请输入广告内容"></el-input>
          </el-form-item>
          <el-form-item label="广告图片:" prop="url">
            <avatarUpload :url="form.url" :before="true" @change="changeImg($event,'url')"></avatarUpload>
          </el-form-item>
          <el-form-item label="广告排序:" prop="sort">
            <el-input-number v-model="form.sort" :min="0" :max="10" label="广告排序"></el-input-number>
          </el-form-item>

          <el-form-item label="广告对象:">
            <el-radio v-model="form.radio" label="1" @change="radiochange">专题</el-radio>
            <el-radio v-model="form.radio" label="2" @change="radiochange">链接</el-radio>
          </el-form-item>

          <el-form-item label="专题配置:" prop="topicId" v-if="form.radio=='1'">
            <el-select v-model="form.topicId" placeholder="请选择专题">
              <el-option
                v-for="item in options"
                :key="item.topicId"
                :label="item.title"
                :value="item.topicId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用:" prop="enabled">
            <el-switch v-model="form.enabled"></el-switch>
          </el-form-item>
          <el-form-item label="活动链接:" prop="link" v-if="form.radio=='2'">
            <el-input v-model="form.link" style="width:200px" placeholder="请输入活动链接"></el-input>
          </el-form-item>
          <el-form-item label="生效时间:" prop="date">
            <el-date-picker
              v-model="form.date"
              value-format="timestamp"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="quxiao('form')">取 消</el-button>
          <el-button v-if="dltitle =='编辑广告'" type="primary" @click="editquarters('form')">确定</el-button>
          <el-button v-if="dltitle =='添加广告'" type="primary" @click="addquarters('form')">确定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import { searchList, addelete, adput, adpost, topiclist } from "@/api/ad";
import avatarUpload from "@/components/Upload/avatarUpload";
export default {
  components: { avatarUpload },
  data() {
    return {
      formInline: {},
      dialogVisible: false,
      dataList: [],
      tableData: [],
      options: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      dltitle: "",
      dialogImageUrl: "",
      dialogVisible: false,
      form: {
        adId: 0,
        content: "",
        radio: "1",
        enabled: true,
        endTime: "",
        link: "",
        name: "",
        position: 1,
        sort: 0,
        startTime: "",
        topicId: "",
        topicName: "",
        url: "",
        date: "",
      },
      rules: {
        name: [{ required: true, message: "请输入广告标题", trigger: "blur" }],
        content: [
          { required: true, message: "请输入广告内容", trigger: "blur" },
        ],
        url: [{ required: true, message: "请上传广告图片", trigger: "blur" }],
        sort: [{ required: true, message: "请输入排序号", trigger: "blur" }],
        link: [{ required: true, message: "请输入活动链接", trigger: "blur" }],
        topicId: [{ required: true, message: "请选择专题", trigger: "change" }],
        date: [
          { required: true, message: "请选择生效时间", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getList();
    topiclist().then((response) => {
      console.log(response, "response");
      this.options = response.data;
    });
  },
  methods: {
    add0(m) {
      return m < 10 ? "0" + m : m;
    },
    quxiao(formName) {
      this.$refs[formName].clearValidate();
      this.dialogVisible = false;
    },
    radiochange(val) {
      console.log(val);
    },
    gettopicName(val) {
      for (let index = 0; index < this.options.length; index++) {
        const element = this.options[index];
        if (element.topicId == val) {
          return element.title;
        }
      }
    },
    format(shijianchuo) {
      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(shijianchuo);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return (
        y +
        "-" +
        this.add0(m) +
        "-" +
        this.add0(d) +
        " " +
        this.add0(h) +
        ":" +
        this.add0(mm) +
        ":" +
        this.add0(s)
      );
    },

    getList() {
      const param = {
        name: this.formInline.name,
        enable: this.formInline.enable,
        pageNo: this.pageNum,
        pageSize: this.pageSize,
      };

      searchList(param).then((response) => {
        console.log(response, "response");
        for (let index = 0; index < response.data.dataList.length; index++) {
          const element = response.data.dataList[index];

          if (element.link) {
            element.radio = "2";
          } else {
            element.radio = "1";
          }

          element.date = [element.startTime, element.endTime];
        }
        this.tableData = response.data.dataList;
        this.total = response.data.total;
      });
    },
    onSubmit() {
      this.getList();
    },
    changeImg(val, type) {
      this.form[type] = val;
    },
    enabchange(row) {
      adput(row)
        .then((response) => {
          // debugger
          this.formInline.enable = "";
          this.getList();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    edit(row) {
      this.dltitle = "编辑广告";
      this.dialogVisible = true;
      var targetObj = JSON.parse(JSON.stringify(row));
      let arr4 = JSON.parse(JSON.stringify(targetObj));
      this.form = arr4;
      console.log(this.form);
    },
    addquarters(formName) {
      console.log(this.form);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.radio == "1") {
            this.form.link = null;s
          } else {
            this.form.topicId = null;
          }
          this.form.startTime = this.form.date[0];
          this.form.endTime = this.form.date[1];
          adpost(this.form)
            .then((response) => {
              // debugger
              this.dialogVisible = false;

              this.$message({
                type: "success",
                message: "成功!",
              });

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
      console.log(this.form);
      this.$refs[formName].validate((valid) => {
        if (valid) {
           if (this.form.radio == "1") {
            this.form.link = null;
          } else {
            this.form.topicId = null;
          }
          this.form.startTime = this.form.date[0];
          this.form.endTime = this.form.date[1];
          adput(this.form)
            .then((response) => {
              // debugger
              this.dialogVisible = false;
              this.$message({
                type: "success",
                message: "成功!",
              });
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
      this.dltitle = "添加广告";
      (this.form = {
        adId: 0,
        content: "",
        radio: "1",
        enabled: true,
        endTime: "",
        link: "",
        name: "",
        position: 1,
        sort: 0,
        startTime: "",
        topicId: "",
        topicName: "",
        url: "",
        date: "",
      }),
        (this.dialogVisible = true);
    },

    handleDelete(row) {
      this.$confirm("删除广告, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          addelete({ adId: row.adId })
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

