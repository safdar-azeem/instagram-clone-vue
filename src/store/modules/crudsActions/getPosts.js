import { fb, fbAuth, fbStorage } from '../../../firebase';

export default {
	state: {
		loading: false,
		posts: [],
		errors: '',
	},
	mutations: {
		getpostsStart(state) {
			state.loading = true;
			state.posts = [];
			state.errors = '';
		},
		getpostsSuccess(state, payload) {
			state.loading = false;
			state.posts = [...state.posts, ...payload];
			state.errors = '';
		},
		getpostsError(state, payload) {
			state.loading = false;
			state.posts = [];
			state.errors = payload;
		},
		removePosts(state, id) {
			if (state.posts.length == 1) state.posts = [];
			else {
				let filterPosts = [...state.posts].filter(t => t?.postId !== id);
				state.posts = filterPosts;
			}
		},
	},
	actions: {
		async onGetPosts({ commit }) {
			try {
				commit('getpostsStart');
				const currentUser = fbAuth.currentUser;
				const followingCollectionResponse = await fb
					.collection('users')
					.doc(currentUser.uid)
					.collection('following')
					.get();
				const followingAccounts = followingCollectionResponse.docs.map(doc => doc.id);
				const allAccounts = [currentUser.uid, ...followingAccounts];

				if (allAccounts.length >= 1) {
					allAccounts.forEach(async id => {
						let profileUrl;
						try {
							profileUrl = await fbStorage.ref(`imgs/${id}`).getDownloadURL();
						} catch (e) {
							profileUrl = '';
						}
						fb.collection('users')
							.doc(id)
							.collection('posts')
							.onSnapshot(async snapshot => {
								const response = snapshot.docChanges().map(async change => {
									if ('added' === change.type)
										return {
											postId: change.doc.id,
											profileUrl: profileUrl,
											...change.doc.data(),
										};
									'removed' === change.type && commit('removePosts', change.doc.id);
								});

								const data = await Promise.all(response);
								commit('getpostsSuccess', data);
							});
					});
				} else {
					commit('getpostsError', '');
				}
			} catch (e) {
				commit('getpostsError', e.message);
			}
		},
	},
};
