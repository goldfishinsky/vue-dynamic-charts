<template>
    <div>
        <div>{{startButtonText}}</div>
        <div>hello my dymaic charts</div>
        <div>
            <h1 v-if="showTitle">{{currentItem.name}}</h1>
            <section>
                <div v-if="hasBaseline"><span>{{baseline}}</span></div>
                <div>

                    <!-- 单个bar样式 -->
                    <div v-for="(item, index) in sortedCurrentValues" 
                         class="bar-wrapper"
                         :key="index">
                         
                         <!-- bar前的标志（图标或字体） -->
                        <label :style="labelStyles">{{!currentValueData.label ? key : currentValueData.label}}</label>

                        <!-- bar -->
                        <div class="bar" :style="{ height: barHeight, width: widthStr, background: typeof currentValueData.color === 'string' ? currentValueData.color : `linear-gradient(to right, ${currentValueData.color.join(',')})` }" />
                        
                        <!--value -->
                        <span class="value" :style="{color: typeof currentValueData.color === 'string' ? currentValueData.color : currentValueData.color[0] }">
                            {{currentValueData.value}}
                        </span>
                    </div>
                </div>
            </section>

            <!-- 开始按钮 -->
            <button v-if="showStartButton"
                    className="start-button"
                    @click="setisClicked(true)">
                {{startButtonText}}
            </button>
        </div>
    </div>
</template>

<style scoped>

</style>

<script>
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
            currentItem: {
                name: 'titleName'
            },
            hasBaseline: true,
            sortedCurrentValues: [],
            currentValueData: {
                // label: 'test'
            },
            
            //state
            dataQueue: [], //数据源
            activeItemIdx: 0, //第几帧
            nextValues: {}, //下一帧数据
            highestValue: 0, //榜首数据
            currentValues: {}, //经过处理后用于渲染的数据数组 
            firstRun: false, //是否是初始渲染
            isClicked: false, //
            iterationTimeoutHolder: null
        }
    },
    computed() {

    },
    watch: {
        isClicked: (value)=>{
            if (value) {
                this.nextStep();
            }
        },
        dataQueue: ()=>{
            this.emitDymatic();
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
            
            //设置数据源
            this.dataQueue = this.data;
            this.emitDymatic();

            this.setTimeBetweenStart();
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
        setTimeBetweenStart() {
            if (this.startAutomatically) {
                this.iterationTimeoutHolder = window.setTimeout(
                        this.nextStep(), this.firstRun ? this.startRunningTimeout : this.iterationTimeout
                    );
            }
        },

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

            //当前帧的数据
            const roundData =this.dataQueue[this.activeItemIdx];
            const nextValues = {};
            let highestValue = 0;
            //判断是否遍历结束
            if (!roundData) {
                // this.iterationTimeoutHolder = null;

                //执行结束回调
                if (this.onRunEnd) {
                    this.onRunEnd();
                }
                return;
            }

            
            

        },

        //随机生成颜色值
        getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        //TODO 用户可设置主题色改变主题
    }
}
</script>