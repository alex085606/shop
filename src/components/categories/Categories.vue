<template>
  <div id="categories">
    <!-- 添加分类 -->
    <el-button type='success' plain @click='showAddCategoryDialog'>添加分类</el-button>
    <!-- 商品分类表格 -->
    <el-table
      :data="categoryList"
      row-key="cat_id"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-table-column prop="cat_name" label="分类名称" width='200'></el-table-column>
      <el-table-column label="是否有效">
        <template v-slot:default='{ row }'>
          <span>{{ row.cat_deleted ? '否' : '是' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="排序"></el-table-column>
      <el-table-column label="操作" width="180">
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
    <!-- 添加分类 dialog -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCategoryDialogVisible"
      width="40%"
      @close='handleClose'
      >
      <el-form status-icon :rules='rules' ref="addCategoryForm" :model="addCategoryForm" label-width="80px">
        <el-form-item label="分类名称" prop='cat_name'>
          <el-input placeholder='请输入分类名称' v-model="addCategoryForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader
            :options="options"
            :props="props"
            v-model="addCategoryForm.cat_pid"
            clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='addCategory'>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      categoryList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      loading: false,
      addCategoryDialogVisible: false,
      addCategoryForm: {
        cat_pid: [],
        cat_name: '',
        cat_level: ''
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入活动名称', trigger: ['blur', 'change'] }
        ]
      },
      options: [],
      props: { checkStrictly: true, label: 'cat_name', value: 'cat_id', children: 'children' }
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    async getCategoryList () {
      this.loading = true
      const { data, meta } = await this.$axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.categoryList = data.result
        this.loading = false
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getCategoryList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCategoryList()
    },
    async showAddCategoryDialog () {
      this.addCategoryDialogVisible = true
      const { data, meta } = await this.$axios.get('categories', {
        params: { type: 2 }
      })
      if (meta.status === 200) {
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleClose () {
      this.$refs.addCategoryForm.resetFields()
    },
    async addCategory () {
      try {
        await this.$refs.addCategoryForm.validate()
        const { meta } = await this.$axios.post('categories', {
          cat_pid: this.addCategoryForm.cat_pid[this.addCategoryForm.cat_pid.length - 1] || 0,
          cat_name: this.addCategoryForm.cat_name,
          cat_level: this.addCategoryForm.cat_pid.length
        })
        if (meta.status === 201) {
          this.addCategoryDialogVisible = false
          this.$message.success(meta.msg)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
#categories {
  .el-table {
    margin-top: 10px;
  }
  .el-pagination {
    margin-top: 10px;
  }
}
</style>
