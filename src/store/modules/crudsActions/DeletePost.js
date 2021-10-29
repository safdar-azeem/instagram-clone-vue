import { fb } from '../../../firebase';
import firebase from 'firebase/app';

export default {
	state: {
		loading: false,
		error: '',
	},
	mutations: {
		deletePostStart(state) {
			state.loading = true;
			state.error = '';
		},
		deletePostSuccess(state) {
			state.loading = false;
			state.error = '';
		},
		deletePostStart(state, payload) {
			state.loading = false;
			state.error = payload;
		},
	},
	actions: {
		onDeletePost({ commit }, { userID, postId }) {
			commit('deletePostStart');
			fb.collection('users')
				.doc(userID)
				.collection('posts')
				.doc(postId)
				.delete()
				.then(() => {
					commit('deletePostSuccess'),
						fb
							.collection('users')
							.doc(userID)
							.update({ totalPosts: firebase.firestore.FieldValue.increment(-1) });
				})
				.catch(e => {
					commit('deletePostStart', e.message);
				});
		},
	},
};
