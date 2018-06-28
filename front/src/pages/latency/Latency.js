import React from 'react';
import './latency.css';
import echarts from 'echarts';
import axios from '../../axios'

class Latency extends React.Component {
  constructor(props) {
		super(props);
		this.run = this.run.bind(this)
		this.state = {
			button: "开始",
			now: 0,
			average: 0
		};
    this.timer = "";
    this.stop = false;
    this.now = 0;
		this.average = 0;
		this.realAverage = 0;
    this.length = 0;
	}
	
	componentWillMount() {
		if (!Date.now) {
      Date.now = function now() {
        return new Date().getTime();
      };
		}
		const data = []
		const now = []
		const average = []
		for(let i=0;i<10;i++){
			data.push(' ')
			now.push(0)
			average.push(0)
		}
    this.option = {
      title: {
        text: 'Latency Test',
        subtext: '延迟测试'
      },
      tooltip: {
          trigger: 'axis'
      },
      legend: {
          data:['实时值','平均值']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
              yAxisIndex: 'none'
          },
          dataView: {readOnly: false},
          magicType: {type: ['line', 'bar']},
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        data,
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}ms'
        }
      },
      series: [
        {
          data: now,
          type: 'line',
          smooth: true,
          name:'实时值',
          label: {
            normal: {
              show: true,
              position: 'outside',
              formatter: '{c}ms'
            }
          }
        },
        {
          data: average,
          type: 'line',
          smooth: true,
          name:'平均值',
          label: {
            normal: {
              show: true,
              position: 'outside',
              formatter: '{c}ms'
            }
          }
        }
      ],
      animationDuration: 1000,
      animationDurationUpdate: 1000,
      animationEasing:'cubicIn'
    }
	}

	componentDidMount() {
    const myChart = echarts.init(document.getElementById('myChart'));
    myChart.setOption(this.option);
    this.myChart = myChart
  }

  componentWillUnmount() {
		if (this.timer) {
			clearTimeout(this.timer);
		}
  }

  render() {
    return (
			<section>
				<div className="card">
					<div id="myChart" style={{
						width: '100%',
						height:'400px'
					}}></div>
					<div className="table">
						<div>
							<div>当前值</div>
							<div>平均值</div>
						</div>
						<div>
							<div>{this.state.now}</div>
							<div>{this.state.average}</div>
						</div>
					</div>
					<div style={{marginTop: '30px'}}>
							<button onClick={this.change} style={{marginRight: '30px'}}>{this.state.button}</button>
							<button onClick={this.clear}>清空</button>
					</div>
				</div>
			</section>
    );
	}
	
	change = () =>{
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = "";
			this.setState({
				button: "开始"
			})
			this.stop = true;
			return;
		}
		this.stop = false;
		this.setState({
			button: "停止"
		})
		this.run();
	}

	clear = () => {
		this.stop = true;
		this.length = 0;
		this.setState({
			button: "开始",
			average: 0,
			now: 0
		})
		const data = []
		const now = []
		const average = []
		for(let i=0;i<10;i++){
			data.push(' ')
			now.push(0)
			average.push(0)
		}
		this.option.xAxis.data = data
		this.option.series[0].data = now
		this.option.series[1].data = average
		this.myChart.setOption(this.option);
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = "";
		}
	}

	async run() {
		if(this.stop) return;
		const start = Date.now();
		let res = await axios.get("api/latency");
		const end = Date.now();
		if (res.status !== 200) {
			alert('网络异常')
			this.setState({
				button: "开始"
			})
			this.stop = true;
			return
		}
		this.now = end - start;
		this.realAverage = (this.realAverage*this.length + this.now) / (++this.length)
		this.average = Math.round(this.realAverage);
		console.log(this.realAverage)
		const now = this.now + "ms";
		const average = this.average + "ms";
		this.setState({
			now,
			average
		})
		this.option.xAxis.data.shift()
		const date = new Date()
		const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
		this.option.xAxis.data.push(time)
		this.option.series[0].data.shift()
		this.option.series[1].data.shift()
		this.option.series[0].data.push(this.now)
		this.option.series[1].data.push(this.average)
		this.myChart.setOption(this.option);
		if (!this.stop) {
			this.timer = setTimeout(this.run, 1000);
		}
	}
}

export default Latency