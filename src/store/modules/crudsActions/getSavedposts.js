import { fb, fbAuth, fbStorage } from '../../../firebase';
export default {
	state: {
		loading: false,
		error: '',
		posts: [],
	},
	mutations: {
		getSavedpostStart(state) {
			state.loading = true;
			state.error = '';
			state.posts = [];
		},
		getSavedpostSuccess(state, payLoad) {
			state.loading = false;
			state.error = '';
			state.posts = [...payLoad, ...state.posts];
		},
		getSavedpostError(state, payLoad) {
			state.loading = false;
			state.error = payLoad;
			state.posts = [];
		},
		removePosts(state, id) {
			if (state.posts.length == 1) state.posts = [];
			else {
				let filterPosts = [...state.posts].filter(t => t?.postId !== id);
				state.posts = [];
				state.posts = filterPosts;
			}
		},
	},
	actions: {
		async onGetSaveposts({ commit }) {
			commit('getSavedpostStart');
			try {
				const currentUser = fbAuth.currentUser;
				fb.collection('users')
					.doc(currentUser.uid)
					.collection('savePost')
					.onSnapshot(async snapshot => {
						const savePostResponse = snapshot.docChanges().map(async change => {
							let { userId, postId } = change.doc.data();
							if ('added' == change.type) {
								let postResponse = await fb
									.collection('users')
									.doc(userId)
									.collection('posts')
									.doc(postId)
									.get();
								if (postResponse.exists) {
									let profileUrl;
									try {
										profileUrl = await fbStorage.ref(`imgs/${userId}`).getDownloadURL();
									} catch (e) {
										profileUrl = '';
									}
									return {
										profileUrl,
										postId: postResponse.id,
										...postResponse.data(),
									};
								}
							} else 'removed' === change.type && commit('removePosts', change.doc.id);
						});

						let savePostData = await Promise.all(savePostResponse);
						let filterSavePost = savePostData.filter(post => post !== undefined);
						commit('getSavedpostSuccess', filterSavePost);
					});
			} catch (e) {
				commit('savepostError');
			}
		},
	},
};
