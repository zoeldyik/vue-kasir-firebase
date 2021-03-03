<template>
  <div class="login container">
    <div class="columns m-0">
      <div class="column is-4 is-offset-4">
        <div class="box py-5 mt-6">
          <h2 class="is-size-5 mb-3">{{ formTitle }}</h2>

          <!-- alert -->
          <b-notification
            type="is-warning"
            aria-close-label="Close notification"
            role="alert"
            v-model="showAlert"
          >
            invalid email / password
          </b-notification>
          <!-- end alert -->

          <!-- login form -->
          <div class="login-form" v-if="!forgotPassword">
            <form>
              <b-field label="Email" custom-class="has-text-weight-normal">
                <b-input
                  type="email"
                  v-model="email"
                  placeholder="email"
                  rounded
                ></b-input>
              </b-field>
              <b-field label="Password" custom-class="has-text-weight-normal">
                <b-input
                  type="password"
                  v-model="password"
                  placeholder="password"
                  rounded
                ></b-input>
              </b-field>
              <b-button
                expanded
                type="is-info"
                rounded
                :disabled="isdisabled"
                @click="login"
              >
                LOGIN
              </b-button>
            </form>

            <p
              class="show-forgot-password-form is-size-7 has-text-info mt-3 has-text-right"
              @click="showResetForm"
            >
              forgot password ?
            </p>
          </div>
          <!-- login form -->

          <!-- reset password form -->
          <div class="form-forgot-password" v-if="forgotPassword">
            <form>
              <b-field label="Email" custom-class="has-text-weight-normal">
                <b-input
                  type="email"
                  v-model="email"
                  placeholder="email"
                  rounded
                ></b-input>
              </b-field>
              <b-button
                expanded
                type="is-info"
                rounded
                :disabled="isdisabled"
                @click="resetPassword"
              >
                SEND EMAIL
              </b-button>
            </form>

            <p
              class="show-login-form is-size-7 has-text-info mt-3 has-text-right"
              @click="showLoginForm"
            >
              back to login
            </p>
          </div>
          <!-- reset password form -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fbAuth } from "../firebase/config";

export default {
  name: "login",
  components: {},
  data() {
    return {
      email: "admin@admin.com",
      password: "rahasiadong",
      isdisabled: false,
      showAlert: false,
      forgotPassword: false,
      formTitle: "LOGIN",
    };
  },
  methods: {
    login() {
      this.isdisabled = true;

      fbAuth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$router.replace("/dashboard");
        })
        .catch(() => {
          this.showAlert = true;
        })
        .finally(() => (this.isdisabled = false));
    },
    showResetForm() {
      this.formTitle = "RESET PASSWORD";
      this.forgotPassword = true;
    },
    showLoginForm() {
      this.formTitle = "LOGIN";
      this.forgotPassword = false;
    },
    resetPassword() {
      this.isdisabled = true;

      fbAuth
        .sendPasswordResetEmail(this.email)
        .then(() => {
          alert("email sent");
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.showDialog();
          this.isdisabled = false;
        });
    },
    showDialog() {
      this.$buefy.dialog.alert({
        title: "Email Sent",
        message: "check your email for new password !",
        type: "is-info",
        size: "is-small",
        hasIcon: true,
        icon: "check",
        ariaRole: "alertdialog",
        ariaModal: true,
      });
    },
  },
};
</script>

<style scoped>
.taginput .taginput-container.is-focusable:focus,
.login >>> .input:focus {
  border-color: #167df0;
}
.show-forgot-password-form:hover,
.show-login-form:hover {
  cursor: pointer;
}
</style>
