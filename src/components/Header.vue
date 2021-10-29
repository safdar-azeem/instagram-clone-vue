<template>
  <section
    :style="{ zIndex: '2' }"
    class="header h-60px w-100 top-0 bg-white position-fixed"
  >
    <section
      class="
        d-flex
        w-100
        py-lg-3 py-2
        align-items-start
        justify-content-between
        bg-white
        pe-lg-9
        px-lg-0 px-3
      "
    >
      <div class="w-100">
        <div :class="[state?.toggleSearchForm ? 'd-none' : 'd-flex']">
          <button
            class="bar-btn btn d-flex d-lg-none px-1"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasExample"
            aria-controls="offcanvasExample"
          >
            <i class="fas fa-bars fs-22"></i>
          </button>
          <button
            @click="setToggleSearchForm"
            class="bar-btn btn d-flex d-lg-none px-1 ms-3"
          >
            <i class="fas fa-search fs-20"></i>
          </button>
        </div>
        <div
          class="d-lg-block"
          :class="[state?.toggleSearchForm ? 'd-flex w-100' : 'd-none']"
        >
          <button
            @click="setToggleSearchForm"
            class="btn me-3 px-1 d-lg-none d-flex"
          >
            <i class="fas fa-arrow-left fs-20"></i>
          </button>
          <form class="w-100 w-lg-md" @submit.prevent="onfilterUser">
            <div class="position-relative">
              <input
                type="text"
                placeholder="search"
                class="form-control w-100"
                v-model="state.slug"
              />
              <button type="submit" class="btn translate-right-middle">
                <i class="fas fa-search fs-14"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div
        class="d-lg-flex"
        :class="[state?.toggleSearchForm ? 'd-none' : 'd-flex']"
      >
        <button
          @click="setTheme"
          class="btn me-3 btn-outline-secondary center h-43px w-46px"
        >
          <i class="fas fa-sun" v-if="state.theme === 'dark-mode'"></i>
          <i class="fas fa-moon" v-else></i>
        </button>
        <label class="btn me-3 btn-outline-secondary center h-43px w-46px">
          <i class="fas fa-plus-circle fs-19" v-if="!loading"></i>
          <div v-else class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <input
            :disabled="loading"
            type="file"
            class="d-none"
            @change="onCreatePost"
          />
        </label>

        <button
          class="
            btn btn-outline-secondary
            center
            h-43px
            w-46px
            position-relative
          "
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasRight"
          aria-controls="offcanvasRight"
          @click="onGetNotifications"
        >
          <i
            :class="[userData?.totalNotifications ? 'fas' : 'far']"
            class="fa-bell fs-19"
          ></i>
          <small v-if="userData?.totalNotifications !== 0"
            >{{ userData?.totalNotifications }}
          </small>
        </button>
      </div>
    </section>
  </section>
</template>

<script>
import { computed, reactive } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { mapActions, useStore } from "vuex";
import { onMounted, watch } from "@vue/runtime-core";

export default {
  setup() {
    let state = reactive({
      toggleSearchForm: false,
      slug: "",
      theme: "light-mode",
    });
    const router = useRouter();
    const store = useStore();

    const loading = computed(() => store.state.createPost.loading);
    const error = computed(() => store.state.createPost.error);

    const userData = computed(() => store.state.authuser.userData);

    const onfilterUser = () => {
      state.slug && router.push(`/search/${state.slug}`);
    };

    const setToggleSearchForm = () => {
      state.toggleSearchForm = !state.toggleSearchForm;
    };

    onMounted(() => {
      state.theme = localStorage.getItem("theme");
    });

    let setTheme = () => {
      localStorage.setItem(
        "theme",
        state.theme == "dark-mode" ? "light-mode" : "dark-mode"
      );
      state.theme = localStorage.getItem("theme");
    };
    watch(
      () => state.theme,
      (currentValue) => {
        document.querySelector("body").className = currentValue;
      }
    );

    return {
      loading,
      error,
      state,
      userData,
      setTheme,
      setToggleSearchForm,
      onfilterUser,
      ...mapActions(["onCreatePost", "onGetNotifications"]),
    };
  },
};
</script>

<style scoped>
.header {
  padding-left: 290px;
}
@media (max-width: 992px) {
  .header {
    padding-left: 3px;
  }
}
</style>
