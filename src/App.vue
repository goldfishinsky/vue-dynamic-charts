<template>
  <div id="app">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <DynamicCharts
    :showStartButton="true"
    :startButtonText="'开始'"
    :barGapSize="10"
    :barHeight="30"
    :data="data"
    :iterationTimeout="1000"
    :showTitle="true"
    :startRunningTimeout="2500"
    />
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import helpers from "./mock/helpers";
import mocks from "./mock/mocks";
import DynamicCharts from './DynamicCharts/index'
export default {
  name: 'app',
  components: {
    // HelloWorld,
    DynamicCharts
  },
  computed: {
    data() {
      return helpers.generateData(100, mocks.defaultChart, {
        prefix: "Iteration"
      });
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
