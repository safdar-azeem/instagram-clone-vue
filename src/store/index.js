import { createStore } from 'vuex';
import authuser from './modules/AuthUser';
import updateProfile from './modules/UpdateProfile';
import createPost from './modules/crudsActions/CreatePost';
import getPosts from './modules/crudsActions/getPosts';
import deletePost from './modules/crudsActions/DeletePost';
import user from './modules/userProfileActons/getUser';
import userPosts from './modules/userProfileActons/getUserPosts';
import followUser from './modules/followUser';
import searchUsers from './modules/SearchUsers';
import notifications from './modules/GetNotifications';
import savePost from './modules/crudsActions/getSavedposts';
export default createStore({
	modules: {
		authuser: authuser,
		updateProfile: updateProfile,
		createPost: createPost,
		getPosts: getPosts,
		deletePost: deletePost,
		user: user,
		userPosts: userPosts,
		followUser: followUser,
		searchUsers: searchUsers,
		notifications: notifications,
		savePost: savePost,
	},
});
