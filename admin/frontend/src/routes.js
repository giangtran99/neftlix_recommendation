import React from 'react';

const routes = [
	{ path: '/', exact: true, name: 'Home' },
	{ path: '/dashboard', name: 'Dashboard', component: React.lazy(() => import('./views/Dashboard')) },
	{ path: '/account/settings', name: "Info", component: React.lazy(() => import('./views/Accounts/Info')) },
	{ path: '/base/movie/:id', name: "Info", component: React.lazy(() => import('./views/Movie/Crud')) },
	{ path: '/base/movies', name: "Info", component: React.lazy(() => import('./views/Movie/List')) },
	// vouchers
];

export default routes;

