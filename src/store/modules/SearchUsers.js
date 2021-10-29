import { fb, fbStorage } from '../../firebase';

export default {
	state: {
		loading: false,
		error: '',
		users: [],
	},
	mutations: {
		searchUsersStart(state) {
			state.loading = true;
			state.error = '';
			state.users = [];
		},
		searchUsersSuccess(state, payload) {
			state.loading = false;
			state.error = '';
			state.users = payload;
		},
		searchUserError(state, payload) {
			state.loading = false;
			state.error = payload;
			state.users = [];
		},
	},
	actions: {
		onSearchUsers({ commit }, slug) {
			commit('searchUsersStart');
			fb.collection('users')
				.get()
				.then(async users => {
					const response = users.docs.map(async doc => {
						const { name } = doc.data();
						if (name.toLowerCase().includes(slug.toLowerCase())) {
							let userProfile;
							try {
								userProfile = await fbStorage.ref(`imgs/${doc.id}`).getDownloadURL();
							} catch (e) {
								userProfile = '';
							}
							return {
								id: doc.id,
								userProfile,
								...doc.data(),
							};
						}
					});
					const data = await Promise.all(response);
					const filter = data.filter(doc => doc && doc);
					commit('searchUsersSuccess', filter);
				})
				.catch(error => {
					commit('searchUsersSuccess', error.message);
				});
		},
	},
};
