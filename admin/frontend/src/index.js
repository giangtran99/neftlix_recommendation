import React from 'react';
import ReactDOM from 'react-dom';
import dva from 'dva';
import createLoading from 'dva-loading';
// import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.less';

// model
import modelGlobal from './models/global';
import modelMenu from './models/menu';
import modelSetting from './models/setting';
import modelAuth from './models/auth';
import modelUser from './models/user';
/* PLOP_INJECT_IMPORT */
import modelMovie from './models/movie';


const app = dva({
	history: require('history').createHashHistory()
});
app.model(modelGlobal);
app.model(modelMenu);
app.model(modelSetting);
app.model(modelAuth);
app.model(modelUser);
app.model(modelMovie);


app.use(createLoading('loading'));


app.router(require('./App').default);

// app.start('#root');
const MyApp = app.start();

export const MyContext = React.createContext(null);

ReactDOM.render(<MyContext.Provider value={{ store: app._store }}>
	<MyApp />
</MyContext.Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
serviceWorker.register();
export default app;
