<template>
  <div>
    <top></top>
    <b-container fluid>
      <router-view></router-view>
    </b-container>
  </div>
</template>

<script>
  import top from './layout/Top';
  // import left from '../layout/left';
  export default {
    name: 'Index',
    components: {
      top,
      // left,
    },
  };
</script>

<style scoped>
</style>
