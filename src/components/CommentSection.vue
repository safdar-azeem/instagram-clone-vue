<template>
  <section className="d-flex justify-content-center w-100 mt-lg-0 mt-5">
    <section className="w-100">
      <header>
        <h2>Comments</h2>
      </header>
      <main className="mh-lg h-lg w-100  overflow-auto my-4 border rounded-2">
        <div v-if="!state.loadingOnGetComments">
          <Comment
            v-for="comment in state.comments"
            :key="comment.id"
            :comment="comment"
          ></Comment>
        </div>
        <div v-else class="h-100 center">
          <BtnLoading></BtnLoading>
        </div>
      </main>
      <footer>
        <form className="side-center px-1" @submit.prevent="onComment">
          <input
            type="text"
            className="form-control me-3 form-control-lg"
            placeholder="write comment"
            v-model="state.message"
          />
          <button className="btn bg-dark btn-lg px-3" type="submit">
            <BtnLoading v-if="state.loadingOnSendComment"></BtnLoading>
            <i v-else className="fas fa-paper-plane"></i>
          </button>
        </form>
      </footer>
    </section>
  </section>
</template>

<script>
import { reactive } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import Comment from "./Comment.vue";
import { fb, fbAuth, fbStorage } from "../firebase";
import BtnLoading from "./BtnLoading.vue";
import { addNotification } from "../utils/notifications";

export default {
  props: {
    postId: String,
    userId: String,
    postImg: String,
  },
  components: { Comment, BtnLoading },
  setup({ postId, userId, postImg }) {
    let state = reactive({
      comments: [],
      message: "",
      loadingOnSendComment: false,
      loadingOnGetComments: false,
    });
    const currentUser = fbAuth.currentUser;

    const onGetComment = (postId, userId) => {
      (state.loadingOnGetComments = !0),
        fb
          .collection("users")
          .doc(userId)
          .collection("posts")
          .doc(postId)
          .collection("comments")
          .orderBy("currentTime", "desc")
          .onSnapshot(async (postId) => {
            const userId = postId.docs.map((postId) => {
              let userId = postId.data();
              return fbStorage
                .ref("imgs")
                .child(userId.userId)
                .getDownloadURL()
                .then((userId) => ({
                  id: postId.id,
                  userProfile: userId,
                  ...postId.data(),
                }))
                .catch((e) => ({
                  id: postId.id,
                  userProfile: "",
                  ...postId.data(),
                }));
            });
            (state.comments = await Promise.all(userId)),
              (state.loadingOnGetComments = !1);
          });
    };

    const onComment = () => {
      state.loadingOnSendComment = !0;
      fb.collection("users")
        .doc(userId)
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .add({
          message: state.message,
          postId: postId,
          userId: currentUser.uid,
          userName: currentUser.displayName,
          currentTime: new Date(),
        })
        .then(() => {
          state.message = "";
          (state.loadingOnSendComment = !1),
            addNotification(userId, "comment", postId, postImg);
        });
    };

    onMounted(() => {
      onGetComment(postId, userId);
    });

    return { state, onComment };
  },
};
</script>

<style>
</style>