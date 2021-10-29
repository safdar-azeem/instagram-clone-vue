<template>
  <form
    @submit.prevent="
      onSingUp({
        ...state,
      })
    "
  >
    <div class="mb-3">
      <label for="name" class="form-label"> Name </label>
      <input
        type="text"
        class="form-control w-md-lg vw-90"
        id="name"
        placeholder=""
        v-model="state.userName"
      />
    </div>
    <div class="mb-3">
      <label htmlFor="email" class="form-label"> E-mail </label>
      <input
        type="email"
        class="form-control w-md-lg vw-90"
        id="email"
        placeholder=""
        v-model="state.email"
      />
    </div>
    <div class="mb-3">
      <label htmlFor="password" class="form-label"> password </label>
      <input
        type="password"
        class="form-control w-md-lg vw-90"
        id="password"
        placeholder=""
        v-model="state.password"
      />
    </div>
    <div class="mb-3">
      <label htmlFor="password2" class="form-label"> confirm password </label>
      <input
        type="password"
        class="form-control w-md-lg vw-90"
        id="password2"
        placeholder=""
        v-model="state.confirmPassword"
      />
    </div>
    <span class="text-danger mt-2">{{ error }}</span>

    <div class="mt-4">
      <button
        :disabled="loading"
        type="submit"
        class="btn w-md-lg vw-90 bg-dark"
      >
        <span v-if="!loading"> Sign Up </span>
        <BtnLoading v-else></BtnLoading>
      </button>
    </div>
    <div class="mt-4">
      <button type="submit" class="btn w-md-lg vw-90 bg-secondary">
        <img src="/src/assets/imgs/google.png" class="w-18px me-16px" />
        sign up with google
      </button>
    </div>
    <div class="mt-6 d-flex align-items-center">
      <p class="me-2">Already have an account ?</p>
      <h6 class="cursor-pointer" @click="setToggleForm">sign in</h6>
    </div>
  </form>
</template>

<script>
import { mapActions, useStore } from "vuex";
import { reactive, computed } from "@vue/reactivity";
import BtnLoading from "./BtnLoading.vue";

export default {
  props: ["setToggleForm"],
  components: {
    BtnLoading,
  },
  setup() {
    let state = reactive({
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    let store = useStore();

    const error = computed(() => store.state.authuser.error);
    const loading = computed(() => store.state.authuser.loading);

    return {
      state,
      error,
      loading,
      ...mapActions(["onSingUp"]),
    };
  },
};
</script>

<style>
</style>