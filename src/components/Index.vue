<template>
  <el-container id="index">
    <el-header>
      <div class="logo"><img src="../assets/logo.png" alt=""></div>
      <div class="title"><h2>电商后台管理系统</h2></div>
      <div class="logout"><span>欢迎光临~</span><a href="javascript:void(0)" @click='logout'>退出</a></div>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <el-menu
          router
          default-active="2"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="roles">
              <i class="el-icon-menu"></i>
              <span slot="title">角色列表</span>
            </el-menu-item>
            <el-menu-item index="rights">
              <i class="el-icon-menu"></i>
              <span slot="title">权限列表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    logout () {
      this.$confirm('你确定要退出吗？', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('退出成功')
        this.$router.push('/login')
      }).catch(() => {
        this.$message('取消退出')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#index {
  height: 100%;
  .el-header {
    background-color: #d8d8d8;
    height: 60px;
    display: flex;
    .logo {
      width: 180px;
      img {
        height: 40px;
        margin: 10px;
      }
    }
    .title {
      flex: 1;
      text-align: center;
      line-height: 60px;
    }
    .logout {
      text-align: right;
      line-height: 60px;
      margin-right: 10px;
      width: 180px;
      a {
        font-size: 16px;
        color: teal;
        font-weight: 700;
        text-decoration: none;
      }
    }
  }
  .aside {
    background-color: #545c64;
    .el-menu {
      border-right: none;
    }
  }
  .main {
    background-color: #ecf0f1;
  }
}
</style>
