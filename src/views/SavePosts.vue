<template>
  <div v-if="!loading">
    <h4 class="mb-5">Your Saved Posts {{ posts.length }}</h4>
    <PostsSection :posts="posts"></PostsSection>
  </div>
  <Spinner height="vh-90" v-else></Spinner>
</template>

<script>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import PostsSection from "../components/Posts.vue";
import Spinner from "../components/Spinner.vue";
import BtnLoading from "../components/BtnLoading.vue";
export default {
  components: {
    PostsSection,
    Spinner,
    BtnLoading,
  },
  setup() {
    let store = useStore();
    store.dispatch("onGetSaveposts");
    const posts = computed(() => store.state.savePost.posts);
    const loading = computed(() => store.state.savePost.loading);
    return { posts, loading };
  },
};
</script>

<style>
</style>