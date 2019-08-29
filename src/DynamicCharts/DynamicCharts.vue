<template>
    <div class="live-chart">
        <div>
            <h1 v-if="showTitle" >{{currentItem.name}}</h1>
            <!-- 开始按钮 -->
            <button v-if="showStartButton"
                    class="start-button"
                    @click="()=>{isClicked = true}">
                {{startButtonText}}
            </button>
            <section>
                <div v-if="hasBaseline" class="baseline"><span>{{baseline}}</span></div>
                <div class="chart-bars">

                    <!-- 单个bar样式 -->
                    <div v-for="(key, index) in sortedValueKeys" 
                         class="bar-wrapper"
                         :style="{transform: translateY((barHeight + barGapSize) * index),transitionDuration: iterationTimeout / 1000 - 0.1 }" 
                         :key="`bar${key}`">
                         <!-- bar前的标志（图标或字体） -->
                        <label :style="labelStyles">{{currentValues[key].label ? currentValues[key].label : key}}</label>
                        <!-- bar -->
                        <div class="bar" :style="{ height: barHeight + 'px', width: getBarWidth(key), background: typeof currentValues[key].color === 'string' ? currentValues[key].color : `linear-gradient(to right, ${currentValues[key].color.join(',')})` }" />
                        <!--value -->
                        <span class="value" :style="{color: typeof currentValues[key].color === 'string' ? currentValues[key].color : currentValues[key].color[0] }">
                            {{currentValues[key].value}}
                        </span>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<style>

</style>

<script>
import './style.scss';
export default {
    name: 'DynamicCharts',
    props:{
        
        //是否自动开始
        startAutomatically: {
            type: Boolean,
            default: true
        },
        showTitle: {
            type: Boolean,
            default: true
        },
        showStartButton: {
            type: Boolean,
            default: true
        },

        //循环间的间隔时间
        iterationTimeout: {type:Number,default:0},

        //数据源
        data: {
            type: Array,
            default: ()=> []
        },

        //开始前的等待时长
        startRunningTimeout: {
            type: Number,
            default: 0
        },
        barHeight: {
            type: Number,
            default: 20 
        },
        barGapSize: {
            type: Number,
            default: 10
        },
        
        //基准值，防止负值情况出现
        baseline: {
            type: Number,
            default: 0
            },
        startButtonText: {
            type: String,
            default: 'start'
        },

        //自定义样式
        mainWrapperStyles: {
            type: Object,
            default:  ()=> {}
        },
        chartWrapperStyles: {
            type: Object,
            default:  ()=> {}
        },
        baselineStyles: {
            type: Object,
            default:  ()=> {}
        },
        iterationTitleStyles: {
            type: Object,
            'default': function (){
                return {};
                }
            },
        labelStyles: {
            type: Object,
            default:  ()=> {}
        },
        startButtonStyles: {
            type: Object,
            default:  ()=> {}
        },

        //开始与结束的回调函数
        onRunStart: {
            type:Function, 
            'default':()=>{}
        },
        onRunEnd: {
            type:Function, 
            'default':()=>{}
        }
    },
    data() {
        return {
            //state
            // data: [], //数据源
            activeItemIdx: 0, //第几帧
            nextValues: {}, //下一帧数据
            highestValue: 0, //榜首数据
            currentValues: {}, //经过处理后用于渲染的数据数组 
            firstRun: false, //是否是初始渲染
            isClicked: false, //
            iterationTimeoutHolder: null
        }
    },
    computed: {

        //根据最大值生成每帧数据的bar width


        //对当前帧排序后的数据
        sortedValueKeys() {

            /**
             * 对keys进行排序防止对象直接赋值产生的浅拷贝问题，sort方法会改变原数组，
             * 所以不能直接对this.currentValues进行操作
             */
            let keys = Object.keys(this.currentValues);
            let sorts =  keys.sort((a,b) => this.currentValues[b].value - this.currentValues[a].value);
            // eslint-disable-next-line
            console.log('sorts',sorts)
            return sorts
        },

        //当前项目
        currentItem() {
            return this.data[this.activeItemIdx - 1] || {name: '空项目'};
        },

        //判断是否有基准值
        hasBaseline() {
           return this.baseline && !isNaN(this.baseline);
        },
        trans() {
            return 'transform 0.8s linear'
        }
        
    },
    watch: {
        isClicked (value) {
            if (value) {
                this.setNextValues();
            }
        },
        data () {
            this.emitDymatic();
        },
        activeItemIdx() {
            this.iterationTimeoutHolder = window.setTimeout(this.setNextValues,1000)
        }
    },
    mounted() {
        this.init();
    },
    beforeDestroy() {
        window.clearTimeout(this.iterationTimeoutHolder);
    },
    methods: {
        
        init() {

            //触发动态
            this.emitDymatic();

            this.setNextValues();
        },

        //触发动态
        emitDymatic() {
            if (this.startAutomatically) {
                this.start();
            } else {
                this.setNextValues();
            }
        },
        //设置触发动态间隔
        // setTimeBetweenStart() {
        //     // if (this.startAutomatically) {
        //          setTimeout(
        //                 //第一次运行增加启动延时，其余都帧数间隔
        //                 // this.setNextValues(), this.firstRun ? this.startRunningTimeout : this.iterationTimeout
        //                 this.setNextValues(), 2000
        //             );
        //     // } else {

        //     // }
        // },

        start() {

            //不是第一帧的话，直接return
            if (this.activeItemIdx > 1) {
                return;
            }

            //如果有起始回调，执行回调
            if (this.onRunStart) {
                this.onRunStart();
            }
            this.firstRun = true;
            this.setNextValues();
        },

        //更新下一组数据
        setNextValues() {
            // eslint-disable-next-line
            console.log('当前数据',this.currentValues)
            // eslint-disable-next-line
            console.log('最大值',this.highestValue)
            // eslint-disable-next-line
            console.log('帧数',this.activeItemIdx)
            //判断是否遍历结束
            if (this.activeItemIdx === this.data.length) {
                // this.iterationTimeoutHolder = null;

                //执行结束回调
                if (this.onRunEnd) {
                    this.onRunEnd();
                }
                return;
            }

            //当前帧的数据
            const roundData =this.data[this.activeItemIdx].values;
            const nextValues = {};
            let highestValue = 0;

            //对color值进行处理
            roundData.map((r) => {
                
                //更新最大值
                if (Math.abs(r.value) > highestValue) {
                    highestValue = r.value;
                }
                
                //根据ID标识生成对应的nextValue
                nextValues[r.id] = {
                    ...r,
                    //确定color优先级(设置值>上一次使用值>随机生成值)
                    color: r.color || (this.currentValues[r.id] || {}).color || this.getRandomColor()
                }
                //返回值为roundData自身，对应map操作方法
                return r;
            })

            //更新对应值
            this.currentValues = nextValues;
            this.highestValue = highestValue;
            this.activeItemIdx = this.activeItemIdx + 1;
        },

        //随机生成颜色值
        getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },

        translateY(value) {
            return `translateY(${value}px)`;
        },
        //生成最大值与当前数据值比例生成bar宽度
        getBarWidth(key) {
            return Math.abs(this.currentValues[key].value / this.highestValue) * 0.8 * 100 + '%';
        }
        //TODO 用户可设置主题色改变主题
    }
}
</script>