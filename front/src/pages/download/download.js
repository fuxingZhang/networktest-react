import React from 'react';
import './download.css';
import echarts from 'echarts';
import axios from 'axios'

class download extends React.Component {
  constructor(props) {
		super(props);
		this.run = this.run.bind(this)
		this.state = {
			button: "开始",
			now: 0,
			average: 0
		};
    this.running = false;
    this.now = 0;
		this.average = 0;
		this.realAverage = 0;
    this.length = 0;
		this.myChart = null;
    this.request = null;
    this.CancelToken = null;
		this.start = 0;
		this.source = null;
    this.axios = axios;
	}
	
	componentWillMount() {
		if (!Date.now) {
      Date.now = function now() {
        return new Date().getTime();
      };
		}
    this.option = {
      title: {
        text: 'DownLoad Test',
        subtext: '下载测试'
      },
      tooltip : {
          formatter: "{a} <br/>{b} : {c}%"
      },
      toolbox: {
          feature: {
              restore: {},
              saveAsImage: {}
          }
      },
      series: [
        {
          name: '实时速率',
          type: 'gauge',
          z: 3,
          min: 0,
          max: 2000,
          center: ['25%', '55%'],    // 默认全局居中
          detail: {formatter:'{value}kb/s'},
          data: [{value: 0, name: '实时速率'}]
        },
        {
          name: '平均速率',
          type: 'gauge',
          z: 3,
          min: 0,
          max: 2000,
          center: ['75%', '55%'],    // 默认全局居中
          detail: {formatter:'{value}kb/s'},
          data: [{value: 0, name: '平均速率'}]
        }
      ]
    }
    this.CancelToken = this.axios.CancelToken;
    this.init()
	}

	componentDidMount() {
    const myChart = echarts.init(document.getElementById('myChart'));
    myChart.setOption(this.option);
    this.myChart = myChart
  }

  componentWillUnmount() {

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
    if (this.running) {
			this.setState({
				button: "开始"
			})
      this.running = false;
      this.source.cancel('Operation canceled by the user.');
      this.source = null
      return;
    }
    this.running = true;
		this.setState({
			button: "停止"
		})
    this.run();
	}

	clear = () => {
    if(this.source) {
      this.source.cancel('Operation canceled by the user.');
      this.source = null
    }
		this.setState({
			button: "开始",
			average: 0,
			now: 0
		})
    this.running = false;
    this.length = 0;
    this.option.series[0].data[0].value = 0
    this.option.series[1].data[0].value = 0
    this.myChart.setOption(this.option);
	}

	async run() {
    this.start = Date.now();
    this.source = this.CancelToken.source();
    let res = await this.request.get("api/download",{
      cancelToken: this.source.token
    });
    const end = Date.now();
    console.log(res);
  	this.setState({
			button: "开始"
		})
    this.source = null;
    this.running = false;
    if (res.status != 200) {
      alert('网络异常')
    }
	}

	init = () => {

    const Util = {
      //host: 'http://' + window.location.host
      host: 'http://localhost:8200'
    }
    const request = this.axios.create({
      baseURL: Util.host,
      // timeout: 10000,
      validateStatus: function (status) {
        return status < 600; 
      },
      onUploadProgress: progressEvent => {
        console.log(progressEvent)
        console.log(progressEvent.loaded)
      },
      onDownloadProgress: progressEvent => {
        console.log(progressEvent)
        console.log(progressEvent.loaded/(10*1024*1024))
        const end = Date.now();
        const ms = end - this.start;
        this.now = Math.round(progressEvent.loaded*1000/1024/ms);
				this.realAverage = (this.realAverage*this.length + this.now) / (++this.length)
				this.average = Math.round(this.realAverage);
				console.log(this.realAverage)
        const now = this.now + "kb/s";
        const average = this.average + "kb/s";
				this.setState({
					now,
					average
				})
        this.option.series[0].data[0].value = this.now
        this.option.series[1].data[0].value = this.average
        this.myChart.setOption(this.option);
      },
    })
    request.interceptors.response.use((response) => {
      return response
    }, (error) => {
      return Promise.reject(error)
    })
    this.request = request
  }
}

export default download