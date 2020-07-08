<template>
<div id="goods">
  <!-- 添加商品 -->
  <el-button type='success' plain @click='goAdd'>添加商品</el-button>
  <!-- 商品列表 -->
  <el-table :data="goodsData" style="width: 100%">
    <el-table-column label="#" type='index' :index='(pagenum -1) * pagesize + 1'></el-table-column>
    <el-table-column prop="goods_name" label="商品名称"></el-table-column>
    <el-table-column prop="goods_price" label="商品价格"></el-table-column>
    <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
    <el-table-column prop="add_time" label="创建时间">
      <template v-slot:default='{ row }'>
        {{ row.add_time | time }}
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template>
        <el-button type='primary' size='mini' icon='el-icon-edit' plain></el-button>
        <el-button type='danger' size='mini' icon='el-icon-delete' plain></el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pagenum"
    :page-sizes="[5, 10, 15, 20]"
    :page-size="pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
  </el-pagination>
</div>
</template>

<script>
export default {
  data () {
    return {
      pagenum: 1,
      pagesize: 5,
      total: 0,
      goodsData: []
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { data, meta } = await this.$axios.get('goods', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.total = data.total
        this.goodsData = data.goods
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getGoodsList()
    },
    goAdd () {
      this.$router.push('/goods-add')
    }
  }
}
</script>

<style lang="scss" scoped>
#goods {
  .el-table {
    margin-top: 10px;
  }
  .el-pagination {
    margin-top: 10px;
  }
}
</style>
