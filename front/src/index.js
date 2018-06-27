import React from 'react';
import { render } from 'react-dom';
// import { HashRouter as Router} from 'react-router-dom'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import './index.css';
import App from './app/App';
import registerServiceWorker from './registerServiceWorker';
import createBrowserHistory from 'history/createBrowserHistory'

const history = createBrowserHistory()

const Router = Object.is(process.env.NODE_ENV, 'development')
  ? BrowserRouter
  : HashRouter

render(
	<Router history={history}>
		<App />
	</Router>, 
	document.getElementById('root'));
registerServiceWorker();
