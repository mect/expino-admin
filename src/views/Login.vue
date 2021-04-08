<template id="login">
  <div class="bg">
    <div class="container vertical-center">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-5 col-10 login-box">
            <form m v-on:submit.prevent="login">
              <div class="form-group">
                <label class="sr-only" for="username">Username</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text">
                      <i class="fas fa-user"></i>
                    </div>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    name="username"
                    id="username"
                    v-model="username"
                    placeholder="Username"
                  />
                </div>
              </div>
              <div class="form-group">
                <label class="sr-only" for="password">Password</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text">
                      <i class="fas fa-key"></i>
                    </div>
                  </div>
                  <input
                    type="password"
                    class="form-control"
                    name="password"
                    id="password"
                    v-model="password"
                    placeholder="Password"
                  />
                </div>
              </div>
              <button
                class="btn btn-primary"
                :disabled="submitted"
                type="submit"
              >
                <i class="fas fa-sign-in-alt"></i> Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from "../_services/auth.service";

export default {
  template: "#login",
  components: {},
  data: function () {
    return {
      username: "",
      password: "",
      submitted: false,
    };
  },

  methods: {
    login: async function () {
      this.submitted = true;
      if (this.username && this.password) {
        try {
          await authService.login(this.username, this.password);
          this.$router.push("/home");
          this.submitted = false;
        } catch (e) {
          this.submitted = false;
          this.$Simplert.open({
            title: "Login error!",
            message: e,
            type: "error",
            customCloseBtnText: "Close",
          });
        }
      }
    },
  },

  created: function () {},
};
</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css";

.bg {
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  background-size: cover;
}

.login-box {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 10px;
}
.vertical-center {
  min-height: 100vh;

  display: flex;
  align-items: center;
}

#logo {
  max-width: 35%;
  height: auto;
}

h2 {
  text-align: center;
}
</style>
