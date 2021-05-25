<template id="newsedit">
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
          <button
            type="button"
            class="btn btn-outline-secondary"
            v-on:click="goBack()"
            v-bind:disabled="saving"
          >
            <i class="fas fa-arrow-left" /> Back
          </button>
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

        <div class="col-9">
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

        <div class="col-1">
          <div class="form-group">
            <label>Visible</label>
            <div class="text-center" v-if="!item.hidden">
              <button
                type="button"
                v-on:click="item.hidden = true"
                class="btn btn-success"
              >
                <i class="fas fa-check"></i>
              </button>
            </div>
            <div class="text-center" v-if="item.hidden">
              <button
                type="button"
                v-on:click="item.hidden = false"
                class="btn btn-outline-danger"
              >
                <i class="far fa-square"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="col-2">
          <div class="form-group">
            <label for="slidetime">Slide Time</label>
            <input
              type="number"
              class="form-control"
              id="slidetime"
              v-model.number="item.slideTime"
            />
          </div>
        </div>

        <hr />

        <div
          class="col-12"
          v-for="langItem of item.languageItems"
          v-bind:key="langItem.language"
        >
          <h3>{{ langItem.language }}</h3>
          <div class="row">
            <div class="col-10">
              <div class="form-group">
                <label v-bind:for="langItem.language + '-title'"
                  >{{ langItem.language }} Title</label
                >
                <input
                  type="text"
                  class="form-control"
                  v-bind:id="langItem.language + '-title'"
                  v-model="langItem.title"
                />
              </div>
            </div>
            <div class="col-2 text-center">
              <button
                type="button"
                class="btn btn-outline-danger"
                v-on:click="removeLanguage(langItem.language)"
              >
                <i class="fas fa-trash" />
              </button>
            </div>
          </div>

          <div>
            <editor
              v-model="langItem.content"
              :init="{
                height: 850,
                width: 1485,
                menubar: false,
                plugins: ['image', 'table', 'lists', 'advlist', 'media'],
                image_uploadtab: true,
                images_upload_handler: image_upload_handler,
                fontsize_formats:
                  '1rem 2rem 3rem 4rem 5rem 6rem 7rem 8rem 9rem 10rem',
                media_live_embeds: true,
                content_style: 'p {}',
                style_formats: [
                  {
                    title: 'Image Left',
                    selector: 'img',
                    styles: {
                      float: 'left',
                      margin: '0 10px 0 10px',
                    },
                  },
                  {
                    title: 'Image Right',
                    selector: 'img',
                    styles: {
                      float: 'right',
                      margin: '0 10px 0 10px',
                    },
                  },
                ],
                toolbar:
                  'undo redo | formatselect | fontsizeselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify |  \
           bullist numlist outdent indent | removeformat | image | media | help',
              }"
            />
          </div>
        </div>

        <div class="col-12">
          <span class="float-right">
            <div class="dropdown">
              <button
                class="btn btn-info dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i class="fas fa-plus" /> Add Language
              </button>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a
                  class="dropdown-item"
                  v-for="lang of languages"
                  v-bind:key="lang"
                  v-on:click="addLanguage(lang)"
                  >{{ lang }}</a
                >
              </div>
            </div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Editor from "@tinymce/tinymce-vue";
import { HOST } from "../../variables";
import _ from "lodash";

import { newsService } from "@/_services/news.service";

export default {
  props: ["id", "displayID"],
  template: "#newsedit",
  components: {
    editor: Editor,
  },
  data: function () {
    return {
      loading: true,
      saving: false,
      apiUrl: HOST,
      item: {},
      languages: ["NL", "EN", "FR"],
    };
  },

  methods: {
    addLanguage: function (lang) {
      for (let li of this.item.languageItems) {
        if (li.language == lang) {
          this.$Simplert.open({
            title: "Language already exists",
            message: "Language already exists",
            type: "error",
            customCloseBtnText: "Close",
          });
          return;
        }
      }
      this.item.languageItems.push({
        language: lang,
        title: "",
        content: `<p><span style="font-size: 2rem;">Your Message Here</span></p>`,
      });
    },
    removeLanguage: function (lang) {
      console.log(lang);
      this.item.languageItems = _.remove(
        this.item.languageItems,
        (o) => o.language !== lang
      );
    },
    save: async function () {
      this.saving = true;
      try {
        if (this.item.ID == 0) {
          this.item = await newsService.addNewsItems(this.item);
        } else {
          await newsService.editNewsItems(this.item);
        }

        this.saving = false;
        this.$Simplert.open({
          title: "Saved",
          message: "News item is saved",
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
    image_upload_handler: function (blobInfo, success, failure, progress) {
      var xhr, formData;

      xhr = new XMLHttpRequest();
      xhr.withCredentials = false;
      xhr.open("POST", `${HOST}/v1/static/upload`);

      let user = JSON.parse(localStorage.getItem("user"));
      xhr.setRequestHeader("Authorization", "Bearer " + user.token);

      xhr.upload.onprogress = function (e) {
        progress((e.loaded / e.total) * 100);
      };

      xhr.onload = function () {
        var json;

        if (xhr.status === 403) {
          failure("HTTP Error: " + xhr.status, { remove: true });
          return;
        }

        if (xhr.status < 200 || xhr.status >= 300) {
          failure("HTTP Error: " + xhr.status);
          return;
        }

        json = JSON.parse(xhr.responseText);

        if (!json || typeof json.location != "string") {
          failure("Invalid JSON: " + xhr.responseText);
          return;
        }

        success(json.location);
      };

      xhr.onerror = function () {
        failure(
          "Image upload failed due to a XHR Transport error. Code: " +
            xhr.status
        );
      };

      formData = new FormData();
      formData.append("file", blobInfo.blob(), blobInfo.filename());

      xhr.send(formData);
    },
    goBack: function () {
      this.$router.back();
    },
  },

  created: function () {
    if (this.$props.id != 0) {
      newsService
        .getNewsItem(this.$props.id)
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
        slideTime: 10,
        displayID: parseInt(this.$props.displayID),
        languageItems: [],
        hidden: false,
      };
      this.addLanguage("NL"); // TODO not hard code this
      this.loading = false;
    }
  },
};
</script>

<style>
.container {
  max-width: 1485px;
}
</style>
