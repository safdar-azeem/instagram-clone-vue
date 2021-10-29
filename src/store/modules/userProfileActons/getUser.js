import { fb, fbAuth, fbStorage } from '../../../firebase';

export default {
	state: {
		loading: false,
		error: '',
		user: null,
		currentUser: null,
	},
	mutations: {
		getUserStart(state) {
			state.loading = true;
			state.error = '';
			state.user = null;
			state.currentUser = null;
		},
		getUserSuccess(state, payload) {
			state.loading = false;
			state.error = '';
			state.user = payload.user;
			state.currentUser = payload.currentUser;
		},
		getUserError(state, payload) {
			state.loading = false;
			state.error = payload;
			state.user = null;
			state.currentUser = null;
		},
	},
	actions: {
		async onGetUser({ commit }, userId) {
			try {
				commit('getUserStart');
				const currentUser = fbAuth.currentUser;
				let profilePic;
				try {
					profilePic = await fbStorage.ref(`imgs/${userId}`).getDownloadURL();
				} catch (e) {
					profilePic = '';
				}
				fb.collection('users')
					.doc(userId)
					.onSnapshot(snapshot => {
						const user = { ...snapshot.data(), profilePic: profilePic };
						commit('getUserSuccess', { currentUser, user });
					});
			} catch (e) {
				commit('getUserError', e.message);
			}
		},
	},
};
