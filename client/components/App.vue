<template>
  <div id="app">
    <el-menu :default-active="active" class="my-menu" mode="horizontal" router unique-opened>
      <el-menu-item index="/add">新增项目</el-menu-item>
      <el-submenu index="/list">
        <template slot="title">查看项目</template>
        <el-menu-item index="/list/1">进行中</el-menu-item>
        <el-menu-item index="/list/2">已完结</el-menu-item>
      </el-submenu>
    </el-menu>
    <transition name="data" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    computed: {
      active(){
          return this.$route.path
      }
    },
  }
</script>

<style>
  body {margin: 0;font-size: 2rem;font-family: -apple-system, BlinkMacSystemFont,'avenir next', avenir,helvetica, 'helvetica neue',Ubuntu,'segoe ui', arial,sans-serif;}
  .page {padding: 5px}
  .title {text-align: center;padding: 2rem;}
  .data-enter-active, .data-leave {
    transition: all 1s ease;
    opacity: 1;
    transform: scale(1);
  }
  .data-enter, .data-leave-active {
    transition: all 1s ease;
    opacity: 0;
    transform: scale(0.2);
  }
</style>
