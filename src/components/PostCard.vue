<template>
  <div class="">
    <article class="card post-card">
      <header
        class="card-header bg-secondary between-center position-relative border"
      >
        <div class="side-center">
          <div
            class="w-47px h-47px rounded-circle center"
            :class="[!post?.profileUrl ? 'border  border-3' : '']"
          >
            <img
              :src="post?.profileUrl"
              class="w-100 h-100 rounded-circle"
              alt=""
              loading="lazy"
              v-if="post?.profileUrl"
            />
            <i class="fas fa-user fs-18" v-else></i>
          </div>
          <router-link :to="`/users/${post?.userId}`" class="mb-0 ms-3 h5">
            {{ post?.userName }}
            <span class="badge bg-dark ms-2">
              {{ timeAgo(post?.currentTime?.seconds * 1000) }}
            </span>
          </router-link>
        </div>
        <div class="dropdown">
          <button
            class="btn hover-secondary"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="fas fa-ellipsis-v fs-19"></i>
          </button>

          <ul
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="dropdownMenuButton1"
          >
            <li @click="onSharepost" class="dropdown-item cursor-pointer">
              <i class="fas fa-external-link-alt me-3"></i>
              <span>share</span>
            </li>

            <li
              class="dropdown-item cursor-pointer"
              v-if="post?.userId == currentUser?.uid"
              @click="
                onDeletePost({ userID: post?.userId, postId: post?.postId })
              "
            >
              <i class="fas fa-trash me-3"></i>
              <span>Delete</span>
            </li>
          </ul>
        </div>
      </header>
      <main>
        <div
          v-if="!post?.img"
          class="w-100 cursor-pointer border rounded h-lg center"
        >
          <BtnLoading />
        </div>
        <div v-else class="w-100 cursor-pointer bg-secondary h-lg">
          <img
            :src="post?.img"
            class="w-100 cursor-pointer border h-100"
            alt=""
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            loading="lazy"
            @click="$emit('onOpenModelPost', post)"
          />
        </div>
      </main>
      <footer class="card-footer between-center bg-secondary">
        <div>
          <button
            class="btn"
            :disabled="state.likeLoading"
            @click="onLikePost(post?.postId, post?.userId)"
          >
            <span v-if="!state.likeLoading">
              <i
                class="fa-heart fs-22"
                :class="[state.isCurrentUserLikedThisPost ? 'fas' : 'far']"
              ></i>
              <span class="fs-17 ms-2">{{
                state.totalLikes === 0 ? "" : state.totalLikes
              }}</span>
            </span>

            <BtnLoading v-else></BtnLoading>
          </button>
          <button
            class="btn"
            :data-bs-toggle="open && 'modal'"
            data-bs-target="#exampleModal"
          >
            <i class="fas fa-comment fs-22 ms-2"></i>
            <span class="fs-17 ms-2">
              {{ state.totalComments === 0 ? "" : state.totalComments }}
            </span>
          </button>
        </div>
        <button
          class="btn"
          @click="onSavePost({ userId: post?.userId, postId: post?.postId })"
          :disabled="state.loadingOnsavePost"
        >
          <i
            class="far fa-bookmark fs-25"
            :class="[state.isCurrentUserSavedThisPost ? 'fas' : 'far']"
            v-if="!state.loadingOnsavePost"
          ></i>
          <BtnLoading v-else></BtnLoading>
        </button>
      </footer>
    </article>
  </div>
</template>

<script>
import BtnLoading from "./BtnLoading.vue";
import { onMounted, reactive, computed, onUpdated } from "@vue/runtime-core";
import { fb, fbAuth } from "../firebase";
import { mapActions, useStore } from "vuex";
import firebase from "firebase/app";
import timeAgo from "../utils/mytime";
import { addNotification, deleteNotification } from "../utils/notifications";

export default {
  components: {
    BtnLoading,
  },
  emits: ["onOpenModelPost"],
  props: {
    post: Object,
  },
  setup(props) {
    const currentUser = fbAuth.currentUser;

    let state = reactive({
      totalLikes: 0,
      totalComments: 0,
      isCurrentUserLikedThisPost: false,
      likeLoading: false,
      isCurrentUserSavedThisPost: false,
      loadingOnsavePost: false,
    });

    const onGetLikes = (userId, postId) => {
      fb.collection("users")
        .doc(userId)
        .collection("posts")
        .doc(postId)
        .collection("likes")
        .onSnapshot((userId) => {
          const postId = userId.docs.map((userId) => userId.id);
          state.totalLikes = postId.length;
          state.isCurrentUserLikedThisPost = postId.includes(currentUser.uid);
        });
    };

    const onGetTotalComments = (userId, postId) => {
      fb.collection("users")
        .doc(userId)
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .onSnapshot((snapshot) => {
          state.totalComments = snapshot.docs.length;
        });
    };

    const onLikePost = (postId, userId) => {
      state.likeLoading = !0;
      let likeRef = fb
        .collection("users")
        .doc(userId)
        .collection("posts")
        .doc(postId)
        .collection("likes")
        .doc(currentUser.uid);
      likeRef.get().then((o) => {
        o.exists
          ? (likeRef.delete().then(() => {
              deleteNotification(userId, postId, "like");
            }),
            (state.likeLoading = !1))
          : (likeRef.set({ currentTime: new Date() }).then(() => {
              const likeRef = props.post?.img;
              addNotification(userId, "like", postId, likeRef);
            }),
            (state.likeLoading = !1));
      });
    };

    onMounted(() => {
      onGetLikes(props.post?.userId, props.post?.postId);
      onGetTotalComments(props.post?.userId, props.post?.postId);

      fb.collection("users")
        .doc(props.post?.userId)
        .collection("posts")
        .doc(props.post?.postId)
        .collection("whoSaveThisPost")
        .onSnapshot((snapshot) => {
          let isLike = snapshot.docs.find((doc) => doc.id == currentUser.uid);
          state.isCurrentUserSavedThisPost = isLike;
        });
    });

    const onSharepost = () => {
      fb.collection("users")
        .doc(currentUser.uid)
        .collection("posts")
        .add({
          img: props.post?.img,
          userId: currentUser.uid,
          userName: currentUser.displayName,
          currentTime: new Date(),
        })
        .then(() => {
          fb.collection("users")
            .doc(currentUser.uid)
            .update({ totalPosts: firebase.firestore.FieldValue.increment(1) })
            .then(() => {
              addNotification(
                props.post?.userId,
                "share",
                props.post?.postId,
                props.post?.img
              );
            });
        });
    };

    const onSavePost = async ({ userId: userId, postId: postId }) => {
      state.loadingOnsavePost = !0;
      try {
        const currentUser = fbAuth.currentUser;
        let currentUserSavePostCollection = fb
            .collection("users")
            .doc(currentUser.uid)
            .collection("savePost"),
          userPostRef = fb
            .collection("users")
            .doc(userId)
            .collection("posts")
            .doc(postId)
            .collection("whoSaveThisPost")
            .doc(currentUser.uid);
        (await currentUserSavePostCollection.doc(postId).get()).exists
          ? (await currentUserSavePostCollection.doc(postId).delete(),
            await userPostRef.delete(),
            (state.loadingOnsavePost = !1))
          : (await currentUserSavePostCollection
              .doc(postId)
              .set({ currentTime: new Date(), userId: userId, postId: postId }),
            await userPostRef.set({ currentTime: new Date() }),
            (state.loadingOnsavePost = !1));
      } catch (userId) {
        state.loadingOnsavePost = !1;
      }
    };

    return {
      timeAgo,
      state,
      onLikePost,
      currentUser,
      onSharepost,
      onSavePost,
      ...mapActions(["onDeletePost"]),
    };
  },
};
</script>

<style>
.postModal {
  max-width: 78vw !important;
  margin-right: 53px !important;
}

@media (max-width: 992px) {
  .postModal {
    margin-right: auto !important;
    margin-left: auto !important;
  }
}
@media (max-width: 768px) {
  .postModal {
    max-width: 100vw !important;
    margin-right: auto !important;
    margin-left: auto !important;
  }
}
.h-lg {
  height: 410px !important;
}
</style>