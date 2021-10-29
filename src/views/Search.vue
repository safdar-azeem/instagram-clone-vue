<template>
  <div className="row mt-5">
    <section className="row">
      <SearchCard v-for="user in users" :key="user?.id" :user="user">
      </SearchCard>
    </section>
  </div>
</template>

<script>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import SearchCard from "../components/SearchCard.vue";

export default {
  props: ["slug"],
  components: { SearchCard },
  setup({ slug }) {
    const store = useStore();
    store.dispatch("onSearchUsers", slug);
    const users = computed(() => store.state.searchUsers.users);
    return { users, slug };
  },
};
</script>

<style>
</style>