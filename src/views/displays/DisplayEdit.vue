<template id="displayedit">
  <div class="container">
    <div class="d-flex justify-content-center" v-if="loading">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div v-if="!loading">
      <h2><span v-if="id == 0">Add</span><span v-else>Edit</span> News</h2>
      <div class="row">
        <div class="col-12">
          <span class="float-right">
            <button
              type="button"
              class="btn btn-success"
              v-on:click="save()"
              v-bind:disabled="saving"
            >
              <i class="fas fa-save" /> Save
            </button>
          </span>
        </div>

        <div class="col-6">
          <div class="form-group">
            <label for="title">Name</label>
            <input
              type="text"
              class="form-control"
              id="title"
              v-model="item.name"
            />
          </div>
        </div>

        <div class="col-6">
          <div class="form-group">
            <label for="slidetime">Token</label>
            <input
              type="text"
              class="form-control"
              id="slidetime"
              v-model.number="item.token"
            />
          </div>
        </div>
        <div class="col-6">
          <div class="form-group">
            <label for="tickerrss">Ticker RSS</label>
            <input
              type="text"
              class="form-control"
              id="tickerrss"
              v-model="item.tickerRSS"
            />
          </div>
        </div>

        <div class="col-6">
          <div class="form-group">
            <label for="tickertext">Ticker Text</label>
            <input
              type="text"
              class="form-control"
              id="tickertext"
              v-model.number="item.tickerText"
            />
          </div>
        </div>

        <hr />
      </div>
    </div>
  </div>
</template>

<script>
import { displayService } from "../../_services/display.service";

export default {
  props: ["id"],
  template: "#displayedit",
  data: function () {
    return {
      loading: true,
      saving: false,
      item: {},
    };
  },

  methods: {
    save: async function () {
      this.saving = true;
      try {
        if (this.item.ID == 0) {
          this.item = await displayService.addDisplay(this.item);
        } else {
          await displayService.editDisplay(this.item);
        }

        this.saving = false;
        this.$Simplert.open({
          title: "Saved",
          message: "Display is saved",
          type: "success",
          customCloseBtnText: "Close",
        });
      } catch (e) {
        this.$Simplert.open({
          title: "Error",
          message: e,
          type: "error",
          customCloseBtnText: "Close",
        });
        this.saving = false;
      }
    },
  },

  created: function () {
    if (this.$props.id != 0) {
      displayService
        .getDisplay(this.$props.id)
        .then((res) => {
          this.item = res;
          this.loading = false;
        })
        .catch((e) => {
          this.$Simplert.open({
            title: "Error",
            message: e,
            type: "error",
            customCloseBtnText: "Close",
          });
        });
    } else {
      this.item = {
        ID: 0,
        name: "",
        token: "",
      };
      this.loading = false;
    }
  },
};
</script>
