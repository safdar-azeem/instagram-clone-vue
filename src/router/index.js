import { createRouter, createWebHistory } from 'vue-router';
import { guardForDashboard, guardForRegister } from './AuthGuards';

const routes = [
	{
		name: 'home',
		path: '/',
		component: () => import('../views/Home.vue'),
		beforeEnter: guardForDashboard,
		children: [
			{
				name: 'profile',
				path: '/users/:id',
				component: () => import('../views/Profile.vue'),
				props: true,
			},
			{
				name: 'Feed',
				path: '/',
				component: () => import('../views/Feed.vue'),
			},
			{
				name: 'search',
				path: '/search/:slug',
				component: () => import('../views/Search.vue'),
				props: true,
			},
			{
				name: 'save posts',
				path: '/saveposts',
				component: () => import('../views/SavePosts.vue'),
			},
		],
	},
	{
		name: 'register',
		path: '/register',
		component: () => import('../views/Register.vue'),
		beforeEnter: guardForRegister,
	},
];

export default createRouter({
	history: createWebHistory(),
	routes,
});
