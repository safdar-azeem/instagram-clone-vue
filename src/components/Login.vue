<template>
  <form
    @submit.prevent="onSignIn({ email: state.email, password: state.password })"
    autocomplete="off"
  >
    <div class="mb-4">
      <label for="email" class="form-label"> E-mail </label>
      <input
        type="email"
        class="form-control w-md-lg vw-90"
        id="email"
        placeholder=""
        v-model="state.email"
      />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label"> password </label>
      <input
        type="password"
        class="form-control w-md-lg vw-90"
        id="password"
        placeholder=""
        v-model="state.password"
      />
    </div>
    <p class="text-danger w-50">{{ error }}</p>
    <div class="mt-5">
      <button
        type="submit"
        class="btn w-md-lg vw-90 bg-dark"
        :disabled="loading"
      >
        <span v-if="!loading"> sign in </span>
        <BtnLoading v-else></BtnLoading>
      </button>
    </div>
    <div class="mt-4">
      <button type="submit" class="btn w-md-lg vw-90 bg-secondary">
        <img src="/src/assets/imgs/google.png" class="w-18px me-16px" />
        sign in with google
      </button>
    </div>
    <div class="mt-6 d-flex align-items-center">
      <p class="me-2">Not registered yet ?</p>
      <h6 class="cursor-pointer" @click="setToggleForm">Create an account</h6>
    </div>
  </form>
</template>

<script>
import { reactive, computed } from "vue";
import { mapActions, useStore } from "vuex";
import BtnLoading from "./BtnLoading.vue";
export default {
  props: ["setToggleForm"],
  components: {
    BtnLoading,
  },
  setup() {
    let state = reactive({
      email: "dummy@gmail.com",
      password: "123456",
    });

    const store = useStore();

    const loading = computed(() => store.state.authuser.loading);
    const error = computed(() => store.state.authuser.error);

    return {
      state,
      loading,
      error,
      ...mapActions(["onSignIn"]),
    };
  },
};
</script>
<style>
</style>