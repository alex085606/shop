<template>
<div id="app">
  <router-view></router-view>
</div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

<style lang="scss">
$color: teal;
* {
  margin: 0;
  padding: 0;
}
html,
body {
  width:100%;
  height: 100%;
  #app {
    width:100%;
    height: 100%;
    .el-breadcrumb {
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #ccc;
    }
  }
}
</style>
