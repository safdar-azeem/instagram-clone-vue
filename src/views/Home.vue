<template>
  <aside>
    <SideBar />
    <Header />
    <NotificationsModel></NotificationsModel>
  </aside>
  <main class="w-100 main-body">
    <main className="w-100 pe-lg-9 ps-lg-0 pe-3 ps-3 ">
      <section className="w-100 " :style="{ marginTop: '100px' }">
        <router-view :key="this.$route.path"></router-view>
      </section>
    </main>
  </main>
</template>

<script>
import SideBar from "../components/SideBar.vue";
import Header from "../components/Header.vue";
import NotificationsModel from "../components/NotificationsModel.vue";
export default {
  components: {
    SideBar,
    Header,
    NotificationsModel,
  },
};
</script>

<style scoped>
.main-body {
  padding-left: 289px;
}
@media (max-width: 992px) {
  .main-body {
    padding-left: 0;
  }
}
</style>


