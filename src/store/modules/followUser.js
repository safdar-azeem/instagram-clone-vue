import { fb, fbAuth, fbStorage } from '../../firebase';
import firebase from 'firebase/app';
import { addNotification, deleteNotification } from '../../utils/notifications';
export default {
	state: {
		loading: false,
		isAlreadyInFollowing: false,
		isAlreadyInFollowers: false,
	},
	mutations: {
		followStart(state) {
			state.loading = true;
			state.error = '';
		},
		followSuccess(state) {
			state.loading = false;
			state.error = '';
		},
		followError(state, payload) {
			state.loading = false;
			state.error = payload;
		},
		checkIsAlreadyInFollowing(state, payload) {
			state.isAlreadyInFollowing = payload;
		},
		checkIsAlreadyInFollowers(state, payload) {
			state.isAlreadyInFollowers = payload;
		},
	},
	actions: {
		onfollow({ commit }, id) {
			let currentUser = fbAuth.currentUser;
			commit('followStart');
			let followingRef = fb
				.collection('users')
				.doc(currentUser.uid)
				.collection('following')
				.doc(id);

			let followersRef = fb
				.collection('users')
				.doc(id)
				.collection('followers')
				.doc(currentUser.uid);

			followingRef.get().then(async e => {
				if (e.exists) {
					await followingRef.delete();
					fb.collection('users')
						.doc(currentUser.uid)
						.update({
							totalFollowing: firebase.firestore.FieldValue.increment(-1),
						})
						.then(() => {
							followersRef.get().then(async e => {
								if (e.exists) {
									const decrement = firebase.firestore.FieldValue.increment(-1);
									await followersRef.delete();
									await fb.collection('users').doc(id).update({
										totalFollowers: decrement,
									});
									deleteNotification(id, currentUser.uid);
									commit('followSuccess');
								}
							});
						});
				} else {
					await followingRef.set({
						currentTime: new Date(),
					});
					fb.collection('users')
						.doc(currentUser.uid)
						.update({
							totalFollowing: firebase.firestore.FieldValue.increment(1),
						})
						.then(() => {
							followersRef.get().then(async e => {
								if (!e.exists) {
									{
										await followersRef.set({
											currentTime: new Date(),
										});
										const increment = firebase.firestore.FieldValue.increment(1);
										await fb.collection('users').doc(id).update({
											totalFollowers: increment,
										});
										addNotification(id, 'follow');
										commit('followSuccess');
									}
								}
							});
						});
				}
			});
		},
		onCheckIsAlreadyInFollowers({ commit }, id) {
			let currentUser = fbAuth.currentUser;
			fb.collection('users')
				.doc(id)
				.collection('followers')
				.onSnapshot(snapshot => {
					let [isAlreadyInFollowing] = snapshot.docs.filter(e => e.id == currentUser.uid);
					commit('checkIsAlreadyInFollowing', isAlreadyInFollowing);
				});
		},
		onCheckIsAlreadyInFollowing({ commit }, id) {
			let currentUser = fbAuth.currentUser;
			fb.collection('users')
				.doc(id)
				.collection('following')
				.onSnapshot(snapshot => {
					let [isAlreadyInFollowers] = snapshot.docs.filter(
						doc => doc.id == currentUser.uid
					);
					commit('checkIsAlreadyInFollowers', isAlreadyInFollowers);
				});
		},
		ongetFollowers({ commit }, id) {
			fb.collection('users')
				.doc(id)
				.collection('followers')
				.onSnapshot(snapshot => {
					const followers = snapshot.docs.map(async doc => {
						let userProfile;
						try {
							userProfile = await fbStorage.child(`imgs/${doc.id}`).getDownloadURL();
						} catch (e) {
							userProfile = '';
						}
						const userDoc = await fb.collection('users').doc(doc.id).get();
						return {
							id: doc.id,
							userProfile,
							...userDoc.data(),
						};
					});
				});
		},
	},
};
