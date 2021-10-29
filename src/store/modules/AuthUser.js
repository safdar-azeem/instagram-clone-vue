import { fbAuth, fb } from '../../firebase';

import Router from '../../router/';

export default {
	state: { user: null, loading: false, error: '' },
	mutations: {
		registerUserStart(state) {
			state.loading = true;
			state.user = null;
			state.userData = null;
			state.error = '';
		},
		registerUserSuccess(state, payload) {
			state.loading = false;
			state.user = payload.user;
			state.userData = payload.userData;
			state.error = '';
		},
		registerUserError(state, payload) {
			state.loading = false;
			state.user = null;
			state.userData = null;
			state.error = payload;
		},
		resetUserAuthState(state) {
			state.error = '';
			state.loading = false;
			state.user = null;
			state.userData = null;
		},
	},
	actions: {
		async onSingUp({ commit }, { userName, email, password, confirmPassword }) {
			try {
				commit('registerUserStart');
				if (!userName && !email && !password && !confirmPassword) {
					throw new Error('please provide a user name, email and password information');
				} else if (!userName) {
					throw new Error('please provide a user name');
				} else if (!email) {
					throw new Error('please provide a  user email');
				} else if (!password) {
					throw new Error('please provide a user password');
				} else if (!confirmPassword) {
					throw new Error('please provide a user confirm Password');
				} else if (confirmPassword !== password) {
					throw new Error('passwords does not match');
				} else {
					const { user } = await fbAuth.createUserWithEmailAndPassword(email, password);
					user && commit('registerUserSuccess', { user, userData: null });
					user.updateProfile({
						displayName: userName,
					});
					await fb.collection('users').doc(user.uid).set({
						id: user.uid,
						name: userName,
						profilePic: '',
						password: password,
					});
					Router.push('/');
				}
			} catch (e) {
				commit('registerUserError', e.message);
			}
		},
		async onSignIn({ commit }, { email, password }) {
			try {
				commit('registerUserStart');
				const { user } = await fbAuth.signInWithEmailAndPassword(email, password);
				user && commit('registerUserSuccess', { user: user, userData: null });
				Router.push('/');
			} catch (e) {
				commit('registerUserError', e.message);
			}
		},
		async onSignOut({ commit }) {
			commit('registerUserStart');
			await fbAuth.signOut();
			commit('registerUserSuccess', { user: null, userData: null });
			Router.push('/register');
		},
		onResetUserAuthState({ commit }) {
			commit('resetUserAuthState');
		},
	},
};
