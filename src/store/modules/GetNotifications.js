import { fb, fbAuth, fbStorage } from '../../firebase';

export default {
	state: {
		loading: false,
		error: '',
		notifications: [],
	},
	mutations: {
		getNotificationsStart(state) {
			state.loading = true;
			state.error = '';
			state.notifications = [];
		},
		getNotificationsSuccess(state, payload) {
			state.loading = false;
			state.error = '';
			state.notifications = [...state.notifications, ...payload];
		},
		getNotificationsError(state, payload) {
			state.loading = false;
			state.error = payload;
			state.notifications = [];
		},
	},
	actions: {
		async onGetNotifications({ commit }) {
			commit('getNotificationsStart');
			let curentUser = fbAuth.currentUser;
			try {
				fb.collection('users')
					.doc(curentUser.uid)
					.collection('notifications')
					.orderBy('currentTime', 'desc')
					.onSnapshot(async snapshot => {
						if (snapshot.docs.length >= 1) {
							const notificationsResponse = snapshot.docs.map(async doc => {
								const { userId } = doc.data();
								let userProfile;
								try {
									userProfile = await fbStorage.ref(`imgs/${userId}`).getDownloadURL();
								} catch (e) {
									userProfile = '';
								}
								return {
									userProfile,
									...doc.data(),
								};
							});
							const notificationsData = await Promise.all(notificationsResponse);
							commit('getNotificationsSuccess', notificationsData);
							fb.collection('users').doc(curentUser.uid).update({
								totalNotifications: 0,
							});
						} else {
							commit('getNotificationsError');
						}
					});
			} catch (e) {
				commit('getNotificationsError', e.message);
			}
		},
	},
};
