<template id="home">
  <div class="container">
    <div class="d-flex justify-content-center" v-if="loading">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div v-if="!loading">
      <h1>Home</h1>
      <hr />

      <h2>Preview</h2>
      <div class="row mb-2">
        <div class="col-12">
          <span class="float-right">
            Display
            <button
              class="btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {{ this.currentDisplay.name }}
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a
                class="dropdown-item"
                v-for="display in this.displays"
                v-bind:key="display.ID"
                v-on:click="currentDisplay = display"
                >{{ display.name }}
              </a>
            </div>
          </span>
        </div>
      </div>
      <div class="row">
        <div class="col-12 justify-content-center">1920x1080</div>
        <div class="col-12 justify-content-center" id="iframe_container">
          <iframe id="preview" v-bind:src="currentDisplay.url"></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from "../_services/auth.service";
import { displayService } from "@/_services/display.service";

export default {
  template: "#home",
  components: {},
  data: function () {
    return {
      loading: false,
      displays: [],
      currentDisplay: null,
    };
  },

  methods: {
    loadData: async function () {
      this.displays = await displayService.getAllDisplays();
      this.currentDisplay = this.displays[0];
      this.loading = false;
    },
  },

  created: function () {
    this.loading = true;
    authService.check().catch(() => this.$router.push("/login"));
    this.loadData();
  },
};
</script>

<style>
#iframe_container {
  background-color: #ffffff;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: visible;
}

#preview {
  overflow: scroll;
  border: 0;
  width: 1920px;
  height: 1080px;
  transform: scale(0.5);
  -ms-transform-origin: 0 0;
  -moz-transform-origin: 0 0;
  -o-transform-origin: 0 0;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
</style>
