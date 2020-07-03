<template>
<div id="login">
  <el-form :model='form' status-icon ref="form" :rules='rules' label-width="80px">
    <img class="avatar" src="../assets/1.jpg" alt="">
    <el-form-item label="用户名" prop='username'>
      <el-input v-model="form.username" @keyup.enter.native='login'></el-input>
    </el-form-item>
    <el-form-item label="密码" prop='password'>
      <el-input v-model="form.password" type='password' @keyup.enter.native='login'></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click='login' class="login-btn" type='primary'>登录</el-button>
      <el-button @click='resetForm'>重置</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '用户名长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '密码长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    resetForm () {
      this.$refs.form.resetFields()
    },
    login () {
      this.$refs.form.validate(isValid => {
        if (!isValid) return
        this.$axios.post('login', this.form).then(res => {
          const { meta } = res
          if (meta.status === 200) {
            this.$message.success(meta.msg)
            const { token } = res.data
            localStorage.setItem('token', token)
            this.$router.push('/index')
          } else {
            this.$message.error(meta.msg)
          }
        })
      })
    }
    // async login () {
    //   await this.$refs.form.validate()
    //   const { meta } = await this.$axios.post('login', this.from)
    //   if (meta.status === 200) {
    //     this.$message.success(meta.msg)
    //     this.$router.push('/index')
    //   } else {
    //     this.$message.error(meta.msg)
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
#login {
  width: 100%;
  height:100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form {
    width: 400px;
    margin: 200px auto;
    background-color: #fff;
    padding: 75px 20px 20px;
    border-radius: 10px;
    position: relative;
    .login-btn {
      margin-right:80px;
    }
    .avatar {
      width:120px;
      height:120px;
      border-radius: 50%;
      border: 3px solid #f99;
      box-sizing: border-box;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -24%
    }
  }
}

</style>
