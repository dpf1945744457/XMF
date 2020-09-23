<template>
  <div>
    <ul class="file-ul">
      <!-- 上传的文件列表 start -->
      <li v-for="(item, index) in fileList" :key="index" class="file-ul-li">
        <span @mouseover.stop="isShowPopup = index">
          <el-image class="file-ul-li-img" :src="item.image" lazy></el-image>
        </span>

        <span
          class="file-ul-li-popup"
          v-show="item && isShowPopup === index"
          @mouseleave="isShowPopup = -1"
        >
          <span class="file-ul-li-popup-preview" @click="onPreview(item)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span v-if="item.video" class="file-ul-li-popup-play" @click="onPlay(item)">
            <i class="el-icon-caret-right"></i>
          </span>
          <span class="file-ul-li-popup-delete" @click="onRemove(item,index)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </li>
      <!-- 上传的文件列表 end -->

      <el-upload
        list-type="picture-card"
        v-if="typeInfo == 0"
        accept="image/*, video/*"
        :limit="5"
        :show-file-list="false"
        :action="uploadPath"
        :headers="headers"
        :on-exceed="handleExceed"
        :on-change="handleChange"
        :auto-upload="false"
      >
        <span
          v-loading="uploadLoading"
          element-loading-text="上传中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          class="icon-box"
        >
          <i class="el-icon-plus upload-icon"></i>
        </span>
      </el-upload>
      <el-upload
        list-type="picture-card"
        v-if="typeInfo == 1"
        accept="image/*"
        :show-file-list="false"
        :action="uploadPath"
        :headers="headers"
        :on-success="uploadPicUrl"
        :on-progress="progress"
        :before-upload="beforeupsloads"
      >
        <span
          v-loading="uploadLoading"
          element-loading-text="上传中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          class="icon-box"
        >
          <i class="el-icon-plus upload-icon"></i>
        </span>
      </el-upload>
      <!--视频-->
      <el-upload
        list-type="picture-card"
        v-if="typeInfo == 2 && vedioLimit<3"
        ref="myVideo"
        accept=".MP4, .mp4"
        :limit="3"
        :show-file-list="false"
        :action="uploadPath"
        :headers="headers"
        :on-exceed="handleExceed"
        :on-remove="handleRemove"
        :on-change="handleChange"
        :auto-upload="false"
      >
        <span
          v-loading="uploadLoading"
          element-loading-text="上传中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          class="icon-box"
        >
          <i class="el-icon-plus upload-icon"></i>
        </span>
      </el-upload>
    </ul>

    <!-- 选择封面 start-->
    <el-dialog
      title="选择封面"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :append-to-body="true"
      :visible.sync="isShowCover"
      center
    >
      <el-upload
        class="avatar-uploader"
        :headers="headers"
        :action="uploadPath"
        list-type="picture-card"
        :show-file-list="false"
        accept="image/*"
        :on-success="uploadCover"
      >
        <img v-if="imgUrl" :src="imgUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCover">取消</el-button>
        <el-button type="danger" :disabled="loading" :loading="isLoading" @click="onConfirmCover">确定</el-button>
      </span>
    </el-dialog>
    <!-- 选择封面 end-->

    <!-- 预览图片 start -->
    <el-dialog :visible.sync="dialogVisible" width="550px" center>
      <img :src="fileUrl" width="500px" v-if="type === 1" />
      <video :src="fileUrl" width="500px" controls="controls" v-if="type === 2" />
    </el-dialog>
    <!-- 预览图片 end -->
  </div>
</template>

<script>
import { getToken, removeToken } from "@/utils/auth";
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    typeInfo: {
      type: Number,
      default: 0,
    },
    vedioLimit: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      uploadPath: "http://test72.qtopay.cn/beemall-services/uploadPic",

      type: 1, //预览图片

      uploadLoading: false, //上传中

      imgUrl: "",
      file: "",

      isShowCover: false,
      loading: false,
      isLoading: false,
      loadings: "",
      fileUrl: "",
      dialogVisible: false,

      isShowPopup: -1,
      fileList: [],

      upFileType: true, // 上传文件类型 默认 true  图片
    };
  },
  computed: {
    headers() {
      return {
        "Admin-Token": getToken(),
      };
    },
  },
  methods: {
    // 预览文件
    onPreview(item) {
      this.type = 1;
      this.fileUrl = item.image;
      this.dialogVisible = true;
    },

    onPlay(item) {
      this.type = 2;
      this.fileUrl = item.video;
      this.dialogVisible = true;
    },
    handleRemove(files, fileList) {
      //		this.$refs['myVideo'].clearFiles();
    },
    // 删除文件
    onRemove(item, index) {
      this.fileList.splice(index, 1);
    },
    progress() {
      this.loadings = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
    uploadPicUrl(response) {
      console.log(response);
      this.setFileList(response);
      this.loadings.close();
      //   this.imgUrl = response.data.url;
      //   this.$emit('change', this.imgUrl);
      //  this.loading.close();
    },
    // 上传选择限制
    handleExceed(files, fileList) {
      this.$message.error("上传文件个数超出限制!最多上传3个文件!");
    },

    // 上传之前
    beforeUpload(file) {
      let _this = this;
      return new Promise((resolve, reject) => {
        let imgType = ["jpg", "jpeg", "png", "gif"];
        if (
          RegExp(".(" + imgType.join("|") + ")$", "i").test(
            file.name.toLowerCase()
          )
        ) {
          _this.upFileType = true;
          if (file.size > 5 * 1024 * 1024) {
            return reject("上传图片大小不能超过5M!");
          }
        }

        let videoType = [
          "avi",
          "wmv",
          "mkv",
          "mp4",
          "mov",
          "rm",
          "3gp",
          "flv",
          "mpg",
          "rmvb",
        ];
        if (
          RegExp(".(" + videoType.join("|") + ")$", "i").test(
            file.name.toLowerCase()
          )
        ) {
          _this.upFileType = false;
          if (file.size > 50 * 1024 * 1024) {
            return reject("上传视频大小不能超过50M!");
          }
        }
        if (this.fileList.length >= 10) {
          return reject("上传文件个数超出限制!最多上传10张图片!");
        }
        resolve("符合表單規則");
      });
    },
    beforeupsloads() {
      if (this.fileList.length >= 10) {
        this.$message.error("上传文件个数超出限制!最多上传10个图片!");
        return false;
      }
    },
    // 上传改变
    async handleChange(file, fileList) {
      try {
        await this.beforeUpload(file);
        this.file = file.raw;

        let videoType = [
          "avi",
          "wmv",
          "mkv",
          "mp4",
          "mov",
          "rm",
          "3gp",
          "flv",
          "mpg",
          "rmvb",
        ];
        if (
          RegExp(".(" + videoType.join("|") + ")$", "i").test(
            file.name.toLowerCase()
          )
        ) {
          return (this.isShowCover = true);
        } else {
          await this.uploadApi();
        }
      } catch (e) {
        this.$message.error(e);
      }
    },

    // 上传视频封面
    uploadCover(response) {
      this.imgUrl = response.data.url;
    },

    // 关闭上传视频封面
    cancelCover() {
      this.isShowCover = false;
      this.imgUrl = "";
    },

    // 确定视频封面
    async onConfirmCover() {
      this.loading = true;
      await this.uploadApi();
      this.loading = false;

      this.cancelCover();
    },

    // 上传接口
    async uploadApi() {
      this.uploadLoading = true;
      try {
        const formData = new FormData();
        formData.append("file", this.file);
        const res = await createStorage(formData);

        this.setFileList(res);

        this.uploadLoading = false;
      } catch (e) {
        this.uploadLoading = false;
        this.$message.warning(JSON.stringify(e));
      }
    },

    // 设置列表
    setFileList(res) {
      let file = {};
      if (this.imgUrl) {
        file.image = this.imgUrl;
        file.video = res.data.url;
      } else {
        file.image = res.data.url;
      }

      file.type = res.data.type;

      this.fileList.push(file);

      this.$emit("change", this.fileList, this.upFileType);
    },
  },
  watch: {
    data() {
      this.fileList = this.data;
      // if (this.data && this.data.length) {
      //   for (let item of this.data) {
      //     if (item) {
      //       (typeof item === 'string') && (item = JSON.parse(item))
      //       this.fileList.push(item)
      //     }
      //   }
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar-uploader {
  text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 146px;
  height: 146px;
  line-height: 146px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}

.icon-box {
  width: 100%;
  height: 100%;
  display: block;
  line-height: 30px;
  .upload-icon {
    width: 146px;
    height: 146px;
    line-height: 146px;
  }
}

.file-ul {
  display: flex;
  flex-flow: row wrap;
  margin: 0;
  padding: 0;
  .file-ul-li {
    position: relative;
    width: 146px;
    height: 146px;
    display: block;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    overflow: hidden;
    margin: 0 8px 8px 0;
  }
  .file-ul-li-img {
    width: 100%;
    height: 100%;
  }
  .file-ul-li-popup {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: #fff;
    font-size: 20px;
    border-radius: 6px;
    i {
      width: 30%;
      text-align: center;
      padding: 0 5%;
    }
  }
}
</style>