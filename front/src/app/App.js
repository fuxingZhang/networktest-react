import React, { Component } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import Header from '../components/Header'
import Home from '../pages/home/Home'
import Latency from '../pages/latency/Latency'

export default () => (
  <div className="App">
    <Header></Header>
    <Switch>
		  <Route exact path='/' component={Home}/>
		  <Route path='/latency' component={Latency}/>
		  <Route path='/download' component={Home}/>
		  <Route path='/upload' component={Home}/>
		</Switch>
  </div>
)
