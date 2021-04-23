<template>
  <div id="app">
    <a-header></a-header>
    <router-view class="router-view"></router-view>
  </div>
</template>

<script>
import AHeader from '@/components/a-header/a-header';

export default {
  components: {
    AHeader
  }
}
</script>

<style lang="less">
#app {
  position: relative;
  width: 100%;
  height: 100%;

  .router-view {
    width: 100%;
    height: 100%;
  }
}
</style>
