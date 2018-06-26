import React from 'react';
import { NavLink } from 'react-router-dom'

//样式： 1、 className; 2、 CSS标签选择器； 3、 行间样式； 4、 创建一个style对象

const headerStyle = {
	display: 'flex',
  height: '60px',
  lineHeight: '60px',
  backgroundColor: '#2a3f54',
  color: '#fff'
}

const activeStyle = {
  borderBottom: '2px solid rgb(255, 208, 75)',
  color: 'rgb(255, 208, 75)'
}

export default () => (
	<header style={headerStyle}>
	  <NavLink
    	to="/"
	 	>
		  <h1 style={{
	  	  width: '300px',
			  fontSize: '16px',
			  color: '#fff',
			  textAlign: 'center',
			  fontWeight: 'normal'
		  }}>Network Speed Test</h1>
		 </NavLink>
	  <nav style={{flex: '1'}}>
	    <NavLink
	    	to="/latency"
	    	activeStyle={activeStyle}
		 	>延迟测试</NavLink>
	    <NavLink
	    	to="/download"
	    	activeStyle={activeStyle}
		 	>下载测试</NavLink>
	    <NavLink
	    	to="/upload"
	    	activeStyle={activeStyle}
		 	>上传测试</NavLink>
	  </nav>
	</header>
)