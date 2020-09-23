<template>
  <div>
    <div :id="echarts" style="width: 100%;height:400px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts';
export default {
  name: '',
  components: {},

  data() {
    return {
    };
  },
  computed: {
     echarts() {
      return 'echarts' + Math.random() * 100000
    }
  },
  created() {

  },
  mounted() {},
  methods: {
    drawLine(data, id) {
      var myChart = echarts.init(document.getElementById(this.echarts));
      myChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          // data: ['近七日收益'],
          data: data.data
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '10%',
          containLabel: true
        },

        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          name: data.xname,
          // data: this.getDate(),
          data: data.userActivedata, // 注册人数
          axisLabel: {
            interval: 0, // 横轴信息全部显示
            rotate: -60 // -15度角倾斜显示
          },
          nameTextStyle: {
            fontWeight: 600,
            fontSize: 18
          }
          // numberLogins: [], //登录人数
        },
        yAxis: {
          name: data.yname,
          type: 'value'
        },
        series: data.series,
        noDataLoadingOption: {
          effect: 'bubble',
          text: '暂无数据',
          effectOption: {
            effect: {
              n: 0
            }
          },
          textStyle: {
            fontSize: 32,
            fontWeight: 'bold'
          }
        }
      });
    },
    resize() {
       var myChart = echarts.init(document.getElementById(this.echarts));
       myChart.resize()
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
