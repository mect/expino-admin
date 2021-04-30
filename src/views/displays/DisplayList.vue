<template id="displaylist">
  <div class="container">
    <div class="d-flex justify-content-center" v-if="loading">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div v-if="!loading">
      <h1>Displays</h1>
      <div class="row">
        <h3 class="col-12">
          <span class="float-right">
            <button
              type="button"
              class="btn btn-success"
              v-on:click="addItem()"
            >
              <i class="fas fa-plus-square" /> Add
            </button>
          </span>
        </h3>
      </div>
      <table class="table">
        <colgroup>
          <col />
          <col />
          <col />
        </colgroup>
        <thead class="thead-dark">
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>
              {{ item.name }}
            </td>
            <td>TODO</td>
            <td style="width: 120px">
              <button
                type="button"
                class="btn btn-outline-success mr-1"
                v-on:click="editItem(item)"
              >
                <i class="fas fa-edit" />
              </button>
              <button
                type="button"
                class="btn btn-outline-danger"
                v-on:click="removeItem(item)"
              >
                <i class="fas fa-trash" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { displayService } from "../../_services/display.service";

export default {
  template: "#displaylist",
  data: function () {
    return {
      loading: true,
      items: [],
    };
  },

  methods: {
    addItem: function () {
      this.$router.push("/displays/edit/0");
    },

    removeItem: async function (item) {
      try {
        await displayService.deleteDisplay(item);
        this.loadData();
      } catch (e) {
        this.$Simplert.open({
          title: "Error",
          message: e,
          type: "error",
          customCloseBtnText: "Close",
        });
      }
    },

    editItem: function (item) {
      this.$router.push(`/displays/edit/${item.ID}`);
    },

    loadedData: function (res) {
      this.loading = false;
      this.items = res;
    },

    loadData: function () {
      displayService.getAllDisplays().then(this.loadedData);
    },
  },

  created: function () {
    this.loadData();
  },
};
</script>
