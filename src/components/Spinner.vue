<template>
  <div class="center vh-90" :style="{ height: height }">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["height"],
};
</script>

<style>
</style>
