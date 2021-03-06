<template id="newslist">
  <div class="container">
    <div class="d-flex justify-content-center" v-if="loading">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div v-if="!loading">
      <h1>News</h1>
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
                v-on:click="loadItems(display.ID, true)"
                >{{ display.name }}
              </a>
            </div>
          </span>
        </div>
      </div>
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
            <th></th>
            <th>Name</th>
            <th>Visible</th>
            <th>Time</th>
            <th></th>
          </tr>
        </thead>

        <draggable tag="tbody" :list="items" @change="onDrop">
          <tr v-for="item in items" :key="item.id">
            <td class="text-center">
              <i class="fas fa-arrows-alt"></i>
            </td>
            <td>
              {{ item.name }}
            </td>
            <td>
              <i class="fas fa-check" v-if="!item.hidden"></i>
            </td>
            <td>
              <span v-if="item.timeFrames.length < 1">Always Display</span>
              <p v-for="tf in item.timeFrames" v-bind:key="tf.ID">
                {{ new Date(tf.to).toDateString() }} -
                {{ new Date(tf.from).toDateString() }}
              </p>
            </td>
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
        </draggable>
      </table>
    </div>
  </div>
</template>

<script>
import { newsService } from "../../_services/news.service";
import { displayService } from "../../_services/display.service";
import Draggable from "vuedraggable";

export default {
  props: ["displayID"],
  template: "#newslist",
  components: {
    Draggable,
  },
  data: function () {
    return {
      loading: true,
      currentDisplay: {},
      items: [],
      allItems: [],
    };
  },

  methods: {
    addItem: function () {
      this.$router.push(`/news/edit/${this.currentDisplay.ID}/0`);
    },

    onDrop: function () {
      for (let i in this.items) {
        if (!this.items.hasOwnProperty(i)) {
          continue;
        }
        this.items[i].order = parseInt(i);
        newsService.editNewsItems(this.items[i]);
      }
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
      this.$router.push(`/news/edit/${this.currentDisplay.ID}/${item.ID}`);
    },

    loadItems: function (displayID, pushRouter) {
      if (pushRouter) {
        this.$router.push(`/news/${displayID}`);
      }
      for (let item of this.displays) {
        console.log(item);
        if (item.ID == displayID) {
          this.currentDisplay = item;
          break;
        }
      }

      this.items = [];
      for (let item of this.allItems) {
        if (item.displayID === this.currentDisplay.ID) {
          this.items.push(item);
        }
      }
    },

    loadData: async function () {
      try {
        this.displays = await displayService.getAllDisplays();
        this.allItems = await newsService.getAllNewsItems();

        if (this.displays.length > 0) {
          this.loadItems(this.$props.displayID || this.displays[0].ID);
        }

        this.loading = false;
      } catch (e) {
        this.$Simplert.open({
          title: "Error",
          message: e,
          type: "error",
          customCloseBtnText: "Close",
        });
      }
    },
  },

  mounted: function () {
    this.loadData();
  },
};
</script>
