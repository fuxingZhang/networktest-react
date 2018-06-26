import React, { Component } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import Header from '../components/Header'
import Home from '../pages/home/Home'

export default () => (
  <div className="App">
    <Header></Header>
    <Switch>
		  <Route exact path='/' component={Home}/>
		  <Route path='/latency' component={Home}/>
		  <Route path='/download' component={Home}/>
		  <Route path='/upload' component={Home}/>
		</Switch>
  </div>
)
