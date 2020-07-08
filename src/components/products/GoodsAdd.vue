<template>
<div id="goods-add">
  <!-- steps -->
  <el-steps :active="active" finish-status="success">
    <el-step title="步骤 1" description="基本信息"></el-step>
    <el-step title="步骤 2" description="商品图片"></el-step>
    <el-step title="步骤 3" description="商品内容"></el-step>
  </el-steps>
  <!-- Tab -->
  <el-tabs v-model="activeName" :tab-position="tabPosition" @tab-click="handleClick">
    <el-tab-pane label="基本信息" name='0'>
      <el-form status-icon ref="goodsInfoForm" :rules='rules' :model="goodsInfoForm" label-width="80px">
        <el-form-item label="商品名称" prop='goods_name'>
          <el-input v-model="goodsInfoForm.goods_name" placeholder='请输入商品名称'></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="goodsInfoForm.goods_price" placeholder='请输入商品价格'></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="goodsInfoForm.goods_weight" placeholder='请输入商品重量'></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input v-model="goodsInfoForm.goods_number" placeholder='请输入商品数量'></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-cascader
            :options="options"
            :props='props'
            v-model="goodsInfoForm.goods_cat"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <el-button @click='next' type='primary'>下一步</el-button>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name='1'>
      <el-upload
        name='file'
        :headers = 'header'
        action="http://localhost:8888/api/private/v1/upload"
        :on-success='handleSuccess'
        multiple
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <el-button @click='next' type='primary'>下一步</el-button>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name='2'>
      <quill-editor></quill-editor>
      <el-button @click='addGoods'>添加</el-button>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
export default {
  data () {
    return {
      tabPosition: 'left',
      active: 0,
      activeName: '',
      goodsInfoForm: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: []
      },
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: ['blur', 'change'] }
        ]
      },
      options: [],
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      dialogImageUrl: '',
      dialogVisible: false,
      header: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  created () {
    this.getGoodsCategory()
  },
  methods: {
    next () {
      if (this.active++ > 2) {
        this.active = 0
      }
      this.activeName = this.active + ''
    },
    handleClick (tab) {
      this.active = +tab.index
    },
    async getGoodsCategory () {
      const { meta, data } = await this.$axios.get('categories', { params: { type: 3 } })
      if (meta.status === 200) {
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleRemove (file) {
      const path = file.data.response.tmp_path
      this.goodsInfoForm.pics = this.goodsInfoForm.pics.filter(item => item.pic !== path)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleSuccess (res) {
      console.log(res)
      const { meta, data } = res
      if (meta.status === 200) {
        this.goodsInfoForm.pics.push({
          pic: data.tmp_path
        })
      } else {
        this.$message.error(meta.msg)
      }
    },
    async addGoods () {
      const { meta } = await this.$axios.post('goods', {
        ...this.goodsInfoForm,
        goods_cat: this.goodsInfoForm.goods_cat.join(',')
      })
      if (meta.status === 201) {
        this.$message.success(meta.msg)
        this.$router.push('/goods')
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#goods-add {
  ::v-deep .ql-editor {
    min-height: 300px;
    background-color: #fff;
  }
}
</style>
