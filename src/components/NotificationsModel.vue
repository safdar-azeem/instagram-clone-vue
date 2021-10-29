<template>
  <div
    class="offcanvas offcanvas-end shadow-lg"
    tabIndex="-1"
    id="offcanvasRight"
    aria-labelledby="offcanvasRightLabel"
  >
    <div class="offcanvas-header align-items-center py-4 px-3 border-bottom">
      <h4 class="mb-0" id="offcanvasRightLabel">Notifications</h4>
      <button
        type="button"
        class="btn-close text-reset"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div class="offcanvas-body py-2 px-1">
      <div v-if="!loading">
        <div></div>
        <SingleNotification
          v-for="(notification, $index) in notifications"
          :key="$index"
          :notification="notification"
        >
        </SingleNotification>
      </div>
      <div v-else class="w-100 center mt-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, computed } from "@vue/reactivity";
import SingleNotification from "./SingleNotifaction.vue";
import { useStore } from "vuex";
export default {
  components: {
    SingleNotification,
  },
  setup() {
    const store = useStore();
    const loading = computed(() => store.state.notifications.loading);
    const notifications = computed(
      () => store.state.notifications.notifications
    );
    return { loading, notifications };
  },
};
</script>

<style>
</style>