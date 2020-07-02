<template>
  <div id="app">
    <vPrinceTab />
  </div>
</template>

<script>
import vPrinceTab from './components/vPrinceTab.vue'

export default {
  name: 'App',
  components: {
    vPrinceTab
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  background-color: rgb(244,244,244);
  padding-bottom: 60px;
}
</style>
