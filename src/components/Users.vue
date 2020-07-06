<template>
  <div id="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input v-model='query' placeholder="请输入搜索关键字" class="input-with-select">
    <el-button @click='searchUser' slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-button class="addUser" type='success' plain @click='showAddUserDialog'>添加用户</el-button>
    <!-- table -->
    <el-table
      :data="userList"
      style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
      <el-table-column label="用户状态" width="180">
        <template v-slot:default='{ row }'>
          <el-switch
            @change='changeState(row.id, row.mg_state)'
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot:default='{ row }'>
          <el-button type='primary' size='mini' plain icon='el-icon-edit' @click='showEditUserDialog(row)'></el-button>
          <el-button type='danger' size='mini' plain icon='el-icon-delete' @click='delUser(row.id)'></el-button>
          <el-button type='success' size='mini' plain icon='el-icon-check' @click='showAssignRoleDialog(row)'>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8,10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加用户 Dialog -->
    <el-dialog
      @close = 'closeDialog'
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="40%"
      >
      <el-form status-icon :rules='rules' ref="adduserForm" :model="addForm" label-width="100px">
        <el-form-item label="用户名" prop='username'>
          <el-input placeholder='请输入用户名' v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop='password'>
          <el-input placeholder='请输入密码' type='password' v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop='email'>
          <el-input placeholder='请输入邮箱' v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop='mobile'>
          <el-input placeholder='请输入手机号' v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='addUser'>确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editUserDialogVisible"
      width="40%"
      >
      <el-form ref='editUserForm' status-icon label-width='80px' :rules='rules' :model='editForm'>
        <el-form-item label='用户名'>
          <el-tag type='info'>{{ editForm.username }}</el-tag>
        </el-form-item>
        <el-form-item label='邮箱' prop='email'>
          <el-input placeholder='请输入邮箱' v-model='editForm.email'></el-input>
        </el-form-item>
        <el-form-item label='手机' prop='mobile'>
          <el-input placeholder='请输入手机号' v-model='editForm.mobile'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='editUser(editForm.id)'>确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="assignRoleDialogVisible"
      width="40%"
      >
      <el-form ref="assignRoleForm" :model="assignRoleForm" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type='info'>{{ assignRoleForm.username }}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="assignRoleForm.rid" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='assignRole'>分 配</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  created () {
    this.getUserList()
  },
  data () {
    return {
      addUserDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editUserDialogVisible: false,
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      userList: [],
      total: 0,
      query: '',
      pagenum: 1,
      pagesize: 2,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '用户名长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '密码长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ]
      },
      assignRoleDialogVisible: false,
      assignRoleForm: {
        id: '',
        rid: '',
        username: ''
      },
      roleList: []
    }
  },
  methods: {
    async getUserList () {
      const { data, meta } = await this.$axios.get('users', {
        params: { query: this.query, pagenum: this.pagenum, pagesize: this.pagesize }
      })
      if (meta.status === 200) {
        this.userList = data.users
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getUserList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getUserList()
    },
    async delUser (id) {
      try {
        await this.$confirm('你确定要删除该用户吗？', '温馨提示', { type: 'warning' })
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async changeState (id, state) {
      const { meta } = await this.$axios.put(`users/${id}/state/${state}`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    },
    searchUser () {
      this.pagenum = 1
      this.getUserList()
    },
    showAddUserDialog () {
      this.addUserDialogVisible = true
    },
    async addUser () {
      try {
        await this.$refs.adduserForm.validate()
        const { meta } = await this.$axios.post('users', this.addForm)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.addUserDialogVisible = false
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    closeDialog () {
      this.$refs.adduserForm.resetFields()
    },
    showEditUserDialog (row) {
      this.editUserDialogVisible = true
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
    },
    async editUser (id) {
      try {
        await this.$refs.editUserForm.validate()
        const { id, email, mobile } = this.editForm
        const { meta } = await this.$axios.put(`users/${id}`, { email, mobile })
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.editUserDialogVisible = false
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async showAssignRoleDialog (row) {
      this.assignRoleDialogVisible = true
      this.assignRoleForm.username = row.username
      this.assignRoleForm.id = row.id
      const rs = await this.$axios.get(`users/${row.id}`)
      if (rs.meta.status === 200) {
        const rid = rs.data.rid
        this.assignRoleForm.rid = rid === -1 ? '' : rid
      }
      const { data, meta } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.roleList = data
        console.log('roles', this.options)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async assignRole () {
      if (this.assignRoleForm.rid === '') {
        this.$message.error('请选择角色')
        return
      }
      const { meta } = await this.$axios.put(`users/${this.assignRoleForm.id}/role`, { rid: this.assignRoleForm.rid })
      if (meta.status === 200) {
        this.assignRoleDialogVisible = false
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#users {
  .input-with-select {
    margin-top: 10px;
    width: 300px;
  }
  .addUser {
    margin-left: 20px;
  }
  .el-table {
    margin-top: 10px;
  }
  .el-pagination {
    margin-top: 10px;
  }
}
</style>
