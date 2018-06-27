import React from 'react';
import './upload.css';
import echarts from 'echarts';
import axios from 'axios'

class upload extends React.Component {
  constructor(props) {
		super(props);
		this.run = this.run.bind(this)
		this.state = {
			button: "开始",
			now: 0,
			average: 0,
			iterations: 1,
			duration: 1,
			value: '1024'
		};
    this.axios = axios;
    this.remain = 0;
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
		this.uploadData = null;
    this.uploadData = '';
    this.selectOptions = [
      {
        value: '10',
        label: '10kb'
      },{
        value: '100',
        label: '100kb'
      }, {
        value: '1024',
        label: '1mb'
      }, {
        value: '10240',
        label: '10mb'
      }, {
        value: '102400',
        label: '100mb'
      }
    ];
	}
	
	async componentWillMount() {
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
        text: 'Upload Test',
        subtext: '上传测试'
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
          formatter: '{value}kb/s'
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
              show: false,
              position: 'top',
              formatter: '{c}kb/s'
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
              show: false,
              position: 'bottom',
              formatter: '{c}kb/s'
            }
          }
        }
      ],
      // animationDuration: 1000,
      // animationDurationUpdate: 1000,
      animationEasing:'cubicIn'
    }
    this.CancelToken = this.axios.CancelToken;
    this.init()
    this.source = this.CancelToken.source();
    let res = await this.request.get("api/upload",{
      cancelToken: this.source.token
    });
    this.uploadData = res.data;
    this.source = null
	}

	componentDidMount() {
    const myChart = echarts.init(document.getElementById('myChart'));
    myChart.setOption(this.option);
    this.myChart = myChart
  }

  componentWillUnmount() {
    if(this.source) {
      this.source.cancel('Operation canceled by the user.');
      this.source = null
    }
  }

  render() {
  	const optionList = this.selectOptions.map( item => 
  		<option key={item.value} value={item.value}>{item.label}</option>
  	);

  	const displayFlex = {display: 'flex'};
  	const tableLeft = {
    	width: '160px',
    	textAlign: 'right'
    };
    const tableRight = {
    	flex: '1',
    	textAlign: 'left',
    	paddingLeft: '40px'
    }

    return (
			<section>
				<div className="card">
					<div id="myChart" style={{
						width: '100%',
						height:'400px'
					}}></div>
			    <div style={displayFlex}>
			      <div style={{flex: '1'}}>
			        <div style={displayFlex}>
			          <div style={tableLeft}>文件大小</div>
			          <div style={tableRight}>
			            <select value={this.state.value} style={{width: '84px'}}
			            onChange={e => this.handleChange({value: e.target.value})}>
			              {optionList}
			            </select>
			          </div>
			        </div>
			        <div style={displayFlex}>
			          <div style={tableLeft}>测试次数</div>
			          <div style={tableRight}>
			            <input type="number" min="1" max="100" 
			            value={this.state.iterations} 
			            style={{width: '80px'}}
			            onChange={e => this.handleChange({iterations: e.target.value})}/>
			          </div>
			        </div>
			        <div style={displayFlex}>
			          <div style={tableLeft}>间隔时间</div>
			          <div style={tableRight}>
			            <input type="number" min="0" max="1000" 
			            value={this.state.duration} 
			            style={{width: '80px'}}
			            onChange={e => this.handleChange({duration: e.target.value})}/>
			          </div>
			        </div>
			      </div>
			      <div style={{flex: '1'}}>
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
	
	handleChange = (data) => {
		this.setState(data)
	}

	change = () =>{
    if (this.running) {
			this.setState({
				button: "开始"
			})
      this.running = false;
      this.source.cancel('Operation canceled by the user.');
      return;
    }
    this.running = true;
		this.setState({
			button: "停止"
		})
    this.remain = this.state.iterations;
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
    this.now = 0;
    this.average = 0;
    this.length = 0;
    this.running = false;
    const data = [];
    const now = [];
    const average = [];
    for(let i=0;i<10;i++){
      data.push(' ')
      now.push(0)
      average.push(0)
    }
    this.option.xAxis.data = data
    this.option.series[0].data = now
    this.option.series[1].data = average
    this.myChart.setOption(this.option);
	}

	async run() {
    if(!this.running) return
    let duration = this.state.duration
    const start = Date.now();
    this.start = start
    this.source = this.CancelToken.source();
    let postData = []
    let n = parseInt(this.state.value)
    for(let i=0;i < n; i++){
      postData.push(this.uploadData)
    }
    let data = new FormData()
    let blob = new Blob(postData,{
      type:'application/octet-stream'
    }) //var aBlob = new Blob( array, options );
    // let file = new File([this.uploadData], "file.bin", {
    //   type: 'application/octet-stream',
    // });
    /**
     * The filename reported to the server (a USVString), when a Blob or File is passed as the second parameter. 
     * The default filename for Blob objects is "blob". 
     * The default filename for File objects is the file's filename.
     */
    // data.append('file', blob) 
    data.append('file', blob,'upload.bin') 
    // data.append('file',file) 
    // data.append('file',file,'appendFileName.bin') 
    let res = await this.request.post("api/upload", data,{
      cancelToken: this.source.token
    });
    const end = Date.now();
    console.log(res);
    this.length = 0;
    this.source = null;
    if (res.status !== 200) {
      alert('网络异常')
    }
    this.remain--
    if(this.remain === 0) {
			this.setState({
				button: "开始"
			})
      this.running = false
      return
    }
    setTimeout( () => {
      this.run()
    }, duration*1000)
	}

  init() {
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
        if(!this.running) return
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
        this.option.xAxis.data.shift()
        const date = new Date()
        const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        this.option.xAxis.data.push(time)
        this.option.series[0].data.shift()
        this.option.series[1].data.shift()
        this.option.series[0].data.push(this.now)
        this.option.series[1].data.push(this.average)
        this.myChart.setOption(this.option);
      },
      onDownloadProgress: progressEvent => {
        console.log(progressEvent)
        console.log(progressEvent.loaded/(10*1024*1024))
      },
    })
    request.interceptors.response.use((response) => {
      return response
    }, (error) => {
      return Promise.reject(error)
    })
    request.defaults.headers.post['Content-Type'] = 'multipart/form-data';
    this.request = request
  }
}

export default upload