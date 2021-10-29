import { fb, fbStorage } from '../../../firebase';

export default {
	state: {
		loading: false,
		posts: [],
		errors: '',
	},
	mutations: {
		getUserPostsStart(state) {
			state.loading = true;
			state.posts = [];
			state.errors = '';
		},
		getUserPostsSuccess(state, payload) {
			state.loading = false;
			state.posts = payload;
			state.errors = '';
		},
		getUserPostsError(state, payload) {
			state.loading = false;
			state.posts = [];
			state.error = payload;
		},
	},
	actions: {
		async onGetUserPosts({ commit }, userId) {
			commit('getUserPostsStart');
			try {
				let profileUrl;
				try {
					profileUrl = await fbStorage.ref(`imgs/${userId}`).getDownloadURL();
				} catch (e) {
					profileUrl = '';
				}

				fb.collection('users')
					.doc(userId)
					.collection('posts')
					.onSnapshot(snapshot => {
						const posts = snapshot.docs.map(doc => ({
							postId: doc.id,
							profileUrl: profileUrl,
							...doc.data(),
						}));
						commit('getUserPostsSuccess', posts);
					});
			} catch (error) {
				commit('getUserPostsError', error.message);
			}
		},
	},
};
