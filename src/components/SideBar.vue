<template>
  <aside>
    <div
      class="offcanvas sidebar position-fixed offcanvas-end"
      tabindex="-1"
      id="offcanvasExample"
      aria-labelledby="offcanvasExampleLabel"
    >
      <div class="offcanvas-body px-0 bg-body shadow vh-100">
        <div>
          <header class="center flex-column pt-4">
            <div
              class="
                w-86px
                h-86px
                rounded-circle
                center
                position-relative
                pos
                mb-4
                cursor-pointe
                bg-secondary
              "
            >
              <img
                :src="userProfile"
                class="w-100 h-100 border rounded-circle"
                alt=""
                v-if="userProfile"
              />

              <i v-else class="fas fa-user fs-26"></i>

              <div
                class="position-absolute bottom-0"
                :style="{ right: '-9px', bottom: '-10px' }"
              >
                <div
                  class="spinner-border spinner-border-sm"
                  role="status"
                  v-if="updateProfileLoading"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
                <label class="cursor-pointer" v-else>
                  <i class="fas fa-edit"></i>
                  <input type="file" class="d-none" @change="onUpdateProfile" />
                </label>
              </div>
            </div>

            <router-link :to="`/users/${user?.uid}`" class="h4">
              {{ user?.displayName }}
            </router-link>
          </header>
          <main>
            <ul class="nav flex-column mt-4">
              <router-link
                class="nav-item ps-6 py-14px hover-secondary"
                to="/"
                :class="{
                  'border-end border-5 border-dark': this.$route.path == '/',
                }"
                exact
              >
                <i class="fas fa-home w-40px fs-18"></i>
                Home
              </router-link>

              <router-link
                class="nav-item ps-6 py-14px hover-secondary"
                to="/saveposts"
                :class="{
                  'border-end border-5 border-dark':
                    this.$route.path == '/saveposts',
                }"
              >
                <i class="fas fa-bookmark fs-18 w-40px"></i>
                saved
              </router-link>
            </ul>
          </main>
        </div>

        <footer class="position-absolute bottom-0 w-100">
          <button
            class="btn bg-secondary py-3 side-center w-100"
            :class="[!singOutLoading ? 'px-6' : 'px-0']"
            :disabled="singOutLoading"
            @click="onSignOut"
          >
            <span v-if="!singOutLoading">
              <i class="fas fa-sign-out-alt me-3 fs-21"></i>
              Logout
            </span>
            <div v-else class="center w-100">
              <BtnLoading></BtnLoading>
            </div>
          </button>
        </footer>
      </div>
    </div>
  </aside>
</template>

<script>
import { useStore, mapActions } from "vuex";
import { computed } from "vue";
import BtnLoading from "./BtnLoading.vue";

export default {
  name: "sidebar",
  components: {
    BtnLoading,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.authuser.user);
    const userProfile = computed(() => store.state.updateProfile.userProfile);
    const updateProfileLoading = computed(
      () => store.state.updateProfile.loading
    );
    const singOutLoading = computed(() => store.state.authuser.loading);
    return {
      user,
      userProfile,
      updateProfileLoading,
      singOutLoading,
      ...mapActions(["onUpdateProfile", "onSignOut"]),
    };
  },
};
</script>
<style>
.sidebar {
  width: 280px !important;
}

@media (min-width: 992px) {
  .sidebar {
    width: 260px !important;
    z-index: 2222;
    visibility: visible !important;
    transform: translateX(0%) !important;
    right: auto !important;
    float: left !important;
    left: 0 !important;
  }
}
</style>
