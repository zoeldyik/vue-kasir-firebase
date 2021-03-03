<template>
  <div class="form-home">
    <div class="box">
      <!-- alert -->
      <b-message
        type="is-danger"
        title="product is out of stock !"
        v-model="alert"
        size="is-small"
      >
      </b-message>
      <!-- end alert -->

      <!-- input field name for Edit Mode -->
      <b-field
        label="Product"
        custom-class="has-text-weight-normal"
        v-if="isEdit"
      >
        <b-input v-model="name" disabled rounded></b-input>
      </b-field>
      <!-- input field name for Edit Mode -->

      <!-- autcomplete -->
      <b-field
        label="Product"
        custom-class="has-text-weight-normal"
        v-if="!isEdit"
      >
        <b-autocomplete
          rounded
          expanded
          v-model="name"
          :data="filteredDataArray"
          placeholder="e.g. jQuery"
          icon="magnify"
          clearable
          @select="(option) => selectProduct(option)"
          field="name"
        >
          <template #empty>No results found</template>
        </b-autocomplete>
      </b-field>
      <!-- end autcomplete -->

      <b-field label="Stock Product" custom-class="has-text-weight-normal">
        <b-numberinput
          v-model="stock_product"
          :controls="false"
          required
          rounded
          disabled
        ></b-numberinput>
      </b-field>

      <b-field label="Quantity" custom-class="has-text-weight-normal">
        <b-numberinput
          v-model="qty"
          :controls="false"
          required
          rounded
        ></b-numberinput>
      </b-field>
      <p class="is-size-7 has-text-danger" v-if="qty > stock_product">
        not enough stock
      </p>

      <b-field label="Price" custom-class="has-text-weight-normal">
        <b-numberinput
          :value="price"
          :controls="false"
          disabled
          rounded
        ></b-numberinput>
      </b-field>

      <!-- form button -->
      <b-field label="Action" custom-class="has-text-weight-normal">
        <b-button
          type="is-info"
          rounded
          icon-left="plus"
          size="is-small"
          :disabled="disable_button"
          @click="addCartItem"
          v-if="!isEdit"
        >
          ADD TO CART
        </b-button>
        <b-button
          type="is-success"
          rounded
          icon-left="update"
          size="is-small"
          :disabled="disable_button"
          v-if="isEdit"
          @click="updateCartItem"
        >
          UPDATE
        </b-button>
        <b-button
          type="is-dark"
          rounded
          icon-left="close"
          size="is-small"
          class="ml-1"
          @click="cancel"
        >
          CANCEL
        </b-button>
      </b-field>
    </div>
  </div>
</template>

<script>
import { Bus } from "../../bus";

export default {
  name: "form-home",
  data() {
    return {
      isEdit: false,
      name: "",
      qty: 0,
      price: 0,
      selected: null,
      alert: false,
    };
  },
  computed: {
    products() {
      return this.$store.state.products;
    },
    cart() {
      return this.$store.state.cart;
    },
    filteredDataArray() {
      return this.products.filter((product) => {
        return product.name.toLowerCase().includes(this.name.toLowerCase());
      });
    },
    stock_product() {
      return this.selected ? this.selected.qty_product : 0;
    },
    disable_button() {
      return this.qty > this.stock_product || this.qty < 1 ? true : false;
    },
  },
  methods: {
    clearForm() {
      this.name = "";
      this.selected = null;
      // this.qty and this.price will be reset to 0 because this.selected is watched
    },
    checkForm() {
      if (!this.selected) {
        this.alertModal();
        return false;
      }

      if (!this.qty || !this.price) {
        this.alertModal();
        return false;
      }

      return true;
    },
    checkCart() {
      // check if product already exist in cart
      const check = this.cart.findIndex((el) => el.name === this.selected.name);

      if (check === -1) {
        return true;
      } else {
        this.alertModal();
        return false;
      }
    },
    selectProduct(option) {
      // arguments option di peroleh dari fungsi @select component autocomplete
      this.selected = option;
    },
    cancel() {
      this.name = "";
      this.selected = null;
      this.isEdit = false;
    },
    addCartItem() {
      const checkForm = this.checkForm();
      const checkCart = this.checkCart();

      if (!checkForm) return;
      if (!checkCart) return;

      const payload = { ...this.selected };
      payload.id = this.selected.id;
      payload.total = this.price;
      payload.qty = this.qty;

      this.$store.commit("addCartItem", payload);
      this.clearForm();
    },
    updateCartItem() {
      const check = this.checkForm();

      if (!check) return;

      const payload = { ...this.selected };
      payload.qty = this.qty;
      payload.total = this.price;
      this.$store.commit("updateCartItem", payload);
      this.isEdit = false;
      this.clearForm();
    },
    alertModal() {
      this.$buefy.dialog.alert({
        title: "Product already exist",
        message: "The product is already exist in the cart!",
        type: "is-danger",
        hasIcon: true,
        icon: "close-circle",
        ariaRole: "alertdialog",
        ariaModal: true,
      });
    },
  },
  watch: {
    qty(newValue) {
      if (this.selected) {
        const value = parseInt(newValue);

        return value >= 1
          ? (this.price = this.selected.price * value)
          : (this.price = 0);
      }
    },
    selected(newValue) {
      if (!newValue) {
        this.qty = 0;
        this.price = 0;
      } else {
        if (this.selected.qty_product < 1) {
          this.alert = true;
        }
      }
    },
  },
  created() {
    Bus.$on("edit-cart-item", (item) => {
      this.isEdit = true;
      this.name = item.name;
      this.qty = item.qty;
      this.price = item.price;
      this.selected = item;
    });
  },
};
</script>

<style scoped>
.help {
  color: #363636;
}

.form-home >>> .select select:focus,
.form-home >>> .taginput .taginput-container.is-focusable:focus,
.form-home >>> .textarea:focus,
.form-home >>> .input:focus {
  border-color: #167df0;
}
</style>
