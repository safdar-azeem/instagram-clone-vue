<template>
  <div>
    <div
      class="modal fade"
      id="exampleModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      :style="{ backgroundColor: '#17192a47' }"
    >
      <div class="modal-dialog postModal mb-0 mt-lg-4 mt-0">
        <div class="modal-content">
          <div class="modal-heade pt-4 px-5 between-center w-100 border-0">
            <h3>post</h3>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body px-md-6 pb-3">
            <section class="row" v-if="post">
              <div class="col-lg-6 col-12">
                <PostCard :key="post.postId" :post="post"></PostCard>
              </div>
              <div class="col-lg-6 col-12 ps-md-4">
                <CommentSection
                  :key="post.postId"
                  :postId="post.postId"
                  :userId="post.userId"
                  :postImg="post.img"
                ></CommentSection>
              </div>
            </section>

            <section v-else class="h-xxl center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PostCard from "./PostCard.vue";
import CommentSection from "./CommentSection.vue";
export default {
  components: {
    PostCard,
    CommentSection,
  },
  props: {
    post: Object,
  },
};
</script>

<style>
</style>