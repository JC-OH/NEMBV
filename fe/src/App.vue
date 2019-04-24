<template>
  <div id="app">
    <!-- <img src="./assets/logo.png">-->
    <b-container fluid class="px-0">
      <!-- b-container fluid는 고정폭이아닌 유동 폭을 쓰겠다는 것이다. -->
      <router-view></router-view>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
