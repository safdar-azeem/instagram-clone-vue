import { fbAuth } from '../firebase';

const guardForDashboard = (to, from, next) => {
	const user = fbAuth.currentUser;
	user ? next() : next({ name: 'register' });
};

const guardForRegister = (to, from, next) => {
	const user = fbAuth.currentUser;
	user ? next({ name: 'home' }) : next();
};

export { guardForDashboard, guardForRegister };
