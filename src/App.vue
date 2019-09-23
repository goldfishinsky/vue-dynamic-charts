<template>
  <div id="app" >
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <div id="main" style="width: 600px;height:400px;">
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import * as echarts from 'echarts';
export default {
  name: 'app',
  created() {
    // 基于准备好的dom，初始化echarts实例
    console.log(echarts)
    var myChart = echarts.init(document.getElementById('main'));
    // 绘制图表
    myChart.setOption({
          title: {
              text: 'ECharts 入门示例'
          },
          tooltip: {},
          xAxis: {
              data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
          },
          yAxis: {},
          series: [{
              name: '销量',
              type: 'bar',
              data: [5, 20, 36, 10, 10, 20]
          }]
      });
    }
}
</script>

<style lang="scss">
#app {
  // font-family: 'Avenir', Helvetica, Arial, sans-serif;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  // color: #2c3e50;
  // margin-top: 60px;
}
</style>
