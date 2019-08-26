// DynamicCharts 是对应组件的名字，要记得在 DynamicCharts.vue 文件中还是 name 属性哦
import DynamicCharts from './DynamicCharts';

DynamicCharts.install = Vue => Vue.component(DynamicCharts.name, DynamicCharts);

export default DynamicCharts;