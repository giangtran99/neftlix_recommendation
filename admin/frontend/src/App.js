import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import { routerRedux } from 'dva';
import PageLoading from './components/PageLoading';
import { MyContext } from './index';
import './App.less';

const { ConnectedRouter } = routerRedux;
// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));
const UserLayout = React.lazy(() => import('./containers/DefaultLayout/UserLayout'));

// // Pages
// // const Register = React.lazy(() => import('./views/Pages/Register'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));
/* if (process.env.NODE_ENV === 'production') {
	var console = {};
	console.log = function () { };
	if (window)
		window.console = console;
} */

export default ({ history, app }) => {
	return (
		<ConnectedRouter history={history} context={MyContext} omitRouter>
			<Router history={history}>
				<React.Suspense fallback={<PageLoading />}>
					<Switch>
						<Route exact path="/login" name="Login Page" render={props => <UserLayout {...props} />} />
						<Route exact path="/exception/404" name="Page 404" render={props => <Page404 {...props} />} />
						<Route exact path="/exception/500" name="Page 500" render={props => <Page500 {...props} />} />
						<Route path="/" name="Home" render={props => <DefaultLayout {...props} />} />
					</Switch>
				</React.Suspense>
			</Router>
		</ConnectedRouter>
	);
};
