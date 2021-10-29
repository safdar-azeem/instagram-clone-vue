<template>
  <section>
    <div class="mb-8">
      <section class="main-body">
        <section class="">
          <div
            v-if="!userLoading"
            class="
              d-block d-sm-flex
              justify-content-between
              align-items-xl-center align-items-start
              px-3
              gx-0
              w-100
              border
              py-15px
              rounded-3
            "
          >
            <div class="d-xl-flex align-items-center">
              <section class="side-center me-xl-9">
                <div
                  class="w-70px me-3 h-70px center rounded-circle"
                  :class="[!user?.profilePic ? 'bg-secondary border' : '']"
                >
                  <img
                    :src="user?.profilePic"
                    class="w-100 h-100 border rounded-circle"
                    alt=""
                    v-if="user?.profilePic"
                  />

                  <i v-else class="fas fa-user fs-26"></i>
                </div>
                <div>
                  <h4 class="mb-0" :style="{ whiteSpace: 'nowrap' }">
                    {{ user?.name }}
                  </h4>
                </div>
              </section>
              <section class="mt-xl-0 mt-4">
                <ul class="nav mt-1">
                  <li class="nav-item px-2 border-end border-3">
                    <span class="py-0 nav-link active fs-16">
                      <span class="me-1 fw-bold">
                        {{ user?.totalPosts }}
                      </span>
                      <span class="text-secondary">posts</span>
                    </span>
                  </li>
                  <li class="nav-item px-2 border-end border-3">
                    <span class="py-0 nav-link active fs-16">
                      <span class="me-1 fw-bold">
                        {{ user?.totalFollowers }}
                      </span>
                      <span class="text-secondary">followers</span>
                    </span>
                  </li>
                  <li class="nav-item px-2 border-end border-3">
                    <span class="py-0 nav-link active fs-16">
                      <span class="me-1 fw-bold">
                        {{ user?.totalFollowing }}
                      </span>
                      <span class="text-secondary">following</span>
                    </span>
                  </li>
                </ul>
              </section>
            </div>
            <section class="">
              <button
                class="btn bg-dark mt-4 mt-sm-1 w-xl-auto w-100 px-4"
                :disabled="loadingOnFollow"
                @click="onfollow(user.id)"
                v-if="user.id !== currentUser.uid"
              >
                <div v-if="!loadingOnFollow">
                  {{
                    isAlreadyInFollowing
                      ? "unfollow"
                      : isAlreadyInFollowers
                      ? "Follow Back"
                      : "Follow"
                  }}
                </div>
                <BtnLoading v-else></BtnLoading>
              </button>
            </section>
          </div>
          <div v-else class="border py-15px rounded-3">
            <Spinner height="85px"></Spinner>
          </div>
        </section>
      </section>
    </div>

    <PostsSection v-if="!loading" :key="posts" :posts="posts"></PostsSection>
    <Spinner height="vh-50" v-else></Spinner>
  </section>
</template>

<script>
import { computed } from "@vue/reactivity";
import { mapActions, useStore } from "vuex";
import PostsSection from "../components/Posts.vue";
import Spinner from "../components/Spinner.vue";
import BtnLoading from "../components/BtnLoading.vue";
export default {
  props: ["id"],
  components: {
    PostsSection,
    Spinner,
    BtnLoading,
  },
  setup({ id }) {
    const store = useStore();
    store.dispatch("onGetUser", id);
    store.dispatch("onGetUserPosts", id);
    store.dispatch("onCheckIsAlreadyInFollowers", id);
    store.dispatch("onCheckIsAlreadyInFollowing", id);
    const user = computed(() => store.state.user.user);
    const currentUser = computed(() => store.state.authuser.user);
    const userLoading = computed(() => store.state.user.loading);
    const posts = computed(() => store.state.userPosts.posts);
    const loading = computed(() => store.state.userPosts.loading);
    const loadingOnFollow = computed(() => store.state.followUser.loading);
    const isAlreadyInFollowing = computed(
      () => store.state.followUser.isAlreadyInFollowing
    );
    const isAlreadyInFollowers = computed(
      () => store.state.followUser.isAlreadyInFollowers
    );

    return {
      user,
      posts,
      loading,
      userLoading,
      currentUser,
      isAlreadyInFollowing,
      isAlreadyInFollowers,
      loadingOnFollow,
      ...mapActions(["onfollow"]),
    };
  },
};
</script>
