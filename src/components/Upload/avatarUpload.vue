<template>




  <el-upload
    class="avatar-uploader"
    :headers="headers"
    :action="uploadPath"
    list-type="picture-card"
    :show-file-list="false"
    accept=".jpg, .jpeg, .png, .gif"
    :on-success="uploadPicUrl"
    :before-upload="beforeAvatarUpload"
    :on-progress="progress"
  >

    <img v-if="imgUrl" :src="imgUrl" class="avatar">
    <i v-else class="el-icon-plus "></i>
  </el-upload>
</template>

<script>
import { getToken, removeToken } from '@/utils/auth'
export default {
  props: {
    url: {
      type: String,
      default: '',
    },
    before:null,
  },
  data() {
    return {
      uploadPath: 'http://test72.qtopay.cn/beemall-services/uploadPic',
      imgUrl: '',
      dialogVisible: false,
      loading: ''
    };
  },
  computed: {
    headers() {
      return {
        'Admin-Token': getToken()
      };
    }
  },
  watch: {
    url() {
      this.imgUrl = this.url;
    }
  },
  created() {
    this.imgUrl = this.url;
  },
  methods: {
    uploadPicUrl(response) {
      this.imgUrl = response.data.url;
      this.$emit('change', this.imgUrl);
     this.loading.close();
    },
    progress() {
       this.loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
    },
    beforeAvatarUpload(file) {
      
      if (this.before) {
         const is1M = file.size / 1024 / 1024 < 3; // 限制小于3M
        if (!is1M) {
            this.$message.error('图片尺寸限制最小为375 x 375，大小不可超过3MB，比例为1:1');
            return false;
        } else {
          
            const isSize = new Promise((resolve, reject) => {
                const width = 375;
                const height = 375;
                const _URL = window.URL || window.webkitURL;
                const img = new Image();
                img.onload = () => {
                    const valid = img.width >= width && img.height >= height && img.width === img.height;
                    valid ? resolve() : reject();
                };
                img.src = _URL.createObjectURL(file);
            }).then(
                () => {
                    return file;
                },
                () => {
                    this.$message.error('图片尺寸限制最小为375 x 375，大小不可超过3MB，比例为1:1');
                    return Promise.reject();
                },
            );
            return isSize;
        }
      }else{
        return true;
      }
       

      }
  }
};
</script>

<style scoped>
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
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
}
.avatar {
  width: 146px;
  height: 146px;
  display: block;
}
</style>
