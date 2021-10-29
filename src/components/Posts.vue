<template>
  <section class="post-gellary post-body">
    <div v-for="post in posts" :key="post?.postId">
      <PostCard
        @onOpenModelPost="onOpenModelPost"
        :key="post?.postId"
        :post="post"
        v-if="post?.postId"
      >
      </PostCard>
    </div>
  </section>
  <PostModel :post="state?.modelPost"></PostModel>
</template>

<script>
import PostModel from "./PostModel.vue";
import PostCard from "./PostCard.vue";
import { reactive } from "@vue/runtime-core";

export default {
  components: {
    PostCard,
    PostModel,
  },
  props: ["posts"],
  setup({ posts }) {
    let state = reactive({
      modelPost: null,
    });
    const onOpenModelPost = (postState) => {
      state.modelPost = postState;
    };
    return { state, onOpenModelPost };
  },
};
</script>

<style scoped>
.post-gellary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px 90px;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .post-gellary {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 60px 0px;
  }
}
</style>