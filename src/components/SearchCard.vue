<template>
  <section class="col-md-4">
    <section
      class="
        card
        w-md-90
        border
        mb-6
        p-3
        rounded-2
        d-flex
        justify-content-center
        align-items-center
        flex-column
      "
    >
      <div
        class="w-80px h-80px mb-3 rounded-circle center"
        :class="[!user?.userProfile ? 'bg-secondary' : '']"
      >
        <img
          :src="user?.userProfile"
          class="w-100 h-100 border rounded-circle"
          alt=""
          v-if="user?.userProfile"
        />

        <i v-else class="fas fa-user fs-28"></i>
      </div>

      <h4>{{ user?.name }}</h4>

      <router-link
        :to="`/users/${user?.id}`"
        class="btn bg-secondary px-8 mt-2"
      >
        open profile
      </router-link>
    </section>
  </section>
</template>

<script>
export default {
  props: ["user"],
};
</script>

<style>
</style>