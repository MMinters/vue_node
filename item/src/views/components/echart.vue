<template>
  <div class="box">
    <div class="price-box">
      <div ref="price" style="width:100%; height:500px;"></div>
    </div>
    <div class="price-box num-box">
      <div ref="num" style="width:100%; height:500px;"></div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';
import {formatDate} from "@/utils";

export default {
  name: "Echart",
  data(){
    return {}
  },
  mounted(){
    //随机生成展示数据
    let priceList=[]
    let numList=[];
    // 获取当前日期
    const today = new Date();
    // 循环生成10天的日期
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      priceList.push({ createOrderTime: formatDate(date),price: (Math.random() * (500 - 10 + 1) + 10).toFixed(2) });
      numList.push({ date: formatDate(date,2),sum: Math.floor(Math.random() * (100 - 2 + 1)) + 2 });
    }
    priceList.reverse();numList.reverse();
    this.init({priceList,numList})
  },
  methods:{
    init({priceList,numList}){
      let priceData=priceList.map(t=>t.price);
      let priceTimeData=priceList.map(t=>t.createOrderTime);
      let priceOption = {
        title: { text: "盈 利 金 额", top: 20, left: "center" ,textStyle:{fontSize:30}},
        grid:{
          top:100,
          x: 70,
          x2: 70
        },

        tooltip: {
          trigger: "axis",
          showContent: true,
          backgroundColor: "rgba(1,1,1,0.5)"
        },
        xAxis: {
          type: "category",
          position: 'center',
          data:priceTimeData,
          boundaryGap: true,
          axisLabel:{
            formatter:function(value)  //X轴的内容
            {
              var ret = ""; //拼接加\n返回的类目项
              var max = 10;  //每行显示的文字字数
              var val = value.length;  //X轴内容的文字字数
              var rowN = Math.ceil(val / max);  //需要换的行数
              if(rowN > 1)  //判断 如果字数大于2就换行
              {
                for(var i = 0; i<rowN;i++){
                  var temp = ""; //每次截取的字符串
                  var start = i * max;  //开始截取的位置
                  var end = start + max;  //结束截取的位置
                  temp = value.substring(start,end)+ "\n";
                  ret += temp;  //最终的字符串
                }
                return ret;
              }
              else {return value}
            }
          }
        },
        yAxis: {
          gridIndex: 0 ,
          axisLabel:{
            formatter: '¥ {value}'
          }
        },
        color: [ "#8EDA69", "#3FA768"],
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          }
        ],
        series: [
          {
            type: 'bar',
            showBackground: true,
            barMaxWidth: 50,
            barMinWidth:50,
            data: priceData,
            label:{
              show:true,
              position:"top",
              formatter:'¥ {c}',
              color:'#f00',
              fontSize:16,
              fontWeight:700
            },
            itemStyle: {
              barBorderRadius:[10, 10, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#fd2577' },
                { offset: 0.5, color: '#f683af' },
                { offset: 1, color: '#f8abc1' }
              ]),
              borderRadius: 5
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#fd2577' },
                  { offset: 0.5, color: '#f683af' },
                  { offset: 1, color: '#f8abc1' }
                ])
              }
            }
          },
          {
            type: "line",
            barMaxWidth: "60",
            smooth: true,
            symbol: "none",
            connectNulls: false,
            data: priceData,
            lineStyle: {
              width: 3,
              color: "#fff"
            },
            tooltip:{
              show:false
            },
            z: 0,
            areaStyle: {
              opacity: 0.5,
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgb(248,233,239)" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgb(250,147,200)" // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            }
          },
        ]
      };
      let echartsPrice = echarts.init(this.$refs.price);
      //数据大于100条 设置缩放
      if(priceList.length>100) priceOption.dataZoom[0].start=90;
      echartsPrice.setOption(priceOption);


      let numData=numList.map(t=>t.sum);
      let numTimeData=numList.map(t=>t.date);
      let numOption = {
        title: { text: "访 客 统 计", top: 20, left: "center" ,textStyle:{fontSize:30}},
        grid:{
          top:100,
          x: 70,
          x2: 70
        },

        tooltip: {
          trigger: "axis",
          showContent: true,
          backgroundColor: "rgba(1,1,1,0.5)"
        },
        xAxis: {
          type: "category",
          position: 'center',
          data:numTimeData,
          boundaryGap: true,
          axisLabel:{
            formatter:function(value)  //X轴的内容
            {
              var ret = ""; //拼接加\n返回的类目项
              var max = 10;  //每行显示的文字字数
              var val = value.length;  //X轴内容的文字字数
              var rowN = Math.ceil(val / max);  //需要换的行数
              if(rowN > 1)  //判断 如果字数大于2就换行
              {
                for(var i = 0; i<rowN;i++){
                  var temp = ""; //每次截取的字符串
                  var start = i * max;  //开始截取的位置
                  var end = start + max;  //结束截取的位置
                  temp = value.substring(start,end)+ "\n";
                  ret += temp;  //最终的字符串
                }
                return ret;
              }
              else {return value}
            }
          }
        },
        yAxis: {
          gridIndex: 0 ,
          axisLabel:{
            formatter: '{value}'
          }
        },
        dataZoom: [
          {
            type: 'inside',
          }
        ],
        series: [
          {
            type: 'line',
            showBackground: true,
            barMaxWidth: 50,
            barMinWidth:50,
            data: numData,
            label:{
              show:true,
              position:"top",
              formatter:'{c}',
              color:'#00778a',
              fontSize:16,
              fontWeight:700
            },
            itemStyle: {
              normal: {
                borderWidth: 6,
                borderColor: "#07c8ea",
                lineStyle: { color: "#07c8ea", width: 3 }
              }
            },
            areaStyle: {
              normal: {// 渐变填充色（线条下半部分）
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#07c8ea" },
                  { offset: 1, color: "#07c8ea00" }
                ])
              }
            }
          }
        ]
      };
      let echartsNum = echarts.init(this.$refs.num);
      echartsNum.setOption(numOption);
      window.addEventListener("resize", function() {
        echartsPrice.resize();
        echartsNum.resize();
      });
    },
  }
}
</script>

<style scoped lang="scss">
.price-box{
  box-shadow: 0 0 6px #ff7171;
  border-radius: 10px;
  position: relative;
}
.num-box{
  box-shadow: 0 0 6px #a1a1a1;
  margin-top: 30px;
  .price-num{
    right: 50px;
  }
  span{
    color: #07c8ea !important;
  }
}
</style>