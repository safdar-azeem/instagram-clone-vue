<template>
  <article className="d-flex  hover-secondary cursor-pointer p-3 w-100">
    <div
      class="w-44px h-44px me-4 rounded-circle center"
      :class="[!comment.userProfile ? 'bg-secondary' : '']"
    >
      <img
        v-if="comment.userProfile"
        :src="comment.userProfile"
        className="w-100 border h-100 rounded-circle"
        alt=""
      />
      <i v-else className="fas fa-user fs-16"></i>
    </div>
    <div>
      <h5>{{ comment.userName }}</h5>
      <p>{{ comment.message }}</p>
    </div>
  </article>
</template>

<script>
export default {
  props: ["comment"],
};
</script>