export default [
	{
		name: 'Trang chủ',
		path: '/dashboard',
		icon: 'dashboard',
	},
	{
		name: 'Quản lý',
		path: '/base',
		icon: 'setting',
		children: [
			{
				name: 'Danh sách phim',
				path: '/base/movies',
				icon: 'icon-file',
				resource: 'users'
			},
		],
	}
];
