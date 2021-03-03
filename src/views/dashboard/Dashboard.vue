<template>
  <div class="dashboard py-4">
    <div class="custom-container">
      <div class="columns m-0">
        <!-- column for table -->
        <div class="column is-8">
          <!-- alert -->
          <b-message
            :type="alert.type"
            :title="alert.message"
            v-model="alert.isActive"
          >
          </b-message>
          <!-- end alert -->

          <div class="box p-1">
            <!-- columns for search and select categorie -->
            <div class="columns m-0 is-gapless">
              <div class="column is-8 mb-3 column-search-input">
                <!-- search input -->
                <b-field label="Search By Name ..." label-position="on-border">
                  <b-input
                    v-model="search"
                    placeholder="Search..."
                    type="input"
                    icon-right="close"
                    icon-right-clickable
                    @icon-right-click="clearSearch"
                  ></b-input>
                </b-field>
                <!-- end search input -->
              </div>

              <!-- select category column -->
              <div class="column is-4 mb-3">
                <b-select expanded v-model="selectedCategory">
                  <option
                    v-for="(category, index) in categories_for_select"
                    :value="category.name"
                    :key="index"
                    :selected="category.name === selectedCategory"
                  >
                    {{ category.name.toUpperCase() }}
                  </option>
                </b-select>
              </div>
              <!-- select category column -->
            </div>
            <!-- end columns for search and select categorie -->

            <b-table
              :data="tableProducts"
              paginated
              :per-page="pagination.perPage"
              :current-page.sync="pagination.currentPage"
              pagination-size="is-small"
            >
              <template v-slot:empty>
                <p class="has-text-weight-semi-bold">{{ table_placeholder }}</p>
              </template>
              <b-table-column
                label="PRODUCT"
                v-slot="props"
                field="createAt"
                sortable
              >
                {{ props.row.name.toUpperCase() }}
              </b-table-column>
              <b-table-column label="CATEGORY" v-slot="props">
                {{ props.row.category.toUpperCase() }}
              </b-table-column>
              <b-table-column
                label="QTY"
                v-slot="props"
                field="qty_product"
                numeric
                sortable
              >
                {{ props.row.qty_product }}
              </b-table-column>
              <b-table-column label="PRICE" v-slot="props" numeric>
                {{ props.row.price }}
              </b-table-column>
              <b-table-column label="ACTION" centered v-slot="props">
                <div class="buttons is-centered">
                  <b-button
                    type="is-info"
                    size="is-small"
                    icon-left="update"
                    rounded
                    @click="editProduct(props.row)"
                  >
                    EDIT
                  </b-button>
                  <b-button
                    type="is-dark"
                    size="is-small"
                    icon-left="delete"
                    rounded
                    @click="deleteProduct(props.row.id)"
                  >
                    DELETE
                  </b-button>
                </div>
              </b-table-column>
            </b-table>
          </div>
        </div>
        <!-- end column for table -->

        <!-- column for form -->
        <div class="column is-3 is-offset-1">
          <div class="box">
            <dashboard-form
              @add-product-success="successAddProduct"
              @update-product-success="successUpdateProduct"
            ></dashboard-form>
          </div>
        </div>
        <!-- end column for form -->
      </div>
    </div>
  </div>
</template>

<script>
import { Bus } from "../../bus";
import dashboardForm from "./form-dashboard";

export default {
  components: {
    "dashboard-form": dashboardForm,
  },
  data() {
    return {
      search: "",
      selectedCategory: "ALL CATEGORY",
      alert: {
        type: "",
        message: "",
        isActive: false,
      },
      pagination: {
        currentPage: 1,
        perPage: 8,
      },
    };
  },
  methods: {
    showAlert(type, message) {
      this.alert.type = type;
      this.alert.message = message;
      this.alert.isActive = true;
    },
    deleteProduct(id) {
      console.log("deleteProduct fired");
      this.$store
        .dispatch("deleteProduct", id)
        .then(() => this.showAlert("is-dark", "One Product Deleted!"));
    },
    editProduct(product) {
      // emit event to form component
      Bus.$emit("editProduct", product);
    },
    successAddProduct() {
      this.showAlert("is-success", "One Product Added!");
    },
    successUpdateProduct() {
      this.showAlert("is-info", "One Product Updated!");
    },
    clearSearch() {
      this.search = "";
    },
  },
  computed: {
    Allproducts() {
      return this.$store.state.products;
    },
    tableProducts() {
      let result = this.Allproducts;

      if (this.selectedCategory !== "ALL CATEGORY") {
        result = this.Allproducts.filter(
          (product) => product.category === this.selectedCategory
        );
      }

      result = result.filter((product) =>
        product.name.toLowerCase().includes(this.search.toLowerCase())
      );

      return result;
    },
    totalProducts() {
      return this.products.length;
    },
    categories_for_select() {
      const categories = [...this.$store.state.categories];
      categories.unshift({ name: "ALL CATEGORY" });

      return categories;
    },
    table_placeholder() {
      return this.Allproducts.length
        ? "PRODUCT NOT FOUND"
        : "GETTING ALL PRODUCTS PLEASE WAIT";
    },
  },
};
</script>

<style scoped>
.dashboard >>> .pagination-link {
  background-color: white !important;
}

.dashboard >>> .pagination-link:focus {
  border-color: white !important;
}

.dashboard >>> .is-current {
  background-color: #167df0 !important;
  border-color: #167df0 !important;
}

.dashboard >>> .button.is-primary {
  background-color: #167df0;
}

.dashboard >>> .select:not(.is-multiple):not(.is-loading)::after {
  border-color: #167df0;
}

.dashboard >>> .select select:focus {
  border-color: #167df0;
}

.dashboard >>> .input:focus {
  border-color: #167df0;
}

.dashboard >>> .pagination-previous,
.dashboard >>> .pagination-next {
  display: none;
}

@media (min-width: 769px) {
  .dashboard .column-search-input {
    margin-right: 14px;
  }
}
</style>
