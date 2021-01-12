import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './App';
import { LoginComponent } from './components'
import 'antd/dist/antd.css';
import axios from 'axios';
import store from './redux/store'
import { Provider } from 'react-redux';
import { clearLocalStorage, getToken } from './services';
// import { isAuth } from './services'

var isA = false
axios.interceptors.request.use( async config => {
  const token = getToken();
  config.headers = {
    'Authorization': `${token}`,
    // 'Accept': 'application/json',
    // 'Content-Type': 'application/json'
  };
  return config;
})

axios.interceptors.response.use( async res => {
  return res
}, async error => {
  if(!error.response) {
    // window.location.assign(`/no_internet_connection`)
  }
  else if
  (error.response.status === 401 ) {
    clearLocalStorage()
    window.location.reload()
  }
  return Promise.reject(error);
})

ReactDOM.render(
  <React.Fragment>

    <Provider
      store={store}>
      {isA ? <LoginComponent /> : <App />}

    </Provider>

  </React.Fragment>,
  document.getElementById('root')
);



