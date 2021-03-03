<template>
  <div class="dashboard-form">
    <h2 class="is-size-5 mb-3">ADD PRODUCT</h2>

    <b-field label="Product" custom-class="has-text-weight-normal">
      <b-input
        type="text"
        placeholder="text"
        rounded
        v-model="form.name"
      ></b-input>
    </b-field>

    <b-field label="Category" custom-class="has-text-weight-normal">
      <b-select
        placeholder="Select Category"
        rounded
        expanded
        v-model="form.category"
      >
        <option
          v-for="(category, i) in categories"
          :key="i"
          :value="category.name"
        >
          {{ category.name.toUpperCase() }}
        </option>
      </b-select>
    </b-field>

    <b-field label="Quantity" custom-class="has-text-weight-normal">
      <b-input
        type="number"
        placeholder="0"
        rounded
        v-model.number="form.qty_product"
      ></b-input>
    </b-field>

    <b-field label="Price" custom-class="has-text-weight-normal">
      <b-input
        type="number"
        placeholder="0"
        rounded
        v-model.number="form.price"
      ></b-input>
    </b-field>

    <!-- form button -->
    <b-button
      native-type="submit"
      type="is-info"
      rounded
      icon-left="plus"
      v-if="!update"
      expanded
      class="mb-1"
      :disabled="isDisabled"
      @click="addProduct"
    >
      PRODUCT
    </b-button>

    <b-button
      native-type="submit"
      type="is-success"
      rounded
      icon-left="update"
      v-if="update"
      expanded
      class="mb-1"
      :disabled="isDisabled"
      @click="updateProduct"
    >
      UPDATE
    </b-button>

    <b-button
      native-type="button"
      type="is-dark"
      rounded
      icon-left="close"
      expanded
      @click="clearForm"
    >
      CANCEL
    </b-button>
  </div>
</template>

<script>
import { Bus } from "../../bus";

export default {
  name: "form-dashboard",
  data() {
    return {
      isDisabled: false,
      update: false,
      form: {
        id: "",
        name: "",
        category: "",
        qty_product: 0,
        price: 0,
      },
    };
  },
  computed: {
    categories() {
      return this.$store.state.categories;
    },
  },
  methods: {
    clearForm() {
      this.update = false;
      this.form.id = "";
      this.form.name = "";
      this.form.category = "";
      this.form.qty_product = 0;
      this.form.price = 0;
    },
    checkInput() {
      const name = this.form.name.trim().length;
      const category = this.form.category.length;
      const qty_product = parseInt(this.form.qty_product);
      const price = parseInt(this.form.price);

      if (name && category && qty_product > 0 && price) {
        return true;
      } else {
        Bus.$emit("open-app-alert");
        return false;
      }
    },
    addProduct() {
      const check = this.checkInput();
      if (!check) return;

      const payload = { ...this.form };
      payload.createAt = Date.now();
      delete payload.id;

      // disable button
      this.isDisabled = true;
      this.$store
        .dispatch("addProduct", payload)
        .then(() => this.$emit("add-product-success"))
        .finally(() => {
          this.clearForm();

          // enable button
          this.isDisabled = false;
        });
    },
    editProduct(product) {
      this.update = true;
      this.form = { ...product };
      this.form.id = product.id;
    },
    updateProduct() {
      const check = this.checkInput();
      if (!check) return;

      const { id, ...product } = this.form;

      // disable button
      this.isDisabled = true;

      this.$store
        .dispatch("updateProduct", { id, product })
        .then(() => {
          this.clearForm();
          this.$emit("update-product-success");
        })
        .catch((err) => {
          alert("gagal uupdate");
          console.log(err);
        })
        .finally(() => {
          this.update = false;
          this.isDisabled = false;
        });
    },
  },
  created() {
    Bus.$on("editProduct", (product) => this.editProduct(product));
  },
};
</script>

<style scoped>
.help.is-light {
  color: #f14668;
}

.dashboard-form >>> .select select:focus,
.dashboard-form >>> .taginput .taginput-container.is-focusable:focus,
.dashboard-form >>> .textarea:focus,
.dashboard-form >>> .input:focus {
  border-color: #167df0;
}
</style>
