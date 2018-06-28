import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import Header from '../components/Header'
import Home from '../pages/home/Home'
import Latency from '../pages/latency/Latency'
import Download from '../pages/download/Download'
import Upload from '../pages/upload/Upload'

export default () => (
  <div className="App">
    <Header></Header>
    <Switch>
		  <Route exact path='/' component={Home}/>
		  <Route path='/latency' component={Latency}/>
		  <Route path='/download' component={Download}/>
		  <Route path='/upload' component={Upload}/>
		</Switch>
  </div>
)
