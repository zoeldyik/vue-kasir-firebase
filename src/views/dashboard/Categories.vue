<template>
  <div class="categories custom-container py-4">
    <div class="columns m-0">
      <!-- category table column -->
      <div class="column is-8">
        <b-table :data="categories">
          <b-table-column label="CATEGORY" v-slot="props">
            {{ props.row.name.toUpperCase() }}
          </b-table-column>
          <b-table-column label="ACTION" centered v-slot="props">
            <div class="buttons is-centered">
              <b-button
                type="is-info"
                size="is-small"
                icon-left="update"
                rounded
                @click="editCategory(props.row)"
              >
                EDIT
              </b-button>
              <b-button
                type="is-dark"
                size="is-small"
                icon-left="delete"
                rounded
                @click="deleteCategory(props.row.id)"
              >
                DELETE
              </b-button>
            </div>
          </b-table-column>
        </b-table>
      </div>
      <!-- end category table column -->

      <div class="column is-3 is-offset-1">
        <div class="box">
          <b-field
            :label="label"
            custom-class="has-text-weight-normal"
            grouped
            group-multiline
          >
            <b-input
              placeholder="New Category"
              rounded
              expanded
              size="is-small"
              v-model="category"
            ></b-input>
          </b-field>

          <div class="buttons">
            <b-button
              type="is-info"
              rounded
              icon-left="plus"
              size="is-small"
              v-if="!isUpdateMode"
              @click="addCategory"
              :disabled="isDisabled"
            >
              ADD CATEGORY
            </b-button>
            <b-button
              type="is-success"
              rounded
              icon-left="plus"
              size="is-small"
              v-if="isUpdateMode"
              :disabled="isDisabled"
              @click="updateCategory"
            >
              UPDATE
            </b-button>
            <b-button
              type="is-dark"
              rounded
              icon-left="cancel"
              size="is-small"
              v-if="isUpdateMode"
              @click="cancel"
            >
              CANCEL UPDATE
            </b-button>
          </div>
          <!-- end buttons -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Bus } from "../../bus";

export default {
  data() {
    return {
      isDisabled: false,
      category: "",
      categoryId: null,
      isUpdateMode: false,
    };
  },
  computed: {
    categories() {
      return this.$store.state.categories;
    },
    label() {
      return this.isUpdateMode ? "UPDATE CATEGORY" : "ADD CATEGORY";
    },
  },
  methods: {
    checkInput() {
      const name = this.category.trim().length;

      if (name) {
        return true;
      } else {
        Bus.$emit("open-app-alert");
        return false;
      }
    },
    addCategory() {
      const check = this.checkInput();
      if (!check) return;

      this.isDisabled = true;
      this.$store
        .dispatch("addCategory", this.category)
        .then()
        .finally(() => {
          this.isDisabled = false;
          this.category = "";
        });
    },
    deleteCategory(id) {
      this.$store.dispatch("deleteCategory", id);
    },
    editCategory(category) {
      this.category = category.name;
      this.categoryId = category.id;
      this.isUpdateMode = true;
    },
    updateCategory() {
      const check = this.checkInput();
      if (!check) return;

      this.isUpdateMode = true;
      this.$store
        .dispatch("updateCategory", {
          id: this.categoryId,
          name: this.category,
        })
        .then(() => {
          this.category = "";
        })
        .finally(() => {
          this.isDisabled = false;
          this.isUpdateMode = false;
        });
    },
    cancel() {
      this.isUpdateMode = false;
      this.category = "";
    },
  },
};
</script>

<style scoped>
.categories >>> .input:focus {
  border-color: #167df0;
}
</style>
