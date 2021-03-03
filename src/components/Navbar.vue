<template>
  <div class="navbar-wrapper">
    <div class="custom-container">
      <b-navbar>
        <template #brand>
          <b-navbar-item tag="router-link" :to="{ path: '/' }">
            <h1 class="is-size-4 has-text-dark is-hidden-touch">
              MYSHOP
            </h1>
            <b-icon icon="shopping" type="is-dark"></b-icon>
          </b-navbar-item>
        </template>

        <template #end v-if="!displayNav">
          <b-navbar-item tag="div">
            <div class="buttons">
              <b-button
                type="is-info"
                size="is-small"
                rounded
                tag="router-link"
                to="/dashboard"
                v-if="displayProducts"
              >
                PRODUCT
              </b-button>
              <b-button
                type="is-info"
                size="is-small"
                rounded
                tag="router-link"
                icon-left="view-column-outline"
                to="/dashboard/categories"
                v-if="displayCategories"
              >
                CATEGORIES
              </b-button>
              <b-button
                type="is-info"
                icon-left="monitor-edit"
                size="is-small"
                rounded
                tag="router-link"
                to="/dashboard"
                v-if="displayDashboard"
              >
                DASHBOARD
              </b-button>
              <b-button
                icon-left="logout"
                type="is-dark"
                size="is-small"
                rounded
                @click="logout"
                v-if="isLogin"
              >
                LOGOUT
              </b-button>
            </div>
          </b-navbar-item>
        </template>
      </b-navbar>
    </div>
  </div>
</template>

<script>
import { fbAuth } from "../firebase/config";

export default {
  name: "navbar",
  computed: {
    displayNav() {
      return this.$route.path === "/login";
    },
    displayCategories() {
      return this.$route.path === "/dashboard";
    },
    displayProducts() {
      return this.$route.path === "/dashboard/categories";
    },
    displayDashboard() {
      return this.$route.path === "/";
    },
    isLogin() {
      return this.$store.state.isLogin;
    },
  },
  methods: {
    logout() {
      fbAuth
        .signOut()
        .then(() => {
          this.$store.commit("setIsLogin", false);

          if (this.$route.path !== "/") {
            this.$router.replace("/");
          }
        })
        .catch(() => {
          alert("fail to logout try again");
        });
    },
  },
};
</script>

<style scoped>
.navbar-wrapper {
  background-color: white;
}
</style>
