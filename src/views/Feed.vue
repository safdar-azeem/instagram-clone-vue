<template>
  <div v-if="!loading">
    <PostsSection :posts="posts"></PostsSection>
  </div>
  <Spinner height="vh-90" v-else></Spinner>
</template>


<script>
import { useStore } from "vuex";
import { computed, onMounted } from "@vue/runtime-core";
import PostsSection from "../components/Posts.vue";
import Spinner from "../components/Spinner.vue";

export default {
  components: {
    PostsSection,
    Spinner,
  },
  setup() {
    const store = useStore();
    const posts = computed(() =>
      store.state.getPosts.posts.sort((a, b) => b.currentTime - a.currentTime)
    );
    const loading = computed(() => store.state.getPosts.loading);
    onMounted(() => {
      store.dispatch("onGetPosts");
    });

    return { posts, loading };
  },
};
</script>
