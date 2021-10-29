import { fb, fbAuth, fbStorage } from '../../firebase';
export default {
	state: {
		userProfile: '',
		error: '',
		loading: false,
	},
	mutations: {
		updateProfileStart(state) {
			state.loading = true;
		},
		updateProfileSuccess(state, payload) {
			state.userProfile = payload;
			state.loading = false;
			state.error = '';
		},
		updateProfileError(state, payload) {
			state.userProfile = '';
			state.loading = false;
			state.error = payload;
		},
	},
	actions: {
		onUpdateProfile({ commit }, img) {
			commit('updateProfileStart');
			let user = fbAuth.currentUser;
			let storeRef = fbStorage.ref();
			let uploadTask = storeRef.child(`imgs/${user.uid}`).put(img.target.files[0]);

			uploadTask.on(
				'state_changed',
				() => {},
				error => {
					commit('updateProfileError', error.message);
				},
				() => {
					uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
						commit('updateProfileSuccess', downloadURL);
						user.updateProfile({
							photoURL: downloadURL,
						});
					});
				}
			);
		},
	},
};
