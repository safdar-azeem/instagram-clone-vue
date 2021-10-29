import { createApp } from 'vue';
import App from './App.vue';
import Router from './router/';
import store from './store';
import './assets/css/bootstrap.css';
import { fb, fbAuth } from './firebase';

import Spinner from './components/Spinner.vue';

createApp(Spinner).mount('#app');

let app;
fbAuth.onAuthStateChanged(user => {
	store.commit('updateProfileSuccess', user?.photoURL);
	if (user?.uid) {
		fb.collection('users')
			.doc(user?.uid)
			.onSnapshot(snapshot => {
				let userData = snapshot.data();
				store.commit('registerUserSuccess', { user, userData });
				if (!app) {
					app = createApp(App).use(store).use(Router).mount('#app');
				}
			});
	} else {
		if (!app) {
			app = createApp(App).use(store).use(Router).mount('#app');
		}
	}
});
