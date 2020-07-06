<template>
<div id="roles">
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 添加角色 -->
  <el-button class="addUser" type='success' plain @click='showAddRoleDialog'>添加角色</el-button>
  <!-- 角色列表 -->
  <el-table ref="roleTable" :data="roleData" highlight-current-row style="width: 100%">
    <el-table-column type="expand">
      <template v-slot:default='{ row }'>
        <p v-if='row.children.length === 0'>暂无权限</p>
        <el-row class='level1' v-for="l1 in row.children" :key='l1.id'>
          <el-col :span='4'><el-tag @close='delRight(row, l1.id)' closable>{{ l1.authName }}</el-tag><i class="el-icon-arrow-right"></i></el-col>
          <el-col :span='20'>
            <el-row class="level2" v-for="l2 in l1.children" :key='l2.id'>
              <el-col :span='4'><el-tag @close='delRight(row, l2.id)' type='success' closable>{{ l2.authName }}</el-tag><i class="el-icon-arrow-right"></i></el-col>
              <el-col :span='20'>
                <el-tag @close='delRight(row, l3.id)' class="level3" v-for="l3 in l2.children" :key='l3.id' type='warning' closable>{{ l3.authName }}</el-tag>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
    <el-table-column label='#' type='index'></el-table-column>
    <el-table-column label='角色名称' property='roleName'></el-table-column>
    <el-table-column label='描述' property='roleDesc'></el-table-column>
    <el-table-column label='操作'>
      <template v-slot:default='{ row }'>
        <el-button type='primary' plain size='mini' icon='el-icon-edit' @click='showEditDialog(row)'></el-button>
        <el-button type='danger' plain size='mini' icon='el-icon-delete' @click='delRole(row.id)'></el-button>
        <el-button type='success' plain size='mini' icon='el-icon-check' @click='showAssignDialog(row.children, row.id)'>分配权限</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分配权限对话框 -->
  <el-dialog
    title="提示"
    :visible.sync="assignRightsDialogVisible"
    width="40%"
    >
    <el-tree
      ref='tree'
      :data="data"
      show-checkbox
      node-key="id"
      default-expand-all
      :props="defaultProps">
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="assignRightsDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click='assignRights'>确 定</el-button>
    </span>
  </el-dialog>
  <!-- 添加角色对话框 -->
  <el-dialog
    title="添加角色"
    :visible.sync="addRoleDialogVisible"
    width="40%"
    @close = 'closeDialog'
    >
    <el-form status-icon :rules="rules" ref="addRoleForm" :model="addRoleForm" label-width="80px">
      <el-form-item label="角色名称" prop='roleName'>
        <el-input v-model="addRoleForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop='roleDesc'>
        <el-input v-model="addRoleForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addRoleDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click='addRole'>确 定</el-button>
    </span>
  </el-dialog>
  <!-- 修改角色对话框 -->
  <el-dialog
    title="修改角色"
    :visible.sync="editRoleDialogVisible"
    width="40%"
    >
    <el-form status-icon :rules="rules" ref="editRoleForm" :model="editRoleForm" label-width="80px">
      <el-form-item label="角色名称" prop='roleName'>
        <el-input v-model="editRoleForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop='roleDesc'>
        <el-input v-model="editRoleForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="editRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click=editRole>确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      roleData: [],
      assignRightsDialogVisible: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      addRoleDialogVisible: false,
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: ['blur', 'change'] }
        ],
        roleDesc: [
          { required: true, message: '角色描述不能为空', trigger: ['blur', 'change'] }
        ]
      },
      roleId: '',
      editRoleDialogVisible: false,
      editRoleForm: {
        roleName: '',
        roleDesc: '',
        id: ''
      }
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const { data, meta } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.roleData = data
        console.log(this.roleData)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async delRole (id) {
      try {
        await this.$confirm('你确定要删除该角色吗？', '温馨提示', { type: 'warning' })
        const res = await this.$axios.delete(`roles/${id}`)
        this.getRoleList()
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    async delRight (row, rightId) {
      const { data, meta } = await this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        row.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async showAssignDialog (children, id) {
      this.roleId = id
      this.assignRightsDialogVisible = true
      const { data, meta } = await this.$axios.get('rights/tree')
      if (meta.status === 200) {
        this.data = data
        const ids = []
        children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              ids.push(l3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(ids)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async assignRights () {
      const id1 = this.$refs.tree.getCheckedKeys()
      const id2 = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...id1, ...id2].join(',')
      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.assignRightsDialogVisible = false
        this.getRoleList()
      } else {
        this.$message.error(meta.msg)
      }
    },
    showAddRoleDialog () {
      this.addRoleDialogVisible = true
    },
    async addRole () {
      try {
        await this.$refs.addRoleForm.validate()
        const { meta } = await this.$axios.post('roles', {
          roleName: this.addRoleForm.roleName,
          roleDesc: this.addRoleForm.roleDesc
        })
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.addRoleDialogVisible = false
          this.getRoleList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 关闭对话框重置
    closeDialog () {
      this.$refs.addRoleForm.resetFields()
    },
    showEditDialog (row) {
      this.editRoleDialogVisible = true
      this.editRoleForm.id = row.id
      this.editRoleForm.roleName = row.roleName
      this.editRoleForm.roleDesc = row.roleDesc
    },
    async editRole () {
      try {
        await this.$refs.editRoleForm.validate()
        const { roleName, roleDesc } = this.editRoleForm
        const { meta } = await this.$axios.put(`roles/${this.editRoleForm.id}`, {
          roleName,
          roleDesc
        })
        if (meta.status === 200) {
          this.editRoleDialogVisible = false
          this.$message.success('操作成功')
          this.getRoleList()
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

<style lang="scss" scoped>
#roles {
  .addUser {
    margin-top: 10px;
  }
  .el-table {
    margin-top: 10px;
  }
  .level1 {
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
  }

  .level2 {
    margin-bottom: 10px;
  }

  .level3 {
    margin-right: 5px;
  }
}
</style>
