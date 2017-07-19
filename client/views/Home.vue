<template>
  <div :class="css">
    <div>欢迎使用本系统！</div>
    <div>其他功能还在陆续开发中，敬请期待。。。</div>
  </div>
</template>
<script>
  export default {
    name: 'home',
    data () {
      return {
          css:['page','home']
      }
    },
    created () {
      setTimeout(()=>this.css.push('home2'),10)
    }
  }
</script>
<style>
  .home{position:absolute;text-align:center;top:50%;left: 50%;transform: translate(-50%,-50%) scale(0.1);opacity:0;width:650px;}
  .home2 {transition: all 1.5s ease;opacity: 1;transform: translate(-50%,-50%) scale(1.2);}
</style>
