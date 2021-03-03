<template>
  <div id="app">
    <div v-if="isLoading">
      <app-navbar></app-navbar>

      <transition name="fade">
        <router-view></router-view>
      </transition>
    </div>
    <loader-component v-if="!isLoading"></loader-component>
  </div>
</template>

<script>
import { Bus } from "./bus";
import navbar from "./components/Navbar";
import loader from "./components/Loader";

export default {
  components: {
    "app-navbar": navbar,
    "loader-component": loader,
  },
  data() {
    return {
      hide: false,
    };
  },
  computed: {
    isLoading() {
      return this.$store.state.products.length;
    },
  },
  methods: {
    appAlert() {
      this.$buefy.dialog.alert({
        title: "Invalid Input",
        message:
          "Your input is <b>invalid</b> / <b>empty</b> please check it again",
        type: "is-danger",
        hasIcon: true,
        icon: "close-circle",
        ariaRole: "alertdialog",
        ariaModal: true,
      });
    },
  },
  created() {
    // initialize vuexfire
    this.$store.dispatch("bindProducts");
    this.$store.dispatch("bindCategories");

    Bus.$on("open-app-alert", () => this.appAlert());
  },
};
</script>

<style>
#app {
  width: 100%;
  background-color: #f5f5f5;
  min-height: 100vh;
}

#app >>> .dialog header,
#app >>> .dialog footer {
  background-color: brown !important;
}

@media (min-width: 769px) {
  .custom-container {
    margin: 0 20px;
  }
}

@media (min-width: 1024px) {
  .custom-container {
    margin: 0 40px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
