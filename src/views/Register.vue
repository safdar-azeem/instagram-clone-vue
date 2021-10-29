<template>
  <div className="row  vh-lg-100">
    <div
      className="col-lg-5  d-lg-flex justify-content-center align-items-center d-none"
    >
      <img
        src="../assets/imgs/registerPageImg.png"
        className="w-lg-90  w-25"
        alt=""
      />
    </div>
    <div class="col-lg-7 center flex-column mt-lg-0">
      <h1 className="mb-7 mt-5 mt-lg-0 text-start">
        {{ state.toggleForm ? "Sign in" : "Sign up" }} To Hellogram
      </h1>
      <div>
        <Login v-if="state.toggleForm" :setToggleForm="setToggleForm"></Login>
        <SingUp v-else :setToggleForm="setToggleForm"></SingUp>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from "@vue/reactivity";
import Login from "../components/Login.vue";
import SingUp from "../components/SingUp.vue";
import { useStore } from "vuex";
export default {
  components: {
    Login,
    SingUp,
  },
  setup() {
    let state = reactive({
      toggleForm: true,
    });
    const store = useStore();
    const setToggleForm = () => {
      state.toggleForm = !state.toggleForm;
      store.dispatch("onResetUserAuthState");
    };

    return { state, setToggleForm };
  },
};
</script>
<style>
</style>