<template>
  <div>
    <el-card class="box-card">
      <el-steps :active="active">
        <el-step
          title="选择楼栋"
          icon="el-icon-edit"
          align-center
        ></el-step>
        <el-step
          title="选择房屋"
          icon="el-icon-upload"
          align-center
        ></el-step>
        <el-step
          title="业主信息"
          icon="el-icon-picture"
          align-center
        ></el-step>
      </el-steps>
    </el-card>

  </div>
</template>

<script>
export default {
    data() {
        return {
            active: 1
        }
    }
}
</script>

<style lang='scss' scoped>
.box-card {
  margin-top: 20px;
  box-sizing: border-box;
  padding-top: 30px;
  margin-bottom: 20px;
}
</style>
