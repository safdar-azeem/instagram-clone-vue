import { fb, fbAuth } from '../firebase';
import firebase from 'firebase/app';

const incrementNotifications = userId => {
	const increment = firebase.firestore.FieldValue.increment(1);
	fb.collection('users').doc(userId).update({ totalNotifications: increment });
};

const decrementNotifications = userId => {
	const decrement = firebase.firestore.FieldValue.increment(-1);
	fb.collection('users')
		.doc(userId)
		.get()
		.then(doc => {
			const { totalNotifications } = doc.data();
			totalNotifications &&
				fb.collection('users').doc(userId).update({ totalNotifications: decrement });
		});
};

export const addNotification = (userId, type, docId, postImageUrl) => {
	const currentUser = fbAuth.currentUser;
	if (currentUser.uid !== userId) {
		const notificationsRef = fb
			.collection('users')
			.doc(userId)
			.collection('notifications');

		if (type === 'follow') {
			notificationsRef
				.doc(currentUser.uid)
				.set({
					type: 'follow',
					title: `${currentUser.displayName} started follwing you`,
					userId: currentUser.uid,
					currentTime: new Date(),
					postImageUrl: '',
				})
				.then(() => {
					incrementNotifications(userId);
				});
		} else if (type === 'like') {
			notificationsRef
				.doc(`like${docId}`)
				.set({
					type: 'like',
					title: `${currentUser.displayName} liked Your Post`,
					postImageUrl: postImageUrl,
					postId: docId,
					userId: currentUser.uid,
					currentTime: new Date(),
				})
				.then(() => {
					incrementNotifications(userId);
				});
		} else if (type === 'comment') {
			notificationsRef
				.doc(`comment${docId}`)
				.set({
					type: 'comment',
					title: `${currentUser.displayName} commented on Your Post`,
					postImageUrl: postImageUrl,
					postId: docId,
					userId: currentUser.uid,
					currentTime: new Date(),
				})
				.then(() => {
					incrementNotifications(userId);
				});
		} else if (type === 'share') {
			notificationsRef
				.doc(`share${docId}`)
				.set({
					type: 'share',
					title: `${currentUser.displayName} share Your Post`,
					postImageUrl: postImageUrl,
					postId: docId,
					userId: currentUser.uid,
					currentTime: new Date(),
				})
				.then(() => {
					incrementNotifications(userId);
				});
		}
	}
};

export const deleteNotification = (userId, docId, type) => {
	const notificationsRef = fb.collection('users').doc(userId);
	const currentUser = fbAuth.currentUser;

	if (currentUser.uid !== userId) {
		if (type === 'like') {
			notificationsRef
				.collection('notifications')
				.doc(`like${docId}`)
				.delete()
				.then(() => {
					decrementNotifications(userId);
				});
		} else if (type === 'comment') {
			notificationsRef
				.collection('notifications')
				.doc(`comment${docId}`)
				.delete()
				.then(() => {
					decrementNotifications(userId);
				});
		} else if (type === 'share') {
			notificationsRef
				.collection('notifications')
				.doc(`share${docId}`)
				.delete()
				.then(() => {
					decrementNotifications(userId);
				});
		} else {
			notificationsRef
				.collection('notifications')
				.doc(currentUser.uid)
				.delete()
				.then(() => {
					decrementNotifications(userId);
				});
		}
	}
};
