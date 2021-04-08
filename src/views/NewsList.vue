<template id="newslist">
  <div class="container">
    <div class="d-flex justify-content-center" v-if="loading">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div v-if="!loading">
      <h1>News</h1>
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
            <th>TIme</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" v-bind:key="item.ID">
            <td>
              {{ item.name }}
            </td>
            <td>FROM - TO</td>
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
import { newsService } from "../_services/news.service";

export default {
  template: "#newslist",
  components: {},
  data: function () {
    return {
      loading: true,
      items: [],
    };
  },

  methods: {
    addItem: function () {
      this.$router.push("/news/edit/0");
    },

    removeItem: async function (item) {
      try {
        await newsService.deleteNewsItem(item);
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
      this.$router.push(`/news/edit/${item.ID}`);
    },

    loadedData: function (res) {
      this.loading = false;
      this.items = res;
    },

    loadData: function () {
      newsService.getAllNewsItems().then(this.loadedData);
    },
  },

  created: function () {
    this.loadData();
  },
};
</script>
