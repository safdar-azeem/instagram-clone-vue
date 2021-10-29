import { fb, fbAuth, fbStorage } from '../../../firebase';
import firebase from 'firebase/app';
export default {
	state: {
		loading: false,
		error: '',
	},
	mutations: {
		createPostStart(state) {
			state.loading = true;
			state.error = '';
		},
		createPostSuccess(state) {
			state.loading = false;
			state.error = '';
		},
		createPostError(state, payload) {
			state.loading = false;
			state.error = payload;
		},
	},
	actions: {
		onCreatePost({ commit }, event) {
			commit('createPostStart');
			const img = event.target.files[0];
			const imgName = new Date().toISOString() + img.name;

			const user = fbAuth.currentUser;
			const storeRef = fbStorage.ref();
			const uploadTask = storeRef.child(`imgs/${imgName}`).put(img);

			uploadTask.on(
				'state_changed',
				() => {},
				error => {
					commit('createPostError', error.message);
				},
				() => {
					uploadTask.snapshot.ref.getDownloadURL().then(url => {
						fb.collection('users')
							.doc(user.uid)
							.collection('posts')
							.add({
								img: url,
								userId: user.uid,
								userName: user.displayName,
								currentTime: new Date(),
								share: 0,
							})
							.then(() => {
								commit('createPostSuccess'),
									fb
										.collection('users')
										.doc(user.uid)
										.update({ totalPosts: firebase.firestore.FieldValue.increment(1) });
							});
					});
				}
			);
		},
	},
};
