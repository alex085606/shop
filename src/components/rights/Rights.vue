<template>
<div id="rights">
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 权限列表 -->
  <el-table
    :data="rightsData"
    highlight-current-row
    style="width: 100%">
    <el-table-column label='#' type="index"></el-table-column>
    <el-table-column property='authName' label='权限名称'></el-table-column>
    <el-table-column property='path' label='路径'></el-table-column>
    <el-table-column property='level' label='层级'>
      <template v-slot:default='{ row }'>
        <span v-if="row.level === '0'">一级</span>
        <span v-if="row.level === '1'">二级</span>
        <span v-if="row.level === '2'">三级</span>
      </template >
    </el-table-column>
  </el-table>
</div>
</template>

<script>
export default {
  data () {
    return {
      rightsData: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      const { data, meta } = await await this.$axios.get('rights/list')
      if (meta.status === 200) {
        this.rightsData = data
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#rights {
  .el-table {
    margin-top: 10px;
  }
}
</style>
