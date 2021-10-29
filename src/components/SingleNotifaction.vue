<template>
  <section
    class="side-center py-3 px-3 hover-secondary cursor-pointer rounded-2"
  >
    <div
      class="h-47px w-47px rounded-circle center"
      :class="{ 'bg-secondary': !notification?.userProfile }"
    >
      <img
        :src="notification?.userProfile"
        alt=""
        v-if="notification?.userProfile"
        class="h-47px w-47px rounded-circle"
      />
      <i v-else class="fas fa-user fs-18"></i>
    </div>
    <div class="d-flex ms-3 w-100 align-items-center justify-content-between">
      <p class="fs-15 mb-0 me-3">{{ notification.title }}</p>
      <div
        v-if="notification.type !== 'follow'"
        class="w-45px ms-2 border h-45px rounded-2"
      >
        <img
          :src="notification.postImageUrl"
          alt=""
          class="w-100 h-100 rounded-2"
          v-if="notification.postImageUrl"
        />

        <i v-else class="fas fa-user fs-18"></i>
      </div>
      <button class="btn bg-dark" :style="{ whiteSpace: 'nowrap' }" v-else>
        {{
          isAlreadyInFollowing
            ? "unfollow"
            : isAlreadyInFollowers
            ? "Follow Back"
            : "Follow"
        }}
      </button>
    </div>
  </section>
</template>

<script>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import { onMounted } from "@vue/runtime-core";
export default {
  props: ["notification"],
  setup({ notification }) {
    let store = useStore();

    onMounted(() => {
      store.dispatch("onCheckIsAlreadyInFollowers", notification.userId);
      store.dispatch("onCheckIsAlreadyInFollowing", notification.userId);
    });

    const isAlreadyInFollowers = computed(
      () => store.state.followUser.isAlreadyInFollowers
    );

    const isAlreadyInFollowing = computed(
      () => store.state.followUser.isAlreadyInFollowing
    );

    return { isAlreadyInFollowing, isAlreadyInFollowers };
  },
};
</script>

<style>
</style>