<template>
  <div id="app">
    <recorder-menu></recorder-menu>
    <router-view></router-view>
  </div>
</template>

<script>
import RecorderMenu from './components/Menu';

export default {
  name: 'App',
  components: { RecorderMenu }
}
</script>

<style lang="less">
html {
  position: relative;

  #app {
    padding-top: 30px;
  }
}

::-webkit-scrollbar{
  width:8px;
  height:8px;
  position: absolute;
}

::-webkit-scrollbar-track-piece{
  background-color: #000;
  border-radius:0;
}

::-webkit-scrollbar-thumb{
  height:50px;
  background-color:#999;
  border-radius:4px;
  outline:2px solid #fff;
  outline-offset:-2px;
  border: 2px solid #fff;
}
::-webkit-scrollbar-thumb:hover{
  height:50px;
  background-color:#9f9f9f;
  border-radius:4px;
}
</style>

